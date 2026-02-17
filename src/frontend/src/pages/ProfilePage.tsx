import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetFollowerCounts } from '../hooks/useQueries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';
import ProfileSetupModal from '../components/profile/ProfileSetupModal';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { data: followerCounts } = useGetFollowerCounts(identity?.getPrincipal() || null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center space-y-4">
          <User className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <p className="text-muted-foreground">Login to view your profile</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="container max-w-2xl mx-auto p-4 space-y-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/assets/generated/avatar-placeholder.dim_256x256.png" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                onClick={() => setEditModalOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold">{userProfile?.name || 'User'}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {identity?.getPrincipal().toString().slice(0, 10)}...
              </p>
            </div>

            <div className="flex gap-8 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{Number(followerCounts?.followers || 0)}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Number(followerCounts?.following || 0)}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold mb-4">Your Videos</h2>
            <div className="text-center py-8">
              <p className="text-muted-foreground">No videos yet</p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Videos you create will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
      <ProfileSetupModal />
      <EditProfileModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </>
  );
}
