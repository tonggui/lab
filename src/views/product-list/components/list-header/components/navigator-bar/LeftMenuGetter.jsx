import { leftMenu } from '@/components/header-bar/config'
import { mapModule } from '@/module/module-manage/vue'
import isPlainObject from 'lodash/isPlainObject'
import {
  POI_BUSINESS_DAY,
  POI_PRODUCT_CUBE_ENTRANCE,
  POI_PRODUCT_NEW_ARRIVAL_SWITCH
} from '@/module/moduleTypes'
import { inBatchInsertNewGrey } from '@/data/api/batch'
import { poiId } from '@/common/constants'
import lx from '@/common/lx/lxReport'

export default {
  name: 'LeftMenuGetter',
  data () {
    return {
      inBatchGrey: false,
      firstStatus: true
    }
  },
  computed: {
    ...mapModule({
      businessDays: POI_BUSINESS_DAY,
      newArrivalSwitch: POI_PRODUCT_NEW_ARRIVAL_SWITCH,
      supportProductCube: POI_PRODUCT_CUBE_ENTRANCE
    }),
    computedCubeShow () {
      const { businessDays, onlineDayLimit } = this.businessDays
      console.log('computedCubeShow', businessDays, onlineDayLimit, this.newArrivalSwitch.switch, this.supportProductCube)
      if ((this.newArrivalSwitch || {}).switch === undefined) return 0
      if (businessDays > onlineDayLimit) return this.newArrivalSwitch.switch ? 2 : (this.supportProductCube ? 1 : 0)
      else return this.supportProductCube ? 1 : 0
    },
    distMenuList () {
      return leftMenu.map(item => {
        if (!isPlainObject(item)) return
        const { key } = item || {}
        if (key === 'batchCreate' && this.inBatchGrey) return { ...item, link: '/reuse/sc/product/views/seller/center/new/create' }
        if (item.key === 'productLibrary' && this.computedCubeShow) {
          this.reportMagicLx()
          return {
            key: 'productLibrary',
            label: '商品魔方',
            icon: item.icon,
            link: this.computedCubeShow === 2
              ? { name: 'newArrivalList', query: this.$route.query }
              : { name: 'productRecommend', query: this.$route.query },
            bid: this.computedCubeShow === 2 ? 'b_shangou_online_e_n2chi3yh_mc' : 'b_shangou_online_e_i4acqwpi_mc',
            description: '从商品魔方新建商品'
          }
        }
        return item
      })
    }
  },
  methods: {
    async updateBatchGray () {
      const data = await inBatchInsertNewGrey(poiId)
      this.inBatchGrey = (data || {}).inGrey
    },
    reportMagicLx () {
      if (!this.firstStatus) return
      lx.mv({ bid: this.computedCubeShow === 2 ? 'b_shangou_online_e_bvdvb4tt_mv' : 'b_shangou_online_e_rbtq0rr1_mv' }, 'productCube') // 魔方入口曝光
      this.firstStatus = false
    }
  },
  mounted () {
    this.updateBatchGray()
  },
  render () {
    return <div>
      {this.$scopedSlots.default(this.distMenuList)}
    </div>
  }

}
