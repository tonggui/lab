/**
 * @url reuse/sc/product/shangou/category/r/suggestCategoryByName
 */
module.exports = function (req) {
  const name = req.body.name;
  return {
    code: 0,
    msg: '',
    data: {
      // categoryId: 200000089,
      // categoryName: name,
      // idPath: '200000062,200000087,200000089',
      // categoryNamePath: `制品,冰品,${name}`,
      // parentId: 200000087,
      // isLeaf: 1,
      // level: 1,
      allowCustomProduct: null,
      categoryId: 200001464,
      categoryName: "速食泡面",
      categoryNamePath: "粮油调味干货,方便速食,速食泡面",
      categoryType: null,
      idPath: ",200000160,200001467,200001464,",
      isLeaf: 1,
      level: 3,
      lockStatus: 0,
      lockTips: null,
      parentId: 200001467
    }
  }
};
