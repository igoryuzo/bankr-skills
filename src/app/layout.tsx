import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bankr Skills — Plug-and-Play Tools for Agents',
  description:
    'Bankr Skills equip builders with plug-and-play tools to build more powerful agents. Browse skills with security audit results.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5f5f5] text-[#1a1a1a]`}
      >
        <div className="min-h-screen flex flex-col">
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
              <p>Bankr Skills &mdash; Security audited. Not affiliated with skill providers.</p>
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
      </body>
    </html>
  );
}
