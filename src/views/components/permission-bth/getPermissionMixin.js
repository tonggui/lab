import { getPermission } from '@/views/components/permission-bth/util'

export const getPermissions = (...types) => ({
  data () {
    return {
      permissions: {}
    }
  },
  async created () {
    console.log(types, this.needPermission)
    for (let i = 0; i < types.length; i++) {
      this.permissions[types[i]] = true
      const permission = await getPermission(types[i])
      this.permissions[types[i]] = !this.needPermission || await getPermission(types[i])
      console.log(types[i], permission, this.permissions[types[i]])
    }
  }
})

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
