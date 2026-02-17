import type { EditorState } from './types';
import { applyVoiceEffect } from './voiceEffects';

export async function mixAudio(videoBlob: Blob, editorState: EditorState): Promise<Blob> {
  const audioContext = new AudioContext();
  
  try {
    const videoArrayBuffer = await videoBlob.arrayBuffer();
    const videoSource = await audioContext.decodeAudioData(videoArrayBuffer);
    
    const duration = videoSource.duration;
    const offlineContext = new OfflineAudioContext(2, duration * audioContext.sampleRate, audioContext.sampleRate);
    
    const originalGain = offlineContext.createGain();
    originalGain.gain.value = editorState.music?.originalVolume ?? 1;
    
    const videoSourceNode = offlineContext.createBufferSource();
    videoSourceNode.buffer = videoSource;
    videoSourceNode.connect(originalGain);
    originalGain.connect(offlineContext.destination);
    videoSourceNode.start(0);
    
    if (editorState.music) {
      const musicResponse = await fetch(editorState.music.url);
      const musicArrayBuffer = await musicResponse.arrayBuffer();
      const musicSource = await audioContext.decodeAudioData(musicArrayBuffer);
      
      const musicGain = offlineContext.createGain();
      musicGain.gain.value = editorState.music.musicVolume;
      
      const musicSourceNode = offlineContext.createBufferSource();
      musicSourceNode.buffer = musicSource;
      musicSourceNode.connect(musicGain);
      musicGain.connect(offlineContext.destination);
      musicSourceNode.start(editorState.music.startOffset);
    }
    
    if (editorState.voiceover) {
      const voiceoverResponse = await fetch(editorState.voiceover.url);
      const voiceoverArrayBuffer = await voiceoverResponse.arrayBuffer();
      let voiceoverSource = await audioContext.decodeAudioData(voiceoverArrayBuffer);
      
      if (editorState.voiceover.effect !== 'none') {
        voiceoverSource = await applyVoiceEffect(voiceoverSource, editorState.voiceover.effect, audioContext);
      }
      
      const voiceoverGain = offlineContext.createGain();
      voiceoverGain.gain.value = 0.8;
      
      const voiceoverSourceNode = offlineContext.createBufferSource();
      voiceoverSourceNode.buffer = voiceoverSource;
      voiceoverSourceNode.connect(voiceoverGain);
      voiceoverGain.connect(offlineContext.destination);
      voiceoverSourceNode.start(0);
    }
    
    const renderedBuffer = await offlineContext.startRendering();
    
    return videoBlob;
  } catch (error) {
    console.error('Audio mixing error:', error);
    return videoBlob;
  } finally {
    audioContext.close();
  }
}
