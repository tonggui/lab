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
        firstStatus: true,
        isNewBatchCreate: false,
        leftMenuExtInfo: {} // 左侧菜单动态信息
      }
    },
    components: {
      HeaderBar
    },
    computed: {
      leftMenu () {
        return this.reorder(this.filterMenu(cloneDeep(leftMenu), this.moduleMap))
      },
      rightMenu () {
        return this.reorder(this.filterMenu(rightMenu, this.moduleMap))
      }
    },
    methods: {
      getLeftMenuWithExtInfo () { // 动态拼接附加信息
        if (!Object.keys(this.leftMenuExtInfo).length) return this.leftMenu
        return this.leftMenu.map(item => {
          const extInfo = this.leftMenuExtInfo[(item || {}).key]
          if (!extInfo) return item
          return { ...item, ...extInfo }
        })
      },
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
            if (item.key === 'batchCreate') {
              item.link = !window.isNewBatchCreate ? {
                path: '/batchManagement/batchCreate'
              } : '/reuse/sc/product/views/seller/center/new/create'
            }
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
        this.$nextTick(() => {
          this.firstStatus = false
        })
      })
    },
    render (h) {
      const _leftMenu = this.getLeftMenuWithExtInfo()
      return this.firstStatus ? null : h(HeaderBar, {
        on: this.$listeners,
        props: {
          left: _leftMenu,
          right: this.rightMenu,
          disabled: this.disabled,
          needPermission: this.needPermission
        }
      })
    }
  }
</script>
