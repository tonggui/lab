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
  import { isPlainObject, merge } from 'lodash'
  import RouteLink from '@components/link/link'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'
  import getMenus, { KEYS } from './menus'

  export default {
    name: 'merchant-batch-management',
    data () {
      return {
        moduleMap: {
          [KEYS.SYNC]: false,
          [KEYS.MEDICINE_REL]: false
        },
        medicineModuleMap: {
          [KEYS.CREATE]: {
            name: '新建商品中心商品'
          },
          [KEYS.UPLOAD_IMAGE]: false,
          [KEYS.REL]: false
        }
      }
    },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      }),
      prevPage () {
        return {
          name: '商品列表',
          path: this.isMedicine ? '/medicine/merchant/product/list' : '/merchant/product/list'
        }
      },
      currentTab () {
        return this.$route.name
      },
      showHeader () {
        return this.currentTab !== KEYS.PROGRESS
      },
      menuList () {
        if (this.isMedicine) {
          const list = getMenus(this.medicineModuleMap)
          return this.filterMenu(list, this.medicineModuleMap)
        }
        return getMenus(this.moduleMap)
      },
      routerMap () {
        return Object.freeze(KEYS)
      }
    },
    components: {
      RouteLink
    },
    methods: {
      filterMenu (list, moduleMap) {
        return list.map((item) => {
          const moduleItem = moduleMap[item.key]
          if (isPlainObject(moduleItem)) {
            return merge({}, item, moduleItem)
          }
          return item
        })
      },
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
