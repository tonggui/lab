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
  import HeaderBar from '@/components/header-bar'
  import DownloadModal from '@components/download-modal'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    UNAPPROVE_PRODUCT_COUNT,
    BUSINESS_MEDICINE // TODO 药品兼容 后期优化
  } from '@/module/moduleTypes'
  import {
    fetchGetPoiAuditProductCount,
    fetchGetDownloadTaskList,
    fetchDownloadProduct
  } from '@/data/repos/merchantPoi'
  import moment from 'moment'
  import { MERCHANT_STATUS_TEXT, MERCHANT_STATUS } from '@/views/progress/constants'
  import { KEYS } from '@/views/merchant/batch-management/menus'
  import storage, { KEYS as STORAGE_KEY } from '@/common/local-storage'

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
            link: '/merchant/product/edit'
          },
          download: true,
          unApproveProduct: {
            show: true,
            badge: {
              count: this.unApproveProductCount,
              overflowCount: 999
            }
            // tooltip: {
            //   type: 'guide',
            //   content: '分店新增商品，临时放在待收录',
            //   keyName: 'UNAPPROVE_PRODUCT_ENTRANCE_TIP'
            // }
          },
          taskProgress: {
            show: true,
            order: 2
          },
          merchantProductConfig: true,
          batchOperation: {
            show: !this.isMedicine,
            initVisible: !storage[STORAGE_KEY['NEW_BATCH_REL_GUIDE']]
          },
          batchCreate: {
            show: true,
            link: {
              name: KEYS.CREATE
            },
            order: 1
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
              keyName: 'NEW_BATCH_REL_GUIDE',
              disabled: !!storage[STORAGE_KEY['NEW_BATCH_REL_GUIDE']]
            }
          },
          audit: {
            show: true,
            link: {
              path: '/merchant/product/auditList'
            },
            badge: this.auditProductCount,
            bid: 'b_shangou_online_e_3hpd4qhc_mc' // 商家商品中心审核按钮bid埋点
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
      handleClick (menu) {
        switch (menu.key) {
        case 'download':
          this.downloadVisible = true
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
