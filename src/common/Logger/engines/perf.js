/*
 * @description
 *   Please write the perf script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2017/6/28)
 */
import isFunction from 'lodash/isFunction'

export default (level, type) => {
  if (window && window.mta && isFunction(window.mta)) {
    window.mta('count', `${level.name}.${type}`)
  }
}
