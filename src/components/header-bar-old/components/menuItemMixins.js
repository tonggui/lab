/*
 * @description
 *   Please write the menuItemMixins script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-06-19)
 */
import isVueComponent from 'is-vue-component'
import { isBoolean, isString, isNumber, isPlainObject, noop } from 'lodash'
import lx from '@/common/lx/lxReport'

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
    menu: Object,
    disabled: Boolean
  },
  computed: {
    isDisabled () {
      return this.disabled || this.menu.disabled
    },
    icon () {
      if (this.menu.active) {
        return this.menu.activeIcon
      }
      return this.menu.icon
    },
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
    },
    component () {
      const { tooltip } = this.menu
      if (tooltip) {
        return 'Tooltip'
      }
      return 'span'
    },
    tooltip () {
      const { tooltip } = this.menu
      return tooltip || {}
    }
  },
  methods: {
    handleClick (e, bid) {
      lx.mc({ bid })
      this.$emit('click', this.menu)
    },
    isComponent (component) {
      return isVueComponent(component)
    },
    getIconProps (icon) {
      if (this.isComponent(icon)) {
        return null
      } else {
        return icon
      }
    },
    createCompatibleClickEventListener (eventListener) {
      return eventListener || noop
    }
  }
}
