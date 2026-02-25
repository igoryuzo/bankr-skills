import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function ContributeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white terminal-card"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-100">
            <h2 className="text-xl font-extrabold tracking-tight text-[#1a1a1a]">Add Your Skill</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-6 space-y-8">

            {/* Steps */}
            <div className="space-y-6">
              {[
                {
                  n: '1',
                  title: 'Fork & branch',
                  body: 'Fork this repository and create a new branch for your skill.',
                },
                {
                  n: '2',
                  title: 'Create your provider directory',
                  body: null,
                  code: 'mkdir your-provider-name/',
                },
                {
                  n: '3',
                  title: 'Add the required files',
                  body: 'SKILL.md is required. references/ and scripts/ are optional.',
                  tree: `your-provider-name/\n├── SKILL.md\n├── references/\n│   └── your-docs.md\n└── scripts/\n    └── your-script.sh`,
                },
                {
                  n: '4',
                  title: 'Submit a Pull Request',
                  body: 'Open a PR with a clear description of what your skill does.',
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <span className="shrink-0 h-7 w-7 rounded-full bg-[#1a1a1a] text-white text-xs font-bold font-mono flex items-center justify-center mt-0.5">
                    {step.n}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1a1a1a] mb-1">{step.title}</p>
                    {step.body && <p className="text-sm text-neutral-500 leading-relaxed">{step.body}</p>}
                    {step.code && (
                      <pre className="mt-2 rounded-lg bg-[#1a1a1a] px-4 py-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                        <span className="text-neutral-500">$ </span>{step.code}
                      </pre>
                    )}
                    {step.tree && (
                      <pre className="mt-2 rounded-lg bg-neutral-50 border border-neutral-100 px-4 py-3 text-sm font-mono text-neutral-600 overflow-x-auto leading-relaxed">
                        {step.tree}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Guidelines */}
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 px-5 py-4">
              <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400 mb-3">Guidelines</p>
              <ul className="space-y-2">
                {[
                  'Keep skill definitions clear and well-documented',
                  'Include examples of usage in your SKILL.md',
                  'Test your skill before submitting',
                  'Use descriptive commit messages',
                ].map((g) => (
                  <li key={g} className="flex items-start gap-2.5 text-sm text-neutral-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 shrink-0 mt-1.5" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <a
              href="https://github.com/BankrBot/openclaw-skills/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#2d2d2d] px-6 py-3.5 text-[13px] font-mono font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#404040] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Fork on GitHub
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
