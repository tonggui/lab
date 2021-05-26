<template>
  <div class="modal-new-batch-task-container">
    <h4>{{dataSource.subTitle}}</h4>
    <br />
    <template v-if="success">
      <div v-if="dataSource.modify">修改方式: {{dataSource.modify}}</div>
      <div v-if="targetTag">目标分类: {{targetTag}}</div>
      <div>涉及商品: <a @click="() => handleClick(productUrl)">{{dataSource.productUrlText}}</a></div>
      <div>门店范围: {{dataSource.poiRange}}</div>
      <div>涉及门店: <a @click="() => handleClick(poiUrl)">涉及的门店列表.xlsx</a></div>
    </template>
    <template v-else>
      <div>{{dataSource.failText}}: <a @click="() => handleClick(failUrl)">{{dataSource.failUrlText}}</a></div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'modal-new-batch-task',
    props: {
      dataSource: Object
    },
    computed: {
      targetTag () {
        return (this.dataSource.tag || []).join('; ')
      },
      productUrl () {
        return this.dataSource.productUrl
      },
      failUrl () {
        return this.dataSource.failUrl
      },
      poiUrl () {
        return this.dataSource.poiUrl
      },
      success () {
        return this.dataSource.type === 'success'
      },
      text () {
        return this.dataSource.text
      },
      link () {
        return this.dataSource.link
      }
    },
    methods: {
      handleClick (url) {
        window.open(url || this.link)
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
