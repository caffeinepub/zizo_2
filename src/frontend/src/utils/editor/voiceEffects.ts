import type { VoiceEffect } from './types';

export async function applyVoiceEffect(
  audioBuffer: AudioBuffer,
  effect: VoiceEffect,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  if (effect === 'none') return audioBuffer;

  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  switch (effect) {
    case 'chipmunk':
      source.playbackRate.value = 1.5;
      break;
    case 'deep':
      source.playbackRate.value = 0.7;
      break;
    case 'robotic':
      const filter = offlineContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      source.connect(filter);
      filter.connect(offlineContext.destination);
      source.start(0);
      return offlineContext.startRendering();
  }

  source.connect(offlineContext.destination);
  source.start(0);
  return offlineContext.startRendering();
}
