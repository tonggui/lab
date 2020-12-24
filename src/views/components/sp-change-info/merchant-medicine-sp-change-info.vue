<template>
  <Modal
    title="字段更新提示"
    :value="value"
    @on-cancel="handleCancel"
    width="700"
  >
    <div class="sp-change-content">
      <SpChangeInfo
        :price="product.price"
        :changes="basicChanges"
        warningText="如价格与商品不对应，请替换商品后立即修改价格"
      />
      <template v-if="categoryAttrChanges.length">
        <h3 class="title">其他信息</h3>
        <div class="diffs">
          <MedicineDiffItem
            v-for="attr in categoryAttrChanges"
            :key="attr.id"
            :data="attr"
          />
        </div>
      </template>
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
  import SpChangeInfo from './sp-change-list'
  import MedicineDiffItem from './diff-item/medicine-diff'
  import { VALUE_TYPE } from '@/data/enums/category'

  export default {
    name: 'SpChangeInfoModal',
    components: { SpChangeInfo, MedicineDiffItem },
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
            let { oldValue, newValue } = item
            if (attr.valueType === VALUE_TYPE.MULTI_SELECT) {
              oldValue = oldValue ? oldValue.split(',').map(v => v ? v + '' : v) : []
              newValue = newValue ? newValue.split(',').map(v => v ? v + '' : v) : []
            } else {
              oldValue = oldValue + ''
              newValue = newValue + ''
            }
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
        this.handleConfirm(3)
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
