import { BRAND_SOURCE, SUGGESTION_TYPE } from '../enums/common'

// alert 所有消息的格式
declare interface Tip {
  id: number | string; // 唯一标识
  content: string; // 文案
  icon?: string; // 按钮
  operationText?: string; // 操作文案
  closable?: boolean; // 是否可删除
  link?: string; // 连接
  fixed?: boolean; // 是否吸顶
  sequence?: number;
}
// 城市
declare interface City {
  id: number | string; // 城市id
  name: string; // 城市名称
  spell?: string; // 城市拼音
}
declare interface Time {
  start: string,
  end: string,
  time?: string,
}
// 时间区间
declare interface TimeZone {
  days: (number | string)[],
  timeList: Time[];
}
// 品牌
declare interface Brand {
  id?: number;
  spBrandId?: number; // 标品库品牌ID，废弃字段（20200917）
  name: string;
  type?: BRAND_SOURCE;
}
// 产地
declare interface Origin {
  id?: number;
  name?: string;
}
// 分页
declare interface Pagination {
  pageSize: number;
  current: number;
  total: number;
  pageSizeOpts?: number[];
  showElevator?: boolean;
  showSizer?: boolean;
}
// 搜索推荐
declare interface Suggestion {
  id?: number;
  brandId?: number | string;
  tagId: number | string;
  tagPath: string[];
  name: string;
  type: SUGGESTION_TYPE;
}

/*
 异步任务
*/
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
  outputListUrl?: string; // 内容来源页面 url，优先级大于output
  extraLink?: string; // 新的内嵌数据模式（异常数据）
  contentLink?: string; // 展示用户上传的文件（上传时的Excel信息）
  detailLink?: string; // 提交时用户数据链接（提交任务时，对应的选择配置信息）
  poiExcelUrl?: string;
  productExcelUrl?: string;
  poiCount?: number;
  productCount?: number;
  taskType?: number;
  subType?: number; // 子类型
  tagList?: string[];
  subTypeDesc?: string; // 修改方式描述
  poiSelectType?: number; // 门店选择方式
}

declare interface MerchantTaskInfo {
  id: number; // 任务id
  name: string; // 操作名称
  opTime: number;
  status?: number,
  downLoadUrl: string;
}
