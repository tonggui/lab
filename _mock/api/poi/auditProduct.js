/**
 * @url reuse/sc/product/shangou/audit/statistics
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    total: "@integer(0)",     				//总数
    auditing: "@integer(0)",    		//审核中
    auditReject: "@integer(0)",    	//被驳回待审
    reject: "@integer(0)",     		//审核驳回
    pass: "@integer(0)",     				//审核通过
    cancel: "@integer(0)",    				//已撤销
    timeout24H: "@integer(0)",    			//24H未审核完成
  }
}
