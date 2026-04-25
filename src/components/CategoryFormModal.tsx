import { useState, useEffect, useRef } from 'react';

const ICON_OPTIONS = [
  '🍜', '🍔', '🍕', '🍰', '🥤', '☕',
  '🚌', '🚗', '✈️', '⛽', '🛍️', '👗',
  '👟', '💄', '🎬', '🎮', '🎵', '📖',
  '🏠', '💡', '📱', '💻', '🏥', '💊',
  '🐱', '🐶', '💰', '💼', '📈', '🎁',
  '🏃', '⚽', '🎂', '❤️', '👶', '🔧',
  '📦', '🎓', '🚀', '🎯',
];

const COLOR_OPTIONS = [
  '#FF6B6B', '#FF8C42', '#FFB347', '#F59E0B',
  '#34D399', '#10B981', '#4ECDC4', '#60A5FA',
  '#3B82F6', '#A78BFA', '#8B5CF6', '#F472B6',
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; color: string }) => void;
  initialData?: { name: string; icon: string; color: string } | null;
  title: string;
}

export default function CategoryFormModal({ visible, onClose, onSave, initialData, title }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [rendered, setRendered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    setName(initialData?.name ?? '');
    setIcon(initialData?.icon ?? ICON_OPTIONS[0]);
    setColor(initialData?.color ?? COLOR_OPTIONS[0]);
  }, [visible, initialData]);

  useEffect(() => {
    if (visible) {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      cancelAnimationFrame(rafRef.current);
      setRendered(true);
      setAnimateIn(false);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      cancelAnimationFrame(rafRef.current);
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
      }
      setAnimateIn(false);
      closeTimerRef.current = setTimeout(() => {
        setRendered(false);
        closeTimerRef.current = null;
      }, 300);
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!rendered) return null;

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name: name.trim(), icon, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.4)', opacity: animateIn ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-t-2xl transition-transform duration-300 ease-out"
        style={{ transform: animateIn ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--color-divider)' }}>
          <button onClick={onClose} className="text-sm bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>取消</button>
          <span className="font-semibold text-sm" style={{ color: 'var(--color-text-main)' }}>{title}</span>
          <button onClick={handleSave} className="text-sm font-semibold bg-transparent border-none cursor-pointer" style={{ color: canSave ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}>保存</button>
        </div>
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="w-12 h-12 flex items-center justify-center rounded-2xl text-2xl" style={{ background: color + '20' }}>{icon}</span>
          <input
            type="text"
            placeholder="输入分类名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 min-w-0 text-base font-medium bg-transparent border-none outline-none"
            style={{ color: 'var(--color-text-main)' }}
            maxLength={10}
          />
        </div>
        <div className="px-4 pb-3">
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>选择图标</div>
          <div className="grid grid-cols-8 gap-1.5">
            {ICON_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setIcon(emoji)}
                className="w-full aspect-square flex items-center justify-center rounded-xl text-xl border-2 bg-transparent cursor-pointer"
                style={{
                  borderColor: icon === emoji ? 'var(--color-primary)' : 'transparent',
                  background: icon === emoji ? 'var(--color-primary-light)' : 'transparent',
                }}
              >{emoji}</button>
            ))}
          </div>
        </div>
        <div className="px-4 pb-6">
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>选择颜色</div>
          <div className="grid grid-cols-6 gap-3 justify-items-center">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full cursor-pointer"
                style={{ background: c, border: `3px solid ${color === c ? 'var(--color-text-main)' : 'transparent'}` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
