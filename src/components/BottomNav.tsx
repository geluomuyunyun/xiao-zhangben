import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { key: '/bills',    label: '账单', icon: '📋' },
  { key: '/stats',    label: '统计', icon: '📊' },
  { key: '/category', label: '分类', icon: '🏷️' },
  { key: '/me',       label: '我的', icon: '👤' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="shrink-0 flex items-start pt-2 border-t"
      style={{ height: 80, borderColor: 'var(--color-divider)', background: '#fff' }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.key)}
            className="flex-1 flex flex-col items-center gap-0.5 bg-transparent border-none cursor-pointer"
          >
            <span className="text-[22px]">{tab.icon}</span>
            <span
              className="text-[10px]"
              style={{
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
