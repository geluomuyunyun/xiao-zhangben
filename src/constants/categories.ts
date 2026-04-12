export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'expense' | 'income';
  color: string;
  isPreset: boolean;
  isHidden: boolean;
  sort: number;
}

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'food',      name: '餐饮', icon: '🍜', type: 'expense', color: '#FF6B6B', isPreset: true, isHidden: false, sort: 1 },
  { id: 'transport',  name: '交通', icon: '🚌', type: 'expense', color: '#4ECDC4', isPreset: true, isHidden: false, sort: 2 },
  { id: 'shopping',   name: '购物', icon: '🛍️', type: 'expense', color: '#FFB347', isPreset: true, isHidden: false, sort: 3 },
  { id: 'entertainment', name: '娱乐', icon: '🎬', type: 'expense', color: '#A78BFA', isPreset: true, isHidden: false, sort: 4 },
  { id: 'housing',    name: '居住', icon: '🏠', type: 'expense', color: '#60A5FA', isPreset: true, isHidden: false, sort: 5 },
  { id: 'medical',    name: '医疗', icon: '🏥', type: 'expense', color: '#F472B6', isPreset: true, isHidden: false, sort: 6 },
  { id: 'education',  name: '教育', icon: '📚', type: 'expense', color: '#34D399', isPreset: true, isHidden: false, sort: 7 },
  { id: 'other',      name: '其他', icon: '📦', type: 'expense', color: '#9CA3AF', isPreset: true, isHidden: false, sort: 8 },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'salary',    name: '工资',   icon: '💰', type: 'income', color: '#10B981', isPreset: true, isHidden: false, sort: 1 },
  { id: 'freelance', name: '兼职',   icon: '💼', type: 'income', color: '#3B82F6', isPreset: true, isHidden: false, sort: 2 },
  { id: 'invest',    name: '理财',   icon: '📈', type: 'income', color: '#F59E0B', isPreset: true, isHidden: false, sort: 3 },
  { id: 'other_income', name: '其他收入', icon: '🎁', type: 'income', color: '#8B5CF6', isPreset: true, isHidden: false, sort: 4 },
];

export const ALL_DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
];
