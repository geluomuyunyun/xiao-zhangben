import { create } from 'zustand';
import { type Category, ALL_DEFAULT_CATEGORIES } from '../constants/categories';
import { getStorage, setStorage, XZB_RECORDS, XZB_CATEGORIES } from '../utils/storage';
import { generateId } from '../utils/id';

export interface BillRecord {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  note: string;
  date: string;       // YYYY-MM-DD
  createdAt: number;   // timestamp ms
}

interface StoreState {
  records: BillRecord[];
  categories: Category[];

  addRecord: (data: Omit<BillRecord, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, data: Partial<Omit<BillRecord, 'id' | 'createdAt'>>) => void;
  getRecordsByMonth: (year: number, month: number) => BillRecord[];

  addCategory: (data: Omit<Category, 'id' | 'isPreset' | 'sort'>) => void;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id' | 'isPreset'>>) => void;
  toggleCategoryHidden: (id: string) => void;
  deleteCategory: (id: string) => void;
}

const initRecords = getStorage<BillRecord[]>(XZB_RECORDS, []);
const initCategories = getStorage<Category[]>(XZB_CATEGORIES, []);

export const useStore = create<StoreState>((set, get) => ({
  records: initRecords,
  categories: initCategories.length > 0 ? initCategories : ALL_DEFAULT_CATEGORIES,

  // ---- Records ----

  addRecord: (data) => {
    const record: BillRecord = { ...data, id: generateId(), createdAt: Date.now() };
    set((s) => ({ records: [record, ...s.records] }));
  },

  deleteRecord: (id) => {
    set((s) => ({ records: s.records.filter((r) => r.id !== id) }));
  },

  updateRecord: (id, data) => {
    set((s) => ({
      records: s.records.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }));
  },

  getRecordsByMonth: (year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return get().records.filter((r) => r.date.startsWith(prefix));
  },

  // ---- Categories ----

  addCategory: (data) => {
    const maxSort = Math.max(0, ...get().categories.filter((c) => c.type === data.type).map((c) => c.sort));
    const category: Category = { ...data, id: generateId(), isPreset: false, sort: maxSort + 1 };
    set((s) => ({ categories: [...s.categories, category] }));
  },

  updateCategory: (id, data) => {
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },

  toggleCategoryHidden: (id) => {
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, isHidden: !c.isHidden } : c)),
    }));
  },

  deleteCategory: (id) => {
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
  },
}));

// 自动持久化：state 变化时写入 LocalStorage
useStore.subscribe((state) => {
  setStorage(XZB_RECORDS, state.records);
  setStorage(XZB_CATEGORIES, state.categories);
});

// 首次初始化：将预设数据写入 LocalStorage（subscribe 不会触发初始状态）
const { records, categories } = useStore.getState();
setStorage(XZB_RECORDS, records);
setStorage(XZB_CATEGORIES, categories);
