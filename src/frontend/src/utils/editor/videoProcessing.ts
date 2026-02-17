import type { Filter, Effect } from './types';

export function applyFilters(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  filters: Filter[]
): void {
  if (filters.length === 0 || filters.includes('none')) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  filters.forEach(filter => {
    switch (filter) {
      case 'bw':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
      case 'contrast':
        const factor = 1.5;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        }
        break;
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.1);
          data[i + 1] = Math.min(255, data[i + 1] * 0.95);
          data[i + 2] = Math.min(255, data[i + 2] * 0.85);
        }
        break;
      case 'cool':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 0.9);
          data[i + 1] = Math.min(255, data[i + 1] * 1.0);
          data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
        break;
    }
  });

  ctx.putImageData(imageData, 0, 0);
}

export function applyEffects(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  effects: Effect[]
): void {
  if (effects.length === 0 || effects.includes('none')) return;

  effects.forEach(effect => {
    switch (effect) {
      case 'blur':
        ctx.filter = 'blur(4px)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        break;
      case 'vignette':
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 1.5
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
      case 'glitch':
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() > 0.98) {
            data[i] = Math.random() * 255;
            data[i + 1] = Math.random() * 255;
            data[i + 2] = Math.random() * 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        break;
      case 'pixelate':
        const size = 10;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, canvas.width / size, canvas.height / size);
        ctx.drawImage(canvas, 0, 0, canvas.width / size, canvas.height / size, 0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        break;
      case 'sharpen':
        ctx.filter = 'contrast(1.2) brightness(1.05)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        break;
    }
  });
}
