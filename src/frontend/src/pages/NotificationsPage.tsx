import { Bell } from 'lucide-react';
import ProfileSetupModal from '../components/profile/ProfileSetupModal';

export default function NotificationsPage() {
  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="container max-w-2xl mx-auto p-4 space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          <div className="text-center py-12">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              You'll see notifications here when people interact with your videos
            </p>
          </div>
        </div>
      </div>
      <ProfileSetupModal />
    </>
  );
}
