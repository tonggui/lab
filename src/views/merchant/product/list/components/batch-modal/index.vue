<template>
  <Modal
    :width="600"
    :value="value"
    :title="title"
    :loading="loading"
    ok-text="下一步"
    v-bind="$attrs"
    @on-hidden="handleHidden"
    @on-cancel="handleCancel"
    @on-ok="triggerSubmit"
  >
    <template v-if="isForm">
<!--      <Alert v-show="error" type="error">{{ error }}</Alert>-->
      <div class="modal-content-title">{{displayText}}</div>
      <div class="modal-content-tip" v-if="config.tip">{{ config.tip }}</div>
      <component ref="form" v-if="showForm" :range="poiSelectType" :tag-list="tagList" :is="component" @submit="handleSubmit"></component>
    </template>
    <template v-else>
      <div>{{ confirm }}</div>
    </template>
  </Modal>
</template>
<script>
  import {
    PRODUCT_BATCH_OP
  } from '@/data/enums/product'
  import config, { defaultPoiType, POI_SELECT_OPTIONS, POI_SELECT_TYPE } from './config'
  import createPopper from '@/hoc/withCreatePopper'
  import Drawer from '@/views/merchant/components/poi-select-drawer'

  const createPoiDrawer = createPopper(Drawer)

  export default {
    name: 'product-list-batch-modal',
    props: {
      range: Object,
      value: Boolean,
      loading: Boolean,
      type: {
        type: Number,
        validator (value) {
          return Object.values(PRODUCT_BATCH_OP).includes(value)
        }
      },
      count: {
        type: Number,
        default: 0
      },
      tagList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        error: '',
        poiType: defaultPoiType,
        poiIdList: []
      }
    },
    computed: {
      poiSelectType () {
        return this.range[this.type]
      },
      displayText () {
        if (this.type === PRODUCT_BATCH_OP.MOD_TAG) {
          return `共选择${this.count}件商品`
        } else if (this.type === PRODUCT_BATCH_OP.DELETE) {
          return `共删除${this.count}个商品`
        }
        return ''
      },
      options () {
        return POI_SELECT_OPTIONS
      },
      showForm () {
        return Object.values(PRODUCT_BATCH_OP).includes(this.type)
      },
      config () {
        return config[this.type] || {}
      },
      title () {
        return this.config.title || ''
      },
      component () {
        return this.config.component
      },
      isForm () {
        return this.config.type === 'form'
      },
      confirm () {
        return this.config.confirm && this.config.confirm({ count: this.count })
      }
    },
    methods: {
      handleCancel () {
        this.$emit('cancel')
      },
      handleHidden () {
        this.error = ''
      },
      triggerSubmit () {
        if (this.isForm) {
          this.$refs.form.submit()
        } else {
          this.$emit('submit', this.config.value)
        }
      },
      nextModal (text) {
        return new Promise(resolve => {
          if (text) {
            this.$Modal.open({
              content: text,
              onOk: () => {
                resolve()
              }
            })
          } else {
            this.$drawer = createPoiDrawer({
              on: {
                'on-confirm': (pois) => {
                  this.poiIdList = pois.map(item => item.id)
                  resolve()
                }
              }
            })
          }
        })
      },
      async handleSubmit (error, value) {
        if (error) {
          this.error = error
          this.$Message.error(error)
          return
        }
        this.$emit('cancel')
        const { range } = value
        await this.nextModal(this.config.next[range])
        let params = null
        if (this.type === PRODUCT_BATCH_OP.MOD_TAG) {
          params = {
            poiIdList: this.poiIdList,
            ...value
          }
        } else if (this.type === PRODUCT_BATCH_OP.DELETE) {
          params = {
            isMerchantDelete: [POI_SELECT_TYPE.MERCHANT].includes(range),
            isSelectAll: POI_SELECT_TYPE.ALL_POI === range,
            poiIdList: this.poiIdList,
            range
          }
        }
        this.$emit('submit', this.type, params)
      }
    }
  }
</script>
<style lang="less" scoped>
  .modal-content-title {
    margin-bottom: 20px;
  }
</style>
