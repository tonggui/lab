<template>
  <Alert v-if="!!alertdata" class="seller-alert" :type="alertdata.type">
    <span v-if="!!alertdata.title" class="seller-alert-title">{{alertdata.title}}</span>
    <span v-if="!!alertdata.title" class="seller-alert-right">|</span>
    <span v-html="alertdata.content"></span>
    <Button v-if="alertdata.operationType === 'button'" class="seller-alert-operation" type="primary" @click="handleLink(alertdata.link)">{{alertdata.operationText}}</Button>
    <a v-if="alertdata.operationType === 'link'" class="seller-alert-link" @click="handleLink(alertdata.link)">{{alertdata.operationText}}</a>
  </Alert>
</template>
<script>
  import { getProductCount } from '@/data/repos/sellerCenter'
  import { poiId } from '@/common/constants'
  import jumpTo from '@/components/link/jumpTo'

  export default {
    name: 'seller-center-notice',
    data () {
      return {
        productCount: null
      }
    },
    computed: {
      alertdata () {
        const { productCount } = this

        if (productCount) {
          const { level, problemItemCount } = productCount
          switch (level) {
          case '差':
            return {
              title: '商品管家',
              type: 'error',
              content: `<span><span class="seller-alert-tag seller-alert-error-tag">${level}</span>有<span class="seller-alert-count seller-alert-error-count">${problemItemCount}</span>个商品信息问题，严重影响商品售卖!</span>`,
              operationText: '立即修改',
              operationType: 'button',
              closeText: '立即修改',
              link: '/reuse/sc/product/views/seller/center'
            }
          case '优':
            return {
              title: '商品管家',
              type: 'success',
              content: `<span><span class="seller-alert-tag seller-alert-success-tag">${level}</span>暂无商品信息问题，请继续保持～</span>`,
              operationText: '查看详情',
              operationType: 'link',
              closeText: '立即修改',
              link: '/reuse/sc/product/views/seller/center'
            }
          default:
            return {
              title: '商品管家',
              type: 'warning',
              content: `<span><span class="seller-alert-tag seller-alert-warning-tag">${level}</span>有<span class="seller-alert-count seller-alert-warning-count">${problemItemCount}</span>个商品信息问题，影响店铺销量提升！</span>`,
              operationText: '立即修改',
              operationType: 'button',
              closeText: '立即修改',
              link: '/reuse/sc/product/views/seller/center'
            }
          }
        }

        return null
      }
    },
    components: {
    },
    methods: {
      handleLink (link) {
        jumpTo(link)
      }
    },
    mounted () {
      getProductCount(poiId).then(data => {
        console.log(data)
        this.productCount = data
      })
    }
  }
</script>
<style scoped lang="less">
  @import '~@/styles/common.less';
  .seller-alert {
    margin-bottom: 0;
    padding: 9px 24px 9px 40px;
    line-height: 14px;
    border-radius: 0;
    font-size: 14px;
    color: #333333;
    font-weight: 600;

    &-icon {
      margin-top: 8px;
      &.with-title {
        margin-top: 4px;
      }
    }
    &-title {
      font-size: 16px;
      color: #333333;
      font-weight: 600;
    }

    &-right {
      margin:  0 20px;
      font-size: 14px;
      color: #D9D9D9;
    }

    &-operation {
      float: right;
      margin-top: -6px;
    }

    &-link {
      float: right;
    }

    :global(.seller-alert-tag) {
      position: relative;
      top: -1px;
      display: inline-block;
      padding: 3px 4px;
      margin-right: 6px;
      font-size: 12px;
      font-weight: 500;
      transform: scale(0.8);
      border-radius: 1px;
      color: #FFFFFF;
    }

    :global(.seller-alert-error-tag) {
      background: #F46E65;
    }

    :global(.seller-alert-success-tag) {
      background: #4DD191;
    }

    :global(.seller-alert-warning-tag) {
      background: #F89800;
    }

    :global(.seller-alert-count) {
      position: relative;
      top: 2px;
      font-weight: 500;
      font-size: 20px;
      margin: 0 4px;
    }

    :global(.seller-alert-error-count) {
      color: #F46E65;
    }

    :global(.seller-alert-success-count) {
      color: #4DD191;
    }

    :global(.seller-alert-warning-count) {
      color: #F89800;
    }

    &-description {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 32px;
      font-weight: 600;
      &.with-title {
        color: #676A78;
        font-weight: normal;
      }
    }
    &-reason {
      text-decoration: underline;
      .link()
    }
  }
</style>
