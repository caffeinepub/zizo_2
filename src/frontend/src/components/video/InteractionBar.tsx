import { useState } from 'react';
import { Heart, MessageCircle, Share2, Zap, UserPlus, UserCheck, Users } from 'lucide-react';
import type { Video } from '../../backend';
import { useLikeVideo, useGetComments, useAddReaction, useGetReactionCounts, useIsFollowing, useToggleFollow } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { triggerHaptic } from '../../utils/haptics';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import CommentsModal from './CommentsModal';
import ShareModal from './ShareModal';

interface InteractionBarProps {
  video: Video;
}

export default function InteractionBar({ video }: InteractionBarProps) {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const likeMutation = useLikeVideo();
  const addReactionMutation = useAddReaction();
  const toggleFollowMutation = useToggleFollow();
  const { data: comments } = useGetComments(video.id);
  const { data: reactionCounts } = useGetReactionCounts(video.id);
  const { data: isFollowing } = useIsFollowing(
    identity?.getPrincipal() || null,
    video.uploader
  );
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const isAuthenticated = !!identity;
  const commentCount = comments?.length || 0;
  const totalReactions = reactionCounts?.reduce((sum, r) => sum + Number(r.count), 0) || 0;
  const isOwnVideo = isAuthenticated && identity.getPrincipal().toString() === video.uploader.toString();

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Login to like videos');
      return;
    }
    triggerHaptic();
    likeMutation.mutate(video.id);
  };

  const handleComment = () => {
    if (!isAuthenticated) {
      toast.error('Login to comment');
      return;
    }
    setCommentsOpen(true);
  };

  const handleReact = () => {
    if (!isAuthenticated) {
      toast.error('Login to react');
      return;
    }
    triggerHaptic();
    addReactionMutation.mutate(
      { videoId: video.id, reactionType: '⚡' },
      {
        onSuccess: () => {
          toast.success('Reacted!');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to react');
        },
      }
    );
  };

  const handleFollow = () => {
    if (!isAuthenticated) {
      toast.error('Login to follow users');
      return;
    }
    triggerHaptic();
    toggleFollowMutation.mutate(video.uploader, {
      onSuccess: () => {
        toast.success(isFollowing ? 'Unfollowed' : 'Following!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to follow');
      },
    });
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const handleDuet = () => {
    if (!isAuthenticated) {
      toast.error('Login to create duets');
      return;
    }
    navigate({ to: '/create', search: { duet: video.id } });
  };

  return (
    <>
      <div className="absolute right-2 bottom-20 flex flex-col gap-4 z-10">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90"
        >
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/30">
            <Heart className={`h-6 w-6 ${Number(video.likes) > 0 ? 'fill-red-500 text-red-500' : ''}`} />
          </div>
          <span className="text-xs font-semibold drop-shadow-lg">{Number(video.likes)}</span>
        </button>

        <button
          onClick={handleComment}
          className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90"
        >
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/30">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold drop-shadow-lg">{commentCount}</span>
        </button>

        <button
          onClick={handleReact}
          className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90"
        >
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/30">
            <Zap className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold drop-shadow-lg">{totalReactions}</span>
        </button>

        {!isOwnVideo && (
          <button
            onClick={handleFollow}
            className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90"
          >
            <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/30">
              {isFollowing ? <UserCheck className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            </div>
          </button>
        )}

        <button
          onClick={handleDuet}
          className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90"
        >
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/30">
            <Users className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold drop-shadow-lg">Duet</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 text-white transition-transform active:scale-90"
        >
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm hover:bg-white/30">
            <Share2 className="h-6 w-6" />
          </div>
        </button>
      </div>

      <CommentsModal
        videoId={video.id}
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
      />

      <ShareModal
        videoId={video.id}
        videoTitle={video.title}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  );
}
