<template>
  <div>
    <RegisterListHeader />
    <Container />
    <AgreementModal mode="sign" />
    <medicineRegisterModal ref="medicineRegisterModal" />
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import RegisterListHeader from './components/list-header/index'
  import Container from './container'
  import MedicineRegisterAgreement from '@/views/components/agreement/medicine-register'
  import medicineRegisterModal from '@/views/medicine-register/components/register-edit'

  const { mapActions } = createNamespacedHelpers('medicineRegister')

  export default {
    name: 'medicine-register-page',
    inject: ['appState'],
    provide () {
      return {
        addMedicineSettings: this.addMedicineSettings,
        editMedicineSettings: this.editMedicineSettings
      }
    },
    computed: {
      isBusinessClient () {
        return this.appState.isBusinessClient
      }
    },
    components: {
      RegisterListHeader,
      Container,
      AgreementModal: MedicineRegisterAgreement,
      medicineRegisterModal
    },
    methods: {
      ...mapActions(['getData', 'destroy']),
      addMedicineSettings () {
        this.$refs.medicineRegisterModal && this.$refs.medicineRegisterModal.show()
      },
      editMedicineSettings (editData) {
        this.$refs.medicineRegisterModal && this.$refs.medicineRegisterModal.show(editData)
      }
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
