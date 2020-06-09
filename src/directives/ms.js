import VueWaypoint from 'vue-waypoint'

export default {
  bind (el, binding, vnode) {
    const {
      active, callback, observeOption
    } = binding.value
    if (active) {
      const waypoint = VueWaypoint.addObserver(el, callback, observeOption)
      vnode._waypoint = waypoint
    }
  },

  update (el, binding, vnode, oldVnode) {
    // const { bid, cid, val = {}, option = {}, show } = binding.value
    // const { oldShow } = binding.oldValue
    // const { active, callback, observeOption } = binding.value

    // if (typeof oldVnode._waypoint !== 'undefined') {
    //   VueWaypoint.removeObserver(oldVnode._waypoint, el)
    // }

    // if (active) {
    //   const waypoint = VueWaypoint.addObserver(el, callback, observeOption)
    //   vnode._waypoint = waypoint
    // }
  },
  unbind (el, binding, vnode) {
    // free up some memory
    if (typeof vnode._waypoint !== 'undefined') {
      VueWaypoint.removeObserver(vnode._waypoint, el)
    }
  }
}
