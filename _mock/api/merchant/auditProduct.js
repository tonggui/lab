/**
 * @url reuse/sc/product/hqcc/r/statistics
 */
module.exports = {
  code: 0,
  msg: '',
  data: {
    total: "@integer(0, 300)",     				//总数
    auditing: "@integer(0, 300)",    		//审核中
    auditReject: "@integer(0, 300)",    	//被驳回待审
    reject: "@integer(0, 300)",     		//审核驳回
    pass: "@integer(0, 300)",     				//审核通过
    cancel: "@integer(0, 300)",    				//已撤销
    timeout24H: "@integer(0, 300)",    			//24H未审核完成
  }
}
