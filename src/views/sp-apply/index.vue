<template>
  <div>
    <MedicineApplyForm
      :data="data"
      :context="context"
    />
  </div>
</template>

<script>
  import MedicineApplyForm from '@/views/components/medicine-apply-form/form'
  export default {
    name: 'index.vue',
    components: {
      MedicineApplyForm
    },
    data () {
      return {
        data: {},
        context: {
          auditing: false
        }
      }
    }
  }
</script>

<style scoped>

</style>
