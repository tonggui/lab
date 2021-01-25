<template>
  <div>
    <RegisterListHeader />
    <Container />
    <AgreementModal mode="sign" />
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import RegisterListHeader from './components/list-header'
  import Container from './container'
  import StandardProductLibraryAgreement from '@/views/components/agreement/standard-product-library'

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
      AgreementModal: StandardProductLibraryAgreement
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
