<template>
  <div class="modal-content-detail-upload-imgs">
    <Table border :data="dataSource.data" :columns="columns" />
    <div slot="footer" class="modal-footer">
      <Button type="primary" @click="handleClickOk">确定</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-content-detail-upload-imgs',
  props: {
    dataSource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      columns: [
        {
          title: '匹配方式',
          key: 'nameTypeDesc'
        }, {
          title: '匹配内容',
          key: 'imgValue'
        }
      ]
    }
  },
  methods: {
    handleClickOk () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
.modal-content-detail-upload-imgs {
  .modal-footer {
    padding: 20px 0;
    border-top: none;
    text-align: right;
    margin: 0;
  }
}
</style>
