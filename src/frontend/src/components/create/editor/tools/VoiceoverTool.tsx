import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Trash2 } from 'lucide-react';
import type { EditorState, VoiceEffect } from '../../../../utils/editor/types';

interface VoiceoverToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

const voiceEffects: Array<{ id: VoiceEffect; label: string }> = [
  { id: 'none', label: 'Normal' },
  { id: 'chipmunk', label: 'Chipmunk' },
  { id: 'deep', label: 'Deep' },
  { id: 'robotic', label: 'Robotic' },
];

export default function VoiceoverTool({ editorState, onStateChange }: VoiceoverToolProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(!!editorState.voiceover);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onStateChange({
          ...editorState,
          voiceover: {
            url,
            effect: editorState.voiceover?.effect || 'none',
          },
        });
        setHasRecording(true);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    onStateChange({ ...editorState, voiceover: null });
    setHasRecording(false);
  };

  const setEffect = (effect: VoiceEffect) => {
    if (editorState.voiceover) {
      onStateChange({
        ...editorState,
        voiceover: { ...editorState.voiceover, effect },
      });
    }
  };

  return (
    <div className="space-y-4 text-white">
      {!hasRecording ? (
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? 'destructive' : 'default'}
          className="w-full h-12 gap-2"
        >
          {isRecording ? (
            <>
              <Square className="h-5 w-5 fill-current" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Record Voiceover
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/10 rounded">
            <span className="text-sm">Voiceover recorded</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearRecording}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Voice Effect</p>
            <div className="grid grid-cols-2 gap-2">
              {voiceEffects.map(effect => (
                <Button
                  key={effect.id}
                  variant={editorState.voiceover?.effect === effect.id ? 'default' : 'outline'}
                  onClick={() => setEffect(effect.id)}
                  className="text-white"
                >
                  {effect.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              clearRecording();
              startRecording();
            }}
            variant="outline"
            className="w-full text-white"
          >
            Re-record
          </Button>
        </div>
      )}
    </div>
  );
}
