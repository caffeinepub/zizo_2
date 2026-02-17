import { useRef, useEffect } from 'react';

interface VideoPreviewProps {
  url: string;
}

export default function VideoPreview({ url }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-card">
      <video
        ref={videoRef}
        src={url}
        controls
        loop
        muted
        className="h-full w-full object-contain"
      />
    </div>
  );
}
