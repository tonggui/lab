import client from '../client/instance/product'

export const fetchCities = params =>
  client.post('uicomponent/r/cities', params)

export const listCategoryByParentId = params =>
  client.post('retail/r/listCategoryByParentId', params)

export const uploadImageFile = (multipart, name, poiIds, score) =>
  client.post('uploadTool/w/uploadImg', {
    multipart,
    picName: name,
    // 上传图片用的评分逻辑  目前后端对于多门店ID不支持，需要过滤处理
    wmPoiId: Array.isArray(poiIds) ? (poiIds.length !== 1 ? undefined : poiIds[0]) : poiIds, // eslint-disable-line
    picAudit: score
  })

export const uploadPicContent = formData =>
  client.post('uploadPicContent/w/uploadImage', formData, {
    type: 'form',
    timeout: 60000
  })
export const searchCategory = keyword =>
  client.post('retail/r/searchCategoryByName', {
    keyword
  })
export const searchBrand = keyword =>
  client.post('retail/r/spBrandSug', {
    keyword
  })
