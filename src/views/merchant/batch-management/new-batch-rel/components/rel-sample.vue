<template>
  <table class="table-sample">
    <thead>
      <tr>
        <th :class="['rel-info']">关联信息</th>
        <th :class="['rel-pic', { 'gray': computedData.includes('pic') }]">商品图片</th>
        <th :class="['rel-video', { 'gray': computedData.includes('video') }]">封面视频</th>
        <th :class="['rel-basic', { 'gray': computedData.includes('basic') }]">基本信息</th>
        <th :class="['rel-class', { 'gray': computedData.includes('class') }]">店内分类</th>
        <th :class="['rel-price', { 'gray': computedData.includes('price') }]">价格</th>
        <th :class="['rel-stock', { 'gray': computedData.includes('stock') }]">库存</th>
        <th :class="['rel-advanced', { 'gray': computedData.includes('advanced') }]">高级设置</th>
      </tr>
    </thead>
    <tbody>
        <tr>
          <td>示例</td>
          <td :class="{ 'gray-img': computedData.includes('pic') }">
            <img :src="picSample" :style="{ width: '58px', height: '58px' }">
          </td>
          <td :class="{ 'gray-img': computedData.includes('video') }">
            <img :src="videoSample" :style="{ width: '58px', height: '58px' }">
          </td>
          <td :class="{ 'gray': computedData.includes('basic') }">
            名称：可口可乐 碳酸饮料 330ml/罐
          </td>
          <td :class="{ 'gray': computedData.includes('class') }">
            一级分类 > 二级分类
          </td>
          <td :class="{ 'gray': computedData.includes('price') }">
            ¥ 3
          </td>
          <td :class="{ 'gray': computedData.includes('stock') }">
            999
          </td>
          <td :class="{ 'gray': computedData.includes('advanced') }">
            <p>可售时间：…</p>
            <p>商品标签：…</p>
            <p>商品属性：…</p>
          </td>
        </tr>
      </tbody>
  </table>
</template>

<script>
  import picSample from '@/assets/img-example/pic-sample.svg'
  import videoSample from '@/assets/img-example/video-sample.svg'
  export default {
    name: 'rel-sample',
    props: {
      type: String
    },
    data () {
      return {
        data: ['pic', 'video', 'basic', 'class', 'price', 'stock', 'advanced'],
        picSample,
        videoSample
      }
    },
    computed: {
      computedData () {
        if (this.type === 'all') return []
        else if (this.type === 'exclude') return this.data.filter(item => item === 'price' || item === 'stock')
        else return this.data
      }
    }
  }
</script>

<style lang="less" scoped>
  .gray {
    &.gray {
    color: #ccc;
    font-weight: 400;
    //opacity: 0.6;
    }
  }
  .table-sample {
    width: 746px;
    border: 1px solid #E9EAF2;
    border-collapse: collapse;
    > thead {
      background: #F5F6FA;
      > tr {
        height: 40px;
        line-height: 40px;
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #222222;
        > th {
          font-weight: 500;
          border: 1px solid #E9EAF2;
          &.rel {
            &-info {
              width: 67px;
            }
            &-pic {
              width: 88px;
              .gray()
            }
            &-video {
              width: 88px;
              .gray()
            }
            &-basic {
              width: 136px;
              .gray()
            }
            &-class {
              width: 144px;
              .gray()
            }
            &-price {
              width: 56px;
              .gray()
            }
            &-stock {
              width: 55px;
              .gray()
            }
            &-advanced {
              .gray()
            }
          }
        }
      }
    }
    > tbody {
      > tr td {
        height: 92px;
        text-align: center;
        border: 1px solid #E9EAF2;
        font-size: 12px;
        &.gray {
          color: #ccc;
        }
        &.gray-img {
          opacity: 0.5;
        }
        &:first-child {
          font-weight: 500;
          font-family: PingFangSC-Medium;
          color: #222222;
          background: #F5F6FA;
        }
      }
    }
  }
</style>
