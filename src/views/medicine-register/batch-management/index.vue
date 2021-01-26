<template>
  <div class="batch-management">
    <template v-if="showHeader">
      <div class="batch-management-navigator">
        <Breadcrumb separator=">" class="breadcrumb" v-if="prevPage">
          <BreadcrumbItem>
            <RouteLink :to="prevPage.path" tag="a"> {{ prevPage.name }} </RouteLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            批量设置
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="batch-management-header">
        <Tabs :value="currentTab" name="batch-management">
          <TabPane v-for="menu in menuList" tab="batch-management" :key="menu.name" :label="h => renderTab(h, menu)" :name="menu.key" />
          <router-link slot="extra" :to="{ name: routerMap.MEDICINE_REGISTER_PROGRESS, query: $route.query }"><Button>任务进度</Button></router-link>
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

  export default {
    name: 'medicine-register-batch-management',
    data () {
      return {}
    },
    computed: {
      prevPage () {
        return {
          name: '疫情药品设置',
          path: '/medicine/register/product/list'
        }
      },
      currentTab () {
        return this.$route.name
      },
      showHeader () {
        return this.currentTab !== KEYS.MEDICINE_REGISTER_PROGRESS
      },
      menuList () {
        return getMenus()
      },
      routerMap () {
        return Object.freeze(KEYS)
      }
    },
    components: {
      RouteLink
    },
    methods: {
      renderTab (h, menu) {
        return <RouteLink to={menu.link}>{ menu.name }</RouteLink>
      }
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
