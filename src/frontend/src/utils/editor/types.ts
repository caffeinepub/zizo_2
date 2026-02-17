export type Filter = 'none' | 'bw' | 'sepia' | 'contrast' | 'vintage' | 'cool';
export type Effect = 'none' | 'blur' | 'vignette' | 'glitch' | 'pixelate' | 'sharpen';
export type VoiceEffect = 'none' | 'chipmunk' | 'deep' | 'robotic';

export interface Caption {
  text: string;
  position: { x: number; y: number };
  size: number;
  color: string;
}

export interface Sticker {
  url: string;
  position: { x: number; y: number };
  scale: number;
}

export interface GreenScreen {
  backgroundUrl: string;
  threshold: number;
}

export interface MusicSettings {
  url: string;
  startOffset: number;
  originalVolume: number;
  musicVolume: number;
}

export interface VoiceoverSettings {
  url: string;
  effect: VoiceEffect;
}

export interface DuetLayout {
  sourceVideoId: string;
  position: 'left' | 'right';
}

export interface EditorState {
  trim: { start: number; end: number };
  speed: number;
  filters: Filter[];
  effects: Effect[];
  greenScreen: GreenScreen | null;
  captions: Caption[];
  stickers: Sticker[];
  autoCutSegments: Array<{ start: number; end: number }>;
  music: MusicSettings | null;
  voiceover: VoiceoverSettings | null;
  duetLayout: DuetLayout | null;
}
