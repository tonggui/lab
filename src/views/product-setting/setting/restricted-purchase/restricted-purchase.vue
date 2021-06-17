<template>
  <div class="restricted-purchase">
    <Breadcrumb separator=">" class="breadcrumb">
      <BreadcrumbItem :to="{ name: 'productList', query: $route.query }">商品管理</BreadcrumbItem>
      <BreadcrumbItem>商品限购配置</BreadcrumbItem>
    </Breadcrumb>
    <Header />
    <div class="body">
      <FormItemLayout>
        <PurchaseLimitation @change="handleChange" :value="limitRule"/>
      </FormItemLayout>
      <FormCard title="选择商品" tip="勾选配置应用生效的商品">
        <ProductList
          @handleSelectCancel="handleSelectCancel"
          @handleSelect="handleSelect"
          :productCount="productCount"
        />
      </FormCard>
      <StickyFooter
        :gap="0"
        :btnTexts="['确认', '取消']"
        :btnProps="[{ loading: submitting }]"
        :bid="['', '']"
        @on-click="handleSubmit"
      />
    </div>
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import FormItemLayout from '@/views/components/product-form/form-item-layout'
  import Header from './components/header'
  import FormCard from '@/views/components/product-form/form-card'
  import ProductList from './container/product-list'
  import invalidImg from '@/assets/invalid.png'
  import StickyFooter from '@/components/sticky-footer'
  import PurchaseLimitation from './components/purchase-limitation'
  import { getLimitRules, saveLimitRule, getRuleRelProduct } from '@/data/api/setting'
  import { getPoiId, getMerchantId } from '@/common/constants'
  import { get, union, indexOf, pull } from 'lodash'
  const { mapState, mapActions, mapMutations } = createNamespacedHelpers('restricted-purchase')

  export default {
    name: 'restricted-purchase',
    components: {
      Header,
      PurchaseLimitation,
      StickyFooter,
      ProductList,
      FormCard,
      FormItemLayout
    },
    data () {
      let limitRule = {
        range: ['', ''],
        max: 0,
        rule: 0
      }
      if (!getPoiId()) {
        limitRule.multiPoi = false
      }
      return {
        img: invalidImg,
        limitRule,
        tagStats: [],
        productCount: 0,
        oldTagStatsMap: {}
      }
    },
    computed: {
      ...mapState({
        status: 'status',
        loading: 'loading',
        error: 'error',
        submitting: 'submitting',
        productMap: 'productMap'
      })
    },
    methods: {
      ...mapActions({
        submit: 'submit',
        getData: 'getData'
        // getRuleRelProduct: 'getRuleRelProduct'
      }),
      ...mapMutations({
        handleStatusChange: 'setStatus',
        destory: 'destory'
      }),
      goToList () {
        this.$router.push({
          path: '/merchant/product/setting',
          query: this.$route.query
        })
      },
      handleSelect (product) {
        this.productCount++
        if (this.productCount > 100) {
          this.$Modal.confirm({
            title: '提示',
            content: `选择上限100个,已选${this.productCount}个商品`,
            okText: '我知道了',
            cancel: '取消'
          })
        }
      },
      handleSelectCancel (product) {
        product.tagList && product.tagList.map(item => {
          const includes = this.oldTagStatsMap[item.id]
          if (includes && includes.length && indexOf(includes, product.id) >= 0) {
            pull(this.oldTagStatsMap[item.id], product.id)
          }
        })
        this.productCount--
      },
      handleChange (data) {
        this.limitRule = data
      },
      getFormatTime (time) {
        if (!time) return ''
        return time.split('-').join('')
      },
      async handleSubmit (index) {
        if (index === 1) {
          this.goToList()
        } else if (index === 0) {
          if (!this.limitRule.range[0]) {
            this.$Message.error('请填写限购周期')
            return
          }
          if (!this.limitRule.max) {
            this.$Message.error('请填写单个买家购买规则')
            return
          }
          if (this.productCount > 100) {
            this.$Modal.confirm({
              title: '提示',
              content: `选择上限100个,已选${this.productCount}个商品`,
              okText: '我知道了',
              cancel: '取消'
            })
            return
          }
          const merchantId = getMerchantId() || 0
          let oldTagStatsMap = this.oldTagStatsMap
          const tagStats = Object.entries(this.productMap).reduce((prev, [key, value]) => {
            const node = {
              tagId: key,
              includes: value.list
            }

            // 全选 但是 exclude 小于 total 表示有选中的
            if (value.checked && value.list.length < value.total) {
              if (oldTagStatsMap[key] && oldTagStatsMap[key].length) {
                node.includes = union(oldTagStatsMap[key], value.list)
                oldTagStatsMap[key] = undefined
              }
              prev.push(node)
            } else if (!value.checked && value.list.length > 0) { // 非全选 但是 include有值，则表示有选中的
              if (oldTagStatsMap[key] && oldTagStatsMap[key].length) {
                node.includes = union(oldTagStatsMap[key], value.list)
                oldTagStatsMap[key] = undefined
              }
              prev.push(node)
            }
            // 否则 此分类不需要处理
            return prev
          }, [])

          for (let key in oldTagStatsMap) {
            if (oldTagStatsMap[key] && oldTagStatsMap[key].length) {
              tagStats.push({
                tagId: key,
                includes: oldTagStatsMap[key]
              })
            }
          }

          let res = await saveLimitRule(
            getPoiId(),
            merchantId,
            JSON.stringify({
              ruleId: this.limitRule.ruleId,
              type: this.limitRule.rule === 0 ? 2 : 1,
              multiPoi: this.limitRule.multiPoi,
              frequency: this.limitRule.rule,
              count: this.limitRule.max,
              begin: this.getFormatTime(this.limitRule.range[0]),
              end: this.getFormatTime(this.limitRule.range[1])
            }),
            JSON.stringify(tagStats)
          )
          if (res.code !== 1) {
            this.$Modal.success({
              title: '提示',
              content: '保存限购规则成功',
              okText: '返回配置管理',
              onOk: () => {
                this.$router.push({
                  path: '/merchant/product/setting',
                  query: {
                    ...this.$route.query
                  }
                })
              }
            })
          }
        }
      }
    },
    async mounted () {
      this.getData()
      const merchantId = getMerchantId() || 0
      const routeRuleId = get(this.$route.query, 'ruleId')
      if (routeRuleId) {
        let res = await getRuleRelProduct(routeRuleId, getPoiId(), merchantId)
        let oldTagStats = (res && res.tagStats) || []
        let oldTagStatsMap = {}
        oldTagStats.map(item => {
          oldTagStatsMap[item.tagId] = item.includes
          if (item.includes && item.includes.length) {
            this.productCount += item.includes.length
          }
        })
        this.oldTagStatsMap = oldTagStatsMap
        let data = await getLimitRules(getPoiId(), merchantId)
        if (data && data.limitRuleVoList) {
          for (let i = 0; i < data.limitRuleVoList.length; i++) {
            const ruleId = get(data.limitRuleVoList[i], 'limitRule.ruleId')
            if (ruleId + '' === routeRuleId) {
              const limitRule = data.limitRuleVoList[i].limitRule
              this.limitRule = {
                range: [limitRule.begin, limitRule.end],
                max: limitRule.count,
                rule: limitRule.frequency,
                multiPoi: limitRule.multiPoi,
                ruleId: limitRule.ruleId
              }
              break
            }
          }
        }
      }
    },
    beforeDestroy () {
      this.destory()
    }
  }
</script>
<style lang="less" scoped>
  .restricted-purchase {
    display: flex;
    flex-direction: column;
    height: 100%;
    .breadcrumb {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .form {
      /deep/ .label {
        width: 150px;
        font-size: @font-size-base;
        vertical-align: baseline;
      }
      /deep/ .header {
        height: auto;
        padding-bottom: 0;
      }
    }
    .content {
      background: @component-bg;
      // min-height: 400px;
      flex: 1;
    }
    .closed {
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: @font-size-large;
      color: rgba(0,0,0,.45);
      img {
        width: 300px;
        margin-bottom: 20px;
      }
    }

    .body {
      background: #FFF;
      box-shadow: 0 2px 10px 0 #f3f3f4;
      margin-bottom: 10px;
      flex: 1;
      height: 100%;
    }
  }
</style>
