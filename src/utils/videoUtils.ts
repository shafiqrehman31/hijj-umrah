export interface ParsedVideoSource {
  kind: 'youtube' | 'vimeo' | 'gdrive' | 'direct' | 'none';
  embedUrl?: string;
  directUrl?: string;
  youtubeId?: string;
  suggestedThumbnail?: string;
}

/**
 * Parses YouTube, Shorts, Vimeo, Google Drive, MP4/WebM URLs, or uploaded video data URLs
 * into an embeddable player configuration.
 */
export function parseVideoSource(rawUrl?: string): ParsedVideoSource {
  if (!rawUrl || !rawUrl.trim()) {
    return { kind: 'none' };
  }
  const url = rawUrl.trim();

  // Data URL or direct video file
  if (
    url.startsWith('data:video/') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
  ) {
    return { kind: 'direct', directUrl: url };
  }

  // YouTube (standard watch, youtu.be, shorts, embed)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      kind: 'youtube',
      youtubeId: id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      suggestedThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      kind: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Google Drive share link -> preview embed
  const gdriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      kind: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
    };
  }

  // Fallback: treat other http/https URLs as direct HTML5 video source
  return { kind: 'direct', directUrl: url };
}
