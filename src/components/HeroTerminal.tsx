'use client';

import { useState, useEffect } from 'react';

const skillSlugs = [
  'bankr',
  'erc-8004',
  'botchan',
  'onchainkit',
  'endaoment',
  'ens-primary-name',
  'qrcoin',
  'veil',
  'bankr-signals',
  'yoink',
  'neynar',
];

export default function HeroTerminal() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % skillSlugs.length);
        setIsAnimating(false);
      }, 200);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-[680px] px-8 mt-14">
      <div className="terminal-card rounded-2xl bg-white overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-neutral-100">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[13px] font-mono text-neutral-400">bankr-cli</span>
        </div>
        <div className="px-6 py-8 font-mono text-[15px] leading-[2.2] text-[#333]">
          <p>
            <span className="text-neutral-400">$ </span>
            <span>npx skills add https://github.com/bankrbot/openclaw-skills --skill{' '}</span>
            <span
              className={`inline-block transition-all duration-200 ${
                isAnimating
                  ? 'opacity-0 translate-y-1'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {skillSlugs[index]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
