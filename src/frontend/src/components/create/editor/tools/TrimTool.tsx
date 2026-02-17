import { Slider } from '@/components/ui/slider';
import type { EditorState } from '../../../../utils/editor/types';

interface TrimToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
  duration: number;
}

export default function TrimTool({ editorState, onStateChange, duration }: TrimToolProps) {
  const handleChange = (values: number[]) => {
    onStateChange({
      ...editorState,
      trim: { start: values[0], end: values[1] },
    });
  };

  return (
    <div className="space-y-4 text-white">
      <div className="flex justify-between text-sm">
        <span>Start: {editorState.trim.start.toFixed(1)}s</span>
        <span>End: {editorState.trim.end.toFixed(1)}s</span>
      </div>
      <Slider
        min={0}
        max={duration}
        step={0.1}
        value={[editorState.trim.start, editorState.trim.end]}
        onValueChange={handleChange}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Duration: {(editorState.trim.end - editorState.trim.start).toFixed(1)}s
      </p>
    </div>
  );
}
