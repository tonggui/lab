<template>
  <div class="info-bar">
    <div class="info-bar-text">{{ problem.title }} <span :class="[problem.count ? 'abnormal' : '']">{{ problem.count }}</span> 个</div>
    <div v-if="problem.count" class="info-bar-btn" @click="handleClick" v-mc="mcObjCheckDetail">查看详情</div>
  </div>
</template>

<script>
  import { getPoiId } from '@/common/constants'
  import { PROBLEM_DETAIL as DETAIL } from '../constants'

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
        const level2Types = Object.entries(DETAIL).filter(d => d[1].level === 2).map(d => d[1].id)
        return {
          bid: 'b_g887j8ls',
          val: {
            type: level2Types.indexOf(this.text) + 1
          },
          option: {
            isLeave: true
          }
        }
      }
    },
    methods: {
      handleClick () {
        const { link, query } = this.problem
        const params = Object.assign({}, query, { wmPoiId: this.poiId })
        this.$router.push({ path: link, query: params })
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
