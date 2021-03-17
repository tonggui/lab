<template>
  <StepFoot>
    <Button class="left-btn" @click="handleCancel">取消</Button>
    <Button @click="handleNextStep" type="primary">下一步</Button>
  </StepFoot>
</template>

<script>
  import StepFoot from '../../../components/step-foot'
  export default {
    name: 'product-foot',
    components: {
      StepFoot
    },
    methods: {
      handleCancel () {
        this.$router.back()
      },
      handleNextStep () {
        this.$emit('step-change', 'PRODUCT', 'next')
      }
    }
  }
</script>

<style scoped>

</style>
