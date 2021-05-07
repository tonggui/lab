import { getPermission } from '@/views/components/permission-bth/util'

export const forceGetPermission = (btnType) => ({
  data () {
    return {
      btnType,
      havePermission: true
    }
  },
  async created () {
    this.havePermission = await getPermission(this.btnType)
  }
})

export default (btnType) => ({
  data () {
    return {
      btnType,
      havePermission: true
    }
  },
  async created () {
    this.havePermission = !this.needPermission || await getPermission(this.btnType)
  }
})
