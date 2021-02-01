<template>
  <div>
    <RegisterListHeader />
    <Container />
    <AgreementModal mode="sign" />
    <medicineRegisterModal ref="medicineRegisterModal" @on-success="refreshHandle" />
  </div>
</template>
<script>
  import RegisterListHeader from './components/list-header/index'
  import Container from './container'
  import MedicineRegisterAgreement from '@/views/components/agreement/medicine-register'
  import medicineRegisterModal from '@/views/medicine-register/components/register-edit'
  import { helper } from './store'
  const { mapActions } = helper()
  const { mapActions: mapActionsProduct } = helper('product')

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
      ...mapActions([
        'getData',
        'getProductList',
        'destroy'
      ]),
      ...mapActionsProduct([
        'resetPagination',
        'resetSearchParams'
      ]),
      addMedicineSettings () {
        this.$refs.medicineRegisterModal && this.$refs.medicineRegisterModal.show()
      },
      editMedicineSettings (editData) {
        this.$refs.medicineRegisterModal && this.$refs.medicineRegisterModal.show(editData)
      },
      refreshHandle (isEdit) {
        if (!isEdit) {
          this.resetPagination()
          this.resetSearchParams()
        }
        this.getProductList()
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
