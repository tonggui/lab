<script>
  import Guide from './tooltip-guide'
  import Help from './tooltip-help'
  import { Tooltip } from '@roo-design/roo-vue'
  import { forwardComponent } from '@/common/vnode'

  export default {
    name: 'tooltip-container',
    props: {
      type: {
        type: String,
        validator (type) {
          return ['default', 'guide', 'help'].includes(type)
        },
        default: 'default'
      }
    },
    computed: {
      component () {
        if (this.type === 'guide') {
          return Guide
        } else if (this.type === 'help') {
          return Help
        }
        return Tooltip
      }
    },
    render (createElement, context) {
      return forwardComponent(this, this.component)
    }
  }
</script>
