<template>
  <Modal :value="value" @on-cancel="handleCancel" @on-ok="handleSubmit" width="650">
    <Tabs type="radio" name="batch-rule" :value="type" @change="handleTypeChange">
      <TabPane label="按UPC码/条码匹配" :name="BATCH_MATCH_TYPE.UPC">
        <Input v-model="formData[BATCH_MATCH_TYPE.UPC]" type="textarea" :rows="8" :placeholder="`每行录入一个UPC码/EAN码/条码，以换行作为分隔，至多添加${max}个。`"/>
      </TabPane>
      <TabPane v-if="!context.isMedicine" label="按SKU码/货号匹配" :name="BATCH_MATCH_TYPE.SKU">
        <Input v-model="formData[BATCH_MATCH_TYPE.SKU]" type="textarea" :rows="8" :placeholder="`每行录入一个SKU码/货号，以换行作为分隔，至多添加${max}个。`"/>
      </TabPane>
      <TabPane label="(仅限组包商品)按商品名称匹配" :name="BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE">
        <Input v-model="formData[BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE]" type="textarea" :rows="8" :placeholder="`每行录入一个组包商品标题，以换行作为分隔，至多添加${max}个。`"/>
      </TabPane>
    </Tabs>
  </Modal>
</template>
<script>
  import Tabs, { TabPane } from '@components/radio-button-tabs'
  import { BATCH_MATCH_TYPE } from '@/data/enums/batch'
  import { createRule } from './util'

  const initValue = {
    [BATCH_MATCH_TYPE.UPC]: '',
    [BATCH_MATCH_TYPE.SKU]: '',
    [BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE]: ''
  }

  export default {
    name: 'batch-rule-modal',
    props: {
      value: Boolean,
      max: {
        type: Number,
        default: Infinity
      },
      context: {
        type: Object,
        default: () => ({
          isMedicine: false
        }),
        validator: (context) => {
          return ['isMedicine'].every(k => k in context)
        }
      }
    },
    data () {
      return {
        BATCH_MATCH_TYPE,
        type: BATCH_MATCH_TYPE.UPC,
        formData: { ...initValue }
      }
    },
    components: {
      Tabs,
      TabPane
    },
    methods: {
      covertDataOut () {
        const result = []
        const isOut = this.formData[this.type].split(/[\n\t]/).some((v) => {
          if (!v) {
            return false
          }
          if (result.length >= this.max) {
            return true
          }
          if (this.type === BATCH_MATCH_TYPE.UPC) {
            result.push(this.createItem({ type: this.type, value: { upc: v } }))
          }
          if (this.type === BATCH_MATCH_TYPE.SKU) {
            result.push(this.createItem({ type: this.type, value: { sku: v } }))
          }
          if (this.type === BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE) {
            result.push(this.createItem({ type: this.type, value: { productName: v } }))
          }
          return false
        })
        if (isOut) {
          this.$Message.warning(`最多只允许创建${this.max}个规则`)
        }
        return result
      },
      createItem (params) {
        return createRule(this.context, params)
      },
      handleTypeChange (type) {
        this.type = type
      },
      handleSubmit () {
        const result = this.covertDataOut()
        this.$emit('submit', result)
        this.formData = { ...initValue }
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>
