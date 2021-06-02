<template>
  <div class="batch-management">
    <template v-if="showHeader">
      <template v-if="isMerchantAccount">
        <Alert type="success" class="batch-management-alert" closable>
          <div class="left">
            <Icon type="error" size="17" color="#63D29D" />&nbsp;
            平台建议您使⽤新版商品管理⼯具 “总部商品库” ，可⼤幅提⾼连锁总部商品管理效率。
          </div>
          <div class="right" slot="close">
            <Button type="primary" @click="handleRelate">
              <RouteLink :to="prevPage.path" tag="a" style="color: #fff">返回新版</RouteLink>
            </Button>&nbsp;
          </div>
        </Alert>
      </template>
      <div class="batch-management-navigator">
        <Breadcrumb separator=">" class="breadcrumb" v-if="prevPage">
          <BreadcrumbItem>
            <RouteLink :to="prevPage.path" tag="a"> {{ prevPage.name }} </RouteLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span v-if="isMerchantAccount">旧版</span>批量管理
          </BreadcrumbItem>
        </Breadcrumb>
<!--        <RouteLink v-if="isMerchantAccount" :to="prevPage.path" tag="a">-->
<!--          <Icon type="arrow-left-double" />返回商家中心-->
<!--        </RouteLink>-->
      </div>
      <div class="batch-management-header">
        <Tabs :value="currentTab" name="batch-management">
          <TabPane v-for="menu in menuList" tab="batch-management" :key="menu.name" :label="h => renderTab(h, menu)" :name="menu.key" />
          <router-link slot="extra" :to="{ path: '/batchManagement/progress', query: $route.query }"><Button>任务进度</Button></router-link>
        </Tabs>
      </div>
    </template>
    <div class="batch-management-content">
      <gray-router-view></gray-router-view>
    </div>
  </div>
</template>
<script>
  import RouteLink from '@components/link/link'
  import { mapModule } from '@/module/module-manage/vue'
  import getMenus, { KEYS } from './menus'
  import { getIsSinglePoi } from './helper'
  import {
    MERCHANT_ACCOUNT,
    SINGLE_BUSINESS,
    BATCH_UPLOAD_IMAGE
  } from '@/module/moduleTypes'

  export default {
    name: 'batch-management',
    computed: {
      ...mapModule({
        isMerchantAccount: MERCHANT_ACCOUNT, // 账号是否开通商家商品中心
        isSingleBusiness: SINGLE_BUSINESS, // 是否是单经营品类
        supportUploadImage: BATCH_UPLOAD_IMAGE // 是否支持批量上传图片
      }),
      // 单店判断
      isSinglePoi () {
        return getIsSinglePoi(this.$route.query)
      },
      /**
       * 上一页地址
       * 单店：返回列表页面
       * 多店：
       *  1. 多品类 返回品类选择 /reuse/product/router/page/multiPoiRouter?routerTagId
       *  2. 单品类 && 商家商品库中心账号 返回 商家商品中心列表页面
       *  3. 单品类 && !商家商品库中心账号 不展示面包屑
      */
      prevPage () {
        if (this.isSinglePoi) {
          return {
            name: '商品管理',
            path: '/product/list'
          }
        }
        if (!this.isSingleBusiness) {
          return {
            name: '门店品类选择',
            path: `/reuse/product/router/page/multiPoiRouter`
          }
        }
        if (this.isMerchantAccount) {
          return {
            name: '商品管理',
            path: '/merchant/product/list'
          }
        }
        return null
      },
      currentTab () {
        return this.$route.name
      },
      showHeader () {
        return this.currentTab !== KEYS.PROGRESS
      },
      menuList () {
        return getMenus({
          // 只有单店 && 支持上传图片 才展示 批量上传图片
          [KEYS.UPLOAD_IMAGE]: this.isSinglePoi && this.supportUploadImage,
          // 只有多店才有批量同步
          [KEYS.SYNC]: !this.isSinglePoi
        })
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
    .batch-management-alert {
      display: flex;
      height: 50px;
      .left, .right {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
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
      position: relative;
      flex: 1;
      min-height: 400px;
      padding: 30px 30px 0 30px;
      background: @component-bg;
    }
  }
</style>
