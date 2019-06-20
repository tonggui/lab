/*
 * @description
 *   Please write the console script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2017/6/28)
 */
export default (level, type, msg) => {
  if (window && window.console && window.console[level.name]) {
    window.console[level.name](type, msg)
  }
}
