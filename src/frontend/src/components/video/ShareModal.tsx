import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  videoId: string;
  videoTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareModal({ videoId, videoTitle, open, onOpenChange }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/?video=${encodeURIComponent(videoId)}`;
  const isWebShareSupported = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleWebShare = async () => {
    if (!isWebShareSupported) {
      toast.error('Web Share not supported on this device');
      return;
    }

    try {
      await navigator.share({
        title: videoTitle,
        text: `Check out this video: ${videoTitle}`,
        url: shareUrl,
      });
      toast.success('Shared successfully!');
      onOpenChange(false);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Video</DialogTitle>
          <DialogDescription>
            {videoTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {isWebShareSupported && (
              <Button onClick={handleWebShare} className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
