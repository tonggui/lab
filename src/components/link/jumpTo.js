/*
 * @description
 *   Please write the jumpTo script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import { parse, stringify } from 'qs'
import isString from 'lodash/isString'
import startsWith from 'lodash/startsWith'
import { jumpTo } from '@sgfe/eproduct/navigator'
import { isPageName } from '@sgfe/eproduct/navigator/pages/page'
import createHistory from '@sgfe/eproduct/navigator/history'
import router from '@/router'

const history = createHistory(router, router.options.base)

export default (page, ctx = {}, options = {}) => {
  const params = ctx.params || {}
  const query = parse(location.search, { ignoreQueryPrefix: true })
  // 如果入参中没有设置poiId/wmPoiId，且当前URL中包含wmPoiId，默认将当前的wmPoiId带着传递
  // !!引入的副作用  如果需要跳转入不需要wmPoiId参数的场景，需要在参数中明确传入poiId=''/undefined
  if (!(['poiId', 'wmPoiId'].some(key => key in params)) && query.wmPoiId) {
    params.wmPoiId = query.wmPoiId
  }
  if (query.wmPoiId) {
    params.from = 'single'
  }
  if (query.routerTagId) {
    params.routerTagId = query.routerTagId
  }
  // 解决传入参数可能存在多wmPoiId的场景，导致内部数据异常
  // 使用query中最后一个wmPoiId为真实使用的poiId
  // 阻断问题的继续传播！！
  if (params.wmPoiId && Array.isArray(params.wmPoiId)) {
    params.wmPoiId = params.wmPoiId.pop()
  }
  // 兼容处理，如果字符串形式的路径与baseUrl一致，表明需要利用内置Router进行跳转
  if (isString(page) && !isPageName(page)) {
    const baseUrl = router.options.base || '/'
    if (params) {
      if (!page.includes('?')) {
        page = `${page}?${stringify(params)}`
      } else {
        page = `${page}&${stringify(params)}`
      }
    }
    if (startsWith(page, baseUrl)) {
      const { matched } = router.match(page.replace(baseUrl, ''))
      if (matched && matched.length > 0) {
        options.history = history
      }
    }
  }
  return jumpTo(
    page,
    {
      history,
      ...ctx,
      params
    },
    {
      spaType: 'vue',
      ...options
    }
  )
}
