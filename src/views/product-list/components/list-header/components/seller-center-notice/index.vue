<template>
  <Alert v-if="!!alertdata" class="seller-alert" :type="alertdata.type">
    <span v-if="!!alertdata.title" class="seller-alert-title">{{alertdata.title}}</span>
    <span v-if="!!alertdata.title" class="seller-alert-right">|</span>
    <span v-html="alertdata.content"></span>
    <div class="seller-alert-actions">
      <div :key="item.text" v-for="item in alertdata.actions">
        <Button v-if="item.type === 'button'" class="seller-alert-operation" type="primary" @click="handleLink(item.handle)">{{item.text}}</Button>
        <a v-if="item.type === 'link'" class="seller-alert-link" @click="handleLink(item.handle)">{{item.text}}</a>
      </div>
    </div>
  </Alert>
</template>
<script>
  import { getProductCount, getGrey } from '@/data/repos/sellerCenter'
  import { getRetailBatchInsertTask, finishBatchInsertNew, inBatchInsertNewGrey } from '@/data/api/batch'
  import { poiId } from '@/common/constants'
  import jumpTo from '@/components/link/jumpTo'
  import moment from 'moment'

  export default {
    name: 'seller-center-notice',
    data () {
      return {
        productCount: null,
        batchInfo: null,
        showBatchAlert: true
      }
    },
    computed: {
      alertdata () {
        const { productCount, batchInfo, inNewBatchGrey } = this

        if (this.showBatchAlert && batchInfo && inNewBatchGrey) {
          const { taskId, infoMiss, ctime, status } = batchInfo
          if (taskId) {
            if (status === 0) {
              return {
                title: '批量新建',
                type: 'warning',
                content: `于 ${moment(ctime * 1000).format('YYYY-MM-DD h:mm')} 提交的创建任务正在进⾏中，请耐⼼等待。`,
                actions: [{
                  text: '查看进度',
                  type: 'button',
                  handle: '/reuse/sc/product/views/seller/center/new/create'
                }]
              }
            }
            if (status === 1) {
              return {
                title: '批量新建',
                type: 'warning',
                content: `于 ${moment(ctime * 1000).format('YYYY-MM-DD h:mm')} 提交的创建任务已完成。商品全部创建成功。`,
                actions: [{
                  text: '查看详情',
                  type: 'button',
                  handle: '/reuse/sc/product/views/seller/center/new/create'
                }, {
                  text: '我知道了',
                  type: 'link',
                  handle: () => {
                    this.iGotIt(taskId)
                  }
                }]
              }
            }
            // eslint-disable-next-line no-unreachable
            if (status === 3) {
              return {
                title: '批量新建',
                type: 'error',
                content: `于 ${moment(ctime * 1000).format('YYYY-MM-DD h:mm')} 提交的任务，商品全部创建失败。`,
                actions: [{
                  text: '立即补充',
                  type: 'button',
                  handle: '/reuse/sc/product/views/seller/center/new/create'
                }]
              }
            }
            if (status === 2 && infoMiss) {
              return {
                title: '批量新建',
                type: 'error',
                content: `于 ${moment(ctime * 1000).format('YYYY-MM-DD h:mm')} 提交的任务，有${infoMiss}个商品需补充必填信息。请⽴即处理。`,
                actions: [{
                  text: '立即补充',
                  type: 'button',
                  handle: '/reuse/sc/product/views/seller/center/new/create'
                }]
              }
            }
          // eslint-disable-next-line no-unreachable
          } else if (infoMiss) {
            if (infoMiss > 3) {
              return {
                title: '批量新建',
                type: 'error',
                content: `${infoMiss}个商品，需补充必填信息才可上架售卖。`,
                actions: [{
                  text: '立即补充',
                  type: 'button',
                  handle: '/reuse/sc/product/views/seller/center/new/create'
                }]
              }
            } else {
              return {
                title: '批量新建',
                type: 'error',
                content: `${infoMiss}个商品，需补充必填信息才可上架售卖。`,
                actions: [{
                  text: '立即补充',
                  type: 'button',
                  handle: '/reuse/sc/product/views/seller/center/new/create'
                }, {
                  text: '忽略',
                  type: 'link',
                  handle: this.hideBatchAlert
                }]
              }
            }
          }
        }

        if (productCount) {
          const { level, problemItemCount } = productCount
          if (problemItemCount === 0) {
            return {
              title: '商品管家',
              type: 'success',
              content: `<span><span class="seller-alert-tag seller-alert-success-tag">${level}</span>暂无商品信息问题，请继续保持～</span>`,
              actions: [{
                text: '查看详情',
                type: 'link',
                handle: '/reuse/sc/product/views/seller/center'
              }]
            }
          } else if (level === '差') {
            return {
              title: '商品管家',
              type: 'error',
              content: `<span><span class="seller-alert-tag seller-alert-error-tag">${level}</span>有<span class="seller-alert-count seller-alert-error-count">${problemItemCount}</span>个商品信息问题，严重影响商品售卖!</span>`,
              actions: [{
                text: '立即修改',
                type: 'button',
                handle: '/reuse/sc/product/views/seller/center'
              }]
            }
          } else {
            return {
              title: '商品管家',
              type: 'warning',
              content: `<span><span class="seller-alert-tag seller-alert-warning-tag">${level}</span>有<span class="seller-alert-count seller-alert-warning-count">${problemItemCount}</span>个商品信息问题，影响店铺销量提升！</span>`,
              actions: [{
                text: '立即修改',
                type: 'button',
                handle: '/reuse/sc/product/views/seller/center'
              }]
            }
          }
        }

        return null
      }
    },
    components: {
    },
    methods: {
      handleLink (action) {
        if (typeof action === 'string') {
          jumpTo(action)
        } else if (typeof action === 'function') {
          action()
        }
      },
      hideBatchAlert () {
        this.showBatchAlert = false
      },
      iGotIt (taskId) {
        this.showBatchAlert = false
        finishBatchInsertNew(taskId)
      },
      async init () {
        getGrey(poiId).then(data => {
          if (data && data.productManagerGray) {
            getProductCount(poiId).then(data => {
              this.productCount = data
            })
          }
        })
        const res = await inBatchInsertNewGrey(poiId)
        this.inNewBatchGrey = (res || {}).inGrey
        getRetailBatchInsertTask(poiId).then(data => {
          this.batchInfo = data
        })
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
<style scoped lang="less">
  @import '~@/styles/common.less';
  .seller-alert {
    margin-bottom: 10px;
    padding: 9px 24px 9px 20px;
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

    &-actions {
      float: right;
      > div {
        display: inline-block;
        margin-left: 12px;
        height: 28px;
        line-height: 28px;
      }
    }

    &-operation {
      margin-top: -4px;
      font-size: 12px;
      height: 28px;
    }

    &-link {
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
