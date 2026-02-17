import { ReactNode } from 'react';
import BottomTabs from '../navigation/BottomTabs';
import AuthButton from '../auth/AuthButton';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-border/50 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/zizo-logo.dim_512x512.png" alt="ZIZO" className="h-8 w-auto" />
        </div>
        <AuthButton />
      </header>

      <main 
        className="flex-1 overflow-hidden pt-14"
        style={{
          paddingBottom: 'var(--tab-bar-total-space)',
          height: '100dvh',
        }}
      >
        {children}
      </main>

      <BottomTabs />

      <footer 
        className="fixed left-0 right-0 z-40 border-t border-border/30 bg-background/95 px-4 py-2 text-center text-xs text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{
          bottom: 'calc(var(--tab-bar-total-space) + 0.25rem)',
        }}
      >
        <span>© {new Date().getFullYear()} • Built with ❤️ using </span>
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== 'undefined' ? window.location.hostname : 'zizo-app'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
