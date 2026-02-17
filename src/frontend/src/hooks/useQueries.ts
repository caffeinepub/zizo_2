import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Video, UserProfile, Comment, ReactionCount } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrending() {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['trending'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrending();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLikeVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeVideo(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['trending'] });
    },
  });
}

export function useVideoUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, file }: { title: string; file: File }) => {
      if (!actor) throw new Error('Actor not available');

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      return actor.uploadVideo(title, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['trending'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Comments hooks
export function useGetComments(videoId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['comments', videoId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(videoId);
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, content }: { videoId: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComment(videoId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.videoId] });
    },
  });
}

// Reactions hooks
export function useGetReactionCounts(videoId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ReactionCount[]>({
    queryKey: ['reactions', videoId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReactionCounts(videoId);
    },
    enabled: !!actor && !isFetching && !!videoId,
  });
}

export function useAddReaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, reactionType }: { videoId: string; reactionType: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReaction(videoId, reactionType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reactions', variables.videoId] });
    },
  });
}

// Follow hooks
export function useIsFollowing(follower: Principal | null, followee: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isFollowing', follower?.toString(), followee?.toString()],
    queryFn: async () => {
      if (!actor || !follower || !followee) return false;
      return actor.isFollowing(follower, followee);
    },
    enabled: !!actor && !isFetching && !!follower && !!followee,
  });
}

export function useToggleFollow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (target: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleFollow(target);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isFollowing'] });
      queryClient.invalidateQueries({ queryKey: ['followerCounts'] });
    },
  });
}

export function useGetFollowerCounts(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['followerCounts', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return { followers: 0n, following: 0n };
      return actor.getFollowerCounts(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}
