<template>
  <div>
  <SlideUp>
    <div v-if="show">
      <div @click="handleClose" style="background: #fff; padding: 20px;box-sizing: border-box;">
        <h3>测试slide up效果</h3>
        <p>啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦</p>
      </div>
    </div>
  </SlideUp>
  <div style="background: #fff; padding: 20px;height: 100px">
  </div>
  </div>
</template>
<script>
  import SlideUp from './index'

  export default {
    name: 'slide-up-demo',
    data () {
      return {
        show: true
      }
    },
    components: {
      SlideUp
    },
    methods: {
      handleClose () {
        this.show = false
      }
    }
  }
</script>
