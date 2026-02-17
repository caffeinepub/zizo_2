import { useGetVideos } from '../hooks/useQueries';
import VerticalVideoFeed from '../components/feed/VerticalVideoFeed';
import ProfileSetupModal from '../components/profile/ProfileSetupModal';

export default function HomePage() {
  const { data: videos, isLoading, error } = useGetVideos();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive">Failed to load videos</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">No videos yet. Be the first to create one!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <VerticalVideoFeed videos={videos} />
      <ProfileSetupModal />
    </>
  );
}
