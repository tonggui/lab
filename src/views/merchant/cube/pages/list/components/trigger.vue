<template>
  <div class="trigger-display">
    <div :class="{'trigger-display-content': true, 'is-disabled': disabled }" @click="$emit('show')">
      <div v-if="size" class="trigger-display-text">
        <span>{{displayContent}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { helper } from '@/views/merchant/cube/store'

  const { mapState } = helper()
  export default {
    name: 'trigger-display',
    props: {
      allowClear: Boolean,
      size: Number,
      product: {
        type: Object,
        required: true
      },
      label: String,
      disabled: Boolean
    },
    computed: {
      ...mapState({
        rowScopeList: state => state.multiCubeList.rowScopeList,
        scopeList: state => state.multiCubeList.scopeList,
        classifySelectedProducts: 'classifySelectedProducts'
      }),
      classifySelectedProductsInfo () {
        return Object.values(this.classifySelectedProducts)
      },
      displayContent () {
        return this.getScopeTips()
      }
    },
    methods: {
      getCitiesList (pois) {
        const cityIds = new Map()
        let tmp = {}
        pois.forEach(item => {
          tmp = this.rowScopeList.find(i => i.id === item)
          if (!cityIds.has(tmp.cityName)) {
            cityIds.set(tmp.cityName, [].push(item))
          } else {
            let arr = Array.isArray(cityIds.get(tmp.cityName)) ? cityIds.get(tmp.cityName) : []
            arr.push(item)
            cityIds.set(tmp.cityName, arr)
          }
        })
        return cityIds
      },
      getScopeTips () {
        let content = ''
        let pois = this.product['relatingPoiIds'].concat(this.product['relatedPoiIds'])
        const alreadyCities = this.getCitiesList(pois)
        const totalCities = this.getCitiesList(this.product.totalPoiIds)
        if (alreadyCities.size === totalCities.size && pois.length === this.product.totalPoiIds.length) {
          content = '全国所有门店'
        } else {
          let cityCount = 0
          let poiCount = 0
          let cityName = ''
          for (let key of alreadyCities.keys()) {
            cityName += cityCount > 0 ? '、' : ''
            if (cityCount <= 3) {
              cityName += key
              cityCount++
              poiCount += Array.isArray(alreadyCities.get(key)) ? alreadyCities.get(key).length : 1
            } else break
          }
          if (alreadyCities.size === 1) {
            if (poiCount === 1) {
              let poiName = this.rowScopeList.find(i => i.id === this.product.id).name
              content = `${poiName}`
            } else content = `${cityName}${poiCount}个门店`
          } else content = `${cityName}等${cityCount}个城市共${poiCount}个门店`
        }
        return content
      }
    }
  }
</script>
<style lang="less" scoped>
  .trigger-display {
    display: flex;
    align-items: center;
    &-label {
      width: 60px;
    }
    &-content {
      width: 100px;
      border: 1px solid @border-color-base;
      border-radius: @border-radius-base;
      position: relative;
      line-height: 36px;
      cursor: pointer;
      background: transparent;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 8px;
      a {
        font-size: @font-size-small;
      }
      &.is-disabled {
        pointer-events: none;
        cursor: not-allowed;
        background:  @disabled-bg;
      }
    }
    strong {
      color:  @link-color;
      margin: 0 4px;
    }
    &-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    &-empty {
      color: #D8D8D8;
    }
  }
</style>
