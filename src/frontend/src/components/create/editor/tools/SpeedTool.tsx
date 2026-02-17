import { Button } from '@/components/ui/button';
import type { EditorState } from '../../../../utils/editor/types';

interface SpeedToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

const speeds = [0.5, 0.75, 1, 1.5, 2, 3];

export default function SpeedTool({ editorState, onStateChange }: SpeedToolProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {speeds.map(speed => (
        <Button
          key={speed}
          variant={editorState.speed === speed ? 'default' : 'outline'}
          onClick={() => onStateChange({ ...editorState, speed })}
          className="text-white"
        >
          {speed}x
        </Button>
      ))}
    </div>
  );
}
