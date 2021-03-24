/**
 * @url /reuse/sc/product/retail/w/uniSave
 */
module.exports = function (req) {
  const { checkActivitySkuModify } = req.body
  return {
    data: {
      auditType: 0,
      id: 2200449474,
      message: ""
    },
    code: 0, //JSON.parse(checkActivitySkuModify) ? 11001 : 0,
    msg: '保存失败啊啊啊啊啊'
  };
};
