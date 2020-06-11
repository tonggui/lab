/*
 * @description
 *   Please write the index.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2020/5/27)
 */
const PARAM_NAME_CALLBACK = 'callback'
// const PARAM_NAME_CALLBACK_CODE = '_code'

export const RESULT_CODE = {
  SUCCESS: 1,
  ERROR: 2,
  CANCEL: 0
}

export default class PageJumper {
  constructor (options = {}) {
    this._jumpTo = options.jumpTo
  }

  jumpTo (url) {
    if (this._jumpTo) {
      this._jumpTo(url)
    } else {
      location.href = url
    }
  }

  parse (params = {}, resultCode = RESULT_CODE.CANCEL) {
    let targetUrl = params[PARAM_NAME_CALLBACK]
    if (targetUrl) {
      const urlString = decodeURIComponent(targetUrl)
      // TODO 如何添加合理的添加参数到路径中。主要需要解决参数的追加位置（Hash/Query，如何区分目标模式）
      // const url = new URL(urlString)
      // url.searchParams.append(PARAM_NAME_CALLBACK_CODE, resultCode)
      // return url.toString()
      return urlString
    }
  }
}
