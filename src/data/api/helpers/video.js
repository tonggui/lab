/* eslint-disable camelcase */
/*
 * 转换视频数据格式-转入
 */
export const convertProductVideoFromServer = (video = {}) => {
  const { url_ogg = '', main_pic_small_url = '', ...rest } = video || {}
  return {
    src: url_ogg,
    poster: main_pic_small_url,
    ...rest
  }
}

/*
 * 转换视频数据格式-转出
 */
export const convertProductVideoToServer = (video = {}) => {
  const { src, poster, ...rest } = video
  return {
    url_ogg: src,
    main_pic_small_url: poster,
    ...rest
  }
}
