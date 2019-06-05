import client from './client'

export const fetchMedicineList = params =>
  client
    .post('shangou/medicine/r/searchByCond', params)
    .then(({ productList, ...rest }) => ({
      ...rest,
      productList: productList.map(
        ({ wmProductSkus, wmProductSpuExtends, ...others }) => ({
          ...others,
          wmProductSkus: wmProductSkus || [],
          wmProductSpuExtends: wmProductSpuExtends || {}
        })
      )
    }))

export const postMedicineDownloadExcelRequest = params =>
  client.post('shangou/medicine/r/downloadProductByExcel', params)

/**
 * 列表查询推荐
 */
export const fetchSearchMedicineSuggestion = (poiId, keyword) =>
  client
    .get('shangou/medicine/r/searchSug', {
      wm_poi_id: poiId,
      keyword
    })
    .then(data => data.list || [])

export const fetchCreateByExcel = params =>
  client.post('shangou/medicine/batch/w/saveByExcel', params, {
    type: 'form',
    timeout: 60000
  })

export const fetchModfiyByExcel = params =>
  client.post('shangou/medicine/batch/w/updateByExcel', params, {
    type: 'form',
    timeout: 60000
  })
