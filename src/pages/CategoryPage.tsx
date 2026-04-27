import { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../store/useStore';
import type { Category } from '../constants/categories';
import CategoryFormModal from '../components/CategoryFormModal';

export default function CategoryPage() {
  const { categories, addCategory, updateCategory, toggleCategoryHidden, deleteCategory } = useStore();

  const [activeType, setActiveType] = useState<'expense' | 'income'>('expense');

  const [actionTarget, setActionTarget] = useState<Category | null>(null);
  const lastActionTargetRef = useRef<Category | null>(null);
  if (actionTarget) lastActionTargetRef.current = actionTarget;
  const displayTarget = actionTarget ?? lastActionTargetRef.current;

  const [sheetRendered, setSheetRendered] = useState(false);
  const [sheetAnimateIn, setSheetAnimateIn] = useState(false);
  const sheetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRafRef = useRef(0);

  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<Category | null>(null);
  const lastDeleteTargetRef = useRef<Category | null>(null);
  if (confirmDeleteTarget) lastDeleteTargetRef.current = confirmDeleteTarget;
  const displayDeleteTarget = confirmDeleteTarget ?? lastDeleteTargetRef.current;
  const [confirmRendered, setConfirmRendered] = useState(false);
  const [confirmAnimateIn, setConfirmAnimateIn] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmRafRef = useRef(0);

  const sheetVisible = actionTarget !== null;

  useEffect(() => {
    if (sheetVisible) {
      if (sheetTimerRef.current !== null) {
        clearTimeout(sheetTimerRef.current);
        sheetTimerRef.current = null;
      }
      cancelAnimationFrame(sheetRafRef.current);
      setSheetRendered(true);
      setSheetAnimateIn(false);
      sheetRafRef.current = requestAnimationFrame(() => {
        sheetRafRef.current = requestAnimationFrame(() => {
          setSheetAnimateIn(true);
        });
      });
    } else {
      cancelAnimationFrame(sheetRafRef.current);
      if (sheetTimerRef.current !== null) {
        clearTimeout(sheetTimerRef.current);
      }
      setSheetAnimateIn(false);
      sheetTimerRef.current = setTimeout(() => {
        setSheetRendered(false);
        sheetTimerRef.current = null;
      }, 300);
    }
  }, [sheetVisible]);

  useEffect(() => {
    return () => {
      if (sheetTimerRef.current !== null) clearTimeout(sheetTimerRef.current);
      cancelAnimationFrame(sheetRafRef.current);
    };
  }, []);

  const confirmVisible = confirmDeleteTarget !== null;

  useEffect(() => {
    if (confirmVisible) {
      if (confirmTimerRef.current !== null) {
        clearTimeout(confirmTimerRef.current);
        confirmTimerRef.current = null;
      }
      cancelAnimationFrame(confirmRafRef.current);
      setConfirmRendered(true);
      setConfirmAnimateIn(false);
      confirmRafRef.current = requestAnimationFrame(() => {
        confirmRafRef.current = requestAnimationFrame(() => {
          setConfirmAnimateIn(true);
        });
      });
    } else {
      cancelAnimationFrame(confirmRafRef.current);
      if (confirmTimerRef.current !== null) {
        clearTimeout(confirmTimerRef.current);
      }
      setConfirmAnimateIn(false);
      confirmTimerRef.current = setTimeout(() => {
        setConfirmRendered(false);
        confirmTimerRef.current = null;
      }, 300);
    }
  }, [confirmVisible]);

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current !== null) clearTimeout(confirmTimerRef.current);
      cancelAnimationFrame(confirmRafRef.current);
    };
  }, []);

  const filtered = categories
    .filter((c: Category) => c.type === activeType)
    .sort((a: Category, b: Category) => a.sort - b.sort);

  const closeSheet = () => setActionTarget(null);

  const handleEdit = () => {
    if (!actionTarget) return;
    setEditTarget(actionTarget);
    setFormMode('edit');
    closeSheet();
  };

  const handleToggleHidden = () => {
    if (!actionTarget) return;
    toggleCategoryHidden(actionTarget.id);
    closeSheet();
  };

  const handleDeleteCat = () => {
    if (!actionTarget) return;
    setConfirmDeleteTarget(actionTarget);
    closeSheet();
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteTarget) {
      deleteCategory(confirmDeleteTarget.id);
    }
    setConfirmDeleteTarget(null);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setFormMode('add');
  };

  const handleFormSave = (data: { name: string; icon: string; color: string }) => {
    if (formMode === 'add') {
      addCategory({ ...data, type: activeType, isHidden: false });
    } else if (formMode === 'edit' && editTarget) {
      updateCategory(editTarget.id, data);
    }
    setFormMode(null);
    setEditTarget(null);
  };

  const handleFormClose = () => {
    setFormMode(null);
    setEditTarget(null);
  };

  const formInitialData = useMemo(
    () => editTarget ? { name: editTarget.name, icon: editTarget.icon, color: editTarget.color } : null,
    [editTarget],
  );

  return (
    <div className="flex-1 flex flex-col pb-4 overflow-y-auto gap-5">
      <div className="flex px-4 pt-4">
        <div className="flex w-full rounded-full p-1" style={{ background: 'var(--color-divider)' }}>
          {(['expense', 'income'] as const).map((t) => {
            const active = activeType === t;
            return (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className="flex-1 text-base font-medium py-2 rounded-full border-none cursor-pointer transition-all duration-200"
                style={{
                  background: active ? '#FFFFFF' : 'transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >{t === 'expense' ? '支出分类' : '收入分类'}</button>
            );
          })}
        </div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-4 gap-5">
          {filtered.map((cat: Category) => (
            <button
              key={cat.id}
              onClick={() => setActionTarget(cat)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-none cursor-pointer transition-all"
              style={{ background: 'var(--color-card-bg)', opacity: cat.isHidden ? 0.45 : 1 }}
            >
              <span className="w-11 h-11 flex items-center justify-center rounded-2xl text-2xl" style={{ background: cat.color + '20' }}>{cat.icon}</span>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{cat.name}</span>
              {cat.isHidden && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--color-divider)', color: 'var(--color-text-tertiary)' }}>已隐藏</span>
              )}
            </button>
          ))}
          <button
            onClick={handleAdd}
            className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border-2 border-dashed cursor-pointer bg-transparent"
            style={{ borderColor: 'var(--color-divider)' }}
          >
            <span className="w-11 h-11 flex items-center justify-center rounded-2xl text-2xl" style={{ color: 'var(--color-text-tertiary)' }}>+</span>
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>添加</span>
          </button>
        </div>
      </div>

      {sheetRendered && displayTarget && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.4)', opacity: sheetAnimateIn ? 1 : 0 }}
            onClick={closeSheet}
          />
          <div
            className="relative px-3 pb-5 pt-0 flex flex-col gap-2 transition-transform duration-300 ease-out"
            style={{ transform: sheetAnimateIn ? 'translateY(0)' : 'translateY(100%)' }}
          >
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-card-bg)' }}>
              <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: 'var(--color-divider)' }}>
                <span className="w-10 h-10 flex items-center justify-center rounded-xl text-xl" style={{ background: displayTarget.color + '20' }}>{displayTarget.icon}</span>
                <span className="font-semibold text-base" style={{ color: 'var(--color-text-main)' }}>{displayTarget.name}</span>
              </div>
              {!displayTarget.isPreset && (
                <button onClick={handleEdit} className="w-full text-center px-4 py-6 bg-transparent border-none border-b cursor-pointer text-lg" style={{ color: 'var(--color-text-main)', borderColor: 'var(--color-divider)' }}>编辑</button>
              )}
              <button
                onClick={handleToggleHidden}
                className={`w-full text-center px-4 py-6 bg-transparent border-none cursor-pointer text-lg ${!displayTarget.isPreset ? 'border-b' : ''}`}
                style={{ color: 'var(--color-text-main)', borderColor: 'var(--color-divider)' }}
              >{displayTarget.isHidden ? '取消隐藏' : '隐藏'}</button>
              {!displayTarget.isPreset && (
                <button onClick={handleDeleteCat} className="w-full text-center px-4 py-6 bg-transparent border-none cursor-pointer text-lg" style={{ color: 'var(--color-expense)' }}>删除</button>
              )}
            </div>
            <button
              onClick={closeSheet}
              className="w-full text-center px-4 py-6 rounded-2xl border-none cursor-pointer text-lg font-semibold"
              style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-secondary)' }}
            >取消</button>
          </div>
        </div>
      )}

      <CategoryFormModal
        visible={formMode !== null}
        onClose={handleFormClose}
        onSave={handleFormSave}
        initialData={formInitialData}
        title={formMode === 'edit' ? '编辑分类' : '添加分类'}
      />

      {confirmRendered && displayDeleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(0,0,0,0.5)', opacity: confirmAnimateIn ? 1 : 0 }}
            onClick={() => setConfirmDeleteTarget(null)}
          />
          <div
            className="relative bg-white rounded-3xl px-8 pt-14 pb-8 mx-5 w-full max-w-sm flex flex-col items-center transition-all duration-300"
            style={{
              opacity: confirmAnimateIn ? 1 : 0,
              transform: confirmAnimateIn ? 'scale(1)' : 'scale(0.9)',
            }}
          >
            <p className="text-xl font-medium flex-1 flex items-center" style={{ color: 'var(--color-text-main)' }}>
              确定要删除"{displayDeleteTarget.name}"分类吗？
            </p>
            <div className="flex gap-4 w-full mt-14">
              <button
                onClick={() => setConfirmDeleteTarget(null)}
                className="flex-1 py-5 rounded-2xl text-base font-semibold border-none cursor-pointer"
                style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-secondary)' }}
              >取消</button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-5 rounded-2xl text-base font-semibold text-white border-none cursor-pointer"
                style={{ background: 'var(--color-expense)' }}
              >确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
