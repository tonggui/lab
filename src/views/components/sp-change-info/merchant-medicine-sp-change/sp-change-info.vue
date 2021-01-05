<template>
  <div class="sp-change-detail">
    <h3 class="title">{{product.name}}</h3>
    <h3 class="title">{{product.skuCode}}</h3>
    <div class="diffs">
      <!-- 基本信息 -->
      <template v-if="basicChanges.length">
        <DiffItem
          v-for="(item, idx) in basicChanges"
          :key="item.id || idx"
          :context="item"
          :type="item.renderType"
        />
      </template>
      <!-- 其他信息 -->
      <template v-if="categoryAttrChanges.length">
        <DiffItem
          v-for="(item, idx) in categoryAttrChanges"
          :key="item.id || idx"
          :context="item"
          :type="item.renderType"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import DiffItem from '@/views/components/configurable-form/components/sp-change-info/components/diff-item'

  export default {
    name: 'SpChangeInfoModal',
    components: { DiffItem },
    props: {
      product: {
        type: Object,
        default: () => {}
      },
      changes: {
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
        return (this.changes.basicInfoList || []).map(item => {
          item.weightUnit = this.weightUnit
          item.renderType = item.field || `${item.render.type}`
          return item
        })
      },
      categoryAttrChanges () {
        return (this.changes.categoryAttrInfoList || []).map(item => {
          item.weightUnit = this.weightUnit
          item.renderType = item.field || `${item.render.type}`
          return item
        })
      }
    }
  }
</script>
