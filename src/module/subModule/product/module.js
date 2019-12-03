import { names as source } from './source'
import * as TYPES from './moduleTypes'
import createFelid from '@/module/helper/createFelid'

export default {
  [TYPES.PROPERTY_LOCK]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).propertyEditLock
  }),
  [TYPES.WEIGHT_REQUIRED]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).weightNotEmpty
  }),
  [TYPES.UPC_REQUIRED]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).upcNotEmpty
  }),
  [TYPES.PRODUCT_PICTURE_CONTENT]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).allowGraphicDescription
  }),
  [TYPES.PRODUCT_VIDEO]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).allowProductVideo
  }),
  [TYPES.PRODUCT_TAG_COUNT]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).allowMultiProductTag ? 5 : 1
  })
}
