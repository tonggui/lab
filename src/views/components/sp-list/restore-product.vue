<template>
  <Modal v-model="recycleModal" :title="MODAL_TYPE[modalType].title" :transfer="false" class="recycle-modal">
    <template v-if="MODAL_TYPE[modalType].config['TIP']">
      <Alert type="warning" show-icon>{{ MODAL_TYPE[modalType].tipText }}</Alert>
    </template>
    <div class="product-name-style">
      商品名称：{{restoreProductName}}
    </div>
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
    <div slot="footer" class="modal-footer">
      <Button @click="cancel">取消</Button>
      <Button :loading="submitting" type="primary" @click="onOk">{{ MODAL_TYPE[modalType].okText }}</Button>
    </div>
  </Modal>
</template>

<script>
  import { MODAL_TYPE } from '@/views/recycle/constants'
  import { fetchGetTagList } from '@/data/repos/category'
  import { recoverRecycleSpus } from '@/data/api/productApi'
  import Taglist from '@/components/taglist'
  export default {
    name: 'restore-product',
    components: {
      Taglist
    },
    props: {
      recycleModal: {
        type: Boolean,
        default: () => true
      },
      restoreProductName: {
        type: String
      },
      selectedSpus: {
        type: Array,
        default: () => []
      },
      // 选中某条/几条数据，第一条数据的tag节点数据，存放在这里，用作恢复弹窗中的默认分类
      defaultTag: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        MODAL_TYPE,
        modalType: 'SINGLE_RECOVER', // 模态框类型：'CLEAN'-清理模态框，'SINGLE_RECOVER'-恢复，'BATCH_RECOVER'-批量恢复
        tagList: [],
        curTag: [],
        submitting: false
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
    created () {
      this.getTagList()
    },
    methods: {
      getTagList () {
        fetchGetTagList().then(data => {
          this.tagList = data
        }).catch(err => {
          this.$Message.error(err.message || err)
        })
      },
      handleSelectTag (val) {
        this.curTag = val
      },
      postRecover () {
        if (!this.curTag.length) {
          this.$Message.warning('请选择分类')
          this.submitting = false
          return
        }
        let selectedSpu = [...this.selectedSpus]
        console.log(this.curTag)
        const params = {
          poiId: this.poiId,
          tagId: this.curTag[0].id,
          spuIds: selectedSpu.join(',')
        }
        recoverRecycleSpus(params).then(() => {
          this.$Message.success('恢复成功')
          this.curTag = []
          // this.cancel()
          this.$emit('on-confirm')
        }).catch(err => {
          console.log(err)
          // 回收站无该商品(被清空;已恢复)
          // 店内分类不存在;店内分类非叶子节点
          this.$Message.error(err.message || err || '恢复失败')
        }).finally(() => {
          this.submitting = false
        })
      },
      onOk () {
        this.submitting = true
        this.postRecover()
      },
      cancel () {
        this.curTag = []
        this.$emit('on-cancel')
      },
      findTarget (tree, target) {
        console.log(tree, target)
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
      }
    }
  }
</script>

<style scoped lang='less'>
.recycle-modal {
.modal-footer {
  margin-top: 30px;
}
  .product-name-style{
    margin: 20px 0px 10px 20px;
  }
}
</style>
