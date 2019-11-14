<template>
  <div class="tag-input">
    <span><Input :value="name" placeholder="请输入一级分类" @on-change="handleNameChange" /></span>
    <span><Input :value="subName" placeholder="请输入二级分类" @on-change="handleSubNameChange" /></span>
  </div>
</template>
<script>
  export default {
    name: 'tag-input',
    data () {
      return {
        name: '',
        subName: ''
      }
    },
    methods: {
      triggerChange () {
        const value = [{
          name: this.name,
          subName: this.subName
        }]
        this.$emit('change', value)
        this.$emit('input', value)
      },
      handleSubNameChange (e) {
        const v = e.target.value
        this.subName = v
        this.triggerChange()
      },
      handleNameChange (e) {
        const v = e.target.value
        this.name = v
        this.triggerChange()
      }
    }
  }
</script>
<style lang="less" scoped>
  .tag-input {
    display: flex;
    > span {
      width: 210px;
      margin-right: 20px;
      /deep/ .boo-input-wrapper {
        width: 100%;
      }
    }
  }
</style>
