<template>
  <ProductListFixedPage class="product-table-list-container">
    <Loading v-if="loading" />
    <div v-if="empty" class="empty" slot="content">
      <h2>此分类暂无待创建商品</h2>
      <p>请切换至其他分类继续创建～</p>
    </div>
    <template v-else>
      <Header slot="header" class="product-table-list-header">
        <div slot="left">
          <Checkbox
            :disabled="selectAllDisable"
            v-bind="selectAllStatus"
            :key="+new Date()"
            @on-change="handleSelectAll"
            class="product-table-list-op-checkbox"
          >
            <span style="margin-left: 12px">全选本页</span>
          </Checkbox>
        </div>
        <div slot="right">
          <a
            class="visible-switch"
            @click="handleExistSwitch"
          >{{ showExist ? '隐藏' : '显示' }}{{displayTip}}门店已存在商品</a>
      </div>
      </Header>
      <div slot="content" class="content">
        <DoubleColumnsTableList
          :dataSource="showDataSource"
          :disabled="maxSelected <= 0"
          :selectedIdList="selectedIdList"
          :findDataIndex="findDataIndex"
          :findDataRealIndex="findDataRealIndex"
          :isItemNotSeletable="isItemNotSeletable"
          @on-select="handleSelectChange"
          @on-de-select="handleDeSelect"
          @on-tap-disabled="handleDisabled"
          class="list"
        />
      </div>
      <Pagination :pagination="pagination" slot="footer" class="pagination" @on-change="handlePageChange" />
    </template>
  </ProductListFixedPage>
</template>

