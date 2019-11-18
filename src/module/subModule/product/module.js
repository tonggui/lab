import { names as source } from './source'
import * as TYPES from './moduleTypes'
import createFelid from '@/module/helper/createFelid'

export default {
  [TYPES.PROPERTY_LOCK]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).propertyLock
  }),
  [TYPES.WEIGHT_REQUIRED]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).weightRequired
  }),
  [TYPES.UPC_REQUIRED]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).upcRequired
  }),
  [TYPES.PRODUCT_PICTURE_CONTENT]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).pictureContent
  }),
  [TYPES.PRODUCT_VIDEO]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).productVideo
  }),
  [TYPES.PRODUCT_TAG_COUNT]: createFelid([{ name: 'whiteList', global: true }, source.whiteList], false, ([poiWhiteList, categoryWhiteList]) => {
    return ({ ...poiWhiteList, ...categoryWhiteList }).multiTag ? 5 : 1
  })
}
