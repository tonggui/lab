<script>
  import { isPlainObject, merge, defaultTo, cloneDeep } from 'lodash'
  import HeaderBar from './components/header-bar'
  import { leftMenu, rightMenu } from './config'
  import { poiId } from '@/common/constants'
  import { inBatchInsertNewGrey } from '@/data/api/batch'
  export default {
    name: 'header-bar-container',
    props: {
      moduleMap: {
        type: Object,
        required: true
      },
      disabled: Boolean,
      needPermission: Boolean
    },
    data () {
      return {
        leftMenuExtInfo: {} // 左侧菜单动态信息
      }
    },
    components: {
      HeaderBar
    },
    computed: {
      leftModuleMapWithExtInfo () { //
        const _leftMenuExtInfo = (this.leftMenuExtInfo || {})
        return Object.entries(this.moduleMap).reduce((dist, [key, value]) => {
          if (!_leftMenuExtInfo[key]) return { ...dist, [key]: value }
          if (isPlainObject(value)) return { ...dist, [key]: { ...value, ..._leftMenuExtInfo[key] } }
          return { ...dist, [key]: { ..._leftMenuExtInfo[key], show: value } }
        }, {})
      },
      leftMenu () {
        return this.reorder(this.filterMenu(cloneDeep(leftMenu), this.leftModuleMapWithExtInfo))
      },
      rightMenu () {
        return this.reorder(this.filterMenu(rightMenu, this.moduleMap))
      }
    },
    methods: {
      filterMenu (list, moduleMap) {
        const result = []
        list.forEach(item => {
          const { key } = item
          let { children = [] } = item
          const moduleItem = moduleMap[key] || false
          let show = moduleItem
          if (isPlainObject(moduleItem)) {
            item = merge({}, item, moduleItem)
            show = item.show || false
          }
          if (children && children.length > 0) {
            children = this.filterMenu(children, moduleMap)
            item.children = children
            // 默认显示，配置为不显示则关闭；子菜单中无显示项需要关闭父级菜单
            show = children.length > 0 && (key in moduleMap ? show : true)
          }
          if (show) {
            result.push(item)
          }
        })
        return result
      },
      reorder (menuList) {
        return menuList
          .sort((l, r) => defaultTo(l.order, 1) - defaultTo(r.order, 1))
          .map(menu => {
            if (menu.children && menu.children.length) {
              return merge({}, menu, {
                children: this.reorder(menu.children)
              })
            }
            return menu
          })
      }
    },
    mounted () {
      inBatchInsertNewGrey(poiId).then(data => {
        if (data.inGrey) {
          this.leftMenuExtInfo = { batchCreate: { link: '/reuse/sc/product/views/seller/center/new/create' } }
        }
      })
    },
    render (h) {
      return h(HeaderBar, {
        on: this.$listeners,
        props: {
          left: this.leftMenu,
          right: this.rightMenu,
          disabled: this.disabled,
          needPermission: this.needPermission
        }
      })
    }
  }
</script>
