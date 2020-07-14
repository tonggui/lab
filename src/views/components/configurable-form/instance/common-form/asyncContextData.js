import { sleep } from '@/common/utils'
import { SPU_FELID, SKU_FELID } from '../../felid'
// mock context
export default async (id) => {
  sleep(1000)
  return {
    skuFelid: {
      [SKU_FELID.BOX]: {
        required: false,
        visible: false
      },
      [SKU_FELID.WEIGHT]: {
        required: false, // TODO 白名单
        visible: true
      },
      [SKU_FELID.UPC_CODE]: {
        required: false, // TODO 白名单
        visible: true
      },
      // TODO
      [SKU_FELID.SUGGESTED_PRICE]: {
        required: false,
        visible: false
      }
    },
    felid: {
      [SPU_FELID.PRODUCT_VIDEO]: {
        required: true,
        disabled: false,
        visible: true
      },
      [SPU_FELID.UPC_IMAGE]: {
        required: true,
        disabled: false,
        visible: true
      },
      [SPU_FELID.LIMIT_SALE]: {
        required: true,
        disabled: false,
        visible: true
      },
      [SPU_FELID.SALE_TIME]: {
        required: true,
        disabled: false,
        visible: true
      },
      [SPU_FELID.DESCRIPTION]: {
        required: true,
        disabled: false,
        visible: true
      },
      [SPU_FELID.PICTURE_CONTENT]: {
        required: true,
        disabled: false,
        visible: true
      },
      [SPU_FELID.SP_PICTURE_CONTENT]: {
        required: true,
        disabled: false,
        visible: true
      },
      [SPU_FELID.CATEGORY_ATTRS]: {
        required: true,
        disabled: false,
        visible: true
      }
    },
    features: {
      multiTag: true,
      propertyLock: true
    }
  }
}
