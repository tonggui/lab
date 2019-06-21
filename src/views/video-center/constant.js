export const VIDEO_STATUS = {
  ERROR: -1, // 视频上传失败
  SUCCESS: 1, // 正常视频（转码成功）
  TRANSCODING: 2, // 正在转码
  TRANSCODE_ERROR: 0, // 转码失败
  FROZEN: 3, // 审核失败
  UPLOADING: 10 // 上传中
}

export const MAX_RELATED_COUNT = 3
