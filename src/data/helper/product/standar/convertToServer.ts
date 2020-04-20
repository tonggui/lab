export const convertErrorRecoveryInfoToServer = (data) => {
  data = data || []
  return data.map(item => ({
    fields: item.id,
    newValue: Array.isArray(item.newValue) ? item.newValue.join(',') : item.newValue,
  }))
}

export const convertMedicineSpInfo = sp => ({
  id: sp.id,
  upcCode: sp.upcCode,
  permissionNumber: sp.permissionNumber,
  currentPrice: sp.price,
  specification: sp.spec,
  stock: sp.stock
})