<template>
  <div class="anomaly-list">
    <div class="list-header">
      <span class="desc">商品信息</span>
      <div class="sku-header">
        <span class="header-spec">规格名称</span>
        <span class="header-sell" v-if="anomalyType !== TYPE.UNSALABLE">销量</span>
        <span class="header-price">价格</span>
        <span class="header-stock">库存</span>
        <span class="header-tag" v-if="anomalyType === TYPE.UNSALABLE">店内分类</span>
        <span class="header-opr">优化操作</span>
      </div>
    </div>
    <div class="anomaly-list-container">
      <div v-if="list.length && !loading" class="list-and-pagination">
        <AnomalyCard v-for="(data, index) in list"
                     :key="index"
                     :anomaly-type="anomalyType"
                     :tag-list="tagList"
                     :data="data"
                     :poi-id="poiId">
        </AnomalyCard>
        <div class="page-container">
          <Pagination v-if="list.length" :pagination="pagination" @on-change="handlePageChange" />
        </div>
      </div>
      <div v-if="loading" class="anomaly-list-loading">
        <Loading size="large" class="anomaly-list-loading-icon" />
      </div>
    </div>
  </div>
</template>

<script>
  import Loading from '@/components/loading/flash-loading'
  import AnomalyCard from './anomaly-card'
  import Pagination from '@/components/pagination'
  import { fetchGetTagList } from '@/data/repos/category'
  import { fetchGetAnomalyList } from '@/data/repos/product'
  import { PROBLEM_TYPE as TYPE } from '@/views/monitor/constants'

  export default {
    name: 'anomaly-list',
    components: {
      Loading,
      AnomalyCard,
      Pagination
    },
    props: {
      anomalyType: {
        type: Number,
        default: 1101
      }
    },
    data () {
      return {
        TYPE,
        loading: false,
        tagList: [],
        list: [],
        pagination: {
          pageSize: 20,
          current: 1,
          total: 0
        }
      }
    },
    computed: {
      poiId () {
        return this.$route.query.wmPoiId
      }
    },
    methods: {
      // 获取店内分类列表
      getTagList () {
        fetchGetTagList().then(data => {
          this.tagList = data
        }).catch(err => {
          this.$Message.error(err.message || err)
        })
      },

      // 获取异常列表
      async getAnomalyList (anomalyType = this.anomalyType) {
        try {
          this.loading = true
          const type = anomalyType === TYPE.PRICE_ANOMALY ? 1 : (anomalyType === TYPE.STOCK_ANOMALY ? 2 : 3)
          await fetchGetAnomalyList(this.poiId, type, this.pagination)
            .then(data => {
              this.list = data.list
              this.pagination.total = data.page.totalCount
            })
            .catch(err => {
              this.$Message.error(err.message || err)
            })
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      },

      handlePageChange (page) {
        this.pagination = page
        this.getAnomalyList()
      }
    },
    created () {
      if (this.anomalyType === TYPE.UNSALABLE) {
        this.getTagList()
      }
      this.getAnomalyList()
    }
  }
</script>

<style lang='less'>
  .anomaly-list {
    font-size: 12px;
    background-color: #fff;
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 46px;
      padding-right: 20px;
      border-bottom: 1px dashed @color-gray5;
      .desc {
        padding-left: 30px;
        flex-basis: 24%;
      }
      .sku-header {
        flex-basis: 76%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          text-align: center;
        }
        span.header-spec, span.header-sell {
          flex-basis: 10%;
        }
        span.header-price, span.header-stock {
          flex-basis: 20%;
        }
        span.header-tag {
          flex-basis: 28%;
        }
        span:last-of-type {
          flex-basis: 18%;
        }
      }
    }
    .anomaly-list-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 300px;
      background-color: rgba(255, 255, 255, .9);
    }
    .page-container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 20px 30px 0;
    }
    .anomaly-list-loading {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      text-align: center;
      &-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
</style>
