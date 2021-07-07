<template>
  <div class="merchant-cube-edit-list">
    <div class="merchant-cube-edit-list-title">
      完善商品信息
      <small>已创建<span class="merchant-cube-edit-list-title-num">{{ createdProductCount }}</span>个商品，剩余<span class="merchant-cube-edit-list-title-num">{{ remainingProductCount }}</span>个商品待创建</small>
    </div>
    <div class="merchant-cube-edit-list-content">
      <ProductEmpty v-if="empty">
        <p slot="description">本次所选商品已全部上架</p>
        <template slot="operation">
          <Button @click="handleGoList">查看店内商品</Button>
          <Button type="primary" @click="handleGoRecommendList">继续上架</Button>
        </template>
      </ProductEmpty>
      <ProductList
        v-else
        class="merchant-cube-edit-list-table"
        :cache-product-default-value="cacheProductDefaultValue"
        :cache-product="cacheProduct"
        :group-list="groupList"
        :maxTagCount="maxTagCount"
        :autoSetting="autoSetting"
        :relInfo="relInfoDesc"
        @rel-modal="handleAutoSettingModal"
        @batch-create="handleBatchCreateConfirm"
        @delete="handleDelete"
        @modify-product="handleModifyProduct"
        @modify-range="handleRangeChange"
        @modify-sku="handleModifySku"
      />
    </div>
  </div>
