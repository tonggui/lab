/**
 * @url reuse/sc/product/shangou/category/r/suggestCategoryByName
 */
module.exports = function (req) {
  const name = req.body.name;
  return {
    code: 0,
    msg: '',
    data: {
      categoryId: 200000089,
      categoryName: name,
      idPath: '200000062,200000087,200000089',
      categoryNamePath: `制品,冰品,${name}`,
      parentId: 200000087,
      isLeaf: 1,
      level: 1
    }
  }
};
