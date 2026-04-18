interface Props {
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
}

const KEYS = [
  '1', '2', '3', 'backspace',
  '4', '5', '6', '+',
  '7', '8', '9', '-',
  '.', '0', '', 'confirm',
];

export default function NumberPad({ value, onChange, onConfirm }: Props) {
  const handleKey = (key: string) => {
    if (key === 'backspace') {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === 'confirm') {
      onConfirm();
      return;
    }
    if (key === '+' || key === '-' || key === '') return;

    if (key === '.') {
      if (value.includes('.')) return;
      onChange(value === '' ? '0.' : value + '.');
      return;
    }

    const parts = value.split('.');
    if (parts[1] && parts[1].length >= 2) return;
    if (value === '0' && key !== '.') {
      onChange(key);
      return;
    }
    if (value.length >= 9) return;

    onChange(value + key);
  };

  return (
    <div className="grid grid-cols-4 gap-px bg-gray-200">
      {KEYS.map((key, i) => {
        if (key === '') return <div key={i} className="bg-white" />;

        const isConfirm = key === 'confirm';
        const isBackspace = key === 'backspace';
        const isOperator = key === '+' || key === '-';

        return (
          <button
            key={i}
            onClick={() => handleKey(key)}
            disabled={isOperator}
            className={`h-12 text-lg border-none cursor-pointer active:bg-gray-100 ${
              isConfirm
                ? 'text-white font-semibold'
                : isOperator
                  ? 'bg-white text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-800'
            }`}
            style={isConfirm ? { background: 'var(--color-primary)' } : undefined}
          >
            {isBackspace ? '⌫' : isConfirm ? '确定' : key}
          </button>
        );
      })}
    </div>
  );
}
