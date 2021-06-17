<template>
  <div class="restricted-purchase">
    <div class="restricted-purchase-content">
      <div>
        <p class="restricted-purchase-title">{{ title }}</p>
        <small class="restricted-purchase-description">
          <slot name="description">{{ description }}</slot>
        </small>
      </div>
      <iSwitch v-if="showSwitch" :value="status" @on-change="handleStatus" :loading="submitting" />
    </div>
    <div class="restricted-purchase-list">
      <div class="restricted-purchase-loading" v-if="loading">
        <Loading  size="small" />
      </div>
      <template v-for="item in limitRuleVoList">
        <div class="restricted-purchase-list-item" :key="item.limitRule.ruleId">
          <span class="restricted-purchase-list-item-id">ID：{{item.limitRule.ruleId}}</span>
          <span>| &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div class="restricted-purchase-list-item-time" >
            <Tooltip :content="item.limitRule.begin" placement="top">
              <span>{{item.limitRule.begin}}</span>
            </Tooltip>
            -
            <Tooltip :content="item.limitRule.end" placement="top">
              <span>{{item.limitRule.end}}</span>
            </Tooltip>
          </div>
          <span class="restricted-purchase-list-item-frequency"> | &nbsp;&nbsp;&nbsp;&nbsp;{{item.limitRule.count}}份 / {{item.limitRule.frequency === 0 ? `整个限购周期` : `${item.limitRule.frequency}天`}}</span>
          <span class="restricted-purchase-list-item-count"> | &nbsp;&nbsp;&nbsp;&nbsp;{{item.count}}个商品</span>
          <span class="restricted-purchase-list-item-link" @click="() => delRestrictedPurchase(item.limitRule.ruleId)">删除</span>
          <span class="restricted-purchase-list-item-link" @click="() => modRestrictedPurchase(item.limitRule.ruleId)">点击修改</span>
        </div>
      </template>
      <div v-if="!loading" class="restricted-purchase-add" @click="() => modRestrictedPurchase()">
        + 新增限购规则
      </div>
    </div>
  </div>
</template>
<script>
  import { getLimitRules, delRule } from '@/data/api/setting'
  import { getPoiId, getMerchantId } from '@/common/constants'

  export default {
    name: 'restricted-purchase',
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
      return {
        submitting: false,
        limitRuleVoList: [],
        loading: false
      }
    },
    created () {
      this.getLimitRulesStatus()
    },
    methods: {
      async getLimitRulesStatus () {
        const merchantId = getMerchantId() || 0
        try {
          this.loading = true
          const res = await getLimitRules(getPoiId(), merchantId)
          this.limitRuleVoList = res.limitRuleVoList
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },
      modRestrictedPurchase (ruleId) {
        this.$router.push({ path: '/product/setting/restrictedPurchase', query: { ...this.$route.query, ruleId } })
      },
      async delRestrictedPurchase (ruleId) {
        const merchantId = getMerchantId() || 0
        try {
          let res = await delRule(ruleId, getPoiId(), merchantId)
          if (res.code === 1) {
            this.$Message.error('删除失败:' + res.msg)
          }
          this.getLimitRulesStatus()
        } catch (error) {
          this.$Message.error('删除失败:' + error.message)
        }
      }
    }
  }
</script>
<style lang="less">
  .restricted-purchase {
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
    &-add {
      margin-top: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    &-list {
      &-item {
        padding: 10px 0;
        border-bottom: 1px solid #E9EAF2;
        &-time {
          display: inline-block;
          width: 160px;
        }
        &-id {
          display: inline-block;
          padding: 0 20px 0 0;
        }
        &-frequency {
          display: inline-block;
          width: 200px;
          padding: 0 0 0 40px;
        }
        &-count {
          display: inline-block;
          width: 200px;
          padding: 0 0 0 40px;
        }
        &-link {
          float: right;
          margin-right: 20px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
