import { skills, getAllFindings, getSeverityCounts } from '@/data/skills';
import SkillCard from '@/components/SkillCard';
import HeroTerminal from '@/components/HeroTerminal';

export default function Home() {
  const allFindings = getAllFindings();
  const counts = getSeverityCounts(allFindings);
  const ratingCounts = {
    clean: skills.filter((s) => s.overallRating === 'clean').length,
    warning: skills.filter((s) => s.overallRating === 'warning').length,
    flagged: skills.filter((s) => s.overallRating === 'flagged').length,
  };

  return (
    <div>
      {/* Hero */}
      <section className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-8 text-center">
          <h1 className="text-[64px] sm:text-[80px] font-black tracking-[-0.02em] text-[#1a1a1a] leading-[1.05]">
            Bankr Skills.
            <br />
            Build your agent.
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-[19px] leading-[1.7] text-[#999]">
            Bankr Skills equip builders with plug-and-play tools
            to build more powerful agents.
          </p>

          <div className="mt-12 flex items-center justify-center gap-5">
            <a
              href="https://github.com/BankrBot/openclaw-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#2d2d2d] px-10 py-3.5 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#404040] transition-colors"
            >
              GitHub Repo
            </a>
            <a
              href="#skills"
              className="rounded-lg bg-[#2d2d2d] px-10 py-3.5 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#404040] transition-colors"
            >
              Explore Skills
            </a>
          </div>
        </div>

        {/* Terminal */}
        <HeroTerminal />
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="h-px bg-neutral-200" />
      </div>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Skills Audited" value={skills.length} />
            <StatCard label="Total Findings" value={allFindings.length} />
            <StatCard
              label="Critical / High"
              value={counts.critical + counts.high}
              accent="text-red-600"
            />
            <StatCard
              label="Medium / Low"
              value={counts.medium + counts.low}
              accent="text-amber-600"
            />
          </div>

          {/* Rating breakdown */}
          <div className="flex items-center justify-center gap-8 mt-10">
            <RatingDot color="bg-emerald-500" label="Clean" count={ratingCounts.clean} />
            <RatingDot color="bg-amber-500" label="Warning" count={ratingCounts.warning} />
            <RatingDot color="bg-red-500" label="Flagged" count={ratingCounts.flagged} />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="h-px bg-neutral-200" />
      </div>

      {/* Skills Grid */}
      <section id="skills" className="py-16">
        <div className="mx-auto max-w-[1200px] px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              All Skills
            </h2>
            <span className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
              {skills.length} total
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center terminal-card">
      <div className={`text-3xl font-extrabold tracking-tight ${accent || 'text-[#1a1a1a]'}`}>
        {value}
      </div>
      <div className="mt-1.5 text-xs font-mono text-neutral-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function RatingDot({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-neutral-500">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="font-bold text-[#1a1a1a]">{count}</span>
      <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
    </div>
  );
}
