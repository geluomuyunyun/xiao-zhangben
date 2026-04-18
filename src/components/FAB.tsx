interface Props {
  onClick: () => void;
}

export default function FAB({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed z-40 flex items-center justify-center w-14 h-14 rounded-2xl border-none cursor-pointer shadow-lg text-white text-3xl font-light active:scale-95 transition-transform"
      style={{ background: 'var(--color-primary)', right: 20, bottom: 100 }}
    >
      +
    </button>
  );
}
