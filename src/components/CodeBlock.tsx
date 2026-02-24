'use client';

import { useState } from 'react';

export default function CodeBlock({
  code,
  language,
  title,
}: {
  code: string;
  language: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal-card rounded-2xl bg-white overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs font-mono text-neutral-400">{title}</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
            {language}
          </span>
        </div>
      )}
      <div className="relative group">
        <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
          <code className="text-neutral-700 font-mono">{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-700 cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
