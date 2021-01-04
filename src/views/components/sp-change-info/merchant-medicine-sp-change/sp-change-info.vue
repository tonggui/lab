<template>
  <div class="sp-change-detail">
    <h3 class="title">{{product.name}}</h3>
    <h3 class="title">{{product.skuCode}}</h3>
    <div class="diffs">
      <!-- 基本信息 -->
      <template v-if="basicChanges.length">
        <DiffItem
          v-for="(item, idx) in basicChanges"
          :context="context"
          :key="idx"
          :type="item.field"
          :old-value="item.oldValue"
          :new-value="item.newValue"
        />
      </template>
      <!-- 其他信息 -->
      <template v-if="categoryAttrChanges.length">
          <MedicineDiffItem
            v-for="attr in categoryAttrChanges"
            :key="attr.id"
            :data="attr"
          />
      </template>
    </div>
  </div>
</template>

<script>
  import MedicineDiffItem from '../diff-item/medicine-diff'
  import DiffItem from '../diff-item'
  import { VALUE_TYPE } from '@/data/enums/category'

  export default {
    name: 'SpChangeInfoModal',
    components: { MedicineDiffItem, DiffItem },
    props: {
      product: {
        type: Object,
        default: () => {}
      },
      categoryAttrList: {
        type: Array,
        default: () => ([])
      },
      changeInfo: {
        type: Object,
        default: () => ({})
      },
      weightUnit: {
        type: String,
        default: () => '克(g)'
      }
    },
    data () {
      return {
      }
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
            }
            changes.push({
              ...attr,
              oldValue,
              newValue
            })
          }
        })
        return changes
      },
      context () {
        return {
          weightUnit: this.weightUnit
        }
      }
    }
  }
</script>
