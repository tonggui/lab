import { City, Brand, Tip, Suggestion } from '../../interface/common'

export const convertCity = (city: any): City => {
  const { cityId, cityName, cityPinyin } = city
  const node: City = {
    id: cityId,
    name: cityName || '',
    spell: cityPinyin || '',
  }
  return node
}

export const convertCityList = (list: any[]): City[] => {
  list = list || []
  return list.map(convertCity)
}

export const convertBrand = (brand: any): Brand => {
  const node: Brand = {
    id: brand.brandId,
    name: brand.name,
    type: brand.brandSourceType,
    spBrandId: brand.spBrandId,
  }
  return node
}

export const convertBrandList = (list: any[]): Brand[] => {
  list = list || []
  return list.map(convertBrand)
}

export const convertTip = (tip: any, index?): Tip => {
  const node: Tip = {
    operationText: tip.link ? '去查看' : '',
    closable: true,
    id: `MESSAGE_${index || ''}`,
    content: tip.content,
    link: tip.link,
    sequence: tip.sequence
  }
  return node
}

export const convertTipList = (list: any[]): Tip[] => {
  list = list || []
  return list.map(convertTip)
}

export const convertProductSuggestion = (data: any): Suggestion => {
  data = data || {}
  const { id, name, tagId, tagPath } = data as any
  const node: Suggestion = {
    id,
    name: name || '',
    tagId,
    tagPath: (tagPath || '').split(',')
  };
  return node
}

export const convertProductSuggestionList = (list: any): Suggestion[] => {
  list = list || [];
  return list.map(convertProductSuggestion)
}
// TODO convertTaskList
export const convertTaskList = () => {}