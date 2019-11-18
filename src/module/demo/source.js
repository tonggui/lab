const source = {
  test: {
    fetch: async (context) => {
      console.log('fetching:', context)
      const { category } = context
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            editable: category,
            disabled: category,
            required: category
          })
        }, 1000)
      })
    },
    defaultValue: {
      editable: false,
      disabled: false,
      required: false
    }
  }
}

export default source

export const names = Object.keys(source).reduce((prev, name) => {
  prev[name] = name
  return prev
}, {})
