<template>
  <div class="batch-rule-selected-container">
    <BathRuleSelect
      @submit="handleSubmit"
      :max="2000"
      :input-value="inputValue"
      :radio-type="radioType"
      v-if="!value.length"
    />
    <div class="selected" v-else>
      <div>
        <Icon local="success" />
        <span class="selected-num">已导入选择{{value.length}}个商品</span>
      </div>
      <Button @click="reset">重新导入</Button>
    </div>
  </div>
</template>

<script>
  import BathRuleSelect from './batch-rule-select'
  import { BATCH_MATCH_TYPE } from '@/data/enums/batch'

  export default {
    name: 'batch-rule-selected',
    props: {
      type: {
        type: String,
        default: BATCH_MATCH_TYPE.UPC
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    components: {
      BathRuleSelect
    },
    computed: {
      inputValue () {
        console.log('this.value', this.value)
        return this.value.join('/[\\n\\t]/')
      },
      radioType () {
        return BATCH_MATCH_TYPE[this.type] || BATCH_MATCH_TYPE.UPC
      }
    },
    methods: {
      reset () {
        // this.$emit('data-change', BATCH_MATCH_TYPE.UPC, 'dataSourceType')
        this.$emit('data-change', [], 'dataSourceValues')
      },
      handleSubmit (type, data) {
        // this.$emit('data-change', type, 'dataSourceType')
        this.$emit('data-change', data)
        this.$emit('data-change', Number(type), 'batchType')
      }
    }
  }
</script>

<style lang="less" scoped>
  .batch-rule-selected-container {
    .selected {
      background: #F5F6FA;
      border-radius: 2px;
      width: 746px;
      height: 56px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .selected-num {
        margin-left: 10px;
      }
    }
  }
</style>
