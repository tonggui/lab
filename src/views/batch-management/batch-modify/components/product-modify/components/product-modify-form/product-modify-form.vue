<template>
  <div class="product-modify-form">
    <div>
      <p class="title">1.选择要修改的商品</p>
      <MatchRuleForm :value="value.rule" @change="handleChangeRule" :context="context" ref="matchForm" />
    </div>
    <div>
      <p class="title">2.输入要修改的商品信息</p>
      <ModifyFieldForm :value="value.modifyValue" @change="handleChangeModify" :context="context" ref="modifyForm" />
    </div>
  </div>
</template>
<script>
  import { MatchRuleForm } from '@/views/batch-management/components/match-rule-form'
  import ModifyFieldForm from './modify-field-form'
  import { isObject } from 'lodash'

  export default {
    name: 'product-modify-form',
    props: {
      index: Number,
      context: {
        type: Object,
        default: () => ({})
      },
      value: {
        type: Object,
        validator: (v) => {
          try {
            const { rule, modifyValue } = v
            return isObject(rule) && isObject(modifyValue)
          } catch (err) {
            console.error('product-modify-form props value:', err)
            return false
          }
        }
      }
    },
    components: {
      MatchRuleForm,
      ModifyFieldForm
    },
    methods: {
      triggerChange (params) {
        this.$emit('change', { ...this.value, ...params }, this.index)
      },
      handleChangeRule (rule) {
        this.triggerChange({ rule })
      },
      handleChangeModify (modifyValue) {
        this.triggerChange({ modifyValue })
      },
      async validate () {
        const $match = this.$refs.matchForm
        const $modify = this.$refs.modifyForm
        let error = await $match.validate()
        if (error) {
          return error
        }
        error = await $modify.validate()
        return error
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-modify-form .title {
    margin-bottom: 20px;
  }
</style>
