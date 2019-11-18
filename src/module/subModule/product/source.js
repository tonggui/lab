const source = {
  test: {
    fetch: async ({ category, poiId }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            editable: `${category} -- ${poiId}`,
            disabled: `${category} -- ${poiId}`,
            required: `${category} -- ${poiId}`
          })
        }, 100)
      })
    },
    defaultValue: {
      editable: '',
      disabled: '',
      required: ''
    }
  }
}

export default source

export const names = Object.keys(source).reduce((prev, name) => {
  prev[name] = name
  return prev
}, {})
