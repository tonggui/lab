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
        <ProductList/>
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
  import { getLimitRules, saveLimitRule } from '@/data/api/setting'
  import { getPoiId, getMerchantId } from '@/common/constants'
  import { get } from 'lodash'
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
        limitRule
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
        getData: 'getData',
        getRuleRelProduct: 'getRuleRelProduct'
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
      handleChange (data) {
        this.limitRule = data
      },
      async handleSubmit (index) {
        if (index === 1) {
          this.goToList()
        } else if (index === 0) {
          console.log(this.limitRule)
          if (!this.limitRule.range[0]) {
            this.$Message.error('请填写限购周期')
            return
          }
          if (!this.limitRule.max) {
            this.$Message.error('请填写单个买家购买规则')
            return
          }
          const merchantId = getMerchantId() || 0
          const tagStats = Object.entries(this.productMap).reduce((prev, [key, value]) => {
            const node = {
              tagId: key,
              includes: value.checked ? [] : value.list,
              excludes: value.checked ? value.list : []
            }
            // 全选 但是 exclude 小于 total 表示有选中的
            if (value.checked && value.list.length < value.total) {
              prev.push(node)
            } else if (!value.checked && value.list.length > 0) { // 非全选 但是 include有值，则表示有选中的
              prev.push(node)
            }
            // 否则 此分类不需要处理
            return prev
          }, [])
          let res = await saveLimitRule(
            getPoiId(),
            merchantId,
            {
              ruleId: this.limitRule.ruleId,
              type: this.limitRule.rule === 0 ? 2 : 1,
              multiPoi: this.limitRule.multiPoi,
              frequency: this.limitRule.rule,
              count: this.limitRule.max,
              begin: this.limitRule.range[0],
              end: this.limitRule.range[1]
            },
            tagStats
          )
          if (res.code === 0) {
            this.$Modal.confirm({
              title: '温馨提示',
              render: () => (
                <div>
                  <div>正在为所选商品进行设置····</div>
                  <div>配置完成会通知您</div>
                  现在可以点击【任务进度】查看，或返回商品列表等待配置结束
                </div>
              ),
              okText: '查看任务进度',
              cancelText: '返回配置管理',
              onCancel: () => {
                this.goToList()
              },
              onOk: () => {
                this.$router.push({
                  path: '/batchManagement/progress',
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
        // await this.getRuleRelProduct(routeRuleId)
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
