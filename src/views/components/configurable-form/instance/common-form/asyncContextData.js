import { sleep } from '@/common/utils'
import { SPU_FELID, SKU_FELID } from '@/views/components/configurable-form/felid'
// mock context
export default async (id) => {
  sleep(1000)
  if (!id) {
    return {}
  }
  return {
    skuFelid: {
      [SKU_FELID.BOX]: {
        required: false,
        visible: false
      },
      [SKU_FELID.WEIGHT]: {
        required: false,
        visible: true
      },
      [SKU_FELID.UPC_CODE]: {
        required: false,
        visible: true
      },
      // TODO
      [SKU_FELID.SUGGESTED_PRICE]: {
        required: true,
        visible: false
      }
    },
    felid: {
      [SPU_FELID.UPC_CODE]: {
        visible: true
      },
      [SPU_FELID.PRODUCT_VIDEO]: {
        visible: true
      },
      [SPU_FELID.LIMIT_SALE]: {
        visible: true
      },
      [SPU_FELID.SALE_TIME]: {
        visible: true
      },
      [SPU_FELID.DESCRIPTION]: {
        visible: true
      },
      [SPU_FELID.PICTURE_CONTENT]: {
        visible: true
      },
      [SPU_FELID.SP_PICTURE_CONTENT]: {
        visible: true
      },
      [SPU_FELID.CATEGORY_ATTRS]: {
        visible: true
      }
    },
    features: {
      allowAttrApply: true,
      multiTag: true,
      propertyLock: true,
      showCellularTopSale: true
    }
  }
}
