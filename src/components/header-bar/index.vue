<script>
  import { isPlainObject, merge, defaultTo } from 'lodash'
  import HeaderBar from './components/header-bar'
  import { leftMenu, rightMenu } from './config'

  export default {
    name: 'header-bar-container',
    props: {
      moduleMap: {
        type: Object,
        required: true
      },
      disabled: Boolean
    },
    components: {
      HeaderBar
    },
    computed: {
      leftMenu () {
        return this.reorder(this.filterMenu(leftMenu, this.moduleMap))
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
          }
          if (show || children.length > 0) {
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
    render (h) {
      return h(HeaderBar, {
        on: this.$listeners,
        props: {
          left: this.leftMenu,
          right: this.rightMenu,
          disabled: this.disabled
        }
      })
    }
  }
</script>
