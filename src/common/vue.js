/*
 * @description
 *   Please write the vue script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-04)
 */
export function findParentByName (componentName) {
  let parent = this.$parent || this.$root
  while (parent && parent.$options.name !== componentName) {
    parent = parent.$parent
  }
  return parent
}
