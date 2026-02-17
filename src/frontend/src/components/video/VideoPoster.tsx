interface VideoPosterProps {
  title?: string;
}

export default function VideoPoster({ title }: VideoPosterProps) {
  return (
    <div className="relative h-full w-full">
      <img
        src="/assets/generated/video-placeholder.dim_1280x720.png"
        alt={title || 'Video'}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-background/20">
        <div className="text-center">
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    </div>
  );
}
