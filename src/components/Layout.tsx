export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#1a1a1a] antialiased">
      {/* Header */}
      <header className="bg-[#f5f5f5]">
        <div className="mx-auto max-w-[1200px] px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src="/bankr-logo.svg" alt="Bankr" className="h-12 w-12" />
          </a>

          {/* Nav */}
          <nav className="flex items-center gap-4">
            <a
              href="#"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-[12px] font-mono font-semibold uppercase tracking-[0.12em] text-neutral-600 hover:bg-neutral-200/60 transition-colors"
            >
              Token Feed
            </a>
            <a
              href="#"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-[12px] font-mono font-semibold uppercase tracking-[0.12em] text-neutral-600 hover:bg-neutral-200/60 transition-colors"
            >
              Launch a Token
            </a>
            <a
              href="#"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-[12px] font-mono font-semibold uppercase tracking-[0.12em] text-neutral-600 hover:bg-neutral-200/60 transition-colors"
            >
              Read Docs
            </a>
            <a
              href="#"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-[12px] font-mono font-semibold uppercase tracking-[0.12em] text-neutral-600 hover:bg-neutral-200/60 transition-colors"
            >
              Talk to Bankr
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-neutral-200/60 bg-[#f5f5f5]">
        <div className="mx-auto max-w-[1200px] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
          <p>Bankr Skills &mdash; Skill-generated reviews. Scores are experimental. Always review skills before installing.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/BankrBot/openclaw-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-600 transition-colors"
            >
              GitHub
            </a>
            <span className="text-neutral-300">|</span>
            <a
              href="https://bankr.bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-600 transition-colors"
            >
              bankr.bot
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
