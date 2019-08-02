/*
 * @description
 *   Please write the jumpTo script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import { parse } from 'qs'
import { jumpTo } from '@sgfe/eproduct/navigator'
import router from '@/router'

export default (page, ctx = {}, options = {}) => {
  const params = ctx.params || {}
  const query = parse(location.search, { ignoreQueryPrefix: true })
  // 如果入参中没有设置poiId/wmPoiId，且当前URL中包含wmPoiId，默认将当前的wmPoiId带着传递
  // !!引入的副作用  如果需要跳转入不需要wmPoiId参数的场景，需要在参数中明确传入poiId=''/undefined
  if (!(['poiId', 'wmPoiId'].some(key => key in params)) && query.wmPoiId) {
    params.wmPoiId = query.wmPoiId
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
