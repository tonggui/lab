/**
 * @url reuse/medicine/product/query/condition
*/
module.exports = function (req) {
    return {
      code: 0,
      msg: '',
      data: {
        medicineType:[
            {
                code: 0,
                desc: '非药品',
            },
            {
                code: 1,
                desc: 'OTC',
            },
            {
                code: 2,
                desc: '处方药',
            },
            {
                code: 3,
                desc: '通用品',
            },
            {
                code: 4,
                desc: '其他',
            }
        ],
        sellStatus:[
            {
                code: 0,
                desc: '上架',
            },
            {
                code: 1,
                desc: '下架',
            }
        ]
      }
    }
  }