import { PoiInfo } from '../../interface/poi'

export const convertPoi = (poi: any): PoiInfo => {
  const node: PoiInfo = {
    id: poi.id,
    name: poi.name,
    address: poi.address,
    brand: {
      id: poi.brandId || poi.wmPoiBrandId,
      name: poi.wmPoiBrand || ''
    },
    owner: {
      id: poi.ownerUid,
      name: poi.owner || ''
    }
  }
  return node
}

export const convertPoiList = (list: any[]): PoiInfo[] => {
  list = list || []
  return list.map(convertPoi)
}