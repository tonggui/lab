<template>
  <Modal
    title="上传图片"
    destroyOnClose
    width="820"
    :value="visible"
    :footer-hide="true"
    :class-name="'modal'"
    @on-cancel="handleCancel"
  >
    <Tabs :value="tabKey" @on-click="handleTabChanged">
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
          @confirm="handleConfirmEvent"
        />
      </TabPane>
    </Tabs>
  </Modal>
</template>

<script>
import PictureStore from "./picture-store";
import LocalUpload from "./local-upload";
/**
 * event {confirm, cancel}
 */
export default {
  name: "product-choose-modal",
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
          it => typeof it === "string" || typeof it === "number"
        );
      }
    },
    hasUpc: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      key: null
    };
  },
  computed: {
    tabKey() {
      return this.key || (this.keywords ? "1" : "2");
    }
  },
  methods: {
    handleConfirmEvent(src) {
      this.$emit("confirm", src);
    },

    handleTabChanged(key) {
      this.key = key;
    },

    handleSearchEnd(result, isAuto) {
      if (isAuto && result.total === 0) {
        this.key = "2";
      }
    },

    handleCancel() {
      this.$emit("cancel");
    }
  },
  components: {
    PictureStore,
    LocalUpload
  }
};
</script>

<style scoped lang="less">
.modal {
  :global {
    .ant-modal-header {
      padding: 20px 24px;
      border-bottom: none;
    }
    .ant-modal-title {
      font-size: 20px;
      line-height: 20px;
    }

    .ant-modal-body {
      padding: 0;
    }

    .ant-tabs-bar {
      margin-bottom: 0;
    }

    .ant-tabs-tabpane {
      padding: 24px;
    }
  }
}
</style>
