/**
 * @url /health/pc/wms/freight/sugName
 */
module.exports = function(req) {
    return {
      code: 0,
      msg: 'success',
      data:{
        
          freightTemplateVOList: [
            {
              "templateId": "1001",//模版ID
            "templateName":"运费模版1", //模版名称
            "startPrice": 1000,//起步价（单位分）
              "basePrice": 100,//基础运费（单位分）
            "extraStartCount":5 ,//续件起步数
            "extraStepCount": 2,//续件步长数
              "extraStepPrice": 10,//续件步长对应增收价
          },
          {
              "templateId": "1002",//模版ID
            "templateName":"运费模版2",//模版名称
            "startPrice": 1000,//起步价（单位分）
              "basePrice": 100,//基础运费（单位分）
            "extraStartCount":5, //续件起步数
            "extraStepCount": 2,//续件步长数
              "extraStepPrice": 10,//续件步长对应增收价
          }
          ]
      }
    }
  }