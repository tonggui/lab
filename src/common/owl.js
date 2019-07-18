/*
 * @description
 *   Please write the owl script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-06-25)
 */
import Owl from '@sgfe/owl'
import { getCookie } from '@utiljs/cookie'

window._OWL_ = {
  onErrorPush: instance => instance.updateTags({
    userId: getCookie('acctId'),
    wmempid: getCookie('wmempid')
  })
}

export default Owl
