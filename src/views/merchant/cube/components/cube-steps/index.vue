<template>
  <div class="merchant-cube-step-container">
    <Steps :list="list" class="cube-steps" :current="current" />
  </div>
</template>

<script>
  import Steps from '@/components/steps'
  import stepConfig from '../../router'

  export default {
    name: 'cube-steps',
    data () {
      return {
        list: stepConfig.map(item => ({ id: item.meta.id, title: item.meta.title, name: item.name, path: item.path })),
        current: 0
      }
    },
    components: {
      Steps
    },
    watch: {
      '$route': {
        immediate: true,
        handler () {
          const route = this.$router.match(window.location.pathname)
          const index = this.list.findIndex(item => (route.path || '').includes(item.path))
          this.current = index
        }
      }
    }
  }
</script>

<style lang="less">
@selectors: 0, 1, 2, 3;
.merchant-cube-step-container {
  .cube-steps .steps .default-step {
    display: flex;
    align-items: center;
    each(@selectors, {
      &.step {
        &-@{value} { width: 25% !important;}
      }
    })
  }
}
</style>

<style lang="less" scoped>
  .merchant-cube-step-container {
    background: #fff;
    padding: 30px 0;
    margin-bottom: 10px;
    .cube-steps {
      margin-bottom: 0;
    }
  }
</style>
