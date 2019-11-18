import { PoiInfo } from '../../interface/poi'

export const convertPoi = (poi: any): PoiInfo => {
  const node: PoiInfo = {
    id: poi.id || poi.wmPoiId || poi.poiId,
    name: poi.name || poi.wmPoiName || '',
    address: poi.address,
    brand: {
      id: poi.brandId || poi.wmPoiBrandId,
      name: poi.brandName || poi.wmPoiBrand || ''
    },
    owner: {
      id: poi.ownerUid,
      name: poi.ownerName || poi.owner || ''
    }
  }
  return node
}

export const convertPoiList = (list: any[]): PoiInfo[] => {
  list = list || []
  return list.map(convertPoi)
}
