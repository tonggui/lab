<template>
  <Modal
    title="字段更新提示"
    :value="value"
    :footerHide="onlyCheck"
    @on-cancel="handleCancel"
    width="700"
  >
    <div class="sp-change-content">
      <SpChangeInfo
        v-if="basicChanges.length"
        :price="product.price"
        warningText="如价格与商品不对应，请替换商品后立即修改价格"
        :changes="basicChanges"
      />
      <SpChangeInfo
        v-if="categoryAttrChanges.length"
        title="其他信息"
        :changes="categoryAttrChanges"
      />
    </div>
    <div
      class="sp-change-footer"
      slot="footer"
    >
      <Button @click="handleCancel">暂不替换</Button>
      <Button type="primary" @click="handleConfirm(1)">同意替换</Button>
    </div>
  </Modal>
</template>

<script>
  import SpChangeInfo from '@/views/components/configurable-form/components/sp-change-info/components/sp-change-list'
  import { convertCategoryAttrValue } from '@/data/helper/category/convertFromServer.ts'
  import { VALUE_TYPE, RENDER_TYPE, ATTR_TYPE } from '@/data/enums/category'
  import { get } from 'lodash'

  export default {
    name: 'MedicineSingleSpChangeInfoModal',
    components: { SpChangeInfo },
    props: {
      product: Object,
      categoryAttrList: {
        type: Array,
        default: () => ([])
      },
      changeInfo: {
        type: Object,
        default: () => ({})
      },
      onlyCheck: {
        type: Boolean,
        default: false
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {
      basicChanges () {
        return this.changeInfo.basicInfoList || []
      },
      categoryAttrChanges () {
        const changes = []
        const attrs = this.categoryAttrList;
        (this.changeInfo.categoryAttrInfoList || []).forEach(item => {
          const attr = attrs.find(v => `${v.id}` === item.field)
          if (attr) {
            const renderType = get(attr, 'render.type')
            const valueType = get(attr, 'valueType')
            const attrType = get(attr, 'attrType')
            let newValue = get(item, 'newValue')
            let oldValue = get(item, 'oldValue')

            newValue = [newValue ? convertCategoryAttrValue(newValue, attrs, item.sequence - 1) : '']
            oldValue = [oldValue ? convertCategoryAttrValue(oldValue, attrs, item.sequence - 1) : '']

            if (attr.valueType === VALUE_TYPE.MULTI_SELECT) {
              oldValue = oldValue ? oldValue.split(',').map(v => v ? v + '' : v) : []
              newValue = newValue ? newValue.split(',').map(v => v ? v + '' : v) : []
            }
            if (renderType !== RENDER_TYPE.CASCADE && renderType !== RENDER_TYPE.BRAND) {
              oldValue = oldValue.map(v => (attrType === ATTR_TYPE.SELL || valueType === VALUE_TYPE.INPUT) ? v.name : v.id)
              newValue = newValue.map(v => (attrType === ATTR_TYPE.SELL || valueType === VALUE_TYPE.INPUT) ? v.name : v.id)
            }

            oldValue = oldValue[0] || ''
            newValue = newValue[0] || ''

            changes.push({
              ...attr,
              oldValue,
              newValue
            })
          }
        })
        return changes
      }
    },
    methods: {
      handleConfirm (type = 3) {
        this.$emit('confirm', this.product)
      },
      handleCancel () {
        this.$emit('change', false)
      }
    }
  }
</script>

<style scoped lang="less">
  .sp-change-content {
    max-height: 600px;
    overflow: auto;
  }
  .sp-change-footer {
    .boo-btn {
      margin-left: 10px;
    }
  }
  .title {
    margin: 6px 0;
    font-weight: normal;
    font-size: @font-size-base;
    color: @text-color;
  }
  .diffs {
    background: #F7F8FA;
    padding: 10px;
  }
</style>
