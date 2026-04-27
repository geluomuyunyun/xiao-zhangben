import type { BillRecord } from '../store/useStore';
import type { Category } from '../constants/categories';
import { formatDate, formatAmount } from '../utils/format';
import dayjs from 'dayjs';

interface Props {
  records: BillRecord[];
  categories: Category[];
  onClickRecord: (record: BillRecord) => void;
}

export default function BillList({ records, categories, onClickRecord }: Props) {
  if (records.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <span className="text-4xl">📝</span>
        <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>还没有记录，点击 + 记第一笔吧</span>
      </div>
    );
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const grouped = new Map<string, BillRecord[]>();
  const sorted = [...records].sort((a, b) => {
    const dateDiff = dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
    if (dateDiff !== 0) return dateDiff;
    return b.createdAt - a.createdAt;
  });

  for (const record of sorted) {
    const list = grouped.get(record.date) || [];
    list.push(record);
    grouped.set(record.date, list);
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
      {Array.from(grouped.entries()).map(([date, dayRecords]) => {
        const dayExpense = dayRecords.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
        const dayIncome = dayRecords.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0);

        return (
          <div key={date} className="mb-3">
            {/* Date header */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {formatDate(date)}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {dayExpense > 0 && `支出 ${formatAmount(dayExpense)}`}
                {dayExpense > 0 && dayIncome > 0 && '  '}
                {dayIncome > 0 && `收入 ${formatAmount(dayIncome)}`}
              </span>
            </div>

            {/* Records */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-card-bg)' }}>
              {dayRecords.map((record, idx) => {
                const cat = categoryMap.get(record.categoryId);
                return (
                  <div
                    key={record.id}
                    onClick={() => onClickRecord(record)}
                    className="flex items-center px-4 py-3 cursor-pointer active:bg-gray-50"
                    style={idx > 0 ? { borderTop: '1px solid var(--color-divider)' } : undefined}
                  >
                    <span className="text-2xl mr-3">{cat?.icon || '📦'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>
                        {cat?.name || '未知分类'}
                      </div>
                      {record.note && (
                        <div className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                          {record.note}
                        </div>
                      )}
                    </div>
                    <span
                      className="text-sm font-semibold ml-2 shrink-0"
                      style={{ color: record.type === 'expense' ? 'var(--color-expense)' : 'var(--color-income)' }}
                    >
                      {record.type === 'expense' ? '-' : '+'}{formatAmount(record.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
