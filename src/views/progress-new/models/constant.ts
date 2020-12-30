export enum MerchantTaskType {
  BATCH_CREATE_BY_EXCEL = 501, // excel批量新建
  BATCH_UPDATE_BY_EXCEL = 502, // excel批量修改
  BATCH_UPLOAD_PIC = 503, // 批量传图
  BATCH_SYNC = 504, // 批量同步
  MEDICINE_BATCH_CREATE_BY_EXCEL = 9001, // 医药excel批量新建
  MEDICINE_BATCH_UPDATE_BY_EXCEL = 9002, // 医药excel批量修改
  MEDICINE_BATCH_CREATE_REL = 9003, // 医药批量新建关联关系
  MEDICINE_BATCH_DELETE_REL_BY_EXCEL = 9004, // 医药批量删除关联关系
}
