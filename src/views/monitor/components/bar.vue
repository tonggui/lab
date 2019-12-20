<template>
  <div class="info-bar">
    <div class="info-bar-text">{{ title }} <span :class="[count ? 'abnormal' : '']">{{ count }}</span> 个</div>
    <div v-if="count" class="info-bar-btn" @click="handleClick" v-mc="mcObjCheckDetail">查看详情</div>
  </div>
</template>

<script>
  export default {
    name: 'bar',
    props: {
      title: {
        type: String,
        default: '价格错误'
      },
      count: {
        type: [Number, String],
        default: 0
      }
    },
    computed: {
      mcObjCheckDetail () {
        const typeText = ['价格错误', '无图商品', '售罄商品', '库存不足', '信息不全商品', '信息不规范商品', '违规商品', '滞销商品']
        return {
          bid: 'b_g887j8ls',
          val: {
            type: typeText.indexOf(this.text) + 1
          },
          option: {
            isLeave: true
          }
        }
      }
    },
    methods: {
      handleClick () {
        this.$emit('handle-click')
      }
    }
  }
</script>

<style lang='less'>
  .info-bar {
    display: flex;
    justify-content: space-between;
    height: 60px;
    padding: 16px 14px;
    background-color: @color-gray7;
    .info-bar-text {
      color: @color-gray2;
      line-height: 28px;
      .abnormal {
        color: @error-color;
        font-weight: bold;
      }
    }
    .info-bar-btn {
      width: 76px;
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      color: #fff;
      background-color: @primary-color;
      border-radius: 2px;
      cursor: pointer;
    }
  }
</style>
