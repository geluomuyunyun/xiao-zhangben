import { formatAmount } from '../utils/format';

interface Props {
  year: number;
  month: number;
  totalExpense: number;
  totalIncome: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthSummaryCard({
  year, month, totalExpense, totalIncome, onPrevMonth, onNextMonth,
}: Props) {
  const balance = totalIncome - totalExpense;

  return (
    <div className="mx-4 mt-3 rounded-2xl px-4 py-4 relative" style={{ background: 'var(--color-primary)' }}>
      <div className="flex items-center justify-center h-8 mb-3">
        <span className="text-white font-semibold text-lg">{year}年{month}月</span>
      </div>

      <div className="flex justify-between text-white">
        <div className="flex-1 text-center">
          <div className="text-xs text-white/70 mb-1">支出</div>
          <div className="text-lg font-bold">{formatAmount(totalExpense)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xs text-white/70 mb-1">收入</div>
          <div className="text-lg font-bold">{formatAmount(totalIncome)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-xs text-white/70 mb-1">结余</div>
          <div className="text-lg font-bold">{balance >= 0 ? '' : '-'}{formatAmount(Math.abs(balance))}</div>
        </div>
      </div>

      <button
        onClick={onPrevMonth}
        className="absolute left-0 top-0 bottom-0 bg-transparent border-none cursor-pointer rounded-l-2xl active:bg-white/10 transition-colors"
        style={{ width: 48 }}
      >
        <div className="flex flex-col h-full pt-4">
          <div className="h-8 mb-3" />
          <div className="flex items-center justify-center" style={{ height: 16 }}>
            <span className="text-white/70" style={{ fontSize: 33.6, lineHeight: 1 }}>‹</span>
          </div>
        </div>
      </button>

      <button
        onClick={onNextMonth}
        className="absolute right-0 top-0 bottom-0 bg-transparent border-none cursor-pointer rounded-r-2xl active:bg-white/10 transition-colors"
        style={{ width: 48 }}
      >
        <div className="flex flex-col h-full pt-4">
          <div className="h-8 mb-3" />
          <div className="flex items-center justify-center" style={{ height: 16 }}>
            <span className="text-white/70" style={{ fontSize: 33.6, lineHeight: 1 }}>›</span>
          </div>
        </div>
      </button>
    </div>
  );
}
