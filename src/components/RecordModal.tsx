import { useState, useEffect } from 'react';
import { useStore, type BillRecord } from '../store/useStore';
import type { Category } from '../constants/categories';
import NumberPad from './NumberPad';
import dayjs from 'dayjs';

interface Props {
  visible: boolean;
  onClose: () => void;
  editRecord?: BillRecord | null;
}

export default function RecordModal({ visible, onClose, editRecord }: Props) {
  const { categories, addRecord, updateRecord, deleteRecord } = useStore();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showDelete, setShowDelete] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editRecord) {
        setType(editRecord.type);
        setCategoryId(editRecord.categoryId);
        setAmountStr(String(editRecord.amount));
        setNote(editRecord.note);
        setDate(editRecord.date);
        setShowDelete(true);
      } else {
        setType('expense');
        setCategoryId('');
        setAmountStr('');
        setNote('');
        setDate(dayjs().format('YYYY-MM-DD'));
        setShowDelete(false);
      }
      setRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible, editRecord]);

  if (!rendered) return null;

  const filteredCategories = categories.filter((c: Category) => c.type === type && !c.isHidden);
  const amount = parseFloat(amountStr) || 0;

  const handleConfirm = () => {
    if (amount === 0) return;
    if (!categoryId) return;

    if (editRecord) {
      updateRecord(editRecord.id, { type, categoryId, amount, note, date });
    } else {
      addRecord({ type, categoryId, amount, note, date });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!editRecord) return;
    setPendingDeleteId(editRecord.id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      deleteRecord(pendingDeleteId);
      setPendingDeleteId(null);
      onClose();
    }
  };

  const handleBackdropClick = () => onClose();

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.4)', opacity: animateIn ? 1 : 0 }}
        onClick={handleBackdropClick}
      />

      <div
        className="relative bg-white rounded-t-2xl transition-transform duration-300 ease-out"
        style={{ transform: animateIn ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b gap-4 flex-nowrap" style={{ borderColor: 'var(--color-divider)' }}>
          <button onClick={onClose} className="h-9 px-3 text-sm bg-transparent border-none cursor-pointer flex items-center" style={{ color: 'var(--color-text-secondary)' }}>
            取消
          </button>
          <div className="h-9 flex items-center gap-4">
            <button
              onClick={() => { setType('expense'); setCategoryId(''); }}
              className="text-sm font-semibold bg-transparent border-none cursor-pointer pb-1"
              style={{
                color: type === 'expense' ? 'var(--color-text-main)' : 'var(--color-text-tertiary)',
                borderBottom: type === 'expense' ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            >
              支出
            </button>
            <button
              onClick={() => { setType('income'); setCategoryId(''); }}
              className="text-sm font-semibold bg-transparent border-none cursor-pointer pb-1"
              style={{
                color: type === 'income' ? 'var(--color-text-main)' : 'var(--color-text-tertiary)',
                borderBottom: type === 'income' ? '2px solid var(--color-primary)' : '2px solid transparent',
              }}
            >
              收入
            </button>
          </div>
          {showDelete ? (
            <button onClick={handleDelete} className="h-9 px-3 text-sm bg-transparent border-none cursor-pointer flex items-center" style={{ color: 'var(--color-expense)' }}>
              删除
            </button>
          ) : (
            <span className="h-9 px-3 text-sm invisible flex items-center">占位</span>
          )}
        </div>

        {/* Amount display */}
        <div className="px-4 py-3 text-right">
          <span className="text-sm mr-1" style={{ color: 'var(--color-text-tertiary)' }}>¥</span>
          <span className="text-3xl font-bold" style={{ color: 'var(--color-text-main)' }}>
            {amountStr || '0'}
          </span>
        </div>

        {/* Category grid */}
        <div className="px-4 pb-2">
          <div className="grid grid-cols-5 gap-2">
            {filteredCategories.map((cat: Category) => {
              const selected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className="flex flex-col items-center gap-1 py-2 rounded-xl border-2 bg-transparent cursor-pointer transition-colors"
                  style={{
                    borderColor: selected ? 'var(--color-primary)' : 'transparent',
                    background: selected ? 'var(--color-primary-light)' : 'transparent',
                  }}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note + Date row */}
        <div className="flex items-center gap-2 px-4 h-9 border-t" style={{ borderColor: 'var(--color-divider)' }}>
          <input
            id="record-note"
            name="record-note"
            type="text"
            placeholder="添加备注..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 text-sm border-none outline-none bg-transparent"
            style={{ color: 'var(--color-text-main)' }}
            maxLength={50}
          />
          <input
            id="record-date"
            name="record-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm border-none outline-none bg-transparent cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
          />
        </div>

        {/* Number pad */}
        <NumberPad
          value={amountStr}
          onChange={setAmountStr}
          onConfirm={handleConfirm}
        />
      </div>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setPendingDeleteId(null)}
          />
          <div className="relative bg-white rounded-2xl px-6 py-5 mx-8 w-full max-w-xs text-center">
            <p className="text-base mb-5" style={{ color: 'var(--color-text-main)' }}>
              确定要删除这条记录吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer"
                style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-secondary)' }}
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white border-none cursor-pointer"
                style={{ background: 'var(--color-expense)' }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
