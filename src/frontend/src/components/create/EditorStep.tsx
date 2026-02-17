import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import EditorStage from './editor/EditorStage';
import ToolsPanel from './editor/ToolsPanel';
import type { CreationMode } from './CreationFlow';
import type { EditorState } from '../../utils/editor/types';
import { renderVideo } from '../../utils/editor/renderPipeline';
import { toast } from 'sonner';

interface EditorStepProps {
  mode: CreationMode;
  sourceMedia: File;
  duetVideoId?: string | null;
  onComplete: (state: EditorState, output: File) => void;
  onBack: () => void;
}

export default function EditorStep({ mode, sourceMedia, duetVideoId, onComplete, onBack }: EditorStepProps) {
  const [editorState, setEditorState] = useState<EditorState>({
    trim: { start: 0, end: 0 },
    speed: 1,
    filters: [],
    effects: [],
    greenScreen: null,
    captions: [],
    stickers: [],
    autoCutSegments: [],
    music: null,
    voiceover: null,
    duetLayout: duetVideoId ? { sourceVideoId: duetVideoId, position: 'left' } : null,
  });
  const [isRendering, setIsRendering] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaDuration, setMediaDuration] = useState(0);

  useEffect(() => {
    const url = URL.createObjectURL(sourceMedia);
    setMediaUrl(url);

    if (mode === 'video') {
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        setMediaDuration(video.duration);
        setEditorState(prev => ({
          ...prev,
          trim: { start: 0, end: video.duration },
        }));
      };
    }

    return () => URL.revokeObjectURL(url);
  }, [sourceMedia, mode]);

  const handleNext = async () => {
    setIsRendering(true);
    try {
      const output = await renderVideo(sourceMedia, editorState, mode);
      onComplete(editorState, output);
    } catch (error) {
      console.error('Render error:', error);
      toast.error('Failed to render video');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-black">
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white" disabled={isRendering}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleNext}
          disabled={isRendering}
          className="gap-2"
        >
          {isRendering ? 'Rendering...' : (
            <>
              <Check className="h-4 w-4" />
              Next
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 relative">
        <EditorStage
          mediaUrl={mediaUrl}
          mode={mode}
          editorState={editorState}
          duration={mediaDuration}
        />
      </div>

      <ToolsPanel
        editorState={editorState}
        onStateChange={setEditorState}
        mode={mode}
        duration={mediaDuration}
      />
    </div>
  );
}
