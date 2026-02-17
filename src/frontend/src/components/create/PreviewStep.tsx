import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useVideoUpload } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface PreviewStepProps {
  output: File;
  onBack: () => void;
  onPublish: () => void;
}

export default function PreviewStep({ output, onBack, onPublish }: PreviewStepProps) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const uploadMutation = useVideoUpload();

  useEffect(() => {
    const url = URL.createObjectURL(output);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [output]);

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Please provide a title');
      return;
    }

    try {
      await uploadMutation.mutateAsync({ title: title.trim(), file: output });
      toast.success('Published to feed!');
      onPublish();
    } catch (error) {
      toast.error('Failed to publish');
      console.error('Publish error:', error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="p-4 border-b flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} disabled={uploadMutation.isPending}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Preview & Publish</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="aspect-[9/16] max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={previewUrl}
            controls
            className="w-full h-full object-contain"
          />
        </div>

        <div className="max-w-sm mx-auto space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption (optional)"
              rows={3}
            />
          </div>

          <Button
            onClick={handlePublish}
            disabled={uploadMutation.isPending || !title.trim()}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              'Publish to Feed'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
