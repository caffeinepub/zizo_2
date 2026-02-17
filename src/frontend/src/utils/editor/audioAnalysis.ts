export async function analyzeAudio(audioUrl: string): Promise<number[]> {
  const audioContext = new AudioContext();
  
  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const windowSize = Math.floor(audioContext.sampleRate * 0.1);
    const volumes: number[] = [];
    
    for (let i = 0; i < channelData.length; i += windowSize) {
      let sum = 0;
      const end = Math.min(i + windowSize, channelData.length);
      for (let j = i; j < end; j++) {
        sum += Math.abs(channelData[j]);
      }
      volumes.push(sum / (end - i));
    }
    
    return volumes;
  } finally {
    audioContext.close();
  }
}
