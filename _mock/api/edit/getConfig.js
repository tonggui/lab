/**
 * @url /reuse/sc/product/retail/r/getConfig
 */
module.exports = {
  code: 0,
  msg: '',
  "data|1": [{
    spuFieldConfig: {
      upcCode: {
        visible: true
      },
      video: {
        visible: true
      },
      limitSale: {
        visible: true
      },
      shippingTime: {
        visible: true
      },
      description: {
        visible: true
      },
      pictureContentList: {
        visible: true
      },
      // TODO
      spPictureContentSwitch: {
        visible: true
      },
      marketingPicture: {
        visible: true
      },
      isMedicare: {
        visible: true,
        disabled: true
      },
      spVideo: {
        disabled: false,
        visible: true,
      },
      b2cSinglePoi: {
        visible: true,
      },
      preSale: {
        visible: true,
      }
    },
    skuFieldConfig: {
      box: {
        required: false,
        visible: false
      },
      weight: {
        required: true,
        visible: true
      },
      upcCode: {
        required: true,
        visible: true
      },
      suggestedPrice: {
        required: true,
        visible: false
      }
    },
    funcConfig: {
      allowAttrApply: true,
      allowMultiProductTag: true,
      propertyEditLock: false,
      allowAddSpec: true,
      allowErrorRecovery: true // 是否允许纠错
    }
  }]
}
