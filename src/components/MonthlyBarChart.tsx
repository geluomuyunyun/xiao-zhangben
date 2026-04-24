import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { BillRecord } from '../store/useStore';
import DeferredChartContainer from './DeferredChartContainer';

interface Props {
  allRecords: BillRecord[];
  year: number;
  month: number;   // 选中的月份，柱状图以此为终点往前推 5 个月
}

function getMonthKey(y: number, m: number) {
  return `${y}-${String(m).padStart(2, '0')}`;
}

function getPrev6Months(year: number, month: number) {
  const months: { year: number; month: number; label: string }[] = [];
  let y = year;
  let m = month;
  for (let i = 0; i < 6; i++) {
    months.unshift({ year: y, month: m, label: `${m}月` });
    m--;
    if (m === 0) { m = 12; y--; }
  }
  return months;
}

export default function MonthlyBarChart({ allRecords, year, month }: Props) {
  const chartData = useMemo(() => {
    const months = getPrev6Months(year, month);
    return months.map(({ year: y, month: m, label }) => {
      const key = getMonthKey(y, m);
      const monthRecords = allRecords.filter((r) => r.date.startsWith(key));
      const expense = monthRecords.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
      const income = monthRecords.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0);
      return { label, expense, income };
    });
  }, [allRecords, year, month]);

  return (
    <div className="mx-4 mt-3 rounded-2xl px-4 py-4" style={{ background: 'var(--color-card-bg)' }}>
      <div className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-text-main)' }}>
        收支趋势
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'var(--color-expense)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>支出</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#60A5FA' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>收入</span>
        </div>
      </div>

      <DeferredChartContainer className="w-full overflow-hidden" style={{ height: 180 }}>
        {({ width, height }) => (
          <BarChart width={width} height={height} data={chartData} barGap={2} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
              width={40}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `¥${value.toFixed(2)}`,
                name === 'expense' ? '支出' : '收入',
              ]}
              labelFormatter={(label: string) => label}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} maxBarSize={20} />
            <Bar dataKey="income" fill="#60A5FA" radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        )}
      </DeferredChartContainer>
    </div>
  );
}
