import { useRef, useEffect, useState } from 'react';
import type { Video } from '../../backend';
import InteractionBar from './InteractionBar';
import { useTapGestures } from '../../hooks/useTapGestures';
import { useLikeVideo } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { triggerHaptic } from '../../utils/haptics';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  compact?: boolean;
}

export default function VideoCard({ video, isActive, compact = false }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const likeMutation = useLikeVideo();
  const { identity } = useInternetIdentity();
  const [showHeart, setShowHeart] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const handleSingleTap = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play().catch(() => {});
      setUserPaused(false);
    } else {
      videoElement.pause();
      setUserPaused(true);
    }
  };

  const handleDoubleTap = () => {
    if (!identity) {
      toast.error('Please log in to like videos');
      return;
    }

    triggerHaptic('medium');
    likeMutation.mutate(video.id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const tapHandlers = useTapGestures({
    onSingleTap: handleSingleTap,
    onDoubleTap: handleDoubleTap,
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive && !userPaused) {
      videoElement.play().catch(() => {});
    } else if (!isActive) {
      videoElement.pause();
      setUserPaused(false);
    }
  }, [isActive, userPaused]);

  return (
    <div className="relative w-full h-full bg-black" {...tapHandlers}>
      <video
        ref={videoRef}
        src={video.url.getDirectURL()}
        className="w-full h-full object-contain"
        loop
        playsInline
        muted={false}
      />

      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart className="h-32 w-32 text-white fill-red-500 animate-ping" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">{video.title}</h3>
        <p className="text-white/90 text-sm drop-shadow-lg">
          {video.uploader.toString().slice(0, 8)}...
        </p>
      </div>

      {!compact && <InteractionBar video={video} />}
    </div>
  );
}
