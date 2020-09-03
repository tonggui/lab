import Vue from 'vue'
// import domain from './methods'
// import service from './service'
// const { methods, data } = domain(service)

export default (Component) => Vue.extend({
  name: 'assemble-page',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    // ...methods
  },
  created () {
  },
  render (h) {
    if (this.loading) {
      return 'loading...'
    } else {
      return h(Component, {

      })
    }
  }
})
