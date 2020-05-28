import Vue from 'vue'

export default Vue.extend({
  props: {
    render: {
      type: Function,
      required: true
    }
  },
  render (h) {
    return this.render(h)
  }
})
