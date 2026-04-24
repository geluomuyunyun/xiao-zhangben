import { formatAmount } from '../utils/format';
import dayjs from 'dayjs';

interface Props {
  type: 'expense' | 'income';
  total: number;
  maxSingle: number;
  year: number;
  month: number;
}

export default function MonthlySummaryCards({ type, total, maxSingle, year, month }: Props) {
  const daysInMonth = dayjs().year(year).month(month - 1).daysInMonth();
  const now = dayjs();
  // 如果是当月，用已过天数；否则用该月总天数
  const elapsed =
    year === now.year() && month === now.month() + 1
      ? now.date()
      : daysInMonth;
  const daily = elapsed > 0 ? total / elapsed : 0;

  const isExpense = type === 'expense';

  const items = [
    { label: isExpense ? '总支出' : '总收入', value: total },
    { label: isExpense ? '最大单笔支出' : '最大单笔收入', value: maxSingle },
    { label: isExpense ? '日均支出' : '日均收入', value: daily },
  ];

  return (
    <div className="mx-4 mt-3 rounded-2xl px-4 py-4" style={{ background: 'var(--color-card-bg)' }}>
      <div className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
        月度总结
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-xs mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {item.label}
            </div>
            <div className="text-sm font-bold" style={{ color: 'var(--color-text-main)' }}>
              ¥{formatAmount(item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
