<template>
  <div>
    状态
  </div>
</template>

<script>
  import { getCubeTaskStatus } from '@/data/repos/merchantCube'

  export default {
    name: 'status',
    methods: {
      async getRunningStatusStatus () {
        const { status } = await getCubeTaskStatus()
        console.log('status', status)
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
