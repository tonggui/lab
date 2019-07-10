<template>
  <div class="relate-product-item">
    <div class="num" v-if="num">{{ num }}</div>
    <Checkbox :disabled="disabled && !selected" v-else :value="selected" @on-change="onSelect"></Checkbox>
    <div class="pic">
      <div v-if="data.picture" :style="{ backgroundImage: `url(${data.picture})` }"></div>
      <div v-else class="no-pic"><Icon class="icon" type='image' size="24" /></div>
    </div>
    <div class="meta">
      <h3>
        <div class="name">{{ data.name }}</div>
        <div v-if="!related" class="price">¥{{ price }}</div>
      </h3>
      <div class="stock" v-if="!related">库存：{{ stock }}</div>
      <div class="price" v-if="related">¥{{ price }}</div>
    </div>
    <div v-if="related" class="remove" @click="remove">
      <Icon type="close" size="24" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'relate-product-item',
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      selected: {
        type: Boolean,
        default: false
      },
      related: {
        type: Boolean,
        default: false
      },
      // 是否能够再选中，不过不影响取消选中
      disabled: {
        type: Boolean,
        default: false
      },
      num: Number
    },
    computed: {
      mainSku () {
        const mainSku = (this.data.wmProductSkus || []).find(sku => sku.upcCode === this.data.upcCode) || {}
        return mainSku
      },
      price () {
        return this.mainSku.price || 0
      },
      stock () {
        return this.mainSku.stock || 0
      }
    },
    methods: {
      // 选中商品
      onSelect (check) {
        this.$emit('select', check, this.data.id)
      },
      // 从已关联中删除商品
      remove () {
        this.$emit('remove', this.data.id)
      }
    }
  }
</script>

<style lang="less" scoped>
.relate-product-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 20px 0;
  line-height: 1.25;
  .num {
    margin-right: 5px;
    font-size: 14px;
  }
  .pic {
    width: 60px;
    height: 60px;
    border: 1px solid @border-color-base;
    margin: 0 5px;
    & > * {
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .no-pic {
      background: @light-background;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      object-fit: contain;
    }
  }
  .meta {
    margin: 0 0 0 10px;
    flex: 1;
    h3 {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: normal;
      margin-bottom: 5px;
      word-break: keep-all;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient: vertical;
        max-width: 150px;
      }
    }
    .stock {
      color: @text-helper-color;
    }
  }
  .price {
    align-self: flex-start;
    color: @text-red;
  }
  .remove {
    color: @text-description-color;
    cursor: pointer;
  }
}
</style>
