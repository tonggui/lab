<template>
  <div class="trigger-display">
    <div :class="{'trigger-display-content': true, 'is-disabled': disabled }" @click="$emit('show')">
      <div v-if="size" class="trigger-display-text">
        <span>{{displayContent}}</span>
      </div>
      <div v-else class="trigger-display-empty">
        请选择关联门店
      </div>
    </div>
  </div>
</template>
<script>
  import { get } from 'lodash'
  import { helper } from '@/views/merchant/cube/store'

  const { mapState } = helper()
  export default {
    name: 'trigger-display',
    props: {
      allowClear: Boolean,
      productId: Number,
      totalPoiIds: Array,
      relatedPoiIds: Array,
      addedPoiIds: Array,
      label: String,
      disabled: Boolean
    },
    data () {
      return {
        displayContent: ''
      }
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
      size () {
        return this.relatedPoiIds.length + this.addedPoiIds.length
      }
    },
    watch: {
      addedPoiIds (v) {
        if (v) {
          this.getScopeTips()
        }
      }
    },
    mounted () {
      this.getScopeTips()
    },
    methods: {
      getCitiesList (poiIds) {
        const cityIds = new Map()
        let tmp = {}
        poiIds.forEach(poiId => {
          tmp = this.rowScopeList.find(i => i.id === poiId)
          if (tmp && tmp.cityName) {
            const ids = cityIds.get(tmp.cityName) || []
            ids.push(poiId)
            cityIds.set(tmp.cityName, ids)
            // if (!cityIds.has(tmp.cityName)) {
            //   cityIds.set(tmp.cityName, poiId)
            // } else {
            //   let arr = Array.isArray(cityIds.get(tmp.cityName)) ? cityIds.get(tmp.cityName) : []
            //   arr.push(poiId)
            //   cityIds.set(tmp.cityName, arr)
            // }
          }
        })
        return cityIds
      },
      getScopeTips () {
        const poiIds = this.addedPoiIds.concat(this.relatedPoiIds)
        const alreadyCities = this.getCitiesList(poiIds)
        if (alreadyCities.size >= this.scopeList.length - 1 && poiIds.length >= this.rowScopeList.length) {
          this.displayContent = '全国所有门店'
        } else {
          let cityCount = 0
          let poiCount = 0
          let cityName = ''
          let firstPoiId
          for (let key of alreadyCities.keys()) {
            if (cityCount <= 3) {
              cityName += cityCount > 0 ? '、' : ''
              cityName += key
            }
            cityCount++
            poiCount += Array.isArray(alreadyCities.get(key)) ? alreadyCities.get(key).length : 1
          }
          if (alreadyCities.size === 1) {
            if (poiCount === 1) {
              for (let key of alreadyCities.keys()) {
                firstPoiId = alreadyCities.get(key)
                firstPoiId = Array.isArray(firstPoiId) && firstPoiId.length ? firstPoiId[0] : firstPoiId
                break
              }
              const poiName = get(this.rowScopeList.find(ele => ele.id === firstPoiId), 'name', '')
              this.displayContent = `${poiName}`
            } else this.displayContent = `${cityName}${poiCount}个门店`
          } else this.displayContent = `${cityName}等${cityCount}个城市共${poiCount}个门店`
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .trigger-display {
    display: flex;
    align-items: center;
    justify-content: center;
    &-label {
      width: 60px;
    }
    &-content {
      width: 100px;
      //border: 1px solid @border-color-base;
      //border-radius: @border-radius-base;
      position: relative;
      font-size: 14px;
      color: #FF6A00;
      line-height: 36px;
      cursor: pointer;
      background: transparent;
      overflow: hidden;
      display: flex;
      justify-content: center;
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
      justify-content: center;
      width: 100%;
    }
    &-empty {
      color: #D8D8D8;
    }
  }
</style>
