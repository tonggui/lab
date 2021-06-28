/**
 * @url reuse/sc/product/hqcc/cube/r/tagList
 */
const tagList = [{
  tagId: '1',
  tagName: '一级类目',
  level: '',
  parentId: '',
  isLeaf: 0,
  sequence: 1,
  categoryType: '',
  productCount: 100,
  subTags: [{
    tagId: '12',
    tagName: '一级分类',
    level: '',
    parentId: '',
    isLeaf: 1,
    sequence: 1,
    categoryType: '',
    productCount: 2,
  }, {
    tagId: '13',
    tagName: '二级分类',
    level: '',
    parentId: '',
    isLeaf: 1,
    sequence: 2,
    categoryType: '',
    productCount: 3,
  }]
}, {
  tagId: '2',
  tagName: '二级类目',
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
      tagList: tagList
    }
  }
};
