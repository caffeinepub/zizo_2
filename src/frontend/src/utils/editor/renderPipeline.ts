import type { EditorState } from './types';
import type { CreationMode } from '../../components/create/CreationFlow';
import { applyFilters, applyEffects } from './videoProcessing';
import { mixAudio } from './audioMixing';

export async function renderVideo(
  sourceMedia: File,
  editorState: EditorState,
  mode: CreationMode
): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.src = URL.createObjectURL(sourceMedia);
    video.onloadedmetadata = async () => {
      canvas.width = 1080;
      canvas.height = 1920;

      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        let videoBlob = new Blob(chunks, { type: 'video/webm' });

        if (editorState.music || editorState.voiceover) {
          try {
            videoBlob = await mixAudio(videoBlob, editorState);
          } catch (error) {
            console.error('Audio mixing error:', error);
          }
        }

        const file = new File([videoBlob], `edited-${Date.now()}.webm`, { type: 'video/webm' });
        URL.revokeObjectURL(video.src);
        resolve(file);
      };

      video.playbackRate = editorState.speed;
      video.currentTime = editorState.trim.start;
      
      mediaRecorder.start();
      video.play();

      const renderFrame = () => {
        if (video.currentTime >= editorState.trim.end || video.ended) {
          mediaRecorder.stop();
          video.pause();
          return;
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        applyFilters(ctx, canvas, editorState.filters);
        applyEffects(ctx, canvas, editorState.effects);

        editorState.captions.forEach(caption => {
          ctx.font = `bold ${caption.size}px Inter, sans-serif`;
          ctx.fillStyle = caption.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(
            caption.text,
            (caption.position.x / 100) * canvas.width,
            (caption.position.y / 100) * canvas.height
          );
          ctx.shadowBlur = 0;
        });

        editorState.stickers.forEach(sticker => {
          const img = new Image();
          img.src = sticker.url;
          const size = 64 * sticker.scale;
          ctx.drawImage(
            img,
            (sticker.position.x / 100) * canvas.width - size / 2,
            (sticker.position.y / 100) * canvas.height - size / 2,
            size,
            size
          );
        });

        requestAnimationFrame(renderFrame);
      };

      renderFrame();
    };

    video.onerror = () => reject(new Error('Video loading failed'));
  });
}
