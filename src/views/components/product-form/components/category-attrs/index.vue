<template>
  <div class="category-attrs-form">
    <DynamicForm
      v-if="configs.length"
      class="dynamic-form"
      :class="{ 'column-mode': attrs.length >= 4 }"
      :config="configs"
      :data="value"
    />
    <div v-if="attrs && attrs.length">
      <small>想要填写的信息这里没有？<a @click="applyModalVisible = true">申请商品信息</a></small>
    </div>
    <Drawer
      title="申请商品信息"
      width="40%"
      v-model="applyModalVisible"
    >
      <CategroyAttrsApply />
    </Drawer>
  </div>
</template>

<script>
  import DynamicForm from '@/components/dynamic-form'
  import Cascader from '@/components/cascader'
  import Input from '../Input'
  import FormItemLayout from '../../form-item-layout'
  import CategroyAttrsApply from './category-attrs-apply'

  import CategoryAttributeSelector from './components/selector'

  import createCategoryAttrsConfigs from './config'

  export default {
    name: 'CategoryAttrsForm',
    components: {
      CategroyAttrsApply,
      DynamicForm: DynamicForm({
        Cascader,
        Selector: CategoryAttributeSelector,
        Input
      }, FormItemLayout)
    },
    props: {
      attrs: {
        type: Array,
        required: true
      },
      value: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        applyModalVisible: false
      }
    },
    computed: {
      configs () {
        return createCategoryAttrsConfigs(this.attrs, this.value)
      }
    }
  }
</script>

<style scoped lang="less">
  @column-mode-width: 300px;

  .category-attrs-form {
    .dynamic-form {
      margin-left: -20px;

      &.column-mode {
        display: flex;
        flex-wrap: wrap;
        /deep/ .form-item-layout {
          flex-basis: 36%;
          flex-shrink: 0;
          margin-right: 20px;

          .boo-input-wrapper
          , .boo-select {
            width: @column-mode-width;
          }
        }
      }
    }
  }
</style>
