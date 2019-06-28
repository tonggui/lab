/*
 * @description
 *   Please write the jumpTo script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import { jumpTo } from '@sgfe/eproduct/navigator'
import router from '@/router'

export default (page, ctx = {}, options = {}) => {
  return jumpTo(
    page,
    {
      history: router,
      ...ctx
    },
    {
      spaType: 'vue',
      ...options
    }
  )
}
