interface TagProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export default function Tag({ label, onClick, active }: TagProps) {
  const base =
    'inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border tracking-wide transition-colors';
  const style = active
    ? 'bg-gb-accent border-gb-accent text-white'
    : 'bg-gb-border text-gb-text-secondary border-gb-border-hover hover:border-gb-text-muted';

  if (onClick) {
    return (
      <button onClick={onClick} className={`${base} ${style} cursor-pointer`}>
        {label}
      </button>
    );
  }

  return <span className={`${base} ${style}`}>{label}</span>;
}
