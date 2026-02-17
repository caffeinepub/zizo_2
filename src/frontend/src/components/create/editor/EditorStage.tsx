import { useRef, useEffect, useState } from 'react';
import type { CreationMode } from '../CreationFlow';
import type { EditorState } from '../../../utils/editor/types';
import { useTapGestures } from '../../../hooks/useTapGestures';

interface EditorStageProps {
  mediaUrl: string;
  mode: CreationMode;
  editorState: EditorState;
  duration: number;
}

export default function EditorStage({ mediaUrl, mode, editorState, duration }: EditorStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleSingleTap = () => {
    if (mode !== 'video') return;
    
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play().catch(() => {});
      setIsPaused(false);
    } else {
      videoElement.pause();
      setIsPaused(true);
    }
  };

  const tapHandlers = useTapGestures({
    onSingleTap: handleSingleTap,
  });

  useEffect(() => {
    if (videoRef.current && mode === 'video') {
      videoRef.current.playbackRate = editorState.speed;
    }
  }, [editorState.speed, mode]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      style={{
        backgroundImage: 'url(/assets/generated/editor-grain-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative aspect-[9/16] h-full max-h-full bg-black" {...(mode === 'video' ? tapHandlers : {})}>
        {mode === 'video' ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="w-full h-full object-contain"
            loop
            muted
            autoPlay
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        )}

        {editorState.captions.map((caption, index) => (
          <div
            key={index}
            className="absolute pointer-events-none"
            style={{
              left: `${caption.position.x}%`,
              top: `${caption.position.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${caption.size}px`,
              color: caption.color,
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {caption.text}
          </div>
        ))}

        {editorState.stickers.map((sticker, index) => (
          <div
            key={index}
            className="absolute pointer-events-none"
            style={{
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              transform: `translate(-50%, -50%) scale(${sticker.scale})`,
            }}
          >
            <img
              src={sticker.url}
              alt="Sticker"
              className="w-16 h-16 object-contain"
            />
          </div>
        ))}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
