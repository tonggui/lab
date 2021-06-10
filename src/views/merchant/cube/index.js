import Vue from 'vue'
import { register } from './store'
import cube from './index.vue'

register()
export default Vue.extend(cube)
