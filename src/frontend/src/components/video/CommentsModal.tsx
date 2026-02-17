import { useState } from 'react';
import { useGetComments, useAddComment, useGetCallerUserProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CommentsModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommentsModal({ videoId, open, onOpenChange }: CommentsModalProps) {
  const { identity } = useInternetIdentity();
  const { data: comments, isLoading } = useGetComments(videoId);
  const { data: userProfile } = useGetCallerUserProfile();
  const addCommentMutation = useAddComment();
  const [commentText, setCommentText] = useState('');

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        videoId,
        content: commentText.trim(),
      });
      setCommentText('');
      toast.success('Comment posted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to post comment');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
          </DialogTitle>
          <DialogDescription>
            {comments?.length || 0} {comments?.length === 1 ? 'comment' : 'comments'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !comments || comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {comment.author.toString().slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        @{comment.author.toString().slice(0, 8)}
                      </p>
                      <p className="text-sm mt-1 break-words">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[80px] resize-none"
              disabled={addCommentMutation.isPending}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={addCommentMutation.isPending || !commentText.trim()}
                className="gap-2"
              >
                {addCommentMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Please log in to post a comment
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
