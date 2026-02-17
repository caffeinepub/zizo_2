import { useEffect, useState } from 'react';
import { useGetVideos } from '../../../hooks/useQueries';

interface DuetComposerProps {
  duetVideoId: string;
  userVideoUrl: string;
}

export default function DuetComposer({ duetVideoId, userVideoUrl }: DuetComposerProps) {
  const { data: videos } = useGetVideos();
  const [sourceVideoUrl, setSourceVideoUrl] = useState<string>('');

  useEffect(() => {
    const sourceVideo = videos?.find(v => v.id === duetVideoId);
    if (sourceVideo) {
      setSourceVideoUrl(sourceVideo.url.getDirectURL());
    }
  }, [videos, duetVideoId]);

  return (
    <div className="flex h-full">
      <div className="flex-1 relative">
        {sourceVideoUrl && (
          <video
            src={sourceVideoUrl}
            className="w-full h-full object-cover"
            loop
            muted
            autoPlay
          />
        )}
      </div>
      <div className="flex-1 relative">
        <video
          src={userVideoUrl}
          className="w-full h-full object-cover"
          loop
          muted
          autoPlay
        />
      </div>
    </div>
  );
}
