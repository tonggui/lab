<template>
  <div class="recycle">
    <Breadcrumb separator=">">
      <BreadcrumbItem>
        <NamedLink :name="PRODUCT_LIST_PAGE_NAME" :query="productListPageParams">商品管理</NamedLink>
      </BreadcrumbItem>
      <BreadcrumbItem>商品回收站</BreadcrumbItem>
    </Breadcrumb>
    <Alert class="tip-alert" type="warning" show-icon closable>回收站仅保留15天内删除的商品，逾期自动清空</Alert>
    <div class="panel">
      <div class="panel-header">
        <p class="header-title">商品回收站</p>
        <div class="header-opr">
          <Button @click="handleAction('CLEAN')">清理回收站</Button>
        </div>
      </div>
      <div class="panel-form">
        <Form inline ref="searchForm" :model="searchForm">
          <FormItem props="name" label="商品名称" class="form-item-width">
            <Input type="text" v-model="searchForm.name" placeholder="请输入商品名称" style="width: 200px" />
          </FormItem>
          <FormItem props="date" label="删除时间" class="form-item-width">
            <DatePicker
              v-model="searchForm.date"
              @on-change="handleDateChange"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="开始时间 - 结束时间"
              style="width: 200px"
            />
          </FormItem>
          <FormItem class="search-form-btns">
            <Button type="primary" @click="changePage(1)">搜索</Button>
            <Button @click="clearSearchCond">清空搜索条件</Button>
          </FormItem>
        </Form>
      </div>
      <div class="recover-btn-wrapper">
        <Button type="primary" @click="handleAction('BATCH_RECOVER')">批量恢复</Button>
      </div>
      <Table :data="list" :columns="columns" :loading="loading" @on-selection-change="handleSelectionChange" />
      <div class="page-wrapper">
        <Pagination
          :pagination="pagination"
          @on-change="handlePageChange"
        />
      </div>
    </div>
    <Modal v-model="recycleModal" :title="MODAL_TYPE[modalType].title" :transfer="false" class="recycle-modal">
      <template v-if="MODAL_TYPE[modalType].config['TIP']">
        <Alert type="warning" show-icon>{{ MODAL_TYPE[modalType].tipText }}</Alert>
      </template>
      <template v-if="MODAL_TYPE[modalType].config['TAG']">
        恢复至店内分类：
        <Taglist
          :value="curTag"
          :width="200"
          :source="tagList"
          trigger-mode="hover"
          placeholder="请选择分类"
          @change="handleSelectTag"
        />
      </template>
      <template v-if="MODAL_TYPE[modalType].config['DATE']">
        清空删除日期早于 <DatePicker :value="cleanDateBefore" @on-change="handleCleanDateChange" format="yyyy-MM-dd" /> 的商品
      </template>
      <div slot="footer" class="modal-footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="onOk">{{ MODAL_TYPE[modalType].okText }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import productList from '@sgfe/eproduct/navigator/pages/product/list'
  import NamedLink from '@/components/link/named-link'
  import Taglist from '@/components/taglist'
  import { poiId } from '@/common/constants'
  import { MODAL_TYPE } from '@/views/recycle/constants'
  import { fetchGetTagList } from '@/data/repos/category'
  import {
    fetchRecycleProductList,
    cleanRecycleBin,
    recoverRecycleSpus
  } from '@/data/repos/productRepository'

  export default {
    name: 'recycle',
    components: {
      NamedLink,
      Taglist
    },
    data () {
      return {
        PRODUCT_LIST_PAGE_NAME: productList.name,
        poiId,
        pageNum: 1,
        pageSize: 20,
        totalNum: 0,
        searchForm: {
          name: '', // 商品名称
          date: []
        },
        productName: '', // 商品名称
        startDate: '', // 查询开始时间
        endDate: '', // 查询结束时间
        list: [], // 商品列表
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }, {
            title: '商品图片',
            key: 'picture',
            width: 100,
            render: (h, { row }) => {
              if (!row.picture) {
                return h('div', {
                  style: {
                    width: '64px',
                    height: '64px',
                    lineHeight: '60px',
                    textAlign: 'center',
                    border: '1px solid #e9eaf2',
                    backgroundColor: '#f7f8fa',
                    marginTop: '12px',
                    marginBottom: '11px'
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'image',
                      size: 22
                    }
                  })
                ])
              }
              return h('img', {
                attrs: {
                  src: row.picture,
                  width: 64,
                  height: 64
                },
                style: {
                  border: '1px solid #e9eaf2',
                  verticalAlign: 'middle',
                  marginTop: '12px',
                  marginBottom: '11px'
                }
              })
            }
          }, {
            title: '商品名称',
            key: 'name'
          }, {
            title: '商品分类',
            key: 'tagName'
          }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (h, { row }) => {
              return h('span', {
                style: {
                  color: '#f89800',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.handleAction('SINGLE_RECOVER', row)
                  }
                }
              }, '恢复')
            }
          }
        ],
        loading: false, // 列表加载中
        selectedSpus: [],
        recycleModal: false,
        MODAL_TYPE,
        modalType: 'CLEAN', // 模态框类型：'CLEAN'-清理模态框，'SINGLE_RECOVER'-恢复，'BATCH_RECOVER'-批量恢复
        cleanDateBefore: '', // 清理此日期之前的回收站数据
        tagList: [],
        defaultTag: [], // 选中某条/几条数据，第一条数据的tag节点数据，存放在这里，用作恢复弹窗中的默认分类
        curTag: []
      }
    },
    computed: {
      pagination () {
        return {
          current: this.pageNum,
          pageSize: this.pageSize,
          total: this.totalNum,
          showSizer: true,
          showTotal: true
        }
      },
      productListPageParams () {
        return {
          wmPoiId: this.poiId
        }
      }
    },
    watch: {
      recycleModal: {
        immediate: true,
        handler (show) {
          if (show && (this.modalType === 'SINGLE_RECOVER' || this.modalType === 'BATCH_RECOVER')) {
            const tagStillExist = this.findTarget(this.tagList, ...this.defaultTag)
            if (tagStillExist) {
              this.curTag.push(...this.defaultTag)
            } else {
              this.$Message.warning('原店内分类已经不存在了，请重新选择')
            }
          }
        }
      }
    },
    methods: {
      findTarget (tree, target) {
        let found = false
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          if (node.id === Number(target.id) && node.name === target.name) {
            found = true
            break
          }
          if (node.children && node.children.length) {
            found = this.findTarget(node.children, target)
            if (found) {
              break
            }
          }
        }
        return found
      },
      handleDateChange (date) {
        this.searchForm.date = date
      },
      handleCleanDateChange (date) {
        this.cleanDateBefore = date
      },
      handleSelectTag (val) {
        this.curTag = val
      },
      clearSearchCond () {
        this.searchForm.name = ''
        this.searchForm.date = []
      },
      handleSelectionChange (selection) {
        if (selection.length) {
          this.selectedSpus = []
          selection.forEach((s, i) => {
            this.selectedSpus.push(s.id)
            if (i === 0) {
              this.defaultTag = []
              this.defaultTag.push({ id: s.tagId, name: s.tagName })
            }
          })
        } else {
          this.selectedSpus = []
        }
      },
      handleAction (type, data = null) {
        this.modalType = type
        if (type === 'BATCH_RECOVER' && this.selectedSpus.length === 0) {
          this.$Message.warning('请至少选择一个要恢复的商品哟~')
          return
        }
        if (type === 'SINGLE_RECOVER' && data !== null) {
          this.selectedSpus = []
          this.selectedSpus.push(data.id)
          this.defaultTag = []
          this.defaultTag.push({ id: data.tagId, name: data.tagName })
        }
        this.recycleModal = true
      },
      getRecycleProductList () {
        const params = {
          wmPoiId: this.poiId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.searchForm.name,
          startDate: this.searchForm.date[0] || '',
          endDate: this.searchForm.date[1] || ''
        }
        return new Promise((resolve, reject) => {
          fetchRecycleProductList(params).then(res => {
            this.totalNum = res.total
            resolve(res.list)
          }).catch(err => {
            reject(err)
          })
        })
      },
      changePage (pageNum) {
        this.pageNum = pageNum
        this.loading = true
        this.getRecycleProductList().then(data => {
          this.loading = false
          this.list = data
        }).catch(err => {
          this.loading = false
          this.$Message.error(err.message || err)
        })
      },
      handlePageChange (pagination) {
        this.pageNum = pagination.current
        this.pageSize = pagination.pageSize
        this.changePage(this.pageNum)
      },
      // changePageSize (size) {
      //   this.pageSize = size
      //   this.changePage(1)
      // },
      getTagList () {
        fetchGetTagList().then(data => {
          this.tagList = data
        }).catch(err => {
          this.$Message.error(err.message || err)
        })
      },
      cancel () {
        this.recycleModal = false
        this.curTag = []
      },
      onOk () {
        switch (this.modalType) {
        case 'CLEAN':
          this.postClean()
          break
        case 'SINGLE_RECOVER':
        case 'BATCH_RECOVER':
          this.postRecover(this.modalType)
          break
        default:
          break
        }
      },
      postClean () {
        if (!this.cleanDateBefore) {
          this.$Message.warning('请选择日期')
          return
        }
        const params = {
          poiId: this.poiId,
          endDate: this.cleanDateBefore
        }
        cleanRecycleBin(params).then(() => {
          this.$Message.success('清理成功')
          this.cancel()
          this.changePage(1)
        }).catch(err => {
          this.$Message.error(err.message || err || '清理失败')
        })
      },
      postRecover (type = 'BATCH_RECOVER') {
        if (!this.curTag.length) {
          this.$Message.warning('请选择分类')
          return
        }
        const params = {
          poiId: this.poiId,
          tagId: this.curTag[0].id,
          spuIds: this.selectedSpus.join(',')
        }
        recoverRecycleSpus(params).then(() => {
          this.$Message.success('恢复成功')
          this.cancel()
          this.selectedSpus = []
          this.defaultTag = []
          this.changePage(1)
        }).catch(err => {
          this.$Message.error(err.message || err || '恢复失败')
        })
      }
    },
    created () {
      this.changePage(this.pageNum)
      this.getTagList()
    }
  }
