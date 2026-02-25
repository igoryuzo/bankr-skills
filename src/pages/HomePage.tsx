import { skills } from '@/data/skills';
import SkillCard from '@/components/SkillCard';
import HeroTerminal from '@/components/HeroTerminal';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-16 sm:pt-28 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 text-center">
          <h1 className="text-[42px] sm:text-[64px] md:text-[80px] font-black tracking-[-0.02em] text-[#1a1a1a] leading-[1.05]">
            Bankr Skills.
            <br />
            Build your agent.
          </h1>

          <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-[16px] sm:text-[19px] leading-[1.7] text-[#999]">
            Bankr Skills equip builders with plug-and-play tools
            to build more powerful agents.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            <a
              href="https://github.com/BankrBot/openclaw-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-lg bg-[#2d2d2d] px-10 py-3.5 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#404040] transition-colors text-center"
            >
              GitHub Repo
            </a>
            <a
              href="#skills"
              className="w-full sm:w-auto rounded-lg bg-[#2d2d2d] px-10 py-3.5 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#404040] transition-colors text-center"
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

      {/* Skills Grid */}
      <section id="skills" className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
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

