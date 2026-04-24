import type { PieDataItem } from './CategoryPieChart';
import { formatAmount } from '../utils/format';

interface Props {
  data: PieDataItem[];
  onClickItem: (item: PieDataItem) => void;
}

export default function CategoryRankList({ data, onClickItem }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ background: 'var(--color-card-bg)' }}>
      {data.map((item, idx) => (
        <div
          key={item.categoryId}
          className="flex items-center px-4 py-3 cursor-pointer active:bg-gray-50"
          style={{ borderBottom: idx < data.length - 1 ? '1px solid var(--color-divider)' : 'none' }}
          onClick={() => onClickItem(item)}
        >
          {/* Icon */}
          <span
            className="w-9 h-9 flex items-center justify-center rounded-xl text-lg shrink-0"
            style={{ background: item.color + '20' }}
          >
            {item.icon}
          </span>

          {/* Name + count */}
          <div className="ml-3 flex-1 min-w-0">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>
              {item.name}
            </span>
            <span className="text-xs ml-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
              {item.count}笔
            </span>
          </div>

          {/* Amount + percent */}
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
              ¥{formatAmount(item.amount)}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {item.percent.toFixed(1)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
