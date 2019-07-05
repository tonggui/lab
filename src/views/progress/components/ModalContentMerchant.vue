<template>
  <div class="modal-content-merchant">
    <p class="sub-title">{{ subTitle }}</p>
    <ul class="container">
      <li v-for="(item, idx) in list" :key="idx + item" class="list-item">{{ item }}</li>
    </ul>
    <div slot="footer" class="modal-footer">
      <Button type="primary" @click="handleClickOk">确定</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-content-merchant',
  props: {
    dataSource: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    subTitle () {
      return this.dataSource.title || ''
    },
    list () {
      return this.dataSource.list || []
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
.modal-content-merchant {
  .sub-title {
    width: 460px;
    font-size: 12px;
    color: @primary-color;
    padding-bottom: 20px;
    margin-top: -10px;
  }
  .container {
    width: 460px;
    height: 244px;
    font-size: 12px;
    color: @primary-color;
    padding: 20px;
    border: 1px solid @color-gray5;
    overflow: auto;
    .list-item {
      line-height: 17px;
      list-style-type: none;
    }
  }
  .modal-footer {
    padding: 20px 0;
    border-top: none;
    text-align: right;
    margin: 0;
  }
}
</style>
