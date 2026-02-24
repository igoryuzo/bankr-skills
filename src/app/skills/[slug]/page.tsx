import { notFound } from 'next/navigation';
import { skills, getSkillBySlug, getSeverityCounts } from '@/data/skills';
import type { Metadata } from 'next';
import SecurityBadge from '@/components/SecurityBadge';
import CodeBlock from '@/components/CodeBlock';
import FindingCard from '@/components/FindingCard';
import SetupSteps from '@/components/SetupSteps';
import InstallCommand from '@/components/InstallCommand';
import Link from 'next/link';

export function generateStaticParams() {
  return skills.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};
  return {
    title: `${skill.name} — Bankr Skills`,
    description: skill.description,
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const counts = getSeverityCounts(skill.securityFindings);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Back link */}
      <Link
        href="/"
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
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1a1a]">
            {skill.name}
          </h1>
          <SecurityBadge rating={skill.overallRating} size="lg" />
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

      {/* Quick Setup */}
      <section className="mb-14">
        <SectionHeading>Quick Setup</SectionHeading>
        <div className="rounded-2xl bg-white p-6 terminal-card">
          <SetupSteps steps={skill.setup} />
        </div>
      </section>

      {/* Security Audit */}
      <section>
        <SectionHeading>Security Audit</SectionHeading>

        {/* Severity summary pills */}
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
              No findings
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
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-5 tracking-tight">
      {children}
    </h2>
  );
}

const severityColors: Record<string, { text: string; bg: string }> = {
  critical: { text: 'text-red-700', bg: 'bg-red-100' },
  high: { text: 'text-orange-700', bg: 'bg-orange-100' },
  medium: { text: 'text-amber-700', bg: 'bg-amber-100' },
  low: { text: 'text-blue-700', bg: 'bg-blue-100' },
};

function SeverityPill({ severity, count }: { severity: string; count: number }) {
  const c = severityColors[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold font-mono uppercase tracking-wider ${c.text} ${c.bg}`}
    >
      {count} {severity}
    </span>
  );
}
