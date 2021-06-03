<template>
  <div class="auto-clear-stock-page">
    <Breadcrumb separator=">" class="breadcrumb">
      <BreadcrumbItem :to="{ name: 'productList', query: $route.query }">商品管理</BreadcrumbItem>
      <BreadcrumbItem>设置缺货商品库存自动清0</BreadcrumbItem>
    </Breadcrumb>
    <Header :disabled="error" :status="status" @change="handleStatusChange" />
    <ErrorBoundary :error="error" :top="100" description="配置获取失败~" @refresh="getData" class="content">
      <div>
        <div v-if="status">
          <FormCard title="配置信息" class="form">
            <Form />
          </FormCard>
          <FormCard v-show="!config.isAll" title="选择商品" tip="勾选配置应用生效的商品">
            <ProductList />
          </FormCard>
          <PoiSelectForm
            v-if="config.isAll && !getIsSingle()"
            :data="[...poiListInfo]"
            @data-change="handleDataChange"
          />
        </div>
        <div v-else class="closed">
          <img :src="img" />
          <div>缺货库存自动清0 功能未开启</div>
        </div>
      </div>
      <StickyFooter
        :gap="0"
        :btnTexts="['确认', '取消']"
        :btnProps="[{ loading: submitting }]"
        :bid="['b_shangou_online_e_52d9sbn3_mc', 'b_shangou_online_e_dz7rgvw8_mc']"
        @on-click="handleSubmit"
      />
      <Loading v-if="loading" />
    </ErrorBoundary>
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import Header from './components/header'
  import StickyFooter from '@/components/sticky-footer'
  import FormCard from '@/views/components/product-form/form-card'
  import ProductList from './container/product-list'
  import Form from './container/form'
  import invalidImg from '@/assets/invalid.png'
  import { getIsSingle } from '@/common/constants'
  import PoiSelectForm from './components/poi-select-form'

  const { mapState, mapActions, mapMutations } = createNamespacedHelpers('autoClearStockConfig')

  export default {
    name: 'auto-clear-stock-page',
    components: {
      Header,
      FormCard,
      ProductList,
      Form,
      StickyFooter,
      PoiSelectForm
    },
    data () {
      return {
        img: invalidImg,
        poiListInfo: []
      }
    },
    computed: {
      ...mapState({
        status: 'status',
        loading: 'loading',
        error: 'error',
        submitting: 'submitting',
        config: 'config'
      })
    },
    methods: {
      ...mapActions({
        submit: 'submit',
        getData: 'getData'
      }),
      ...mapMutations({
        handleStatusChange: 'setStatus',
        destory: 'destory',
        setPoiList: 'setPoiList'
      }),
      getIsSingle () {
        return getIsSingle()
      },
      handleDataChange (key, value) {
        this.poiListInfo = [...value]
        this.setPoiList([...value])
      },
      goToList () {
        let path = '/merchant/product/list'
        let query = this.$route.query
        if (getIsSingle()) {
          path = '/product/list'
          query = {
            from: query.from,
            wmPoiId: query.wmPoiId
          }
        }
        this.$router.push({
          path,
          query
        })
      },
      handleSubmit (index) {
        if (index === 1) {
          this.$router.push({
            path: '/merchant/product/setting',
            query: this.$route.query
          })
        } else if (index === 0) {
          this.submit(() => {
            if (!this.config.isAll) {
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
                cancelText: '返回商品列表',
                onCancel: () => {
                  this.goToList()
                },
                onOk: () => {
                  this.$router.push({
                    path: getIsSingle() ? '/batchManagement/progress' : '/merchant/progress',
                    query: {
                      ...this.$route.query
                    }
                  })
                }
              })
            } else {
              this.$Modal.success({
                title: '提示',
                content: '库存清0规则配置成功',
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
          })
        }
      }
    },
    mounted () {
      this.getData((wmPoiIds) => {
        this.poiListInfo = wmPoiIds || []
      })
    },
    beforeDestroy () {
      this.destory()
    }
  }
</script>
<style lang="less" scoped>
  .auto-clear-stock-page {
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
  }
</style>
