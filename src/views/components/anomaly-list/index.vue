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
</template>

<script>
  import AnomalyCard from './anomaly-card'
  import Pagination from '@/components/pagination'
  import { getPoiId } from '@/common/constants'
  import { fetchGetTagList } from '@/data/repos/category'
  import { fetchGetAnomalyList } from '@/data/repos/product'
  import { PROBLEM_TYPE as TYPE } from '@/views/monitor/constants'

  export default {
    name: 'anomaly-list',
    components: {
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
        return getPoiId()
      }
    },
    watch: {},
    methods: {
      // 获取店内分类列表
      getTagList () {
        fetchGetTagList().then(data => {
          this.tagList = data.map(t => {
            const tag = {
              value: t.id,
              label: t.name,
              children: []
            }
            if (t.children.length) {
              t.children.forEach(c => {
                tag.children.push({
                  value: c.id,
                  label: c.name
                })
              })
            }
            return tag
          })
          // this.tagList.push(...data)
          // this.tagList.forEach(t => {
          //   t.value = t.id
          //   t.label = t.name
          //   if (t.children.length) {
          //     t.children.forEach(c => {
          //       c.value = c.id
          //       c.label = c.name
          //     })
          //   }
          // })
        }).catch(err => {
          this.$Message.error(err.message || err)
        })
      },

      // 获取异常列表
      getAnomalyList (anomalyType = this.anomalyType) {
        const type = anomalyType === TYPE.PRICE_ANOMALY ? 1 : (anomalyType === TYPE.STOCK_ANOMALY ? 2 : 3)
        fetchGetAnomalyList(this.poiId, type, this.pagination)
          .then(data => {
            this.list = data.list
            this.pagination.total = data.page.totalCount
          }).catch(err => {
            this.$Message.error(err.message || err)
          })
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
    .page-container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 20px 30px 0;
    }
  }
</style>
