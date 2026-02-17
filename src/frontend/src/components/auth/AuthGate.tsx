import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  onUnauthenticated?: () => void;
}

export default function AuthGate({ children, fallback, onUnauthenticated }: AuthGateProps) {
  const { identity, login } = useInternetIdentity();

  if (!identity) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">You need to be logged in to perform this action.</p>
        <Button
          onClick={() => {
            if (onUnauthenticated) {
              onUnauthenticated();
            } else {
              login();
            }
          }}
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
