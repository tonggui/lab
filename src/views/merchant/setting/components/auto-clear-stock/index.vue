<template>
  <div class="auto-clear-stock">
    <div class="auto-clear-stock-content">
      <div>
        <p class="auto-clear-stock-title">{{ title }}</p>
        <small class="auto-clear-stock-description">
          <slot name="description">{{ description }}</slot>
        </small>
      </div>
      <iSwitch v-if="showSwitch" :value="status" @on-change="handleStatus" :loading="submitting" />
    </div>
    <div class="auto-clear-stock-loading" v-if="loading">
      <Loading  size="small" />
    </div>
    <div v-if="data.status && !loading" class="auto-clear-stock-list">
      <span v-if="!!typeTitle">{{typeTitle}}因无货取消订单</span>
      <span v-if="data.config && data.config.syncStatus"> | &nbsp;&nbsp;&nbsp;&nbsp;{{data.config.syncTime}}前不允许门店自动同步库存</span>
      <span v-if="!!productCount || (data.config && data.config.isAll)"> | &nbsp;&nbsp;&nbsp;&nbsp;{{data.config && data.config.isAll ? '全部商品' : `共${productCount}个商品`}}</span>
      <span class="auto-clear-stock-list-item-link" @click="handleClick">点击修改</span>
    </div>
    <div v-if="!data.status && !loading" class="auto-clear-stock-add" @click="handleClick">
      + 新增清0规则
    </div>
  </div>
</template>
<script>
  import {
    fetchGetPoiAutoClearStockConfig
  } from '@/data/repos/poi'
  import { getPoiId } from '@/common/constants'
  export default {
    name: 'auto-clear-stock',
    props: {
      showSwitch: Boolean,
      title: {
        type: String,
        required: true
      },
      description: String,
      status: Boolean,
      listInfo: {
        type: Object,
        validator: (listInfo) => {
          return ['name', 'count'].every(k => k in listInfo)
        }
      }
    },
    data () {
      return { submitting: false, data: {}, productCount: 0, loading: false }
    },
    methods: {
      handleClick () {
        this.$router.push({ path: '/product/setting/stockoutAutoClearStock', query: this.$route.query })
      },
      handleStatus (status) {
        this.submitting = true
        this.$emit('change-status', status, () => {
          this.submitting = false
        })
      }
    },
    async mounted () {
      try {
        this.loading = true
        let res = await fetchGetPoiAutoClearStockConfig(getPoiId())
        this.loading = false
        this.data = res
        let length = 0
        let typeArr = []
        if (res.config.type) {
          res.config.type.map((item, i) => {
            if (item === 2) {
              typeArr.push('买家')
            }
            if (item === 1) {
              typeArr.push('店铺')
            }
          })
        }
        this.typeTitle = typeArr.join('/')
        Object.values(res.productMap).map((item, i) => {
          if (item.list) {
            length += item.list.length
          }
        })
        this.productCount = length
      } catch (error) {
        this.loading = false
        throw Error(error.message)
      }
    }
  }
</script>
<style lang="less">
  .auto-clear-stock {
    text-align: left;
    padding: 20px;
    background: @component-bg;
    box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.30);
    margin-bottom: 20px;
    &-loading {
      position: relative;
      height: 40px;
      width: 100%;

      .loading-small {
        top: 10px;
      }
    }
    &-add {
      margin-top: 16px;
      &:hover {
        cursor: pointer;
      }
    }
    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      border-bottom: 1px solid @border-color-base;
      padding-bottom: 16px;
    }
    &-title {
      font-size: 16px;
      line-height: 38px;
      color: #222;
      font-weight: bold;
    }
    &-description {
      font-size: @font-size-small;
      color: @text-tip-color;
      line-height: 26px;
    }
    &-list {
      display: flex;
      position: relative;
      // justify-content: space-between;
      align-items: center;
      padding-top: 30px;
      padding-bottom: 10px;
      font-size: @font-size-large;
      > span {
        margin-right: 40px;
        color: #3F4156;
        font-size: 14px;
      }
      &-item-link {
          position: absolute;
          right: 0;
          color: #999;
          margin-right: 20px;
          &:hover {
            cursor: pointer;
          }
        }
    }
  }
</style>
