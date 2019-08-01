import { BRAND_SOURCE, SUGGESTION_TYPE } from '../enums/common'
import { BaseTag } from './category';

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
  spBrandId?: number; // 标品库品牌ID
  name: string;
  type: BRAND_SOURCE;
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
  tagId: number | string;
  tagPath: string[];
  name: string;
  type: SUGGESTION_TYPE;
}

// TODO
// 异步任务
declare interface TaskInfo {
  id: number; // 任务id
  name: string; // 操作名称；
  time: string; // 操作时间；
  type?: number; // 任务类型
  status?: number; // 任务状态；
  result?: number; // 任务的逻辑处理状态；
  statusParam1?: number; // 描述状态的参数1；
  statusParam2?: number; // 描述状态的参数2；
  url?: string;
}

