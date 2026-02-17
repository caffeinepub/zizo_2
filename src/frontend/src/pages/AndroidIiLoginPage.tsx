import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, ExternalLink, AlertCircle } from 'lucide-react';

const ANDROID_APP_LINK = 'https://www.my-app.com';

export default function AndroidIiLoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isLoginError = loginStatus === 'loginError';

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && !redirectAttempted) {
      setRedirectAttempted(true);
      // Attempt automatic redirect
      try {
        window.location.href = ANDROID_APP_LINK;
      } catch (error) {
        console.error('Automatic redirect failed:', error);
      }
    }
  }, [isAuthenticated, redirectAttempted]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleManualReturn = () => {
    window.location.href = ANDROID_APP_LINK;
  };

  // Success state - show return to app
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ExternalLink className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Login Successful</CardTitle>
            <CardDescription>
              You're now authenticated. Returning to the app...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="text-center">
                If you're not redirected automatically, tap the button below.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleManualReturn}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Return to App
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isLoginError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Login Failed</CardTitle>
            <CardDescription>
              There was a problem authenticating your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Please try again or contact support if the problem persists.
              </AlertDescription>
            </Alert>
            <Button
              onClick={handleLogin}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logging in state
  if (isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">Authenticating</CardTitle>
            <CardDescription>
              Please complete the login process in the popup window...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-center text-sm">
                This may take a few moments. Don't close this page.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initial state - ready to start login
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Login to ZIZO</CardTitle>
          <CardDescription>
            Authenticate with Internet Identity to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-center text-sm">
              You'll be redirected to Internet Identity to complete the login process.
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Start Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
