
// 批量操作的类型
declare enum TaskType {
  BATCH_CREATE = 1, // 批量新建商品
  BATCH_UPDATE = 2, // 批量修改商品
  BATCH_EXPORT = 3, // 批量导出商品
  BATCH_DELETE = 4, // 批量删除商品
  BATCH_SYNC = 5, // 批量同步商品
  // DOWNLOAD = 6, // 下载商品-列表页
  BATCH_UPLOAD_IMAGE = 7, // 批量上传图片
  BATCH_UPDATE_BY_EXCEL = 8, // excel批量修改商品
  // CREATE_UNRELEASED_EXCEL = 9, // 创建中间态excel
  UPLOAD_UNRELEASED_EXCEL = 10, // 批量从商品库新建
  // CREATE_BY_TXT = 11, // 批量快捷新建
  BATCH_RELEASE_ONLY = 12, // 批量仅关联商品
  BATCH_RELEASE_REPLACE = 13, // 批量关联并替换商品
  // CREATE_UPDATED_EXCEL = 14, // 生成商品信息确认excel
  UPLOAD_UPDATED_EXCEL = 15 // 批量商品信息确认
  // SYNC_NEW = 20, // 新版跨店同步商品
}

// 异步任务
declare interface TaskInfo {
  id: number; // 任务id
  name: string; // 操作名称；
  utime: number;
  ctime: number;
  time: string; // 操作时间；
  type?: number; // 任务类型
  status?: number; // 任务状态；
  result?: number; // 任务的逻辑处理状态；
  statusParam1?: number; // 描述状态的参数1；
  statusParam2?: number; // 描述状态的参数2；
  url?: string;
  output?: string;
  extraLink?: string; // 新的内嵌数据模式
  contentLink?: string; // 展示用户上传的文件
  detailLink?: string; // 提交时用户数据链接
}
