import { useState, useEffect, useRef } from 'react';
import { ANIMATION_PRESETS, type AnimationPreset } from '../constants/animation';

interface Props {
  visible: boolean;
  message: string;
  hint?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  animation?: AnimationPreset;
}

export default function ConfirmDialog({
  visible,
  message,
  hint,
  confirmText = '确认删除',
  onCancel,
  onConfirm,
  animation = 'scale',
}: Props) {
  const config = ANIMATION_PRESETS[animation];
  const hasAnimation = animation !== 'none';

  const [rendered, setRendered] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!hasAnimation) {
      setRendered(visible);
      setAnimateIn(visible);
      return;
    }

    if (visible) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
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
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      setAnimateIn(false);
      timerRef.current = setTimeout(() => {
        setRendered(false);
        timerRef.current = null;
      }, config.duration);
    }
  }, [visible, hasAnimation, config.duration]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!rendered) return null;

  const backdropStyle = config.backdrop
    ? { background: 'rgba(0,0,0,0.5)', opacity: animateIn ? 1 : 0 }
    : { background: 'rgba(0,0,0,0.5)' };

  const panelStyle = config.panel
    ? (animateIn ? config.panel.to : config.panel.from)
    : {};

  const transitionClass = hasAnimation ? ` ${config.panel?.property ?? 'transition-all'} duration-300` : '';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className={`absolute inset-0${config.backdrop ? ' transition-opacity duration-300' : ''}`}
        style={backdropStyle}
        onClick={onCancel}
      />
      <div
        className={`relative bg-white rounded-2xl p-6 mx-[7.5%] w-[85%] max-w-[360px]${transitionClass}`}
        style={panelStyle}
      >
        <p className="text-lg font-medium text-center" style={{ color: 'var(--color-text-main)' }}>
          {message}
        </p>
        {hint && (
          <p className="text-sm text-center mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
            {hint}
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl text-sm font-medium bg-white cursor-pointer"
            style={{ border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl text-sm font-medium text-white border-none cursor-pointer"
            style={{ background: 'var(--color-expense)' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
