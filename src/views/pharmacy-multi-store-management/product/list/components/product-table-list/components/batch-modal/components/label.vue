<template>
  <Form>
    <FormItem label="选择模式">
      <RadioGroup v-model="type">
        <Radio :label="TYPE.ADD">设置标签</Radio>
        <Radio :label="TYPE.REMOVE">清除标签</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="选择标签">
      <ProductLabel class="batch-product-label" v-model="labelList" />
    </FormItem>
  </Form>
</template>
<script>
  import ProductLabel from '@components/product-label'

  const TYPE = {
    ADD: 0,
    REMOVE: 1
  }

  export default {
    name: 'product-label-batch-modify',
    data () {
      return {
        labelList: [],
        type: 0
      }
    },
    computed: {
      TYPE () {
        return TYPE
      }
    },
    components: {
      ProductLabel
    },
    methods: {
      submit () {
        let error
        const { labelList, type } = this
        if (labelList && labelList.length > 0) {
          if (type === TYPE.ADD) {
            const overLimitItem = labelList.filter(item => item.upperLimit <= item.supCount)
            if (overLimitItem.length > 0) {
              error = overLimitItem.map(item => `本店已经设置${item.spuCount}个${item.label}标签，请清除部分标签后进行设置`).join('；')
            }
          }
        } else {
          error = '请选择商品标签'
        }
        this.$emit('submit', error, { type, labelIdList: labelList.map(i => i.value) })
      }
    }
  }
</script>
<style lang="less" scoped>
  .batch-product-label {
    line-height: inherit;
    overflow: hidden;
    display: inline-block;
  }
</style>
