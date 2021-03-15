<template>
  <div class="batch-select-container">
    <Tabs type="radio" name="batch-rule" :value="type" @change="handleTypeChange" label="选择方式">
      <TabPane label="按'条形码'选择" :name="BATCH_MATCH_TYPE.UPC">
        <Input v-model="formData[BATCH_MATCH_TYPE.UPC]" type="textarea" :rows="8" :placeholder="`每行录入一个UPC/EAN/条形码，以换行作为分隔，至多添加${max}个。`"/>
      </TabPane>
      <TabPane v-if="!context.isMedicine" label="按'店内码/货号'选择'" :name="BATCH_MATCH_TYPE.SKU">
        <Input v-model="formData[BATCH_MATCH_TYPE.SKU]" type="textarea" :rows="8" :placeholder="`每行录入一个SKU码/货号，以换行作为分隔，至多添加${max}个。`"/>
      </TabPane>
      <TabPane label="按'商品名称'选择" :name="BATCH_MATCH_TYPE.PRODUCT_NAME">
        <Input v-model="formData[BATCH_MATCH_TYPE.PRODUCT_NAME]" type="textarea" :rows="8" :placeholder="`每行录入一个组包商品名称，以换行作为分隔，至多添加${max}个。`"/>
      </TabPane>
    </Tabs>
    <div class="footer">
      <span>已导入{{computedNumProduct}}个商品</span>
      <Button @click="handleEmpty" class="empty">清空</Button>
      <Button type="primary" @click="handleSubmit">确定并选择</Button>
    </div>
  </div>
</template>
<script>
  import Tabs, { TabPane } from '@components/radio-button-tabs'
  import { BATCH_MATCH_TYPE } from '@/data/enums/batch'
  import { createRule } from './util'

  const initValue = {
    [BATCH_MATCH_TYPE.UPC]: '',
    [BATCH_MATCH_TYPE.SKU]: '',
    [BATCH_MATCH_TYPE.PRODUCT_NAME]: ''
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
      },
      radioType: {
        type: String,
        default: BATCH_MATCH_TYPE.UPC
      },
      inputValue: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        BATCH_MATCH_TYPE,
        type: this.radioType ? this.radioType : BATCH_MATCH_TYPE.UPC,
        formData: { ...initValue, [BATCH_MATCH_TYPE[this.type]]: this.inputValue }
      }
    },
    components: {
      Tabs,
      TabPane
    },
    computed: {
      computedNumProduct () {
        return this.covertDataOut().length
      }
    },
    methods: {
      covertDataOut () {
        const result = []
        console.log('this.formData', this.formData, this.type)
        const isOut = this.formData[this.type].split(/[\n\t]/).some((v) => {
          if (!v) {
            return false
          }
          if (result.length >= this.max) {
            return true
          }
          result.push(v)
          // if (this.type === BATCH_MATCH_TYPE.UPC) {
          //   // result.push(this.createItem({ type: this.type, value: { upc: v } }))
          // }
          // if (this.type === BATCH_MATCH_TYPE.SKU) {
          //   // result.push(this.createItem({ type: this.type, value: { sku: v } }))
          // }
          // if (this.type === BATCH_MATCH_TYPE.PRODUCT_NAME) {
          //   // result.push(this.createItem({ type: this.type, value: { productName: v } }))
          // }
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
      handleEmpty () {
        this.formData = { ...initValue }
      },
      handleSubmit () {
        const result = this.covertDataOut()
        this.$emit('submit', this.type, result)
        this.handleEmpty()
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="less" scoped>
  .batch-select-container {
    background: #F5F6FA;
    border-radius: 2px;
    width: 746px;
    padding: 24px;
    .footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      align-items: center;
      .empty {
        margin: 0 10px 0 20px;
      }
    }
  }
</style>
