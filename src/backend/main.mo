import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  public type Video = {
    id : Text;
    title : Text;
    url : Storage.ExternalBlob;
    uploader : Principal;
    likes : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  public type Comment = {
    author : Principal;
    content : Text;
    timestamp : Int;
  };

  public type Reaction = {
    user : Principal;
    reactionType : Text;
  };

  public type ReactionCount = {
    reactionType : Text;
    count : Nat;
  };

  public type UserProfileWithPicture = {
    name : Text;
    profilePicture : ?Storage.ExternalBlob;
  };

  public type FollowerCounts = {
    followers : Nat;
    following : Nat;
  };

  let videos = Map.empty<Text, Video>();
  let likes = Map.empty<Text, [Principal]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let comments = Map.empty<Text, [Comment]>();
  let reactions = Map.empty<Text, [Reaction]>();

  // Following relationships
  let following = Map.empty<Principal, Set.Set<Principal>>();

  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinStorage();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // User profiles are publicly viewable in a social media context
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Video Management
  public query ({ caller }) func getVideos() : async [Video] {
    videos.values().toArray();
  };

  public query ({ caller }) func getVideo(videoId : Text) : async Video {
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video };
    };
  };

  public shared ({ caller }) func likeVideo(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like videos");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) {
        let currentLikes = switch (likes.get(videoId)) {
          case (null) { [] };
          case (?likeList) { likeList };
        };

        let hasLiked = currentLikes.find(func(p) { Principal.equal(p, caller) });
        let updatedLikes = switch (hasLiked) {
          case (null) { currentLikes.concat([caller]) };
          case (?_) {
            currentLikes.filter(func(p) { not Principal.equal(p, caller) });
          };
        };

        likes.add(videoId, updatedLikes);
        let updatedVideo = {
          id = video.id;
          title = video.title;
          url = video.url;
          uploader = video.uploader;
          likes = updatedLikes.size();
        };
        videos.add(videoId, updatedVideo);
      };
    };
  };

  public shared ({ caller }) func uploadVideo(title : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };

    let videoId = title.concat(caller.toText());
    let video : Video = {
      id = videoId;
      title;
      url = file;
      uploader = caller;
      likes = 0;
    };
    videos.add(videoId, video);
  };

  public query ({ caller }) func getTrending() : async [Video] {
    let allVideos = videos.values().toArray();
    allVideos.sort(
      func(a, b) { Nat.compare(b.likes, a.likes) }
    );
  };

  // Comments System
  public query ({ caller }) func getComments(videoId : Text) : async [Comment] {
    switch (comments.get(videoId)) {
      case (null) { [] };
      case (?commentList) { commentList };
    };
  };

  public shared ({ caller }) func addComment(videoId : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can comment");
    };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?_) {
        let newComment : Comment = {
          author = caller;
          content;
          timestamp = 0; // Timestamp can be replaced with real time source if available
        };
        let currentComments = switch (comments.get(videoId)) {
          case (null) { [] };
          case (?existing) { existing };
        };
        let updatedComments = currentComments.concat([newComment]);
        comments.add(videoId, updatedComments);
      };
    };
  };

  // Reactions System
  public shared ({ caller }) func addReaction(videoId : Text, reactionType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can react");
    };
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?_) {
        let reactionsList = switch (reactions.get(videoId)) {
          case (null) { [] };
          case (?existing) { existing };
        };
        let newReaction : Reaction = {
          user = caller;
          reactionType;
        };
        let filteredReactions = reactionsList.filter(
          func(r) { not Principal.equal(r.user, caller) }
        );
        let updatedReactions = filteredReactions.concat([newReaction]);
        reactions.add(videoId, updatedReactions);
      };
    };
  };

  public query ({ caller }) func getReactionCounts(videoId : Text) : async [ReactionCount] {
    switch (reactions.get(videoId)) {
      case (null) { [] };
      case (?reactionsList) {
        let countsMap = Map.empty<Text, Nat>();

        for (reaction in reactionsList.values()) {
          let currentCount = switch (countsMap.get(reaction.reactionType)) {
            case (null) { 0 };
            case (?count) { count };
          };
          countsMap.add(reaction.reactionType, currentCount + 1);
        };
        countsMap.entries().map<(Text, Nat), ReactionCount>(
          func((reactionType, count)) {
            { reactionType; count };
          }
        ).toArray();
      };
    };
  };

  // Social Following System

  public shared ({ caller }) func toggleFollow(target : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only logged-in users can follow/unfollow");
    };

    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot follow yourself");
    };

    let currentFollowing = switch (following.get(caller)) {
      case (null) {
        let newFollowing = Set.empty<Principal>();
        newFollowing.add(target);
        newFollowing;
      };
      case (?followingSet) {
        if (followingSet.contains(target)) {
          followingSet.remove(target);
        } else {
          followingSet.add(target);
        };
        followingSet;
      };
    };
    following.add(caller, currentFollowing);
  };

  public query ({ caller }) func isFollowing(follower : Principal, followee : Principal) : async Bool {
    switch (following.get(follower)) {
      case (null) { false };
      case (?followingSet) {
        followingSet.contains(followee);
      };
    };
  };

  public query ({ caller }) func getFollowerCounts(user : Principal) : async FollowerCounts {
    // Count followers
    var followers = 0;
    for ((_, followingSet) in following.entries()) {
      if (followingSet.contains(user)) {
        followers += 1;
      };
    };

    // Count following
    let followingCount = switch (following.get(user)) {
      case (null) { 0 };
      case (?followingSet) { followingSet.size() };
    };

    {
      followers;
      following = followingCount;
    };
  };
};
