<template>
  <div>
    <HeaderBar :module-map="moduleMap" @click="handleClick" />
    <DownloadModal
      v-model="downloadVisible"
      :fetch-download-list="fetchGetDownloadTaskList"
      :submit-download="fetchSubmitDownloadProduct"
      :columns="columns"
    />
  </div>
</template>
<script>
  import HeaderBar from '@/components/header-bar-old'
  import DownloadModal from '@components/download-modal'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    UNAPPROVE_PRODUCT_COUNT,
    BUSINESS_MEDICINE // TODO 药品兼容 后期优化
  } from '@/module/moduleTypes'
  import {
    fetchGetPoiAuditProductCount,
    fetchGetDownloadTaskList,
    fetchDownloadProduct,
    fetchGetPoiAuditProductStatistics
  } from '@/data/repos/merchantPoi'
  import {
    fetchGetCloseMerchant
  } from '@/data/repos/merchantProduct'
  import moment from 'moment'
  import { MERCHANT_STATUS_TEXT, MERCHANT_STATUS } from '@/views/progress/constants'
  import { KEYS } from '@/views/merchant/batch-management/menus'
  import storage, { KEYS as STORAGE_KEY } from '@/common/local-storage'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

  export default {
    name: 'merchant-product-list-navigator-bar',
    data () {
      return {
        auditProductCount: 0,
        downloadVisible: false,
        columns: [
          {
            title: '操作名称',
            key: 'name'
          },
          {
            title: '操作时间',
            key: 'utime',
            width: 180,
            render (h, { row }) {
              const { opTime } = row
              const time = moment(opTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              return <span>{ time }</span>
            }
          },
          {
            title: '操作状态',
            width: 100,
            render: (h, params) => {
              let statusText = MERCHANT_STATUS_TEXT[params.row.status] || ''
              return h('span', statusText)
            }
          },
          {
            title: '下载',
            width: 100,
            render: (h, params) => {
              const { status, downLoadUrl } = params.row
              if (status === MERCHANT_STATUS['SUCCESS'] && downLoadUrl) {
                return h(
                  'a',
                  {
                    attrs: {
                      target: '_blank',
                      href: downLoadUrl
                    }
                  },
                  '下载'
                )
              }
              return ''
            }
          }
        ]
      }
    },
    computed: {
      ...mapModule({
        unApproveProductCount: UNAPPROVE_PRODUCT_COUNT,
        isMedicine: BUSINESS_MEDICINE
      }),
      fetchGetDownloadTaskList () {
        return fetchGetDownloadTaskList
      },
      fetchSubmitDownloadProduct () {
        return fetchDownloadProduct
      },
      moduleMap () {
        return {
          createProduct: {
            show: !this.isMedicine,
            link: '/merchant/product/edit',
            id: 'creatSingleProduct'
          },
          download: true,
          unApproveProduct: {
            show: true,
            badge: {
              count: this.unApproveProductCount,
              overflowCount: 999
            },
            tooltip: {
              type: 'custom',
              content: '单店新建的商品在总部不存在时，会在待收录中暂存，如想总部管理可收录至商品库中',
              needOrders: true,
              orders: ['MERCHANT_TASK_PROCESS', 'UNAPPROVE_PRODUCT_ENTRANCE_TIP'],
              keyName: 'UNAPPROVE_PRODUCT_ENTRANCE_TIP'
            }
          },
          taskProgress: {
            show: true,
            order: 2,
            tooltip: {
              type: 'custom',
              placement: 'bottom',
              needOrders: true,
              orders: ['MERCHANT_OPERATION_GUIDE', 'MERCHANT_TASK_PROCESS'],
              transfer: true,
              content: '总部的所有增、删、改的操作需要一些时间同步给分店，操作后可在任务进度中查看是否完成',
              keyName: 'MERCHANT_TASK_PROCESS'
            }
          },
          merchantProductConfig: true,
          batchOperation: {
            show: !this.isMedicine,
            initVisible: !storage[STORAGE_KEY['NEW_BATCH_REL_GUIDE']] || !storage[STORAGE_KEY['MERCHANT_GUIDE']]
          },
          batchCreate: {
            show: true,
            link: {
              name: KEYS.CREATE
            },
            order: 1,
            id: 'batchCreate'
          },
          batchModify: {
            show: true,
            link: {
              name: KEYS.MODIFY
            },
            order: 2
          },
          batchUpload: {
            show: true,
            link: {
              name: KEYS.UPLOAD_IMAGE
            },
            order: 4
          },
          batchRel: {
            show: true,
            order: 3,
            link: {
              name: 'newBatchRel'
            },
            tooltip: {
              type: 'guide',
              placement: 'right',
              transfer: true,
              content: '①批量关联可给新开业门店批量建品哦；\n②总部商品修改后未更新到门店，因为门店商品未关联总部，也可批量关联一下~',
              keyName: 'NEW_BATCH_REL_GUIDE'
              // disabled: !!storage[STORAGE_KEY['NEW_BATCH_REL_GUIDE']]
            }
          },
          audit: {
            show: true,
            link: {
              path: '/merchant/product/auditList'
            },
            badge: this.auditProductCount,
            bid: 'b_shangou_online_e_3hpd4qhc_mc' // 商家商品中心审核按钮bid埋点
          },
          merchantWarehouseConfig: {
            show: true,
            order: 1,
            id: 'warehouse',
            menu: {
              id: 'warehouseMenu'
            },
            initVisible: !storage[STORAGE_KEY['MERCHANT_GUIDE']]
          },
          importFromPoi: {
            show: true,
            link: '/reuse/sc/product/views/seller/center/productImport',
            id: 'import'
          },
          resetMerchant: {
            show: true,
            questionTip: {
              content: '重置仅清除当前总部商品，重置总部商品库后分店中相应商品保持不变、不被清除',
              transfer: true,
              placement: 'right',
              maxWidth: 260
            },
            id: 'reset'
          },
          closeMerchant: {
            show: true,
            questionTip: {
              content: '同⼀品牌有多个账号，仅允许其中1个账号开通此系统。如需更换⾄其他账号操作，请关闭此系统',
              transfer: true,
              placement: 'right',
              maxWidth: 260
            },
            id: 'close'
          }
        }
      }
    },
    components: {
      HeaderBar,
      DownloadModal
    },
    mounted () {
      this.getAuditProductCount()
    },
    methods: {
      async handleClick (menu) {
        switch (menu.key) {
        case 'download':
          this.downloadVisible = true
          break
        case 'resetMerchant':
          const data = await fetchGetPoiAuditProductStatistics()
          const auditingNum = data[PRODUCT_AUDIT_STATUS['AUDITING']]
          const auditRejectNum = data[PRODUCT_AUDIT_STATUS['AUDIT_CORRECTION_REJECTED']]
          const sumNum = auditingNum + auditRejectNum
          this.$Modal.open({
            title: '确定重置总部商品库',
            render: () => <div>
              <h3>确定重置后，当前商品库中的商品将被清除、但分店中相应商品不会被删除，请谨慎操作。</h3>
              { sumNum !== 0 && <p style="color: red">注：当前有{sumNum}个商品为审核中或审核驳回状态，此类商品不会被清除，请关注商品审核状态。</p> }
            </div>,
            onOk: () => {
              this.$router.push({ name: 'merchantResetSelect' })
            }
          })
          break
        case 'closeMerchant':
          this.$Modal.open({
            title: '确定关闭总部商品库',
            content: '确定关闭后，当前商品库中的商品将被清除，请谨慎操作。分店中相应商品不会被删除。',
            onOk: async () => {
              try {
                await fetchGetCloseMerchant()
                this.$router.push({ name: 'merchantClose' })
              } catch (err) {
                this.$Message.error(err.msg || err.message || '网络错误')
              }
            }
          })
          break
        }
      },
      async getAuditProductCount () {
        let count = 0
        try {
          count = await fetchGetPoiAuditProductCount()
        } catch (err) {
          console.error(err)
        }
        this.auditProductCount = count
      }
    }
  }
</script>
