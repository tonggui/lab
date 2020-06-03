/**
 * @url /reuse/sc/product/shangou/cube/r/searchBySug
 */
module.exports = function (req) {
  return {
    code: 0,
    msg: '',
    data: {
      sugList: [
        {
          dataType: 1,
          id: 85965284,
          name: '分类1',
          tagId: null,
          tagPath: '',
        },
        {
          dataType: 1,
          id: 518,
          name: '雪碧',
          tagId: null,
          tagPath: '',
        },
        {
          dataType: 2,
          id: null,
          name: '七喜 冰爽柠檬味碳酸饮料 330ml/听',
          tagId: '66483887',
          tagPath: '酒水饮料,碳酸饮料',
        }
      ]
    }
  };
};
