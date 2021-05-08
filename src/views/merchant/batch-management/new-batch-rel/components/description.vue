<template>
  <div class="batch-rel-description-container">
    <h3 :class="{ 'title': true, 'opened': opened }" @click="opened = !opened">
      <span class="desc"><Icon type="info-outline" class="info" size="15" />批量关联功能的用途是什么？</span>
      <span class="btn">{{ opened ? '收起' : '展开' }}<i :class="{ 'opened': opened }" /></span>
    </h3>
    <div class="tips" v-show="opened">
      <p>1. 新建商品到分店：总部商品库中商品与分店建立关联，若分店中无此商品，则关联成功即在分店新建此商品。</p>
      <p>2. 同步更新商品信息：分店商品与总部商品库中商品建立关联后，总部商品库的商品信息更新，则分店对应商品的信息自动同步更新。</p>
      <p>建议在“为新分店新建商品时”、“分店商品信息无法与总部同步更新时”使用此功能。</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'batch-rel-description',
    data () {
      return {
        opened: false
      }
    }
  }
</script>

<style lang="less" scoped>
  .batch-rel-description-container {
    width: 100%;
    background: #F5F6FA;
    border-radius: 2px;
    font-size: 12px;
    color: #666666;
    //padding: 1px 20px;
    margin-bottom: 40px;
    > .title {
      color: #222222;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      padding: 15px 20px;
      &.opened {
        padding-bottom: 8px;
      }
      .desc {
        font-weight: 400;
        font-size: 12px;
        display: flex;
        align-items: center;
        .info {
          margin-right: 8px;
        }
      }
      .btn {
        color: #999999;
        font-size: 12px;
        > i {
          position: relative;
          margin-left: 3px;
          &::before, &::after {
            content: '';
            display: inline-block;
            width: 5px;
            height: 1px;
            background: #999999;
          }
          &::after {
            position: absolute;
            left: 3px;
            top: 7px;
            transform: rotate(-45deg);
          }
          &::before {
            position: absolute;
            top: 7px;
            transform: rotate(-135deg);
          }
          &.opened {
            &::after {
              transform: rotate(45deg);
            }
            &::before {
              transform: rotate(135deg);
            }
          }
        }
      }
    }
    .tips {
      padding: 0 20px 10px;
    }
  }
</style>
