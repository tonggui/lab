<template>
  <div>
    <div>{{ tagNameList }}</div>
    <span>自动生成推荐分类, 商品创建后可修改</span>
  </div>
</template>
<script>
  import { isEmptyArray } from '../../../utils'
  export default {
    name: 'product-recommend-edit-tag',
    props: {
      tagList: {
        type: Array,
        required: true
      }
    },
    computed: {
      tagNameList () {
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
