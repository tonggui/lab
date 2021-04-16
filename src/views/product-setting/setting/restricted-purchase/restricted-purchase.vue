<template>
  <div class="restricted-purchase">
    <Breadcrumb separator=">" class="breadcrumb">
      <BreadcrumbItem :to="{ name: 'productList', query: $route.query }">商品管理</BreadcrumbItem>
      <BreadcrumbItem>商品限购配置</BreadcrumbItem>
    </Breadcrumb>
    <Header />
    <div class="body">
      <FormItemLayout>
      <PurchaseLimitation/>

      </FormItemLayout>
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
  import invalidImg from '@/assets/invalid.png'
  import StickyFooter from '@/components/sticky-footer'
  import PurchaseLimitation from './components/purchase-limitation'
  const { mapState, mapActions, mapMutations } = createNamespacedHelpers('restricted-purchase')

  export default {
    name: 'restricted-purchase',
    components: {
      Header,
      PurchaseLimitation,
      StickyFooter,
      FormItemLayout
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
                  path: '/batchManagement/progress',
                  query: {
                    ...this.$route.query,
                    from: 'single'
                  }
                })
              }
            })
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
