// Video management filter
import { Video } from "../../domain/types/management/videomanagement";

export function filterVideos(videos: Video[], filters: { status: string; category: string }, searchQuery: string): Video[] {
  return videos
    .filter(video =>
      filters.category ? video.diploma?.category === filters.category : true
    )
    .filter(video =>
      filters.status && filters.status !== 'All Status' && filters.status !== 'all'
        ? video.status === filters.status
        : true
    )
    .filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
} 