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
    <div className="mx-4 mt-4 rounded-2xl px-5 py-4" style={{ background: 'var(--color-primary)' }}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="text-white/70 text-lg bg-transparent border-none cursor-pointer px-2">
          ‹
        </button>
        <span className="text-white font-semibold text-base">{year}年{month}月</span>
        <button onClick={onNextMonth} className="text-white/70 text-lg bg-transparent border-none cursor-pointer px-2">
          ›
        </button>
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
    </div>
  );
}
