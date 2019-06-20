import { BRAND_SOURCE } from '../enums/common'
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
  day: number | string,
  timezone: Time[];
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
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
}
// 搜索推荐
declare interface Suggestion {
  id?: number;
  tagId: number | string;
  tagPath: string[];
  name: string;
}
// TODO
// 异步任务
declare interface TaskInfo {
  id: number; // 任务id
}

