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
          begin: "20200717",
          end: "20200717"
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
          begin: "20200723",
          end: "20200817"
        },
        count: 10
      }
    ],
    code: 0,
    msg: ""
  }
};
