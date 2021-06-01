/**
 * 之前开通了商家商品中心 - 引导
 */
export const oldMerchantSteps = [
  {
    title: '欢迎使用总部商品库',
    intro: '商家商品中⼼”正式更名为“总部商品库”啦～<br />现可⽀持⾃主重置总部商品库哦～'
  },
  {
    element: '#reset',
    title: '重置总部商品库',
    intro: '点击这⾥即可重置<br />重置商品库可“从分店中快速导⼊商品”或“⾃⾏创建总部商品”<br />（重置总部商品不会删除分店相应商品，请放⼼使⽤）',
    position: 'left'
  }
]

/**
 * 之前未开通过且通过选择“从分店导入商品” - 引导
 */
export const stepsFromPoi = [
  {
    title: '欢迎使用总部商品库',
    intro: '欢迎使用总部商品库'
  },
  {
    title: '从分店导⼊商品',
    element: '#import',
    intro: '如要继续向商品库中添加，请使⽤“从分店导⼊商品'
  },
  {
    title: '重置总部商品库',
    element: '#reset',
    intro: '可“重置总部商品库”重新创建，重置总部商品不会删除分店相应商品哦～'
  },
  {
    title: '关联门店',
    element: '.associatedPoi',
    intro: '点击可查看指定商品关联的分店明细，可继续添加关联分店'
  },
  {
    title: '删除商品',
    element: '.delete-operation',
    intro: '删除商品时，请选择是否删除分店商品，注意不要误删商品哦~'
  }
]

/**
 * 之前未开通过且通过选择“自行新建总部商品”方式 - 引导
 */
export const stepsFromSelf = [
  {
    title: '欢迎使用总部商品库',
    intro: '欢迎使用总部商品库'
  },
  {
    title: '新建分类',
    element: '#createTag',
    intro: '创建商品前，请先创建店内商品分类。<br />总部创建的分类可关联⾄分店哦～'
  },
  {
    title: '批量新建',
    element: '#batchCreate',
    intro: '分类创建后，可使⽤“批量新建”创建商品，将商品信息复制粘贴⾄Excel模板并上传创建，⼀次可创建多个商品。<br />新建的商品可自动给所选分店新建，并与分店建立关联关系，后续修改商品可以自动同步有关联的分店哦~'
  },
  {
    title: '单个新建',
    element: '#creatSingleProduct',
    intro: '分类创建后，可使⽤“新建单个商品”创建商品，⼿动逐条输⼊商品信息，⼀次仅可创建⼀个商品。<br />新建的商品可自动给所选分店新建，并与分店建立关联关系，后续修改商品可以自动同步有关联的分店哦~'
  },
  {
    title: '从分店导⼊商品',
    element: '#import',
    intro: '如要继续向商品库中添加，请使⽤“从分类导⼊商品'
  },
  {
    title: '重置总部商品库',
    element: '#reset',
    intro: '可“重置总部商品库”重新创建，重置总部商品不会删除分店相应商品哦～'
  }
]

export const stepsProductOperation = [
  {
    title: '关联门店',
    element: '.associatedPoi',
    intro: '点击可查看指定商品关联的分店明细，可继续添加关联分店'
  },
  {
    title: '删除商品',
    element: '.delete-operation',
    intro: '删除商品时，请选择是否删除分店商品，注意不要误删商品哦~'
  }
]
