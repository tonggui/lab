<template>
  <div class="info-bar">
    <div class="info-bar-text">{{ problem.title }} <span :class="[problem.count ? 'abnormal' : '']">{{ problem.count }}</span> 个{{ problem.extra }}</div>
    <div v-if="problem.count" class="info-bar-btn" @click="handleClick" v-mc="mcObjCheckDetail">查看详情</div>
  </div>
</template>

<script>
  import { getPoiId } from '@/common/constants'
  import { PROBLEM_TYPE as TYPE, PROBLEM_DETAIL as DETAIL } from '../constants'

  export default {
    name: 'bar',
    props: {
      problem: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {}
    },
    computed: {
      poiId () {
        return getPoiId()
      },
      mcObjCheckDetail () {
        const level2Types = Object.entries(DETAIL).filter(d => d[1].level === 2).map(d => d[1].title)
        // 为了保持埋点数据的一致性，之前的 信息不规范商品 type为8，该异常不展示之后，后面的两个异常，违规和滞销要保持9和10
        level2Types.splice(7, 0, '信息不规范商品')
        const title = this.problem.title
        const mcObj = {
          bid: 'b_g887j8ls',
          option: {
            isLeave: true
          }
        }
        if (title === '类目与商品不匹配') {
          mcObj.bid = 'b_shangou_online_e_3vdk9fkx_mc'
        } else if (title === '未填写类目') {
          mcObj.bid = 'b_shangou_online_e_4uln8czb_mc'
        } else {
          mcObj.val = {
            type: level2Types.indexOf(title) + 1
          }
        }
        return mcObj
      }
    },
    methods: {
      handleClick () {
        console.log(this.mcObjCheckDetail)
        const { id, link, query } = this.problem
        // 特殊处理 违规页面的跳转
        if (id === TYPE.ILLEGAL) {
          window.location.href = `/reuse/sc/product/inspection/r/falsePriceIndex?wmPoiId=${this.poiId}`
        } else {
          const params = Object.assign({}, query, { wmPoiId: this.poiId })
          this.$router.push({ path: link, query: params })
        }
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
      width: 86px;
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      text-align: center;
      color: #fff;
      background-color: @primary-color;
      border-radius: 2px;
      cursor: pointer;
    }
  }
</style>
