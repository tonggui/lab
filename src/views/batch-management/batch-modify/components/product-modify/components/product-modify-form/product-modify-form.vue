<template>
  <div class="product-modify-form">
    <div class="product-modify-form-content">
      <div>
        <p class="title">1.选择要修改的商品</p>
        <MatchRuleForm :value="value.rule" @change="handleChangeRule" :context="context" ref="matchForm" />
      </div>
      <div>
        <p class="title">2.输入要修改的商品信息</p>
        <ModifyFeildForm :value="value.modifyValue" @change="handleChangeModify" :context="context" ref="modifyForm" />
      </div>
    </div>
    <span class="product-modify-form-delete" :class="{ 'is-hide': !deleteabled }" @click="handleDelete"><Icon type="close" /></span>
  </div>
</template>
<script>
  import MatchRuleForm from '@/views/batch-management/components/match-rule-form'
  import ModifyFeildForm from './modify-feild-form'
  import { isObject } from 'lodash'

  export default {
    name: 'product-modify-form',
    props: {
      deleteabled: Boolean,
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
      ModifyFeildForm
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
      handleDelete () {
        this.$emit('delete', this.index)
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
  .product-modify-form {
    display: inline-flex;
    border: 1px solid @border-color-base;
    border-radius: @border-radius-base;
    padding: 20px;
    margin-bottom: 20px;
    .title {
      margin-bottom: 20px;
    }
    &-delete {
      font-size: 18px;
      color: #a2a4b3;
      cursor: pointer;
      margin-left: 32px;
      &.is-hide {
        visibility: hidden;
      }
    }
  }
</style>