</script>

<style lang='less' scoped>
.recycle {
  text-align: left;
  .link {
    font-size: 14px;
    padding: 0;
    vertical-align: bottom;
    border: none;
  }
  .tip-alert {
    margin-top: 10px;
  }
  .panel {
    min-width: 1000px;
    min-height: 700px;
    padding: 0 20px 30px;
    background-color: #fff;
    margin-top: 10px;
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 20px 0;
      .header-title {
        font-size: 20px;
        line-height: 26px;
        align-self: baseline;
      }
    }
    .panel-form {
      .form-item-width {
        width: 280px;
      }
      .search-form-btns {
        .boo-btn:not(:first-of-type) {
          margin-left: 10px;
        }
      }
    }
    .recover-btn-wrapper {
      padding-bottom: 10px;
      text-align: right;
    }
    .boo-table-tbody {
      .boo-table-row {
        height: 70px;
      }
    }
    .page-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 60px;
    }
  }
  .recycle-modal {
    .modal-footer {
      margin-top: 30px;
    }
  }
}
</style>
<style lang='less'>
.recycle {
  .boo-btn {
    font-size: 14px;
  }
  .panel {
    .panel-form {
      .boo-form {
        .boo-form-item-label {
          font-size: 14px;
          padding-top: 12px;
        }
      }
    }
  }
}
</style>
