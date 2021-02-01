<template>
  <div class="medicine-register-info-download">
    <Button class="open-download" @click="showDownload">
      疫情药品购买信息下载
    </Button>
    <Modal
      v-model="modalShow"
      footer-hide
      title="疫情药品购买信息下载"
    >
      <div class="download-body">
        <Table :columns="columns" :data="downloadData"></Table>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getInfoDownload } from '@/data/api/medicineRegister'
  export default {
    name: 'medicine-register-download',
    data () {
      return {
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
        getInfoDownload().then(data => {
          this.downloadData = data || []
        }).catch(e => {
          this.downloadData = []
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .medicine-register-info-download {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
</style>
