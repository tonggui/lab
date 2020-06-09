<template>
  <div class="product-recommend-edit-tag">
    <TextOverflowEllipsis :text="tagName" :line="2" />
    <small>自动生成推荐分类, 商品创建后可修改</small>
  </div>
</template>
<script>
  import { isEmptyArray } from '../../../utils'
  import TextOverflowEllipsis from '@/components/text-overflow-ellipsis'

  export default {
    name: 'product-recommend-edit-tag',
    components: { TextOverflowEllipsis },
    props: {
      tagList: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        showIcon: false
      }
    },
    computed: {
      tagName () {
        return this.tagList.map(tag => {
          const isLeaf = isEmptyArray(tag.children)
          if (isLeaf) {
            return tag.name
          }
          const childTag = tag.children[0]
          return [tag.name, childTag.name].join('>')
        }).join(';')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/styles/common.less";
  .product-recommend-edit-tag {
    position: relative;
    text-align: left;
    small {
      margin-top: 10px;
      padding-bottom: 10px;
      .default-value-tip()
    }
  }
</style>
