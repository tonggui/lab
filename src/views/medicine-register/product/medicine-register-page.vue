<template>
  <div>
    <RegisterListHeader />
    <Container />
    <AgreementModal mode="sign" />
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import RegisterListHeader from './components/list-header/index'
  import Container from './container'
  import MedicineRegisterAgreement from '@/views/components/agreement/medicine-register'

  const { mapActions } = createNamespacedHelpers('medicineRegister')

  export default {
    name: 'medicine-register-page',
    inject: ['appState'],
    computed: {
      isBusinessClient () {
        return this.appState.isBusinessClient
      }
    },
    components: {
      RegisterListHeader,
      Container,
      AgreementModal: MedicineRegisterAgreement
    },
    methods: {
      ...mapActions(['getData', 'destroy'])
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