</template>
<script>
  import ProductList from '../components/product-list'
  import { helper } from '../../../store'
  import { getUniqueId } from '../../../utils'
  import lx from '@/common/lx/lxReport'
  // import { mapModule } from '@/module/module-manage/vue'
  // import { PRODUCT_TAG_COUNT } from '@/module/subModule/product/moduleTypes'
  import RelSample from '@/views/merchant/batch-management/new-batch-rel/components/rel-sample'
  import LocalStorage, { KEYS } from '@/common/local-storage'

  const { mapState, mapActions } = helper('multiCubeEdit')
  const { mapActions: mapRootActions } = helper()

  const REL_INFO = {
    'all': '全部信息',
    'exclude': '除价格、库存的信息',
    'only': '仅关联门店商品，不更新商品信息'
  }

  export default {
    name: 'merchant-cube-edit-list-container',
    data () {
      return {
        relInfo: REL_INFO,
        relModalVisible: false,
        type: 'all',
        createProduct: []
      }
    },
    props: {
      tagGroupProduct: {
        type: Object,
        required: true
      },
      autoFillTag: Boolean
    },
    components: {
      ProductList
    },
    computed: {
      ...mapState({
        createdProductIdList: 'createdProductIdList',
        createdProductCount: 'createdProductCount',
        cacheProduct: 'editProductCache',
        cacheProductDefaultValue: 'editProductDefaultValueCache',
        productInfoMap: 'editProductInfoMap'
      }),
      maxTagCount () {
        // 目前默认支持多分类，之后根据配置来判断
        return 5
      },
      // ...mapModule('product', {
      //   maxTagCount: PRODUCT_TAG_COUNT
      // }),
      // 展示在页面中的都是待创建的商品
      remainingProductCount () {
        return Object.values(this.tagGroupProduct).reduce((prev, { productList }) => {
          return prev + productList.length
        }, 0)
      },
      groupList () {
        const list = []
        const sortedList = Object.entries(this.tagGroupProduct).sort(([key, value], [nextKey, nextValue]) => {
          return value.sequence - nextValue.sequence
        })
        sortedList.forEach(([key, value]) => {
          const { productList } = value
          if (productList.length > 0) {
            // 标品在前面，非标品在后
            list.push(({
              id: key,
              ...value,
              productList: productList.sort((prev, next) => {
                if (prev.isSp === next.isSp) {
                  return 0
                }
                return prev.isSp ? -1 : 1
              }).map((product) => {
                const id = getUniqueId(product)
                return {
                  tabId: product.tabId, // tabId 特殊处理，从之前缓存中匹配
                  ...(this.productInfoMap[id] || product),
                  tagList: this.autoFillTag ? product.tagList : [], // 默认分类不自动填充
                  addedPoiIds: product.addedPoiIds || this.productInfoMap[id].addedPoiIds,
                  relatedPoiIds: product.relatedPoiIds || this.productInfoMap[id].relatedPoiIds,
                  totalPoiIds: product.totalPoiIds || this.productInfoMap[id].totalPoiIds,
                  productLabelIdList: product.productLabelIdList || this.productInfoMap[id].productLabelIdList
                }
              })
            }))
          }
        })
        return list
      },
      empty () {
        return !this.groupList || this.groupList.length <= 0
      },
      autoSetting () {
        return LocalStorage[KEYS.MERCHANT_CUBE_RANGE_AUTO_SETTING]
      },
      relInfoDesc () {
        return REL_INFO[this.type]
      }
    },
    methods: {
      ...mapRootActions({
        handleRangeChange: 'poiRelatingRangeChange'
      }),
      ...mapActions({
        handleModifyProduct: 'modifyProduct',
        handleModifySku: 'modifySku',
        resetCreatedProductCount: 'resetCreatedProductCount',
        resetCreatedProductIdList: 'resetCreatedProductIdList',
        // handleSingleCreate: 'singleCreate',
        handleBatchCreate: 'batchCreate',
        destroy: 'destroy'
      }),
      handleRequest (productList) {
        const params = {}
        if (this.type === 'all') {
          params.syncType = 1
        } else if (this.type === 'exclude') {
          params.syncType = 1
          params.excludeSyncContent = [8, 9]
        } else {
          params.syncType = 10
        }
        params.productList = productList
        return this.handleBatchCreate(params)
      },
      handleAutoSettingModal (resolve, reject) {
        let autoSetting = LocalStorage[KEYS.MERCHANT_CUBE_RANGE_AUTO_SETTING]
        this.$Modal.open({
          className: 'merchant-cube-edit-setting-modal',
          width: 800,
          closable: false,
          maskClosable: false,
          centerLayout: true,
          title: '请确认关联后商品信息更新范围',
          render: () => {
            return <div>
              <RadioGroup value={this.type} vOn:on-change={(val) => { this.type = val }}>
                <Radio label="all">
                  <span>全部信息</span>
                </Radio>
                <Radio label="exclude">
                  <span>除价格、库存的信息</span>
                </Radio>
                <Radio label="only">
                  <span>仅关联门店商品，不更新商品信息</span>
                </Radio>
              </RadioGroup>
              <RelSample type={this.type} class="sample"/>
              <Checkbox
                value={autoSetting}
                vOn:on-change={(val) => { autoSetting = val }}>开启默认设置</Checkbox>
            </div>
          },
          onOk: () => {
            LocalStorage[KEYS.MERCHANT_CUBE_RANGE_AUTO_SETTING] = autoSetting
            if (resolve) resolve()
          },
          onCancel: () => {
            if (reject) reject(new Error('取消'))
          }
        })
      },
      handleModalVisible (visble) {
        return new Promise((resolve, reject) => {
          if (!LocalStorage[KEYS.MERCHANT_CUBE_RANGE_AUTO_SETTING]) {
            this.handleAutoSettingModal(resolve, reject)
          } else {
            resolve()
          }
        })
      },
      async handleBatchCreateConfirm (productList) {
        const hasAddedPoiIds = productList.some(product => product.addedPoiIds && product.addedPoiIds.length)

        if (hasAddedPoiIds) await this.handleModalVisible()
        return this.handleRequest(productList)
      },
      handleDelete (productList) {
        this.$emit('delete', productList)
      },
      handleGoList () {
        this.$router.push({
          path: '/product/list',
          query: this.$route.query
        })
      },
      handleGoRecommendList () {
        this.$router.back()
      },
      leaveReport () {
        try {
          lx.mv({
            cid: 'c_shangou_online_e_m17be667',
            bid: 'b_shangou_online_e_hn5n5kq9_mv',
            val: {
              viewtime: (+new Date() - this.createTime) / 1000,
              spu_num: this.createdProductCount,
              list: this.createdProductIdList,
              source_id: 1,
              page_source: window.page_source || ''
            }
          }, 'productCube')
        } catch (err) {
          console.log(err)
        }
      }
    },
    mounted () {
      lx.mv({
        bid: 'b_shangou_online_e_dby4v8ve_mv',
        val: { spu_num: this.remainingProductCount } }, 'productCube')
      this.createTime = +new Date()
      window.addEventListener('beforeunload', () => {
        this.leaveReport()
      })
    },
    beforeDestroy () {
      this.leaveReport()
      this.resetCreatedProductCount()
      this.resetCreatedProductIdList()
      this.destroy()
    }
  }
</script>
<style lang="less">
  .merchant-cube-edit-list {
    background: @component-bg;
    display: flex;
    flex-direction: column;
    &-title {
      padding: 24px;
      font-size: 18px;
      color: #36394D;
      font-weight: 600;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      &-num {
        margin-left: 4px;
        margin-right: 4px;
      }
      small {
        display: inline-block;
        font-size: @font-size-base;
        padding-left: 8px;
        margin-left: 24px;
        border-left: 1px solid #D8D8D8;
        line-height: 14px;
      }
    }
    &-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-footer {
      height: 72px;
      padding: 16px 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.08);
      .create-btn {
        height: 40px;
        line-height: 40px;
        width: 96px;
        text-align: center;
        font-size: 14px;
        color: #222222;
        cursor: pointer;
        font-weight: 500;
        font-family: PingFangSC-Medium;
        margin-left: 24px;
        background-image: linear-gradient(-45deg, #FFC34D 0%, #FFE14D 100%);
        border-radius: 25px;
      }
    }
    &-table {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .quick-edit-product-table-container {
        flex: 1;
      }
    }
  }
  .merchant-cube-edit-setting-modal {
    .header {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }
    .sample {
      margin: 10px 0;
    }
  }
</style>
