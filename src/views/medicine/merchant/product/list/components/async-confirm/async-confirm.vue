<template>
  <span @click="handleCreated">
    <slot></slot>
  </span>
</template>
<script>
  import createPopper from '@/hoc/withCreatePopper'
  import PoiSelectDrawer from '@/views/merchant/components/poi-select-drawer'
  import { POI_TYPE, options, ASYNC_TYPE, asyncInfo } from './constants'

  const createPoiDrawer = createPopper(PoiSelectDrawer)

  export default {
    name: 'async-confirm',
    props: {
      currentTag: Object,
      asyncType: {
        type: Number,
        validator (type) {
          return Object.values(ASYNC_TYPE).includes(type)
        }
      },
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    data () {
      return {
        submitting: false,
        poiType: POI_TYPE.SELECT_POI
      }
    },
    computed: {
      asyncInfo () {
        const tagName = this.currentTag && this.currentTag.name
        const handler = asyncInfo[this.asyncType]
        if (!handler) {
          return {}
        }
        return handler(tagName)
      }
    },
    created () {
      this.poiIdList = []
      this.isSelectAll = false
      this.$drawer = null
    },
    beforeDestroy () {
      if (this.$drawer) {
        this.$drawer.destroy()
        this.$drawer = null
      }
    },
    methods: {
      handleAllPoi (callback) {
        this.isSelectAll = true
        this.$Modal.open({
          width: 384,
          closable: false,
          maskClosable: false,
          centerLayout: true,
          title: this.asyncInfo.confirmTitle,
          render: () => <div style="text-align: center">{ this.asyncInfo.confirmContent }</div>,
          onOk: this.handleSubmit
        })
      },
      handleSelectPoi (poiIdList) {
        this.poiIdList = poiIdList.map(item => item.id)
        return this.handleSubmit()
      },
      async handleSubmit () {
        try {
          const { isSelectAll, poiIdList } = this
          await new Promise((resolve, reject) => {
            this.$emit('submit', { isSelectAll, poiIdList }, this.createCallback(resolve, reject))
          })
          this.$Message.success(this.asyncInfo.success)
        } catch (err) {
          this.$Message.warning(err.message || this.asyncInfo.error)
          throw err
        }
      },
      handleNext () {
        const type = this.poiType
        // 删除总部
        this.isSelectAll = false
        this.poiIdList = []
        if (type === POI_TYPE.ALL_POI) {
          this.handleAllPoi()
        } else if (type === POI_TYPE.SELECT_POI) {
          // 打开抽屉选择
          this.$drawer = createPoiDrawer({
            on: { 'on-confirm': this.handleSelectPoi }
          })
        }
      },
      handleCreated () {
        this.$Modal.open({
          title: this.asyncInfo.title,
          width: 494,
          centerLayout: true,
          render: (h) => {
            return (
              <div class="async-confirm-content">
                <div>{ this.asyncInfo.content }</div>
                <div class="async-confirm-range">
                  <span class="async-confirm-range-label">选择修改范围</span>
                  <RadioGroup vModel={this.poiType}>
                    {
                      options.map(({ value, label }) => (
                        <Radio label={value} key={value}><span>{ label }</span></Radio>
                      ))
                    }
                  </RadioGroup>
                </div>
              </div>
            )
          },
          onOk: this.handleNext,
          okText: '下一步'
        })
      }
    }
  }
</script>
<style lang="less">
  .async-confirm-content {
    .async-confirm-range {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .async-confirm-range-label {
        margin-right: 20px;
      }
      /deep/ span.boo-radio + * {
        margin-left: 0;
        margin-right: 0;
      }
      /deep/ .boo-radio-wrapper:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
</style>
