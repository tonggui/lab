/**
 * @url reuse/sc/product/hqcc/cube/r/tagList
 */
const tagList = [{
  id: '1',
  name: '一级类目',
  level: '',
  parentId: '',
  isLeaf: 0,
  sequence: 1,
  categoryType: '',
  productCount: 100,
  subCategoryList: [{
    id: '12',
    name: '一级分类',
    level: '',
    parentId: '',
    isLeaf: 1,
    sequence: 1,
    categoryType: '',
    productCount: 2,
  }, {
    id: '13',
    name: '二级分类',
    level: '',
    parentId: '',
    isLeaf: 1,
    sequence: 2,
    categoryType: '',
    productCount: 3,
  }]
}, {
  id: '2',
  name: '二级类目',
  level: '',
  parentId: '',
  isLeaf: 0,
  sequence: 2,
  categoryType: '',
  productCount: 200,
}]

module.exports = function (req) {
  const { keyword, tabId } = req.body
  return {
    msg: 'handleFixedScroll',
    code: 0,
    data: {
      tabId,
      totalProductCount: 300,
      tagList: tagList.filter(item => item.name.indexOf(keyword) !== -1)
    }
  }
};
