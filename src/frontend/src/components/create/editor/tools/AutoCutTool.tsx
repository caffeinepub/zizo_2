import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Zap } from 'lucide-react';
import type { EditorState } from '../../../../utils/editor/types';

interface AutoCutToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
  duration: number;
}

export default function AutoCutTool({ editorState, onStateChange, duration }: AutoCutToolProps) {
  const [threshold, setThreshold] = useState(0.3);

  const handleAutoCut = () => {
    const segments: Array<{ start: number; end: number }> = [];
    const segmentCount = Math.floor(duration / 2);
    
    for (let i = 0; i < segmentCount; i++) {
      const start = i * 2;
      const end = start + 1.5;
      if (Math.random() > threshold) {
        segments.push({ start, end: Math.min(end, duration) });
      }
    }

    onStateChange({
      ...editorState,
      autoCutSegments: segments,
    });
  };

  return (
    <div className="space-y-4 text-white">
      <div className="space-y-2">
        <label className="text-sm">Sensitivity</label>
        <Slider
          min={0.1}
          max={0.9}
          step={0.1}
          value={[threshold]}
          onValueChange={([val]) => setThreshold(val)}
        />
        <p className="text-xs text-muted-foreground">
          Higher = more aggressive cutting
        </p>
      </div>

      <Button
        onClick={handleAutoCut}
        className="w-full gap-2"
      >
        <Zap className="h-4 w-4" />
        Apply Auto-cut
      </Button>

      {editorState.autoCutSegments.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {editorState.autoCutSegments.length} segments will be kept
        </p>
      )}
    </div>
  );
}
