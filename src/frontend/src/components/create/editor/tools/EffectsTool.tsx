import { Button } from '@/components/ui/button';
import type { EditorState, Effect } from '../../../../utils/editor/types';

interface EffectsToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

const effects: Effect[] = ['none', 'blur', 'vignette', 'glitch', 'pixelate', 'sharpen'];

export default function EffectsTool({ editorState, onStateChange }: EffectsToolProps) {
  const toggleEffect = (effect: Effect) => {
    const newEffects = editorState.effects.includes(effect)
      ? editorState.effects.filter(e => e !== effect)
      : [effect];
    onStateChange({ ...editorState, effects: newEffects });
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {effects.map(effect => (
        <Button
          key={effect}
          variant={editorState.effects.includes(effect) ? 'default' : 'outline'}
          onClick={() => toggleEffect(effect)}
          className="text-white capitalize"
        >
          {effect}
        </Button>
      ))}
    </div>
  );
}
