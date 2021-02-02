<template>
  <div class="medicine-register-download">
    <div class="medicine-register-download-title">疫情药品购买信息下载</div>
    <div class="medicine-register-download-body">
      <Table
        :loading="loading"
        :columns="columns"
        :data="downloadData"
        :table-fixed="true"
        :show-header="true">
        <div slot="empty">
          <ProductEmpty>
            <template slot="description">
              <slot name="empty"></slot>
            </template>
          </ProductEmpty>
        </div>
      </Table>
    </div>
  </div>
</template>

<script>
  import { getInfoDownload } from '@/data/api/medicineRegister'
  export default {
    name: 'medicine-register-download',
    data () {
      return {
        loading: false,
        modalShow: false,
        downloadData: [],
        columns: [{
          title: '日期',
          key: 'formDate'
        }, {
          title: '表格',
          key: 'formName'
        }, {
          title: '操作',
          key: 'downloadUrl',
          render: (h, p) => (
            p.row.downloadUrl ? h('span', {
              style: {
                cursor: 'pointer',
                color: '#F89800'
              },
              on: {
                click: () => {
                  this.open(p.row.downloadUrl)
                }
              }
            }, '下载') : h('span', {
              style: {
                color: '#999'
              }
            }, '暂无数据下载')
          )
        }]
      }
    },
    mounted () {
      this.getDownload()
    },
    methods: {
      showDownload () {
        this.modalShow = true
        this.getDownload()
      },
      open (url) {
        if (!url) return
        try {
          parent.window.open(url)
        } catch (e) {
          console.log(e)
        }
      },
      getDownload () {
        this.loading = true
        getInfoDownload().then(data => {
          this.downloadData = data || []
          this.loading = false
        }).catch(e => {
          this.downloadData = []
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .medicine-register-download {
    &-title {
      display: flex;
      justify-content: space-between;
      color: @text-color-secondary;
      margin: 10px 0;
    }
    &-body {
      min-height: 500px;
      overflow-y: auto;
    }
  }
</style>
