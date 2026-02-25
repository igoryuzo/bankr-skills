import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getSkillBySlug, getSeverityCounts, getQualityScore } from '@/data/skills';
import CodeBlock from '@/components/CodeBlock';
import FindingCard from '@/components/FindingCard';
import InstallCommand from '@/components/InstallCommand';

export default function SkillPage() {
  const { slug } = useParams<{ slug: string }>();
  const skill = getSkillBySlug(slug ?? '');

  if (!skill) return <Navigate to="/" replace />;

  const counts = getSeverityCounts(skill.securityFindings);
  const score = getQualityScore(skill.securityFindings);
  const scoreColor =
    score >= 90 ? 'text-emerald-600' : score >= 75 ? 'text-amber-600' : 'text-orange-600';

  return (
    <>
      <Helmet>
        <title>{skill.name} — Bankr Skills</title>
        <meta name="description" content={skill.description} />
      </Helmet>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-[#1a1a1a] transition-colors mb-10 group uppercase tracking-wider"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All Skills
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1a1a] mb-4">
            {skill.name}
          </h1>

          {/* Skill Score */}
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center gap-2.5 rounded-xl bg-white px-4 py-2.5 terminal-card">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400">Skill Score</span>
              <span className={`text-2xl font-extrabold ${scoreColor}`}>{score}</span>
              <span className="text-xs font-mono text-neutral-300">/ 100</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-300 border border-neutral-200 rounded px-1.5 py-0.5">
                Experimental
              </span>
            </div>
          </div>

          {/* Install command bar */}
          <InstallCommand slug={skill.slug} />

          <p className="mt-5 text-sm font-mono text-neutral-400">
            by{' '}
            <a
              href={skill.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-[#1a1a1a] underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500 transition-colors"
            >
              {skill.provider}
            </a>
          </p>
          <p className="mt-4 text-neutral-500 leading-relaxed max-w-2xl">
            {skill.description}
          </p>
        </div>

        {/* What It Does */}
        <section className="mb-14">
          <SectionHeading>What It Does</SectionHeading>
          <CodeBlock
            code={skill.demo.code}
            language={skill.demo.language}
            title={skill.demo.title}
          />
        </section>

        {/* GitHub */}
        <section className="mb-14">
          <SectionHeading>Source</SectionHeading>
          <a
            href={`https://github.com/BankrBot/openclaw-skills/tree/main/${skill.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 terminal-card text-sm font-mono text-neutral-600 hover:text-[#1a1a1a] transition-colors group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>View on GitHub</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </section>

        {/* Community Code Review */}
        <section>
          <SectionHeading>Code Review</SectionHeading>

          <p className="text-sm text-neutral-400 font-mono mb-6 -mt-3">
            Skill-generated notes. The Skill score is experimental. Always review skills before installing.
          </p>

          {/* Priority summary pills */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {counts.critical > 0 && (
              <SeverityPill severity="critical" count={counts.critical} />
            )}
            {counts.high > 0 && (
              <SeverityPill severity="high" count={counts.high} />
            )}
            {counts.medium > 0 && (
              <SeverityPill severity="medium" count={counts.medium} />
            )}
            {counts.low > 0 && (
              <SeverityPill severity="low" count={counts.low} />
            )}
            {skill.securityFindings.length === 0 && (
              <span className="text-sm font-mono font-semibold text-emerald-600">
                No notes
              </span>
            )}
          </div>

          <div className="space-y-4">
            {skill.securityFindings.map((finding, i) => (
              <FindingCard key={i} finding={finding} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-5 tracking-tight">
      {children}
    </h2>
  );
}

const severityConfig: Record<string, { label: string; text: string; bg: string }> = {
  critical: { label: 'High Priority', text: 'text-rose-700', bg: 'bg-rose-100' },
  high: { label: 'Medium Priority', text: 'text-amber-700', bg: 'bg-amber-100' },
  medium: { label: 'Low Priority', text: 'text-sky-700', bg: 'bg-sky-100' },
  low: { label: 'Informational', text: 'text-neutral-500', bg: 'bg-neutral-100' },
};

function SeverityPill({ severity, count }: { severity: string; count: number }) {
  const c = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold font-mono uppercase tracking-wider ${c.text} ${c.bg}`}
    >
      {count} {c.label}
    </span>
  );
}
