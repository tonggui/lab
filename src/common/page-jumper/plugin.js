/*
 * @description
 *   Please write the vue.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2020/5/27)
 */
import { parse } from 'qs'
import { isString, isFunction } from 'lodash'
import PageJumper, { RESULT_CODE } from './index'

const goBack = () => window.history.go(-1)

export default {
  install: (Vue, options) => {
    const jumper = new PageJumper(options)

    Vue.prototype.$setPageResult = function (resultCode) {
      this.$pageResult = resultCode
    }
    Vue.prototype.$tryToNext = function (defaultTarget = goBack) {
      const resultCode = this.$pageResult === undefined ? RESULT_CODE.CANCEL : this.$pageResult
      let url = jumper.parse(
        (this.$route && this.$route.query) || parse(location.search, { ignoreQueryPrefix: true }),
        resultCode
      )
      if (!url && isString(defaultTarget)) {
        url = defaultTarget
      }

      if (url) {
        jumper.jumpTo(url)
        return true
      }

      if (isFunction(defaultTarget)) {
        const targetUrl = defaultTarget(resultCode)
        if (targetUrl && isString(targetUrl)) {
          jumper.jumpTo(targetUrl)
        }
        return true
      }

      return false
    }
  }
}
