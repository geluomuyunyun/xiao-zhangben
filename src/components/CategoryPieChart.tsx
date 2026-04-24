import { PieChart, Pie, Cell } from 'recharts';
import { formatAmount } from '../utils/format';
import DeferredChartContainer from './DeferredChartContainer';

export interface PieDataItem {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  count: number;
  percent: number;
}

interface Props {
  data: PieDataItem[];
  total: number;
  label: string;          // "总支出" | "总收入"
  onClickSlice: (item: PieDataItem) => void;
}

export default function CategoryPieChart({ data, total, label, onClickSlice }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="mx-4 mt-3 rounded-2xl px-4 py-4" style={{ background: 'var(--color-card-bg)' }}>
      <DeferredChartContainer className="relative w-full overflow-hidden" style={{ height: 220 }}>
        {({ width, height }) => (
          <>
            <PieChart width={width} height={height}>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
                onClick={(_: unknown, index: number) => onClickSlice(data[index])}
                style={{ cursor: 'pointer' }}
              >
                {data.map((item) => (
                  <Cell key={item.categoryId} fill={item.color} />
                ))}
              </Pie>
            </PieChart>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{label}</span>
              <span className="text-xl font-bold mt-0.5" style={{ color: 'var(--color-text-main)' }}>
                ¥{formatAmount(total)}
              </span>
            </div>
          </>
        )}
      </DeferredChartContainer>
    </div>
  );
}
