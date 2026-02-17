import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import ProfileSetupModal from '../components/profile/ProfileSetupModal';
import CreationFlow from '../components/create/CreationFlow';
import { getUrlParameter } from '../utils/urlParams';

export default function CreatePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [duetVideoId, setDuetVideoId] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const duetParam = getUrlParameter('duet');
    if (duetParam) {
      setDuetVideoId(duetParam);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">You need to be logged in to create videos.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-hidden">
        <CreationFlow duetVideoId={duetVideoId} onComplete={() => navigate({ to: '/' })} />
      </div>
      <ProfileSetupModal />
    </>
  );
}
