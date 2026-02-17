import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import CreatePage from './pages/CreatePage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AndroidIiLoginPage from './pages/AndroidIiLoginPage';
import FirstLaunchPreloader from './components/preloader/FirstLaunchPreloader';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trending',
  component: TrendingPage,
});

const createRoute_ = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreatePage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const androidIiLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/android/ii-login',
  component: AndroidIiLoginPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  trendingRoute,
  createRoute_,
  notificationsRoute,
  profileRoute,
  androidIiLoginRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  if (showPreloader) {
    return <FirstLaunchPreloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
