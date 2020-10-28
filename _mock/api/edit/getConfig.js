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
    },
    skuFieldConfig: {
      box: {
        required: false,
        visible: false
      },
      weight: {
        required: false,
        visible: true
      },
      upcCode: {
        required: false,
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
