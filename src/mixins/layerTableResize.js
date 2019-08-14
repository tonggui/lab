export default {
  methods: {
    tableResize (v) {
      if (v) {
        const stack = [this.$children]
        while (stack.length) {
          const children = stack.pop()
          children.forEach(child => {
            if (child.$options.name === 'Table') {
              this.$nextTick(() => {
                child.handleResize && child.handleResize()
              })
            } else if (child.$children && child.$children.length) {
              stack.push(child.$children)
            }
          })
        }
      }
    }
  }
}
