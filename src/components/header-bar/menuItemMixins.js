/*
 * @description
 *   Please write the menuItemMixins script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-06-19)
 */
import isVueComponent from 'is-vue-component'
import { isBoolean, isString, isNumber, isPlainObject } from 'lodash'

export default {
  props: {
    /**
     * label: String,
     * icon: [Function, Object],
     * badge: [Boolean, String, Number, Object],
     * tip: [String, Function],
     * link: [String, Object],
     * click: Function,
     * children: Array
     */
    menu: Object
  },
  computed: {
    badgeProps () {
      if (this.menu.badge) {
        if (isBoolean(this.menu.badge)) {
          return { dot: true }
        } else if (isNumber(this.menu.badge)) {
          return { count: this.menu.badge, 'overflow-count': 99 }
        } else if (isString(this.menu.badge)) {
          return { text: this.menu.badge }
        } else if (isPlainObject(this.menu.badge)) return this.menu.badge
      }
      return null
    }
  },
  methods: {
    isComponent (component) {
      return isVueComponent(component)
    },
    getIconProps (icon) {
      if (this.isComponent(icon)) {
        return null
      } else {
        return icon
      }
    }
  }
}
