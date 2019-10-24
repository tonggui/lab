export const VIDEO_STATUS = {
  ERROR: -1, // 视频上传失败
  SUCCESS: 1, // 正常视频（转码成功）
  TRANSCODING: 2, // 正在转码
  TRANSCODE_ERROR: 0, // 转码失败
  FROZEN: 3, // 审核失败
  UPLOADING: 'uploading' // 上传中
}

export const MAX_RELATED_COUNT = 3 // 每个视频最多关联商品数