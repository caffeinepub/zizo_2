import { Home, TrendingUp, PlusCircle, Bell, User } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';

export default function BottomTabs() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: PlusCircle, label: 'Create', path: '/create' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border/50 overflow-x-hidden"
      style={{
        paddingBottom: 'calc(var(--tab-bar-inset) + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(var(--tab-bar-inset), env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(max(var(--tab-bar-inset), env(safe-area-inset-right, 0px)) + var(--tab-bar-horizontal-shift))',
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-full">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path })}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors flex-1 min-w-0 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-6 w-6 flex-shrink-0 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
