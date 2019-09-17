export const convertErrorRecoveryInfoToServer = (data) => {
  data = data || []
  return data.map(item => ({
    fields: item.id,
    newValue: Array.isArray(item.newValue) ? item.newValue.join(',') : item.newValue,
  }))
}