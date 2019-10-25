import { fetchVideoList } from '../api/videoApi'
import { VIDEO_STATUS } from '../constants/video'
export { fetchVideoList, deleteVideo, saveVideo, relVideo, fetchVideoStatus } from '../api/videoApi'

export const fetchValidVideoList = (options = {}) => fetchVideoList({
  ...options,
  status: `${VIDEO_STATUS.SUCCESS},${VIDEO_STATUS.FROZEN}`
})
