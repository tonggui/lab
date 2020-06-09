import Vue from 'vue'

export default Vue.extend({
  name: 'table-td',
  functional: true,
  props: {
    rowspan: Number,
    colspan: Number,
    className: [Array, Object, String]
  },
  render (h, ctx) {
    const { rowspan, colspan, className } = ctx.props
    if (rowspan === 0 || colspan === 0) {
      return null
    }
    return h('td', {
      attrs: {
        ...ctx.attrs,
        rowspan,
        colspan
      },
      class: className
    }, [ctx.children])
  }
})
