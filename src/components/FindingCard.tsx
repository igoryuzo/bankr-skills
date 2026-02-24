import type { Finding } from '@/data/skills';

const severityConfig: Record<
  Finding['severity'],
  { bg: string; text: string; badgeBg: string; border: string }
> = {
  critical: {
    bg: 'bg-red-50/50',
    text: 'text-red-700',
    badgeBg: 'bg-red-100',
    border: 'border-red-200/60',
  },
  high: {
    bg: 'bg-orange-50/50',
    text: 'text-orange-700',
    badgeBg: 'bg-orange-100',
    border: 'border-orange-200/60',
  },
  medium: {
    bg: 'bg-amber-50/50',
    text: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    border: 'border-amber-200/60',
  },
  low: {
    bg: 'bg-blue-50/50',
    text: 'text-blue-700',
    badgeBg: 'bg-blue-100',
    border: 'border-blue-200/60',
  },
};

export default function FindingCard({ finding }: { finding: Finding }) {
  const s = severityConfig[finding.severity];
  return (
    <div className={`finding-card rounded-2xl border ${s.border} ${s.bg} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-bold text-[#1a1a1a] leading-snug">{finding.title}</h4>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider ${s.text} ${s.badgeBg}`}
        >
          {finding.severity}
        </span>
      </div>

      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1">
        <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-xs font-mono text-neutral-500">{finding.file}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-600">{finding.description}</p>

      <div className="mt-5 rounded-xl bg-white/80 border border-neutral-100 p-4">
        <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-600 mb-2">
          Recommendation
        </p>
        <p className="text-sm text-neutral-700 leading-relaxed">{finding.recommendation}</p>
      </div>
    </div>
  );
}
