<template>
  <Modal
    title="上传图片"
    width="820"
    :value="visible"
    footer-hide
    class="picture-modal"
    @on-cancel="handleCancel"
    @on-visible-change="handleVisibleChange"
  >
    <Tabs
      v-if="tabVisible"
      :value="tabKey"
      :animated="false"
      @on-click="handleTabChanged"
    >
      <TabPane name="1" label="图片选择">
        <PictureStore
          :keywords="keywords"
          @confirm="handleConfirmEvent"
          @search-end="handleSearchEnd"
        />
      </TabPane>
      <TabPane name="2" label="本地上传">
        <LocalUpload
          :score="score"
          :poiIds="poiIds"
          :hasUpc="hasUpc"
          :minWidth="minWidth"
          :aspectRatios="aspectRatios"
          :autoCropArea="autoCropArea"
          @confirm="handleConfirmEvent"
        />
      </TabPane>
    </Tabs>
  </Modal>
</template>

<script>
  import PictureStore from './picture-store'
  import LocalUpload from './local-upload'
  export default {
    name: 'ProductChooseModal',
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      keywords: {
        type: String,
        default: null
      },
      score: {
        type: Boolean,
        default: false
      },
      poiIds: {
        type: Array,
        validator: val => {
          return val.every(
            it => typeof it === 'string' || typeof it === 'number'
          )
        }
      },
      hasUpc: {
        type: Boolean,
        default: false
      },
      minWidth: {
        type: Number,
        default: 600
      },
      aspectRatios: {
        type: Array,
        default: () => [
          {
            label: '1 / 1',
            value: 1
          },
          {
            label: '4 / 3',
            value: 4 / 3
          }
        ]
      },
      autoCropArea: Number // 自动裁剪区域大小（0~1）
    },
    data () {
      return {
        key: null,
        tabVisible: false
      }
    },
    computed: {
      tabKey () {
        return this.key || (this.keywords ? '1' : '2')
      }
    },
    watch: {
      visible: {
        immediate: true,
        handler (v) {
          this.tabVisible = v
        }
      }
    },
    methods: {
      handleConfirmEvent (src) {
        this.$emit('confirm', src)
      },
      handleTabChanged (key) {
        this.key = key
      },
      handleSearchEnd (result, isAuto) {
        if (isAuto && result.total === 0) {
          this.key = '2'
        }
      },
      handleCancel () {
        this.$emit('cancel')
      },
      handleVisibleChange (v) {
        setTimeout(() => (this.tabVisible = v), 1000)
      }
    },
    components: {
      PictureStore,
      LocalUpload
    }
  }
</script>

<style scoped lang="less">
  .picture-modal {
    /deep/ .boo-modal-header {
      padding: 20px 24px
    }
    /deep/ .boo-modal-body {
      padding: 0
    }

    /deep/ .boo-tabs {
      .boo-tabs-bar {
        margin-bottom: 0;
      }
      .boo-tabs-tab {
        padding: 16px 24px;
      }

      .boo-tabs-tabpane {
        padding: 24px
      }
    }
  }
</style>
