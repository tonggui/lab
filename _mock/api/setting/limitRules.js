/**
 * @url /reuse/sc/product/retail/r/getLimitRules
 */

module.exports = {
  data: {
    limitRuleVoList: [
      {
        limitRule: {
          type: 2,
          count: 3,
          frequency: 0,
          ruleId: 52039,
          multiPoi: false,
          begin: "20210614",
          end: "20210614"
        },
        count: 3
      },
      {
        limitRule: {
          type: 2,
          count: 1,
          frequency: 0,
          ruleId: 52037,
          multiPoi: false,
          begin: "20210520",
          end: "20210520"
        },
        count: 0
      },
      {
        limitRule: {
          type: 2,
          count: 2,
          frequency: 0,
          ruleId: 52033,
          multiPoi: false,
          begin: "20210520",
          end: "20210520"
        },
        count: 0
      },
      {
        limitRule: {
          type: 2,
          count: 4,
          frequency: 0,
          ruleId: 52038,
          multiPoi: false,
          begin: "20210518",
          end: "20210518"
        },
        count: 0
      },
      {
        limitRule: {
          type: 2,
          count: 1,
          frequency: 0,
          ruleId: 52034,
          multiPoi: false,
          begin: "20210517",
          end: "20210517"
        },
        count: 1
      }
    ]
  },
  code: 0,
  success: true,
  msg: "查询限购规则成功"
};
