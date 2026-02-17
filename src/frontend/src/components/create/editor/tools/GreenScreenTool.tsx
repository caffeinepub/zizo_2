import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import type { EditorState } from '../../../../utils/editor/types';

interface GreenScreenToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

export default function GreenScreenTool({ editorState, onStateChange }: GreenScreenToolProps) {
  const [bgUrl, setBgUrl] = useState<string | null>(editorState.greenScreen?.backgroundUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgUrl(url);
      onStateChange({
        ...editorState,
        greenScreen: { backgroundUrl: url, threshold: 0.4 },
      });
    }
  };

  const handleClear = () => {
    setBgUrl(null);
    onStateChange({ ...editorState, greenScreen: null });
  };

  return (
    <div className="space-y-4 text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {bgUrl ? (
        <div className="space-y-2">
          <img src={bgUrl} alt="Background" className="w-full h-32 object-cover rounded" />
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full text-white"
          >
            Remove Background
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-white gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Background
        </Button>
      )}
      
      <p className="text-xs text-muted-foreground">
        Upload a background image to replace green/blue areas in your video
      </p>
    </div>
  );
}
