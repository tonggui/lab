<template>
  <div class="product-recommend-edit-tag">
    <TagList
      :class="{ 'tag-error': enableErrorTip }"
      placeholder="请选择"
      transfer
      :width="178"
      :source="source"
      :value="tagList"
      :maxCount="maxCount"
      :disabled="disabled"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <template v-if="enableErrorTip">
      <div class="error">店内分类不可为空</div>
    </template>
  </div>
</template>
<script>
  import { isEmptyArray } from '@/views/product-recommend/utils'
  import TagList from '@/components/taglist'

  export default {
    name: 'product-recommend-edit-tag',
    components: { TagList },
    props: {
      maxCount: {
        type: Number,
        default: 1
      },
      source: {
        type: Array,
        default: () => []
      },
      tagList: {
        type: Array,
        required: true
      },
      showErrorTip: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selfShowErrorTip: false
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
      },
      enableErrorTip () {
        if (!this.showErrorTip) return false
        return this.selfShowErrorTip
      }
    },
    methods: {
      handleBlur () {
        if (!this.tagList.length) this.selfShowErrorTip = true
      },
      handleFocus () {
        this.selfShowErrorTip = false
      },
      handleChange (value) {
        if (value && value.length) this.selfShowErrorTip = false
        else this.selfShowErrorTip = true

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
    .tag-error {
      /deep/ .withSearch {
        border: 1px solid @error-color;
      }
    }
    small {
      margin-top: 10px;
      padding-bottom: 10px;
      .default-value-tip()
    }
    .error {
      position: absolute;
      color: @error-color;
      font-size: @font-size-small;
      line-height: 1;
      margin-top: 4px;
    }
  }
</style>
