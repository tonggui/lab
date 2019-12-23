<template>
  <div class="anomaly-card">
    <div class="desc-wrapper">
      <img v-if="picture" :src="picture" class="pic">
      <Icon v-else local="picture" size="22" />
      <div class="title">{{ data.title }}</div>
    </div>
    <div class="sku-wrapper">
      <div v-for="(item, index) in data.skus" class="sku-box" :key="index">
        <div class="spec">{{ item.spec }}</div>
        <div class="sell-count" v-if="anomalyType !== TYPE.UNSALABLE">{{ item.sellCount }}</div>
        <div class="price"></div>
        <div class="stock"></div>
        <div class="tag"></div>
        <div class="oprs"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { PROBLEM_TYPE as TYPE } from '@/views/monitor/constants'

  export default {
    name: 'anomaly-card',
    props: {
      anomalyType: {
        type: Number,
        default: 1101
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        TYPE,
        picture: this.convertToCompatiblePicture(this.data.picture)
      }
    },
    computed: {},
    watch: {},
    methods: {
      /**
       * 转化为兼容模式图片
       * 目前展现层只显示单张主图，所以需要将多图转化为单图显示
       * @param src 标品库返回图片内容
       * @return {string | string}
       */
      convertToCompatiblePicture (src) {
        const sourceMainPicture = (src || '').split(',')[0]
        return sourceMainPicture || ''
      }
    },
    created () {}
  }
</script>

<style lang='less'>
.anomaly-card {}
</style>
