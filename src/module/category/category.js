import { merge } from 'lodash'
// https://km.sankuai.com/page/145699961
// 经营品类说明
// 目前，闪购的经营品类只包含两个级别（一级、二级经营品类）；外卖存在最多三级的经营品类
// 一个门店，最多存在两个经营品类

// 目前后端存在两个经营品类管理体系
// 1. 虚拟经营品类，主要用于跨店的批量操作分类控制；
// 2. 实际的经营品类；
// 前端无法通过虚拟经营品类控制（一个虚拟经营品类可能会应对多个实体的一级品类，无法精确控制）

// 闪购经营品类的层级关系
const newCategory = {
  // 水果
  10000000: [
    10010000, // 整装水果店
    10020000 // 鲜切水果/果捞店
  ],
  // 食材
  11000000: [
    11010000, // 综合生鲜果蔬超市
    11060000, // 肉禽店
    11030000, // 前置仓
    11040000, // 火锅专营
    11050000, // 海鲜/水产店
    11020000 // 菜市场
  ],
  // 母婴
  5018: [
    5022, // 玩具/童车/模型店
    19010000, // 综合母婴店
    5020 // 婴童服饰鞋帽店
  ],
  // 宠物
  12000000: [
    12010000 // 宠物食品/用品店
  ],
  // 超市便利
  13000000: [
    13030000, // 便利店
    13010000, // 大型超市/卖场
    13020000 // 小型超市
  ],
  // 食品专营
  14000000: [
    14040000, // 水站
    14050000, // 奶站
    14080000, // 零食/干果店
    14060000, // 粮油调味店
    14010000, // 酒水饮料店
    14030000, // 进口食品商店/超市
    14070000, // 地方特产店
    14020000 // 茶行
  ],
  // 日用百货
  15000000: [
    15010000, // 综合日用百货店
    15030000, // 五金日用店
    15040000, // 文具店
    15020000, // 书店
    15070000, // 节庆用品/礼品店
    15060000, // 家居饰品店
    15080000, // 电子用品店
    15050000 // 餐具厨具店
  ],
  // 美妆日化
  5007: [
    5010, // 护肤/美体/精油店
    5011, // 美容美体仪器店
    17020000, // 香水店
    17010000 // 综合美妆日化店
  ],
  // 服饰鞋帽
  5001: [
    5002, // 服饰配件/皮带/帽子/围巾店
    5005, // 男女鞋店
    16030000, // 男装店
    5004, // 内衣/家居服店
    16020000, // 女装/女士精品店
    16050000, // 体育用品店
    16040000, // 运动鞋/服店
    16010000 // 综合服饰鞋帽店
  ],
  // 医药健康
  22: [
    6006, // 医疗器械店
    4012, // 成人/情趣用品店
    180, // 中药店
    181, // 营养保健品店
    179, // 综合药店
    6005 // 眼镜店
  ],
  // 鲜花绿植
  1001: [
    4013, // 绿植/园艺店
    182, // 鲜花店
    18010000 // 综合鲜花绿植店
  ]
}
// TODO 品类升级的过程中 新旧品类字典需要共存 数据完全清洗完成之后 删除旧字典
const oldCategory = {
  // 生活超市
  20: [
    106, // 零食/干果
    173, // 超市
    174, // 便利店
    175, // 水站/奶站
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
    181, // 保健药
    4012, // 成人用品
    6005, // 眼镜
    6006 // 医疗器械
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

export default merge(oldCategory, newCategory)
