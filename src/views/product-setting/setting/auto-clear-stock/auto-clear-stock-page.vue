<template>
  <div class="auto-clear-stock-page">
    <Breadcrumb separator=">" class="breadcrumb">
      <BreadcrumbItem :to="{ name: 'productList', query: $route.query }">商品管理</BreadcrumbItem>
      <BreadcrumbItem>设置缺货商品库存自动清零</BreadcrumbItem>
    </Breadcrumb>
    <Header :status="status" @change="handleStatusChange" />
    <ErrorBoundary :error="error" :top="100" description="配置获取失败~" @refresh="getData" class="content">
      <div>
        <div v-if="status">
          <FormCard title="配置信息" class="form">
            <Form />
          </FormCard>
          <FormCard title="选择商品" tip="勾选配置应用生效的商品">
            <ProductList />
          </FormCard>
        </div>
        <div v-else class="closed">
          <img :src="img" />
          <div>设置状态关闭</div>
        </div>
      </div>
      <StickyFooter
        :gap="0"
        :btnTexts="['确认', '取消']"
        :btnProps="[{ loading: submitting }]"
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

  const { mapState, mapActions, mapMutations } = createNamespacedHelpers('autoClearStockConfig')

  export default {
    name: 'auto-clear-stock-page',
    components: {
      Header,
      FormCard,
      ProductList,
      Form,
      StickyFooter
    },
    data () {
      return { img: invalidImg }
    },
    computed: {
      ...mapState({
        status: 'status',
        loading: 'loading',
        error: 'error',
        submitting: 'submitting'
      })
    },
    methods: {
      ...mapActions({
        submit: 'submit',
        getData: 'getData'
      }),
      ...mapMutations({
        handleStatusChange: 'setStatus',
        destory: 'destory'
      }),
      goToList () {
        this.$router.push({
          path: '/product/list',
          query: this.$route.query
        })
      },
      handleSubmit (index) {
        if (index === 1) {
          this.goToList()
        } else if (index === 0) {
          this.submit(() => {
            this.$Message.success('设置成功～')
            setTimeout(() => {
              this.goToList()
            }, 1000)
          })
        }
      }
    },
    mounted () {
      this.getData()
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
