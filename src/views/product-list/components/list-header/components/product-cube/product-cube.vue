<template>
  <div class="product-cube">
    <Alert type="warning" class="product-cube-alert">
      <div class="product-cube-alert-content">
        <CubeLogo />
        <div>
          <div>
            <span class="product-cube-tag">建品神器</span>
            <span class="product-cube-title">{{ title }}</span>
            <PermissionBtn
              component="router-link"
              need-permission
              btn-type="CREATE"
              class="product-cube-link"
              :to="{ name: 'productRecommend', query: $route.query }"
            >
              <span v-mc:productCube="{ bid: 'b_shangou_online_e_i4acqwpi_mc' }">立即去创建</span>
            </PermissionBtn>
          </div>
          <div v-if="description" class="product-cube-description">
            <Icon size="14" local="horn" class="product-cube-horn-icon" />{{ description }}
          </div>
        </div>
      </div>
    </Alert>
  </div>
</template>
<script>
  import lx from '@/common/lx/lxReport'
  import CubeLogo from '@/views/components/cube-logo/index'
  import PermissionBtn from '@/views/components/permission-bth'

  export default {
    name: 'product-cube',
    components: { CubeLogo, PermissionBtn },
    props: {
      title: String,
      description: String
    },
    mounted () {
      lx.mv({ bid: 'b_shangou_online_e_rbtq0rr1_mv' }, 'productCube')
    }
  }
</script>
<style lang="less" scoped>
  .product-cube {
    background: @component-bg;
    &-alert {
      margin-bottom: 0;
      padding: 14px 20px;
      border-radius: 0;
      &-content {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    &-tag {
      background: #FFECCF;
      border: 1px solid #F89800;
      border-radius: 0 2.5px 0 2.5px;
      color: #F88100;
      padding: 2px 4px;
      line-height: 20px;
      margin-right: 8px;
      font-size: @font-size-small;
    }
    &-title {
      color: #333333;
      font-weight: 600;
      margin-right: 4px;
    }
    &-link {
      text-decoration: underline;
    }
    &-description {
      margin-top: 8px;
      color: #676A78;
    }
    &-horn-icon {
      color: #F89800;
      margin-right: 8px;
    }
  }
</style>
