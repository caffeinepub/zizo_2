import { Video, Camera, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CreationMode } from './CreationFlow';

interface ModeSelectProps {
  onSelect: (mode: CreationMode) => void;
}

export default function ModeSelect({ onSelect }: ModeSelectProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Create Content</h1>
      <p className="text-muted-foreground text-center">Choose what you want to create</p>
      
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button
          onClick={() => onSelect('video')}
          size="lg"
          className="h-20 text-lg gap-3"
        >
          <Video className="h-6 w-6" />
          Video
        </Button>
        
        <Button
          onClick={() => onSelect('photo')}
          size="lg"
          variant="outline"
          className="h-20 text-lg gap-3"
        >
          <Camera className="h-6 w-6" />
          Photo
        </Button>
        
        <Button
          onClick={() => onSelect('text')}
          size="lg"
          variant="outline"
          className="h-20 text-lg gap-3"
        >
          <Type className="h-6 w-6" />
          Text
        </Button>
      </div>
    </div>
  );
}
