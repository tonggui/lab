<template>
  <div class="empty">
    <slot name="image">
      <div class="empty-image" :style="imageStyle">
        <img :src="src" alt="暂无数据" />
      </div>
    </slot>
    <p><slot name="description">{{ description }}</slot></p>
    <slot></slot>
  </div>
</template>
<script>
  /**
   * 参考antd做的empty的一个展示型组件
   */
  import empty from '@/assets/empty.svg'

  export default {
    name: 'empty-container',
    props: {
      description: {
        type: String,
        default: '暂无数据'
      },
      image: String,
      imageStyle: Object
    },
    computed: {
      src () {
        return this.image || empty
      }
    }
  }
</script>
<style lang="less" scoped>
  .empty {
    font-size: @font-size-base;
    line-height: 22px;
    text-align: center;
    margin: 32px 0;
    color: rgba(0,0,0,0.25);
    &-image {
      height: 40px;
      margin-bottom: 8px;
      img {
        height: 100%;
        vertical-align: middle;
        border-style: none;
      }
    }
    &-description {
      margin: 0;
    }
  }
</style>
