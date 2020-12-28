// https://km.sankuai.com/page/145699961
// 经营品类说明
// 目前，闪购的经营品类只包含两个级别（一级、二级经营品类）；外卖存在最多三级的经营品类
// 一个门店，最多存在两个经营品类

// 目前后端存在两个经营品类管理体系
// 1. 虚拟经营品类，主要用于跨店的批量操作分类控制；
// 2. 实际的经营品类；
// 前端无法通过虚拟经营品类控制（一个虚拟经营品类可能会应对多个实体的一级品类，无法精确控制）

// 闪购经营品类的层级关系
export const CategoryTree = {
  // 生活超市
  20: [
    106, // 零食/干果
    173, // 超市
    174, // 便利店
    175, // 水站/奶站
    181, // 保健药
    2004, // 粮油调味
    4014, // 日化美妆
    4015, // 五金日用
    4016, // 酒水/茶行
    4017, // 宠物用品
    4018, // 地方特产
    4019, // 进口食品
    4020, // 文具店
    4021 // 书店
  ],
  // 生鲜果蔬
  21: [
    176, // 鲜切水果
    177, // 整装水果
    178, // 蔬菜
    2005, // 其他生鲜果蔬
    4022, // 大闸蟹
    4023, // 其他海鲜水产
    4024, // 肉禽蛋奶
    4025 // 冷冻速食
  ],
  // 医药健康
  22: [
    179, // OTC
    180, // 中药
    // 181, // 保健药
    4012 // 成人用品
  ],
  // 鲜花绿植
  1001: [
    182, // 鲜花
    4013 // 绿植
  ],
  // 服饰鞋帽
  5001: [
    5002, // 服饰配件/皮带/帽子/围巾
    5003, // 服装
    5004, // 女士内衣/男士内衣/家居服
    5005, // 鞋靴
    5006 // 服饰鞋帽综合类
  ],
  // 美妆
  5007: [
    5008, // 彩妆/香水/美妆工具
    5009, // 美发护发/假发
    5010, // 美容护肤/美体/精油
    5011 // 美容美体仪器
  ],
  // 日用品
  5012: [
    5013, // 居家日用
    5014, // 节庆用品/礼品
    5015, // 家居饰品
    5016, // 厨具餐具
    5017 // 宠物食品用品
  ],
  5018: [
    5019, // 奶粉/辅食/营养品/零食
    5020, // 婴童服饰鞋帽
    5021, // 孕妇装/孕产妇用品/营养
    5022, // 玩具/童车/益智/积木/模型
    5023 // 尿片/洗护/喂哺/推车床
  ]
}

export const CategoryMap = Object.entries(CategoryTree)
  .reduce((map, [k, v = []]) => {
    const pid = +k
    map[pid] = {
      id: pid,
      level: 1,
      idPath: [pid]
    }
    v.forEach((cid) => {
      map[cid] = {
        id: cid,
        pid,
        level: 2,
        idPath: [pid, cid]
      }
    })
    return map
  }, {})

/**
 * 是否为常规的药品品类（除去成人用品）
 */
export const isNormalMedicine = category => category.pid === 22 && category.id !== 4012
