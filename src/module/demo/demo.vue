<template>
  <div>
    <!-- <p>门店异常商品数目: {{ text1 }}</p>
    <p>图文详情开关: {{ text2 }}</p>
    <p>多分类个数: {{ text3 }}</p>
    <p>商品视频: {{ text4 }}</p>
    <p>购物袋设置: {{ text5 }}</p> -->
    <p>中间态商品: {{ text6 }}</p>
    <!-- <p>风控: {{ text7 }}</p>
    <p>未关联商品数: {{ text8 }}</p>
    <p>分类模版入口: {{ text9 }}</p>
    <p>热卖推荐: {{ text10 }}</p>
    <p>门店异常: {{ text11 }}</p> -->
    <Select :value="select" @on-change="handleChange">
      <Option v-for="(index, i) in 10" :key="index" :value="i">
        选项：{{ index }}
      </Option>
    </Select>
    <div>
      {{ JSON.stringify(moduleMap) }}
    </div>
    <router-link :to="{ name: 'productList', query: { wmPoiId: $route.query.wmPoiId } }">跳转</router-link>
  </div>
</template>
<script>
  import { mapModule } from '@/module/module-manage/vue'
  import { POI_HOT_RECOMMEND } from '@/module/moduleTypes'
  import moduleControl from '@/module'
  import source from './source'
  import module, { TYPES } from './module'

  moduleControl.registerModule('test', {
    source,
    module
  })

  export default {
    name: 'cmm-demo',
    data () {
      return { select: '' }
    },
    computed: {
      ...mapModule({ text6: POI_HOT_RECOMMEND }),
      ...mapModule('test', TYPES),
      moduleMap () {
        return Object.keys(TYPES).reduce((prev, key) => {
          prev[key] = this[key]
          return prev
        }, {})
      }
    },
    methods: {
      handleChange (v) {
        this.select = v
        moduleControl.setContext('test', { category: this.select })
        setTimeout(() => {
          console.log('handleChange:', moduleControl)
        }, 1000)
      }
    }
  }
</script>
<style lang="less" scoped>
  .text {
    color: red
  }
</style>
