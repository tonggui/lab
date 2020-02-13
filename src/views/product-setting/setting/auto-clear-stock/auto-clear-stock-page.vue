<template>
  <div class="auto-clear-stock-page">
    <Breadcrumb separator=">" class="breadcrumb">
      <BreadcrumbItem :to="{ name: 'productList', query: $route.query }">商品管理</BreadcrumbItem>
      <BreadcrumbItem>设置缺货商品库存自动清零</BreadcrumbItem>
    </Breadcrumb>
    <Header :status="status" @change="handleStatusChange" />
    <div class="content">
      <keep-alive>
        <div v-if="status">
          <FormCard title="配置信息" class="form">
            <Form />
          </FormCard>
          <FormCard title="选择商品" tip="勾选配置应用生效的商品">
            <ProductList />
          </FormCard>
        </div>
        <div v-else class="closed">
          设置状态关闭
        </div>
      </keep-alive>
    </div>
    <StickyFooter :gap="10" size="normal" :btnTexts="['确认', '取消']" @on-click="handleSubmit" />
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import Header from './components/header'
  import StickyFooter from '@/components/sticky-footer'
  import FormCard from '@/views/components/product-form/form-card'
  import ProductList from './container/product-list'
  import Form from './container/form'

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
    computed: {
      ...mapState({
        status: 'status'
      })
    },
    methods: {
      ...mapActions({
        handleSubmit: 'submit',
        getData: 'getData'
      }),
      ...mapMutations({
        handleStatusChange: 'setStatus'
      })
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less" scoped>
  .auto-clear-stock-page {
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
    .closed {
      background: @component-bg;
      text-align: center;
      height: 400px;
      line-height: 400px;
    }
  }
</style>
