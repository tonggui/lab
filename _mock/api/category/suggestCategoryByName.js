/**
 * @url reuse/sc/product/shangou/category/r/suggestCategoryByName
 */
module.exports = function (req) {
  const name = req.body.name;
  return {
    code: 0,
    msg: '',
    data: {
      id: 200000089,
      name,
      idPath: '200000062,200000087,200000089',
      namePath: `制品,冰品,${name}`,
      parentId: 200000087,
      leaf: 1,
      level: 1
    }
  }
};
