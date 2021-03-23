<template>
  <div class="batch-rule-selected-container">
    <BathRuleSelect
      v-show="!submit"
      :max="2000"
      :input-value="inputValue"
      :radio-type="radioType"
      @submit="handleSubmit"
    />
    <div class="selected" v-show="submit">
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
  import { BATCH_REL_MATCH_TYPE } from '@/data/enums/batch'

  export default {
    name: 'batch-rule-selected',
    props: {
      type: {
        type: String,
        default: BATCH_REL_MATCH_TYPE.UPC
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    mounted () {
      if (this.type && this.value && this.value.length) this.submit = true
    },
    data () {
      return {
        submit: false
      }
    },
    components: {
      BathRuleSelect
    },
    computed: {
      inputValue () {
        return this.value.join('\n')
      },
      radioType () {
        return this.type || BATCH_REL_MATCH_TYPE.UPC
      }
    },
    methods: {
      reset () {
        this.submit = false
        // this.$emit('data-change', BATCH_MATCH_TYPE.UPC, 'dataSourceType')
        // this.$emit('data-change', [], 'dataSourceValues')
      },
      handleSubmit (type, data) {
        this.submit = true
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
