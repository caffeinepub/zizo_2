import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2 } from 'lucide-react';
import type { EditorState, Caption } from '../../../../utils/editor/types';

interface CaptionsToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

export default function CaptionsTool({ editorState, onStateChange }: CaptionsToolProps) {
  const [newText, setNewText] = useState('');

  const addCaption = () => {
    if (!newText.trim()) return;
    
    const caption: Caption = {
      text: newText,
      position: { x: 50, y: 50 },
      size: 32,
      color: '#ffffff',
    };
    
    onStateChange({
      ...editorState,
      captions: [...editorState.captions, caption],
    });
    setNewText('');
  };

  const removeCaption = (index: number) => {
    onStateChange({
      ...editorState,
      captions: editorState.captions.filter((_, i) => i !== index),
    });
  };

  const updateCaption = (index: number, updates: Partial<Caption>) => {
    const newCaptions = [...editorState.captions];
    newCaptions[index] = { ...newCaptions[index], ...updates };
    onStateChange({ ...editorState, captions: newCaptions });
  };

  return (
    <div className="space-y-4 text-white">
      <div className="flex gap-2">
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Enter caption text"
          className="flex-1"
        />
        <Button onClick={addCaption} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {editorState.captions.map((caption, index) => (
          <div key={index} className="p-3 bg-white/10 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate flex-1">{caption.text}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCaption(index)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <label className="text-xs">Size</label>
              <Slider
                min={16}
                max={64}
                step={2}
                value={[caption.size]}
                onValueChange={([size]) => updateCaption(index, { size })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
