import { useState } from "react";
import { skills } from "@/data/skills";
import SkillCard from "@/components/SkillCard";
import HeroTerminal from "@/components/HeroTerminal";
import ContributeModal from "@/components/ContributeModal";

export default function HomePage() {
  const [showContribute, setShowContribute] = useState(false);

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

          <p className="mt-6 sm:mt-8 max-w-3xl mx-auto text-[16px] sm:text-[19px] leading-[1.7] text-[#999]">
            Bankr Skills equip builders with plug-and-play tools to build more
            powerful agents.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            <button
              onClick={() => setShowContribute(true)}
              className="w-full sm:w-auto rounded-lg bg-[#a88bfb] px-10 py-3.5 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#9678f0] transition-colors text-center cursor-pointer"
            >
              Create Skill
            </button>
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

      {showContribute && (
        <ContributeModal onClose={() => setShowContribute(false)} />
      )}

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="h-px bg-neutral-200" />
      </div>

      {/* Skills Grid */}
      <section id="skills" className="py-10 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8 space-y-16">
          {[
            { label: 'Bankr Skills', filter: (s: typeof skills[0]) => !s.slug.startsWith('uniswap-') && !s.slug.startsWith('base-') },
            { label: 'Uniswap Skills', filter: (s: typeof skills[0]) => s.slug.startsWith('uniswap-') },
            { label: 'Base Skills', filter: (s: typeof skills[0]) => s.slug.startsWith('base-') },
          ].map(({ label, filter }) => {
            const group = skills.filter(filter);
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
                    {label}
                  </h2>
                  <span className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
                    {group.length} total
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((skill) => (
                    <SkillCard key={skill.slug} skill={skill} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
