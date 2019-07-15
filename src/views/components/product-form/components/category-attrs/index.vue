<template>
  <div>
    <DynamicForm
      v-if="configs.length"
      :config="configs"
      :data="value"
    />
    <div>
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

  import createCategoryAttrsConfigs from './config'

  export default {
    name: 'CategoryAttrsForm',
    components: {
      CategroyAttrsApply,
      DynamicForm: DynamicForm({
        Cascader,
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

<style scoped>

</style>
