"use client";

import { useState, useEffect } from "react";

const skillSlugs = [
  "bankr",
  "erc-8004",
  "botchan",
  "onchainkit",
  "endaoment",
  "ens-primary-name",
  "qrcoin",
  "veil",
  "bankr-signals",
  "yoink",
  "neynar",
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
    <div className="mx-auto max-w-[1160px] px-4 sm:px-8 mt-10 sm:mt-14">
      <div className="terminal-card rounded-2xl bg-white overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-neutral-100">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[13px] font-mono text-neutral-400">
            openclaw
          </span>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 font-mono text-[13px] sm:text-[15px] leading-[2.2] text-[#333] overflow-x-auto">
          <p className="whitespace-nowrap">
            <span className="text-neutral-400">&gt; </span>
            <span>install the </span>
            <span
              className={`inline-block rounded-lg bg-[#a88bfb] px-3 py-0.5 text-white transition-all duration-200 ${
                isAnimating
                  ? "opacity-0 translate-y-1"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {skillSlugs[index]}
            </span>
            <span>
              {" "}
              skill from https://github.com/BankrBot/openclaw-skills/tree/main/
              {skillSlugs[index]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
