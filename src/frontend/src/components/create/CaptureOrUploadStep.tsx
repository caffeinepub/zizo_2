import { useState, useRef } from 'react';
import { useCamera } from '../../camera/useCamera';
import { Button } from '@/components/ui/button';
import { Camera, Video, Upload, AlertCircle, ArrowLeft, Square } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import type { CreationMode } from './CreationFlow';

interface CaptureOrUploadStepProps {
  mode: CreationMode;
  duetVideoId?: string | null;
  onComplete: (file: File) => void;
  onBack: () => void;
}

export default function CaptureOrUploadStep({ mode, duetVideoId, onComplete, onBack }: CaptureOrUploadStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [useUpload, setUseUpload] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1080,
    height: 1920,
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
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      stopCamera();
      onComplete(file);
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

  const handleCapturePhoto = async () => {
    const photoFile = await capturePhoto();
    if (photoFile) {
      stopCamera();
      onComplete(photoFile);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onComplete(file);
    }
  };

  const handleTextSubmit = () => {
    if (!textContent.trim()) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = textContent.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 100) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    const lineHeight = 80;
    const startY = (canvas.height - lines.length * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `text-${Date.now()}.png`, { type: 'image/png' });
        onComplete(file);
      }
    }, 'image/png');
  };

  if (mode === 'text') {
    return (
      <div className="flex h-full flex-col p-4 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">Text Mode</h2>
        </div>
        
        <Textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Enter your text here..."
          className="flex-1 text-lg resize-none"
        />
        
        <Button
          onClick={handleTextSubmit}
          disabled={!textContent.trim()}
          size="lg"
        >
          Continue
        </Button>
      </div>
    );
  }

  if (useUpload || isSupported === false || error?.type === 'permission') {
    return (
      <div className="flex h-full flex-col p-4 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">Upload {mode === 'video' ? 'Video' : 'Photo'}</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Select a file from your device</p>
            <input
              ref={fileInputRef}
              type="file"
              accept={mode === 'video' ? 'video/*' : 'image/*'}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} size="lg">
              Choose File
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-black">
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {duetVideoId && (
          <span className="text-white text-sm font-medium">Duet Mode</span>
        )}
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
          style={{ minHeight: '400px' }}
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {isRecording && (
          <div className="absolute top-20 left-4 flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span className="text-xs font-semibold text-white">Recording</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {!isActive ? (
          <div className="space-y-2">
            <Button
              onClick={startCamera}
              disabled={isLoading}
              className="w-full h-14 text-lg gap-2"
              size="lg"
            >
              <Camera className="h-5 w-5" />
              {isLoading ? 'Starting Camera...' : 'Start Camera'}
            </Button>
            <Button
              onClick={() => setUseUpload(true)}
              variant="outline"
              className="w-full"
            >
              Or Upload File
            </Button>
          </div>
        ) : mode === 'video' ? (
          !isRecording ? (
            <Button
              onClick={handleStartRecording}
              className="w-full h-14 text-lg gap-2 bg-destructive hover:bg-destructive/90"
              size="lg"
            >
              <Video className="h-5 w-5" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              className="w-full h-14 text-lg gap-2"
              size="lg"
              variant="outline"
            >
              <Square className="h-5 w-5 fill-current" />
              Stop Recording
            </Button>
          )
        ) : (
          <Button
            onClick={handleCapturePhoto}
            className="w-full h-14 text-lg gap-2"
            size="lg"
          >
            <Camera className="h-5 w-5" />
            Capture Photo
          </Button>
        )}
      </div>
    </div>
  );
}
