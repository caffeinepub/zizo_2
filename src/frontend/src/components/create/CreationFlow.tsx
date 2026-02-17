import { useState, useCallback } from 'react';
import ModeSelect from './ModeSelect';
import CaptureOrUploadStep from './CaptureOrUploadStep';
import EditorStep from './EditorStep';
import PreviewStep from './PreviewStep';
import type { EditorState } from '../../utils/editor/types';

export type CreationMode = 'video' | 'photo' | 'text';

interface CreationFlowProps {
  duetVideoId?: string | null;
  onComplete: () => void;
}

export default function CreationFlow({ duetVideoId, onComplete }: CreationFlowProps) {
  const [step, setStep] = useState<'mode' | 'capture' | 'editor' | 'preview'>(duetVideoId ? 'capture' : 'mode');
  const [mode, setMode] = useState<CreationMode>(duetVideoId ? 'video' : 'video');
  const [sourceMedia, setSourceMedia] = useState<File | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [renderedOutput, setRenderedOutput] = useState<File | null>(null);

  const handleModeSelect = useCallback((selectedMode: CreationMode) => {
    setMode(selectedMode);
    setStep('capture');
  }, []);

  const handleCaptureComplete = useCallback((file: File) => {
    setSourceMedia(file);
    setStep('editor');
  }, []);

  const handleEditorComplete = useCallback((state: EditorState, output: File) => {
    setEditorState(state);
    setRenderedOutput(output);
    setStep('preview');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'preview') {
      setStep('editor');
    } else if (step === 'editor') {
      setStep('capture');
    } else if (step === 'capture') {
      setStep(duetVideoId ? 'capture' : 'mode');
    }
  }, [step, duetVideoId]);

  const handlePublishComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className="h-full w-full">
      {step === 'mode' && <ModeSelect onSelect={handleModeSelect} />}
      {step === 'capture' && (
        <CaptureOrUploadStep
          mode={mode}
          duetVideoId={duetVideoId}
          onComplete={handleCaptureComplete}
          onBack={handleBack}
        />
      )}
      {step === 'editor' && sourceMedia && (
        <EditorStep
          mode={mode}
          sourceMedia={sourceMedia}
          duetVideoId={duetVideoId}
          onComplete={handleEditorComplete}
          onBack={handleBack}
        />
      )}
      {step === 'preview' && renderedOutput && (
        <PreviewStep
          output={renderedOutput}
          onBack={handleBack}
          onPublish={handlePublishComplete}
        />
      )}
    </div>
  );
}
