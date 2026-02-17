import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadFallbackProps {
  onUpload: (file: File, url: string) => void;
}

export default function UploadFallback({ onUpload }: UploadFallbackProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      onUpload(file, url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleInputChange}
        className="hidden"
      />
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <Upload className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="font-semibold">Upload a video file</p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop or click to browse
          </p>
        </div>
        <Button onClick={() => inputRef.current?.click()} variant="outline">
          Choose File
        </Button>
      </div>
    </div>
  );
}
