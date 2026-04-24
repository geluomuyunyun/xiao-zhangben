import { useState, useEffect } from 'react';
import type { BillRecord } from '../store/useStore';
import { formatAmount, formatDate } from '../utils/format';

interface Props {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  records: BillRecord[];
}

export default function CategoryDetailModal({
  visible, onClose, categoryName, categoryIcon, categoryColor, records,
}: Props) {
  const [rendered, setRendered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!rendered) return null;

  const total = records.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.4)', opacity: animateIn ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative bg-white rounded-t-2xl transition-transform duration-300 ease-out"
        style={{
          transform: animateIn ? 'translateY(0)' : 'translateY(100%)',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--color-divider)' }}>
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 flex items-center justify-center rounded-lg text-base"
              style={{ background: categoryColor + '20' }}
            >
              {categoryIcon}
            </span>
            <span className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>
              {categoryName}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              共{records.length}笔
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-sm bg-transparent border-none cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            关闭
          </button>
        </div>

        {/* Total */}
        <div className="px-4 py-2 text-right" style={{ borderBottom: '1px solid var(--color-divider)' }}>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>合计 </span>
          <span className="font-bold text-base" style={{ color: 'var(--color-text-main)' }}>
            ¥{formatAmount(total)}
          </span>
        </div>

        {/* Record list */}
        <div className="flex-1 overflow-y-auto">
          {records
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--color-divider)' }}
              >
                <div className="flex flex-col">
                  <span className="text-sm" style={{ color: 'var(--color-text-main)' }}>
                    {r.note || categoryName}
                  </span>
                  <span className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {formatDate(r.date)}
                  </span>
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>
                  ¥{formatAmount(r.amount)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
