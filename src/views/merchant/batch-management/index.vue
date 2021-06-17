<template>
  <div class="batch-management">
    <template v-if="showHeader">
      <div class="batch-management-navigator">
        <Breadcrumb separator=">" class="breadcrumb" v-if="prevPage">
          <BreadcrumbItem>
            <RouteLink :to="prevPage.path" tag="a"> {{ prevPage.name }} </RouteLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            商品中心批量管理
          </BreadcrumbItem>
        </Breadcrumb>
        <MerchantUserGuide />
<!--        <div>-->
<!--          旧版批量功能-->
<!--          <span class="line" />-->
<!--          <NamedLink tag="a" :name="batchPage" :query="{ routerTagId }" v-mc="{ bid: 'b_shangou_online_e_act4ikmb_mc' }">-->
<!--            点击进入<Icon type="keyboard-arrow-right" size="18"/>-->
<!--          </NamedLink>-->
<!--        </div>-->
      </div>
      <div class="batch-management-header">
        <Tabs :value="currentTab" name="batch-management">
          <TabPane v-for="menu in menuList" tab="batch-management" :key="menu.name" :label="h => renderTab(h, menu)" :name="menu.key" />
          <router-link slot="extra" :to="{ name: routerMap.PROGRESS, query: $route.query }"><Button>任务进度</Button></router-link>
        </Tabs>
      </div>
    </template>
    <div class="batch-management-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import RouteLink from '@components/link/link'
  import getMenus, { KEYS } from './menus'
  // import NamedLink from '@components/link/named-link'
  import BatchPage from '@sgfe/eproduct/navigator/pages/batch/create'
  import { isAssociateMedicineMerchant } from '@/module/helper/utils'
  import MerchantUserGuide from '@components/merchant-user-guide'

  export default {
    name: 'merchant-batch-management',
    data () {
      return {
        batchPage: BatchPage.name,
        showRel: true
      }
    },
    computed: {
      prevPage () {
        return {
          name: '商品列表',
          path: '/merchant/product/list'
        }
      },
      currentTab () {
        return this.$route.name
      },
      showHeader () {
        return this.currentTab !== KEYS.PROGRESS
      },
      menuList () {
        return getMenus(this.showRel ? {} : {
          [KEYS.REL]: false
        })
      },
      routerMap () {
        return Object.freeze(KEYS)
      }
    },
    components: {
      RouteLink,
      MerchantUserGuide
    },
    methods: {
      async isMedicineMerchant () {
        const res = await isAssociateMedicineMerchant()
        if (!res) this.showRel = false
      },
      renderTab (h, menu) {
        return <RouteLink to={menu.link}>{ menu.name }</RouteLink>
      }
    },
    mounted () {
      this.isMedicineMerchant()
    }
  }
</script>
<style lang="less" scoped>
  .batch-management {
    display: flex;
    flex-direction: column;
    &-navigator {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .line {
        display: inline-block;
        margin-left: 10px;
        margin-right: 10px;
        width: 1px;
        background: #E5E5E5;
        height: 14px;
        vertical-align: middle;
      }
    }
    &-header {
      width: 100%;
      background: @component-bg;
      margin: 10px auto;
      /deep/ .boo-tabs {
        .boo-tabs-bar {
          border-bottom: none;
          margin-bottom: 5px;
          .boo-tabs-nav-right {
            line-height: 50px;
            margin-right: 20px;
          }
        }
        .boo-tabs-nav .boo-tabs-tab {
          padding: 0;
          a.boo-btn-text.link {
            padding: 15px 20px 10px 20px;
            line-height: 28px;
            height: 53px;
          }
        }
        .boo-tabs-ink-bar {
          &::after,
          &::before {
            height: 2px;
            border: none;
          }
        }
      }
    }
    &-content {
      flex: 1;
      min-height: 400px;
      padding: 30px;
      background: @component-bg;
    }
  }
</style>
