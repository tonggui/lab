/*
 * @description
 *   Please write the jumpTo script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import { parse } from 'qs'
import isString from 'lodash/isString'
import startsWith from 'lodash/startsWith'
import { jumpTo } from '@sgfe/eproduct/navigator'
import { isPageName } from '@sgfe/eproduct/navigator/pages/page'
import router from '@/router'

export default (page, ctx = {}, options = {}) => {
  const params = ctx.params || {}
  const query = parse(location.search, { ignoreQueryPrefix: true })
  // 如果入参中没有设置poiId/wmPoiId，且当前URL中包含wmPoiId，默认将当前的wmPoiId带着传递
  // !!引入的副作用  如果需要跳转入不需要wmPoiId参数的场景，需要在参数中明确传入poiId=''/undefined
  if (!(['poiId', 'wmPoiId'].some(key => key in params)) && query.wmPoiId) {
    params.wmPoiId = query.wmPoiId
  }
  // 兼容处理，如果字符串形式的路径与baseUrl一致，表明需要利用内置Router进行跳转
  if (isString(page) && !isPageName(page)) {
    const baseUrl = router.options.base || '/'
    if (startsWith(page, baseUrl)) {
      options.history = router
    }
  }
  return jumpTo(
    page,
    {
      history: router,
      ...ctx,
      params
    },
    {
      spaType: 'vue',
      ...options
    }
  )
}
