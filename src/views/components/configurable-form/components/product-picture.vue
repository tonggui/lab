<template>
  <div class="product-picture-container">
    <ProductPicture
      v-if="showList"
      v-bind="$attrs"
      :disabled="disabled"
      :value="showValue"
      :max="showMax"
      :poorList="poorList"
      tag-placement="top-left"
      @change="handleImageChange"
      class="product-picture-list"
    >
      <ProductPicture
        slot="after"
        v-show="showAdd"
        v-bind="$attrs"
        :value="['']"
        :max="1"
        :tags="[]"
        :tips="[tip]"
        :requiredIndex="[1]"
        @change="handleImageAdd"
        class="product-picture-add"
      />
    </ProductPicture>
    <ProductPicture
      v-else
      v-bind="$attrs"
      :value="['']"
      :max="1"
      :tags="[]"
      :tips="[tip]"
      :requiredIndex="[0]"
      @change="handleImageAdd"
      class="product-picture-add"
    />
  </div>
</template>
<script>
  import ProductPicture from '@/components/product-picture'
  const PICTURE_DESCRIPTIONS = [
    '主图展示位',
    '建议展示包装',
    '建议展示原材料',
    '建议展示特写',
    '建议展示卖点',
    '建议展示细节',
    '建议展示细节',
    '建议展示细节'
  ]
  /**
   * 图片的交互修改成，一个上传按钮 + 上传list的模式，不是固定的上传位
   * 根据ProductPicture封装一个
   * 主要是利用max去控制 上传list
   */
  export default {
    name: 'product-picture-container',
    props: {
      disabled: Boolean,
      value: {
        type: Array,
        default: () => []
      },
      poorList: {
        type: Array,
        default () {
          return []
        }
      },
      max: {
        type: Number,
        default: 8
      }
    },
    components: {
      ProductPicture
    },
    computed: {
      showList () {
        return this.showMax > 0
      },
      showAdd () {
        return !this.disabled && this.showValue.length < this.max
      },
      showValue () {
        const value = this.value.filter(v => !!v)
        return value
      },
      showMax () {
        return this.showValue.length
      },
      tip () {
        return PICTURE_DESCRIPTIONS[this.showMax]
      }
    },
    methods: {
      handleImageAdd (valueList) {
        const value = valueList[0]
        this.$emit('change', [...this.showValue, value])
      },
      handleImageChange (valueList) {
        this.$emit('change', valueList.filter(v => !!v))
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-picture-container {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    width: 650px;
    .product-picture-list {
      margin-right: 20px;
    }
    .product-picture-add {
      display: inline-block;
      vertical-align: bottom;
    }
  }
</style>
