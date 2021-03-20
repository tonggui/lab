<template>
  <StepFoot>
    <Button class="left-btn" @click="handlePreviousStep">上一步</Button>
    <Button @click="handleBatchRel" type="primary">确定关联</Button>
  </StepFoot>
</template>

<script>
  import StepFoot from '../../../components/step-foot'
  export default {
    name: 'poi-foot',
    components: {
      StepFoot
    },
    methods: {
      handleCancel () {
        this.$router.back()
      },
      handlePreviousStep () {
        this.$emit('step-change', 'POI', 'previous')
      },
      handleBatchRel () {
        this.$emit('batch-rel', () => {
          this.$emit('step-change', 'POI', 'RELATE')
        })
      }
    }
  }
</script>

<style scoped>

</style>
