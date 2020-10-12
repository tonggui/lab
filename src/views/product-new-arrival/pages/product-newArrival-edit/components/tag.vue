<template>
  <div class="product-recommend-edit-tag">
<!--    <TextOverflowEllipsis :text="tagName" :line="2" />-->
    <TagList placeholder="请选择" transfer :width="178" :source="source" :value="tagList" @change="handleChange" />
<!--    <small>自动生成推荐分类, 商品创建后可修改</small>-->
  </div>
</template>
<script>
  import { isEmptyArray } from '../../../utils'
  // import TextOverflowEllipsis from '@/components/text-overflow-ellipsis'
  import TagList from '@/components/taglist'

  export default {
    name: 'product-recommend-edit-tag',
    components: { TagList },
    props: {
      source: {
        type: Array,
        default: () => []
      },
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
    },
    methods: {
      handleChange (value) {
        this.$emit('change', value)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "~@/styles/common.less";
  .product-recommend-edit-tag {
    width: 100%;
    position: relative;
    text-align: left;
    small {
      margin-top: 10px;
      padding-bottom: 10px;
      .default-value-tip()
    }
  }
</style>
