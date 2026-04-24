import { useState, useEffect, useRef } from 'react';

interface Size {
  width: number;
  height: number;
}

export default function DeferredChartContainer({
  children,
  className,
  style,
}: {
  children: (size: Size) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mounted = true;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0 && mounted) {
        setSize({ width, height });
        observer.disconnect();
      }
    });

    observer.observe(el);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {size && children(size)}
    </div>
  );
}
