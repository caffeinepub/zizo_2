import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Upload, Music } from 'lucide-react';
import type { EditorState } from '../../../../utils/editor/types';

interface SoundLabToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

const sampleTracks = [
  { name: 'Track 1', url: '/assets/music/sample-track-1.mp3' },
  { name: 'Track 2', url: '/assets/music/sample-track-2.mp3' },
  { name: 'Track 3', url: '/assets/music/sample-track-3.mp3' },
];

export default function SoundLabTool({ editorState, onStateChange }: SoundLabToolProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(editorState.music?.url || null);
  const [originalVolume, setOriginalVolume] = useState(editorState.music?.originalVolume || 1);
  const [musicVolume, setMusicVolume] = useState(editorState.music?.musicVolume || 0.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTrackSelect = (url: string) => {
    setSelectedTrack(url);
    onStateChange({
      ...editorState,
      music: {
        url,
        startOffset: 0,
        originalVolume,
        musicVolume,
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleTrackSelect(url);
    }
  };

  const updateVolumes = (orig: number, music: number) => {
    setOriginalVolume(orig);
    setMusicVolume(music);
    if (selectedTrack) {
      onStateChange({
        ...editorState,
        music: {
          url: selectedTrack,
          startOffset: 0,
          originalVolume: orig,
          musicVolume: music,
        },
      });
    }
  };

  return (
    <div className="space-y-4 text-white">
      <div className="space-y-2">
        <p className="text-sm font-medium">Sample Tracks</p>
        <div className="grid grid-cols-3 gap-2">
          {sampleTracks.map((track, index) => (
            <Button
              key={index}
              variant={selectedTrack === track.url ? 'default' : 'outline'}
              onClick={() => handleTrackSelect(track.url)}
              className="text-xs"
            >
              <Music className="h-3 w-3 mr-1" />
              {track.name}
            </Button>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full text-white gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload Music
      </Button>

      {selectedTrack && (
        <div className="space-y-3 pt-2 border-t border-white/20">
          <div className="space-y-1">
            <label className="text-sm">Original Audio: {Math.round(originalVolume * 100)}%</label>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[originalVolume]}
              onValueChange={([val]) => updateVolumes(val, musicVolume)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Music Volume: {Math.round(musicVolume * 100)}%</label>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[musicVolume]}
              onValueChange={([val]) => updateVolumes(originalVolume, val)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