<script>
  import DoubleColumnsTableList from './double-columns-table-list'
  import { getProductQualificationStatus } from '@/views/product-recommend/utils'
  import { handleToast } from '@/views/product-recommend/pages/product-recommend-list/components/qualification-tip'
  import Pagination from '@/components/pagination' // fix bootes page组件
  import Header from '@/components/header-layout'
  import ProductListFixedPage from '@/views/components/layout/product-list-fixed-page'
  import { helper } from '@/views/merchant/cube/store'
  const { mapState } = helper()
  export default {
    name: 'product-table-list',
    props: {
      selectedIdList: Array,
      maxSelect: {
        type: Number,
        default: 100
      },
      loading: Boolean,
      pagination: Object,
      dataSource: Array
    },
    data () {
      return {
        showExist: true, // 已隐藏商品
        displayTip: '',
        displayContent: ''
      }
    },
    computed: {
      ...mapState({
        rowScopeList: state => state.multiCubeList.rowScopeList,
        scopeList: state => state.multiCubeList.scopeList,
        currentScope: state => state.multiCubeList.currentScope,
        classifySelectedProducts: 'classifySelectedProducts'
      }),
      classifySelectedProductsInfo () {
        return Object.values(this.classifySelectedProducts)
      },
      displayContentScope () {
        if (this.currentScope.poiId !== -1 || this.currentScope.poiId !== '') {
          return '选择'
        } else if (this.currentScope.cityId !== '' || this.currentScope.cityId !== -1) {
          return '选择城市下所有'
        } else return '全国所有'
      },
      showDataSource () {
        if (this.showExist) {
          return this.dataSource
        }
        return this.dataSource.filter(item => !(item.isHqExist))
      },
      isAllUnselectable () {
        return this.dataSource.every(item => this.isItemNotSeletable(item))
      },
      selectAllStatus () {
        if (this.loading || this.isAllUnselectable) {
          return { value: false, indeterminate: false }
        }
        let value = true
        let indeterminate = false
        let selectedIds = this.selectedIdList.map(item => item.__id__)
        this.dataSource.forEach(item => {
          if (this.isItemNotSeletable(item)) {
            return
          }
          const include = selectedIds.includes(item.__id__)
          if (include) {
            indeterminate = true
          } else {
            value = false
          }
        })
        return { value, indeterminate: !value && indeterminate }
      },
      maxSelected () {
        return this.maxSelect - this.selectedIdList.length
      },
      selectAllDisable () {
        if (this.isAllUnselectable) {
          return true
        }
        const { value, indeterminate } = this.selectAllStatus
        return this.maxSelected <= 0 && !value && !indeterminate
      },
      empty () {
        return !this.loading && this.dataSource.length === 0
      }
    },
    watch: {
      'currentScope': {
        immediate: true,
        handler (v) {
          if (v.cityId === -1 || v.cityId === '') {
            this.displayTip = '全国'
          } else if (v.poiId === -1 || v.poiId === '') {
            let cityName = this.rowScopeList && this.rowScopeList.find(item => item.cityId === v.cityId).cityName
            this.displayTip = cityName + '所有'
          } else if (v.poiId !== -1) {
            this.displayTip = ''
          }
        }
      }
    },
    components: {
      DoubleColumnsTableList,
      Header,
      Pagination,
      ProductListFixedPage
    },
    methods: {
      handleExistSwitch () {
        this.showExist = !this.showExist
      },
      findDataIndex (__id__) {
        return this.dataSource.findIndex(item => item.__id__ === __id__)
      },
      findDataRealIndex (__id__) {
        const { pageSize, current } = this.pagination
        return (pageSize * (current - 1)) + this.showDataSource.findIndex(item => item.__id__ === __id__)
      },
      isItemNotSeletable (item) {
        // 不可勾选逻辑
        return item.relatedPoiIds.length === item.totalPoiIds.length
      },
      handleInvalidProduct (status, tips) {
        handleToast.call(this, status, tips)
      },
      handlePageChange (pagination) {
        this.showExist = true
        this.$emit('on-page-change', pagination)
      },
      handleDisabled (item) {
        if (getProductQualificationStatus(item)) {
          this.handleInvalidProduct(getProductQualificationStatus(item), item.qualificationTip)
        } else if (!item.isHqExist) {
          this.handleExceedMax()
        }
      },
      handleExceedMax () {
        if (this.maxSelected <= 0) {
          this.$Message.info({
            content: `单次最多可选${this.maxSelect}个, 请先创建已选商品`
          })
          return true
        }
        return false
      },
      handleSelectAll (selection) {
        if (selection && this.handleExceedMax()) {
          return
        }
        const list = this.dataSource.filter(item => {
          if (this.isItemNotSeletable(item)) {
            return false
          }
          const include = this.selectedIdList.some(ele => ele.__id__ === item.__id__)
          return selection ? !include : include
        })
        if (selection) {
          this.handleSelectChange(list)
        } else {
          this.handleDeSelect(list)
        }
      },
      handleSelectChange (items) {
        if (this.handleExceedMax()) {
          return
        }
        if (this.maxSelected < items.length) {
          this.$Message.info({
            content: `单次选择已达上限 ${this.maxSelect}, 仅选中本页前 ${this.maxSelected} 个商品`
          })
          items = items.slice(0, this.maxSelected)
        }
        if (this.classifySelectedProductsInfo.length > 0) {
          items.forEach(item => {
            this.displayTips(item, true)
          })
        }
        this.$emit('on-select', items)
      },
      handleDeSelect (deSelectItem) {
        this.$emit('on-de-select', deSelectItem)
        this.displayTips(deSelectItem, false)
      },
      displayTips (item, type) {
        // console.log('===o')
        let target = {}
        this.classifySelectedProductsInfo.forEach(({ productList }) => {
          target = productList.find(({ __id__ }) => {
            return item.id === __id__
          })
        })
        // console.log(target)
        // console.log(this.rowScopeList)
        if (target) {
          // console.log('=====')
          let pois = type === true ? target['addedPoiIds'].concat(target['relatedPoiIds']) : target['addedPoiIds']
          const alreadyCities = this.getCitiesList(pois)
          const totalCities = this.getCitiesList(target.totalPoiIds)
          if (alreadyCities.size === totalCities.size && pois.length === item.totalPoiIds.length && type === true) {
            this.displayContent = '全国所有门店'
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
                let poiName = this.rowScopeList.find(i => i.id === item.id).name
                this.displayContent = `${poiName}`
              } else this.displayContent = `${cityName}${poiCount}个门店`
            } else this.displayContent = `${cityName}等${cityCount}个城市共${poiCount}个门店`
          }
          let selContent = `已选列表存在该商品，该商品关联门店范围将修改为${this.displayContent}，且商品关联门店自动变更为${this.displayContentScope}门店`
          let deSelContent = `由于该商品在${this.displayContent}待创建，已选列表仍然保留该商品`
          this.$Message.info({
            content: type === true ? selContent : deSelContent
          })
        }
      },
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
      }
    }
  }
</script>

<style lang="less" scoped>
.product-table-list-container {
  position: relative;
  height: 100%;
  /deep/ .product-list-fixed-page-layout-content {
    height: calc(100% - 121px);
  }
  .product-table-list {
    &-header {
      height: 52px;
      padding: 0 20px 0 32px;
      position: sticky;
      top: 0;
      z-index: 2;
      flex-shrink: 0;
      .product-table-list-op-checkbox {
        font-size: 0;
        /deep/ .boo-checkbox-inner {
          vertical-align: middle;
        }
        > span {
          font-family: PingFangSC-Regular;
          font-size: @font-size-base;
          display: inline-block;
          vertical-align: middle;
          margin-right: 1px;
        }
      }
      .visible-switch {
        font-size: 14px;
        color: #676A78;
        line-height: 14px;
        text-decoration: underline;
      }
    }
  }
  .pagination {
    flex-shrink: 0;
    text-align: right;
    padding: 16px 20px;
    border-top: 1px solid #E9EAF2;
    width: 100%;
  }
  .empty {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    > h2 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #36394d;
      text-align: center;
      line-height: 16px;
      margin-bottom: 8px;
    }
    > p {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #999999;
      text-align: center;
      line-height: 14px;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: auto;
  }
}
</style>
