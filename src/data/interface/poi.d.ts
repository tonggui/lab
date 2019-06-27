import { STATUS, POI_TYPE } from '../enums/poi'

declare interface AuditInfo {
  status: STATUS; // 门店状态 审核状态
  message: string;
  modalStatus: boolean;
}

// 单门店信息
declare interface PoiInfo {
  id: number; // 门店id
  name: string; // 门店名称
  type?: POI_TYPE; // 门店类型
  address?: string; // 门店地址
  brand?: {
    id: number;
    name: string;
  };
  owner?: {
    id: number;
    name: string;
  };
  businessCategory?: number[]; // 门店经营品类
}

// 多门店信息
declare interface MultiPoiInfo {
  multiPoiSwitch: boolean; // TODO
  isSinglePoiTag: boolean; // 是否单一经营品类
}

// 门店经营品类信息
declare interface PoiTag {
  id: number;
  name: string;
  level: number;
  isPrimary?: boolean; // 是否为主营品类，虚拟品类场景时，不存在此节点
}
