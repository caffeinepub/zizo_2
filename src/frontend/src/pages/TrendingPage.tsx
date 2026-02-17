import { useGetTrending } from '../hooks/useQueries';
import { TrendingUp } from 'lucide-react';
import VideoCard from '../components/video/VideoCard';
import ProfileSetupModal from '../components/profile/ProfileSetupModal';

export default function TrendingPage() {
  const { data: videos, isLoading, error } = useGetTrending();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading trending videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive">Failed to load trending videos</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="container max-w-4xl mx-auto p-4 space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Trending Videos</h1>
          </div>

          {!videos || videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No trending videos yet</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => (
                <div key={video.id} className="relative">
                  <div className="absolute top-2 left-2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    #{index + 1}
                  </div>
                  <VideoCard video={video} isActive={false} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ProfileSetupModal />
    </>
  );
}
