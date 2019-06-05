<template>
  <Modal
    :value="visible"
    footer="{this.renderFooter()}"
    title="下载商品"
    class-name="modal"
    @on-cancel="$emit('cancel')"
  >
    <div class="header">
      <Button @click="handleDownload" icon="add">新增下载</Button>
      <Button @click="handleRefresh" icon="sync">刷新</Button>
    </div>
    <Table :loading="fetching" :columns="columns" :data="list" border />
    <div slot="footer">
      <Button type="primary" @click="$emit('cancel')">确认</Button>
    </div>
  </Modal>
</template>

<script>
import {
  postDownloadExcelRequest,
  fetchDownloadTaskList
} from "@/data/repos/listRepository";
/**
 * event {cancel}
 */
export default {
  name: "download-modal",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fetching: false,
      list: [],
      columns: [
        {
          title: "操作名称",
          key: "name"
        },
        {
          title: "操作时间",
          key: "utime"
        },
        {
          title: "操作状态",
          render: (h, params) => {
            let statusText = "";
            if (params.row.status === 0) {
              statusText = "生成中";
            } else if (params.row.status === 1) {
              if (params.row.result !== 1) {
                statusText = "生成失败";
              } else if (params.row.result === 1) {
                statusText = "已生成";
              }
            }
            return h("span", statusText);
          }
        },
        {
          title: "下载",
          render: (h, params) => {
            const { status, result, output } = params.row;
            if (status === 1) {
              if (result !== 1) {
                return h("span", { class: "danger" }, "请重新下载");
              }
              return h(
                "a",
                {
                  attrs: {
                    target: "_blank",
                    href: output
                  }
                },
                "下载"
              );
            }
            return "";
          }
        }
      ]
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.getList();
      }
    }
  },
  methods: {
    async getList() {
      this.fetching = true;
      try {
        const list = await fetchDownloadTaskList({
          pageSize: 10,
          pageNum: 1,
          type: 6
        });
        this.list = list.data || [];
      } catch (err) {
        this.$Message.error(err.message || err);
        this.list = [];
      } finally {
        this.fetching = false;
      }
    },
    getRowKey: ({ id }) => id,

    async handleDownload() {
      try {
        await postDownloadExcelRequest({ v2: 1 }).then(() => {
          this.getList();
        });
        this.$Message.success("商品正在下载中，请稍后点击刷新按钮查看下载状态");
      } catch (err) {
        this.$Message.error(err.message || err);
      }
    },

    handleRefresh() {
      this.getList();
    }
  }
};
</script>

<style scoped lang="less">
.modal {
  :global {
    .ant-modal-body {
      min-height: 400px;
      max-height: 500px;
      overflow: auto;
    }
    .ant-modal-content {
      width: 600px;
    }
  }
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
