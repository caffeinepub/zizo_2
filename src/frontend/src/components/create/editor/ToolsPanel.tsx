import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scissors, Gauge, Sparkles, Wand2, Image, Type, Smile, Zap, Music, Mic } from 'lucide-react';
import type { CreationMode } from '../CreationFlow';
import type { EditorState } from '../../../utils/editor/types';
import TrimTool from './tools/TrimTool';
import SpeedTool from './tools/SpeedTool';
import FiltersTool from './tools/FiltersTool';
import EffectsTool from './tools/EffectsTool';
import GreenScreenTool from './tools/GreenScreenTool';
import CaptionsTool from './tools/CaptionsTool';
import StickersTool from './tools/StickersTool';
import AutoCutTool from './tools/AutoCutTool';
import SoundLabTool from './tools/SoundLabTool';
import VoiceoverTool from './tools/VoiceoverTool';

interface ToolsPanelProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
  mode: CreationMode;
  duration: number;
}

type ToolType = 'trim' | 'speed' | 'filters' | 'effects' | 'greenscreen' | 'captions' | 'stickers' | 'autocut' | 'sound' | 'voiceover' | null;

export default function ToolsPanel({ editorState, onStateChange, mode, duration }: ToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const tools = [
    { id: 'trim' as ToolType, icon: Scissors, label: 'Trim', videoOnly: true },
    { id: 'speed' as ToolType, icon: Gauge, label: 'Speed', videoOnly: true },
    { id: 'filters' as ToolType, icon: Sparkles, label: 'Filters', videoOnly: false },
    { id: 'effects' as ToolType, icon: Wand2, label: 'Effects', videoOnly: false },
    { id: 'greenscreen' as ToolType, icon: Image, label: 'Green Screen', videoOnly: true },
    { id: 'captions' as ToolType, icon: Type, label: 'Captions', videoOnly: false },
    { id: 'stickers' as ToolType, icon: Smile, label: 'Stickers', videoOnly: false },
    { id: 'autocut' as ToolType, icon: Zap, label: 'Auto-cut', videoOnly: true },
    { id: 'sound' as ToolType, icon: Music, label: 'Music', videoOnly: true },
    { id: 'voiceover' as ToolType, icon: Mic, label: 'Voiceover', videoOnly: true },
  ];

  const availableTools = tools.filter(tool => !tool.videoOnly || mode === 'video');

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent">
      {activeTool ? (
        <div className="p-4 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold capitalize">{activeTool}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTool(null)}
              className="text-white"
            >
              Done
            </Button>
          </div>
          
          {activeTool === 'trim' && <TrimTool editorState={editorState} onStateChange={onStateChange} duration={duration} />}
          {activeTool === 'speed' && <SpeedTool editorState={editorState} onStateChange={onStateChange} />}
          {activeTool === 'filters' && <FiltersTool editorState={editorState} onStateChange={onStateChange} />}
          {activeTool === 'effects' && <EffectsTool editorState={editorState} onStateChange={onStateChange} />}
          {activeTool === 'greenscreen' && <GreenScreenTool editorState={editorState} onStateChange={onStateChange} />}
          {activeTool === 'captions' && <CaptionsTool editorState={editorState} onStateChange={onStateChange} />}
          {activeTool === 'stickers' && <StickersTool editorState={editorState} onStateChange={onStateChange} />}
          {activeTool === 'autocut' && <AutoCutTool editorState={editorState} onStateChange={onStateChange} duration={duration} />}
          {activeTool === 'sound' && <SoundLabTool editorState={editorState} onStateChange={onStateChange} />}
          {activeTool === 'voiceover' && <VoiceoverTool editorState={editorState} onStateChange={onStateChange} />}
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="flex gap-2 p-4 pb-safe">
            {availableTools.map(tool => (
              <Button
                key={tool.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTool(tool.id)}
                className="flex-col h-auto py-2 px-3 text-white hover:bg-white/20 gap-1"
              >
                <tool.icon className="h-5 w-5" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
