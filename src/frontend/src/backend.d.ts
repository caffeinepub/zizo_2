import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    url: ExternalBlob;
    title: string;
    likes: bigint;
    uploader: Principal;
}
export interface ReactionCount {
    count: bigint;
    reactionType: string;
}
export interface Comment {
    content: string;
    author: Principal;
    timestamp: bigint;
}
export interface FollowerCounts {
    followers: bigint;
    following: bigint;
}
export interface UserProfile {
    name: string;
}
export enum PostType {
    video = "video",
    text = "text",
    image = "image"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(videoId: string, content: string): Promise<void>;
    addReaction(videoId: string, reactionType: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    doubleTapToLike(postId: string): Promise<void>;
    getAllPosts(): Promise<Array<[string, PostType]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(videoId: string): Promise<Array<Comment>>;
    getFollowerCounts(user: Principal): Promise<FollowerCounts>;
    getLikes(postId: string): Promise<bigint>;
    getPostType(postId: string): Promise<PostType | null>;
    getReactionCounts(videoId: string): Promise<Array<ReactionCount>>;
    getTrending(): Promise<Array<Video>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideo(videoId: string): Promise<Video>;
    getVideos(): Promise<Array<Video>>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(follower: Principal, followee: Principal): Promise<boolean>;
    likeVideo(videoId: string): Promise<void>;
    registerPost(postId: string, postType: PostType): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleFollow(target: Principal): Promise<void>;
    uploadVideo(title: string, file: ExternalBlob): Promise<void>;
}
