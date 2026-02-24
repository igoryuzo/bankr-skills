'use client';

import Link from 'next/link';
import type { Skill } from '@/data/skills';
import SecurityBadge from './SecurityBadge';

export default function SkillCard({ skill }: { skill: Skill }) {
  const findingCount = skill.securityFindings.length;

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group block rounded-2xl bg-white p-6 skill-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#1a1a1a] group-hover:text-[#000] transition-colors">
            {skill.name}
          </h3>
          <p className="mt-1 text-xs font-mono text-neutral-400">by {skill.provider}</p>
        </div>
        <SecurityBadge rating={skill.overallRating} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-500 line-clamp-2">
        {skill.description}
      </p>

      <div className="mt-5 flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-400 uppercase tracking-wider">
          {findingCount} finding{findingCount !== 1 ? 's' : ''}
        </span>
        <span className="text-neutral-400 group-hover:text-[#1a1a1a] transition-colors flex items-center gap-1 uppercase tracking-wider">
          View
          <svg
            className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
