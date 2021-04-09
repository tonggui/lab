/**
 * @url /reuse/sc/product/retail/r/getLimitRules
 */

module.exports = {
  code: 0,
  msg: "",
  data: {
    limitRuleVoList: [
      {
        limitRule: {
          ruleId: 123,
          multiPoi: true,
          type: 1,
          frequency: 7,
          count: 10,
          beginTime: "20200717",
          endTime: "20200717"
        },
        count: 10
      },
      {
        limitRule: {
          ruleId: 32,
          multiPoi: true,
          type: 2,
          frequency: 0,
          count: 10,
          beginTime: "20200723",
          endTime: "20200817"
        },
        count: 10
      }
    ],
    code: 0,
    msg: ""
  }
};
