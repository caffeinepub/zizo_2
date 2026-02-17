import { useState, useRef } from 'react';
import { useCamera } from '../../camera/useCamera';
import { Button } from '@/components/ui/button';
import { Camera, Video, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraRecorderProps {
  onCapture: (file: File, url: string) => void;
  onFallback: () => void;
}

export default function CameraRecorder({ onCapture, onFallback }: CameraRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1280,
    height: 720,
  });

  const handleStartRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      setRecordedChunks([]);
      stopCamera();
      onCapture(file, url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (isSupported === false) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Camera is not supported in your browser. Please use the upload option instead.
        </AlertDescription>
        <Button onClick={onFallback} variant="outline" className="mt-4">
          Upload Video Instead
        </Button>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message}
          {error.type === 'permission' && (
            <Button onClick={onFallback} variant="outline" className="mt-4 w-full">
              Upload Video Instead
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-destructive px-3 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span className="text-xs font-semibold text-white">Recording</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isActive ? (
          <Button onClick={startCamera} disabled={isLoading} className="flex-1 gap-2">
            <Camera className="h-4 w-4" />
            {isLoading ? 'Starting Camera...' : 'Start Camera'}
          </Button>
        ) : !isRecording ? (
          <Button onClick={handleStartRecording} className="flex-1 gap-2">
            <Video className="h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <Button onClick={handleStopRecording} variant="destructive" className="flex-1">
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
}
