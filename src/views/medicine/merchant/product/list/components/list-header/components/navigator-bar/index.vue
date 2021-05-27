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

  import { KEYS, LINKS } from '@/views/medicine/merchant/batch-management/menus'
  import { fetchGetDownloadTaskList, fetchDownloadProduct } from '@/data/repos/medicineMerchantPoi'
  import moment from 'moment'
  import { MERCHANT_STATUS_TEXT, MERCHANT_STATUS } from '@/views/progress/constants'
  import {
    HEAD_QUARTER_MODE
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'medicine-merchant-product-list-navigator-bar',
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
        isHeadQuarterMode: HEAD_QUARTER_MODE
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
            show: true,
            link: '/medicine/merchant/product/edit'
          },
          taskProgress: {
            show: true,
            order: 2,
            link: LINKS.MEDICINE_PROGRESS
          },
          download: {
            show: true,
            order: 1
          },
          merchantProductConfig: {
            show: true,
            order: 2,
            link: '/medicine/merchant/product/setting'
          },
          batchOperation: {
            show: true,
            link: '/merchant/batchManagement/batchCreate'
          },
          batchCreate: {
            label: '新建商品中心商品',
            link: {
              name: KEYS.MEDICINE_CREATE
            },
            show: true,
            order: 1
          },
          batchModify: {
            show: true,
            link: {
              name: KEYS.MEDICINE_MODIFY
            },
            order: 2
          },
          batchUpload: {
            show: false
          },
          batchRel: {
            show: true,
            link: {
              name: KEYS.MEDICINE_REL
            },
            order: 3
          },
          batchSync: {
            show: !this.isHeadQuarterMode,
            link: {
              name: KEYS.MEDICINE_SYNC
            },
            order: 4
          }
        }
      }
    },
    components: {
      HeaderBar,
      DownloadModal
    },
    methods: {
      handleClick (menu) {
        console.log(menu)
        if (menu.key === 'download') {
          this.downloadVisible = true
        }
      }
    }
  }
</script>
