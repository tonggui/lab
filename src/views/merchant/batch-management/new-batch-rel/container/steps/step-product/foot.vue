<template>
  <StepFoot>
    <Button class="left-btn" @click="handleCancel" :style="{ 'min-width': '72px' }">取消</Button>
    <Button @click="handleNextStep" type="primary">下一步</Button>
  </StepFoot>
</template>

<script>
  import StepFoot from '../../../components/step-foot'
  export default {
    name: 'product-foot',
    props: {
      handleValidate: Function
    },
    components: {
      StepFoot
    },
    methods: {
      handleCancel () {
        this.$router.back()
      },
      handleNextStep () {
        if (!this.handleValidate()) this.$emit('step-change', 'PRODUCT', 'next')
      }
    }
  }
</script>

<style scoped>

</style>
