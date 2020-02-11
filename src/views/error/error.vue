<template>
  <div class="error-page">
    <div class="img"><img :src="img" /></div>
    <div class="content">
      <h1 v-if="title" class="title">{{ title }}</h1>
      <p>{{ description }}</p>
      <Button size="large" @click="handleClick" type="primary">{{ buttonText }}</Button>
    </div>
  </div>
</template>
<script>
  import errorImg from './img/error.png'
  import invalidImg from './img/invalid.png'

  export default {
    name: 'error',
    props: {
      invalid: Boolean,
      description: {
        type: String,
        default: `哎呀，哪里出错了～`
      },
      buttonText: {
        type: String,
        default: '刷新一下'
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      img () {
        return this.invalid ? invalidImg : errorImg
      }
    },
    methods: {
      handleClick () {
        this.$emit('refresh')
      }
    }
  }
</script>
<style lang="less" scoped>
  .error-page {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    .img {
      width: 400px;
      img {
        width: 100%;
      }
    }
    .content {
      width: 400px;
      margin-left: 100px;
      .title {
        font-size: 36px;
        font-weight: bold;
        color: #434e59;
        margin-bottom: 40px;
      }
      p {
        color: rgba(0,0,0,.45);
        font-size: @font-size-large;
        line-height: 2;
        margin-bottom: 40px;
      }
    }
  }
</style>
