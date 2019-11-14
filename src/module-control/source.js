const source = {
  test: {
    fetch: async (context) => {
      console.log('fetch:', context)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('done return')
          resolve({
            editable: context.select,
            disabled: context.select,
            required: context.select
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
