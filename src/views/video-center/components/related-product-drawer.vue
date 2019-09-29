<template>
  <div class="related-product-drawer">
    <Drawer
      :mask-closable="false"
      v-bind="$attrs"
      v-on="$listeners"
      :value="!!video"
      title="关联商品"
      >
      <related-product ref="relatedProduct" :video="video" />
      <template slot="footer">
        <Button class="drawer-footer-btn" size="large" @click="cancel">取消</Button>
        <Button class="drawer-footer-btn" size="large" type="primary" @click="confirm" :loading="submitting">确认</Button>
      </template>
    </Drawer>
  </div>
</template>

<script>
  import RelatedProduct from './related-product'
  import { getTagList } from '@/common/global-state'
  import { relVideo } from '@/data/repos/videoRepository'

  export default {
    name: 'related-product-drawer',
    components: { RelatedProduct },
    props: {
      video: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        submitting: false
      }
    },
    watch: {
      video (v) {
        if (v && v.id) {
          getTagList()
        }
      }
    },
    methods: {
      cancel () {
        this.$emit('input', null)
      },
      confirm () {
        const selectedIds = this.$refs.relatedProduct.selectedIds
        if (selectedIds.length) {
          this.submitting = true
          relVideo({
            spuIds: selectedIds.join(','),
            videoId: this.video.id
          }).then(() => {
            this.$Message.success('关联商品成功')
            this.$emit('confirm')
          }).catch(err => {
            this.$Message.error(err.message)
          }).finally(() => {
            this.submitting = false
          })
        } else {
          this.$Message.warning('请至少选择一个商品')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.drawer-header {
  font-size: 20px;
}
.drawer-close {
  padding: 5px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: @primary-color;
  .round {
    @round-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: @round-size;
    height: @round-size;
    border: 1px solid @border-color-base;
    border-radius: 50%;
    margin-left: 10px;
  }
}
.drawer-content {
  height: 100%;
  padding: 5px 0 50px;
}
.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  text-align: right;
  &-btn {
    margin-right: 10px;
  }
}
</style>
