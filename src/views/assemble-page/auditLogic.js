// import { keyAttrsDiff } from '@/views/edit-page-common/common'
//
// function supportAudit () {
//   return !!this.supportAudit
// }
//
// function poiNeedAudit () {
//   return !!this.poiNeedAudit
// }
//
// // 新建场景下是否需要审核
// function createNeedAudit () {
//   // 新建模式，只判断UPC不存在且选中为指定类目
//   return this.categoryNeedAudit && !(this.productInfo.isSp && this.productInfo.upcCode)
// }
//
// function checkCateNeedAudit () {
//   // 初始状态的类目需要审核，才会出现纠错审核
//   if (this.originalProductCategoryNeedAudit) {
//     const newData = this.productInfo
//     const oldData = this.originalFormData
//     return keyAttrsDiff(oldData, newData)
//   }
//   return false
// }
//
// // 编辑场景下是否需要审核
// function editNeedAudit () {
//   if (this.originalProductCategoryNeedAudit) { // 编辑模式下•原始类目需审核，则命中纠错条件则需要审核
//     return checkCateNeedAudit()
//   } else if (!this.originalProductCategoryNeedAudit && this.categoryNeedAudit) { // 编辑模式下•原始类目无需审核，当前选中为制定类目，需要审核
//     return true
//   }
//   return false
// }
// // 是否为纠错审核
// function isNeedCorrectionAudit () {
//   if (!this.poiNeedAudit) return false // 门店审核状态
//   return this.checkCateNeedAudit()
// }
