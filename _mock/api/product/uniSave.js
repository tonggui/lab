/**
 * @url /reuse/sc/product/retail/w/uniSave
 */
module.exports = function (req) {
  const { checkActivitySkuModify } = req.body
  return {
    data: {},
    code: JSON.parse(checkActivitySkuModify) ? 11001 : 0,
    msg: '保存失败啊啊啊啊啊'
  };
};
