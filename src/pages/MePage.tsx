import { useStore } from '../store/useStore';
import dayjs from 'dayjs';

const MENU_ITEMS = [
  { icon: '📥', label: '导出数据', desc: '导出为 CSV 文件', action: 'export' as const },
  { icon: '🎯', label: '预算设置', desc: '设定每月预算上限', tag: '即将上线' },
  { icon: '📖', label: '多账本', desc: '管理多个账本', tag: '即将上线' },
  { icon: '🌙', label: '深色模式', desc: '切换深色主题', tag: '即将上线' },
  { icon: '❓', label: '帮助与反馈', desc: '使用说明和问题反馈' },
  { icon: 'ℹ️', label: '关于', desc: '版本 1.0.0' },
];

export default function MePage() {
  const { records, categories } = useStore();

  const recordCount = records.length;
  const useDays = recordCount > 0
    ? Math.max(1, dayjs().diff(dayjs(Math.min(...records.map(r => r.createdAt))), 'day') + 1)
    : 1;

  const handleExport = () => {
    if (records.length === 0) return;

    const catMap = new Map(categories.map(c => [c.id, c.name]));
    const header = '日期,类型,分类,金额,备注';
    const rows = records
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(r => {
        const type = r.type === 'expense' ? '支出' : '收入';
        const catName = catMap.get(r.categoryId) ?? '未知';
        const note = r.note.replace(/"/g, '""');
        return `${r.date},${type},${catName},${r.amount},"${note}"`;
      });

    const csv = '﻿' + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `小账本_导出_${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClick = (item: typeof MENU_ITEMS[number]) => {
    if (item.tag) return;
    if (item.action === 'export') handleExport();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Profile card */}
      <div className="px-5 pt-5 pb-0 shrink-0">
        <div
          className="flex items-center gap-3.5 p-5 rounded-[20px]"
          style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #7B93FA 100%)' }}
        >
          <div
            className="w-14 h-14 rounded-[18px] flex items-center justify-center text-[28px]"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          >
            😊
          </div>
          <div>
            <div className="text-lg font-bold text-white">我的小账本</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
              已记录 {recordCount} 笔 · 使用 {useDays} 天
            </div>
          </div>
        </div>
      </div>

      {/* Menu list */}
      <div className="flex-1 overflow-auto px-5 pt-4 pb-5 flex flex-col gap-2">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className="flex items-center px-4 py-3.5 rounded-[14px] border-none text-left bg-transparent cursor-pointer transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'var(--color-card-bg)',
              cursor: item.tag ? 'default' : 'pointer',
            }}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>{item.label}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</div>
            </div>
            {item.tag && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0"
                style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}
              >
                {item.tag}
              </span>
            )}
            <span className="ml-2 text-sm" style={{ color: '#CCC' }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
