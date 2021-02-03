import Vue from 'vue'
import { register } from './store'
import medicineRegisterPage from './medicine-register-page'

register()

export default Vue.extend(medicineRegisterPage)
