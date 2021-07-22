import { triggerTour } from './merchant-tour'
import { mapModule } from '@/module/module-manage/vue'
import { MERCHANT_CUBE_SWITCH } from '@/module/moduleTypes'

export default {
  computed: {
    ...mapModule({
      merchantCubeSwitch: MERCHANT_CUBE_SWITCH
    })
  },
  methods: {
    activeTour (inExistSteps) {
      if (!this.hasResult) {
        this.hasResult = true
        triggerTour({ inExistSteps })
      }
    }
  },
  beforeDestroy () {
    this.unwatch()
    clearTimeout(this.timeout)
  },
  mounted () {
    this.hasResult = false
    this.timeout = setTimeout(() => {
      this.activeTour(['#cubeCreate'])
    }, 2000)
    this.unwatch = this.$watch('merchantCubeSwitch', (val) => {
      if (val !== undefined) this.activeTour(val ? [] : ['#cubeCreate'])
    }, {
      immediate: true
    })
  }
}
