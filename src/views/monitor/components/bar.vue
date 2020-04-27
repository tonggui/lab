<template>
  <div class="info-bar">
    <div class="info-bar-text">{{ problem.title }} <span :class="[problem.count ? 'abnormal' : '']">{{ problem.count }}</span> 个{{ problem.extra }}</div>
    <div v-if="problem.count" class="info-bar-btn" @click="handleClick" v-mc="mcObjCheckDetail">查看详情</div>
  </div>
</template>

<script>
  import { getPoiId } from '@/common/constants'
  // import { PROBLEM_DETAIL as DETAIL } from '../constants'

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
        const bid = this.problem.bid
        return {
          bid,
          option: {
            isLeave: true
          }
        }
      }
    },
    methods: {
      handleClick () {
        console.log(this.mcObjCheckDetail)
        const { link, query } = this.problem
        const params = Object.assign({}, query, { wmPoiId: this.poiId })
        setTimeout(() => {
          this.$router.push({ path: link, query: params })
        }, 50)
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
