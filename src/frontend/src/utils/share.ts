interface ShareResult {
  success: boolean;
  message: string;
}

interface SharePayload {
  title: string;
  text?: string;
  url: string;
}

export function getShareUrl(videoId: string): string {
  return `${window.location.origin}/?video=${encodeURIComponent(videoId)}`;
}

export async function shareVideo(videoId: string, videoTitle: string): Promise<ShareResult> {
  const shareUrl = getShareUrl(videoId);
  const sharePayload: SharePayload = {
    title: videoTitle,
    text: `Check out this video: ${videoTitle}`,
    url: shareUrl,
  };

  // Check if Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share(sharePayload);
      return {
        success: true,
        message: 'Shared successfully!',
      };
    } catch (error: any) {
      // User cancelled the share or an error occurred
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Share cancelled',
        };
      }
      // Fall through to clipboard fallback
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shareUrl);
    return {
      success: true,
      message: 'Link copied to clipboard!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to share video',
    };
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}
