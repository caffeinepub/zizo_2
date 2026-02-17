import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { EditorState, Sticker } from '../../../../utils/editor/types';

interface StickersToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

const stickerPacks = [
  '/assets/generated/sticker-pack-1.dim_512x512.png',
  '/assets/generated/sticker-pack-2.dim_512x512.png',
];

export default function StickersTool({ editorState, onStateChange }: StickersToolProps) {
  const addSticker = (url: string) => {
    const sticker: Sticker = {
      url,
      position: { x: 50, y: 50 },
      scale: 1,
    };
    onStateChange({
      ...editorState,
      stickers: [...editorState.stickers, sticker],
    });
  };

  const removeSticker = (index: number) => {
    onStateChange({
      ...editorState,
      stickers: editorState.stickers.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4 text-white">
      <div className="grid grid-cols-4 gap-2">
        {stickerPacks.map((pack, index) => (
          <button
            key={index}
            onClick={() => addSticker(pack)}
            className="aspect-square rounded bg-white/10 hover:bg-white/20 p-2 transition-colors"
          >
            <img src={pack} alt={`Sticker ${index + 1}`} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>

      {editorState.stickers.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Added Stickers</p>
          <div className="flex flex-wrap gap-2">
            {editorState.stickers.map((sticker, index) => (
              <div key={index} className="relative">
                <img src={sticker.url} alt="Sticker" className="w-12 h-12 object-contain bg-white/10 rounded p-1" />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSticker(index)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
