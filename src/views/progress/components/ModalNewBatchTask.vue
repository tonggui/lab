<template>
  <div class="modal-new-batch-task-container">
    <div>{{text}}</div>
    <div>
      <span>{{linkTitle}}</span>
      <a @click="handleClick">{{linkText}}</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modal-new-batch-task',
    props: {
      dataSource: Object
    },
    computed: {
      text () {
        return this.dataSource.text
      },
      link () {
        return this.dataSource.link
      },
      linkText () {
        return this.dataSource.linkText
      },
      linkTitle () {
        return this.dataSource.linkTitle || ''
      }
    },
    methods: {
      handleClick () {
        window.open(this.link)
        // this.$emit('close')
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
