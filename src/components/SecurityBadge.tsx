type Rating = 'clean' | 'warning' | 'flagged';

const config: Record<Rating, { label: string; bg: string; text: string; dot: string }> = {
  clean: {
    label: 'Clean',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  warning: {
    label: 'Has Notes',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    dot: 'bg-sky-400',
  },
  flagged: {
    label: 'Needs Attention',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
};

export default function SecurityBadge({
  rating,
  size = 'sm',
}: {
  rating: Rating;
  size?: 'sm' | 'lg';
}) {
  const c = config[rating];
  const sizeClasses =
    size === 'lg'
      ? 'px-4 py-2 text-sm gap-2'
      : 'px-2.5 py-1 text-[11px] gap-1.5';
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold font-mono uppercase tracking-wider ${c.bg} ${c.text} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
