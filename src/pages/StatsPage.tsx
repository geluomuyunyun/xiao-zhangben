import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { getCurrentYearMonth } from '../utils/format';
import type { Category } from '../constants/categories';
import CategoryPieChart, { type PieDataItem } from '../components/CategoryPieChart';
import CategoryDetailModal from '../components/CategoryDetailModal';
import CategoryRankList from '../components/CategoryRankList';
import MonthlyBarChart from '../components/MonthlyBarChart';
import MonthlySummaryCards from '../components/MonthlySummaryCards';

export default function StatsPage() {
  const { records, categories, getRecordsByMonth } = useStore();

  // ---- 月份选择 ----
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth);

  const handlePrevMonth = () =>
    setYearMonth((p) => (p.month === 1 ? { year: p.year - 1, month: 12 } : { ...p, month: p.month - 1 }));
  const handleNextMonth = () =>
    setYearMonth((p) => (p.month === 12 ? { year: p.year + 1, month: 1 } : { ...p, month: p.month + 1 }));

  // ---- 支出/收入切换 ----
  const [activeType, setActiveType] = useState<'expense' | 'income'>('expense');

  // ---- 当月记录 ----
  const monthRecords = useMemo(
    () => getRecordsByMonth(yearMonth.year, yearMonth.month),
    [records, yearMonth.year, yearMonth.month],
  );

  const filteredRecords = useMemo(
    () => monthRecords.filter((r) => r.type === activeType),
    [monthRecords, activeType],
  );

  // ---- 饼图数据 ----
  const { pieData, total, maxSingle } = useMemo(() => {
    const total = filteredRecords.reduce((s, r) => s + r.amount, 0);
    const maxSingle = filteredRecords.length > 0 ? Math.max(...filteredRecords.map((r) => r.amount)) : 0;

    const map = new Map<string, { amount: number; count: number }>();
    filteredRecords.forEach((r) => {
      const prev = map.get(r.categoryId) || { amount: 0, count: 0 };
      map.set(r.categoryId, { amount: prev.amount + r.amount, count: prev.count + 1 });
    });

    const pieData: PieDataItem[] = Array.from(map.entries())
      .map(([catId, { amount, count }]) => {
        const cat = categories.find((c: Category) => c.id === catId);
        return {
          categoryId: catId,
          name: cat?.name ?? '未知',
          icon: cat?.icon ?? '❓',
          color: cat?.color ?? '#9CA3AF',
          amount,
          count,
          percent: total > 0 ? (amount / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { pieData, total, maxSingle };
  }, [filteredRecords, categories]);

  // ---- 明细弹窗 ----
  const [detailCategory, setDetailCategory] = useState<PieDataItem | null>(null);

  const detailRecords = useMemo(() => {
    if (!detailCategory) return [];
    return filteredRecords.filter((r) => r.categoryId === detailCategory.categoryId);
  }, [detailCategory, filteredRecords]);

  const handleClickSlice = (item: PieDataItem) => setDetailCategory(item);

  // ---- 空状态判断 ----
  const isEmpty = filteredRecords.length === 0;

  return (
    <div className="flex-1 flex flex-col pb-4 overflow-y-auto min-w-0">
      {/* 月份选择器 */}
      <div className="flex items-center justify-center gap-4 pt-4 pb-2">
        <button
          onClick={handlePrevMonth}
          className="text-2xl bg-transparent border-none cursor-pointer px-3 py-1"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          ‹
        </button>
        <span className="font-semibold text-lg" style={{ color: 'var(--color-text-main)' }}>
          {yearMonth.year}年{yearMonth.month}月
        </span>
        <button
          onClick={handleNextMonth}
          className="text-2xl bg-transparent border-none cursor-pointer px-3 py-1"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          ›
        </button>
      </div>

      {/* 支出/收入 Tab */}
      <div className="flex px-4 mb-1">
        <div className="flex w-full rounded-full p-1" style={{ background: 'var(--color-divider)' }}>
          {(['expense', 'income'] as const).map((t) => {
            const active = activeType === t;
            const label = t === 'expense' ? '支出' : '收入';
            const activeColor = t === 'expense' ? 'var(--color-expense)' : 'var(--color-income)';
            return (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className="flex-1 text-base font-medium py-2 rounded-full border-none cursor-pointer transition-all duration-200"
                style={{
                  background: active ? '#FFFFFF' : 'transparent',
                  color: active ? activeColor : 'var(--color-text-tertiary)',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {isEmpty ? (
        /* 空状态 */
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <span className="text-4xl mb-3">📊</span>
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            暂无数据，先去记一笔吧
          </span>
        </div>
      ) : (
        <>
          {/* 饼图 */}
          <CategoryPieChart
            data={pieData}
            total={total}
            label={activeType === 'expense' ? '总支出' : '总收入'}
            onClickSlice={handleClickSlice}
          />

          {/* 分类排行 */}
          <CategoryRankList data={pieData} onClickItem={handleClickSlice} />

          {/* 月度总结 */}
          <MonthlySummaryCards
            type={activeType}
            total={total}
            maxSingle={maxSingle}
            year={yearMonth.year}
            month={yearMonth.month}
          />
        </>
      )}

      {/* 柱状图 —— 不受 Tab 影响，始终显示 */}
      <MonthlyBarChart
        allRecords={records}
        year={yearMonth.year}
        month={yearMonth.month}
      />

      {/* 分类明细弹窗 */}
      <CategoryDetailModal
        visible={detailCategory !== null}
        onClose={() => setDetailCategory(null)}
        categoryName={detailCategory?.name ?? ''}
        categoryIcon={detailCategory?.icon ?? ''}
        categoryColor={detailCategory?.color ?? ''}
        records={detailRecords}
      />
    </div>
  );
}
