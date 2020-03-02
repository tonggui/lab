<script>
  import TabPane from './tabPane'
  import { cloneElement } from '@/common/vnode'

  export default {
    name: 'radio-button-tabs',
    props: {
      value: [String, Number],
      type: {
        type: String,
        default: 'radioButton',
        validator (type) {
          return ['radio', 'radioButton'].includes(type)
        }
      }
    },
    data () {
      return {
        tabList: [],
        activeTab: undefined
      }
    },
    watch: {
      value (value) {
        if (value !== this.activeTab) {
          this.activeTab = value
        }
      }
    },
    computed: {
      activeIndex () {
        return this.tabList.findIndex(tab => tab.value === this.activeTab)
      },
      tabItemType () {
        return this.type === 'radio' ? undefined : 'button'
      }
    },
    created () {
      let value = this.value
      const tabList = []
      const children = this.$slots.default ? [].concat(this.$slots.default) : []
      children.forEach((child, index) => {
        if (!child.tag || child.tag.indexOf(TabPane.name) < 0) {
          return
        }
        const props = child.componentOptions.propsData || {}
        if (value === undefined) {
          value = props.name
        }
        tabList.push({ name: props.label, value: props.name })
      })
      this.tabList = tabList
      this.activeTab = value
    },
    components: {
      TabPane
    },
    methods: {
      getPaneList () {
        const children = this.$slots.default ? [].concat(this.$slots.default) : []
        const paneList = []
        children.forEach((child, index) => {
          if (!child.tag || child.tag.indexOf(TabPane.name) < 0) {
            return
          }
          paneList.push(cloneElement(child, { props: { active: index === this.activeIndex } }))
        })
        return paneList
      },
      handleChange (value) {
        this.activeTab = value
        this.$emit('change', value)
      }
    },
    render () {
      const paneList = this.getPaneList()
      const style = {
        marginLeft: `-${this.activeIndex * 100}%`
      }
      return (
        <div class="radio-button-tabs">
          <RadioGroup value={this.activeTab} vOn:on-change={this.handleChange} type={this.tabItemType}>
            {
              this.tabList.map((tab) => (
                <Radio key={tab.value} label={tab.value}>{ tab.name }</Radio>
              ))
            }
          </RadioGroup>
          <div style={style} class="radio-button-tabs-content">
            { paneList }
          </div>
        </div>
      )
    }
  }
</script>
<style lang="less" scoped>
  .radio-button-tabs {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    /deep/ .boo-radio-group-button .boo-radio-wrapper-checked {
      background: @primary-color;
      color: #fff;
    }
    &-content {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      will-change: margin-left;
      margin-top: 30px;
    }
  }
</style>
