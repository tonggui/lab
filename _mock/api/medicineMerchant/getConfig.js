/**
 * @url /reuse/mpc/product/r/getConfig
 */
module.exports = {
	"code": 0,
	"message": "SUCCESS",
	"data": {
		"funcConfig": {
			"allowModifySellProperty": true,
			"allowMultiProductTag": false,
			"propertyEditLock": false,
			"allowAddSpec": false,
			"allowAttrApply": false,
			"allowErrorRecovery": false
		},
		"spuFieldConfig": {
			"upcCode": {
				"disabled": false,
				"visible": false
			},
			"video": {
				"disabled": false,
				"visible": false
			},
			"description": {
				"disabled": false,
				"visible": false
			},
			"shippingTime": {
				"disabled": false,
				"visible": true
			},
			"limitSale": {
				"disabled": false,
				"visible": true
			},
			"pictureContentList": {
				"disabled": false,
				"visible": false
			},
			"spPictureContentSwitch": {
				"disabled": false,
				"visible": false
			},
			"labelList": {
				"disabled": false,
				"visible": false
			},
			"attributeList": {
				"disabled": false,
				"visible": false
			},
			"name": {
				"disabled": true,
				"visible": true
			},
			"category": {
				"disabled": true,
				"visible": true
			},
			"pictureList": {
				"disabled": true,
				"visible": true
			},
			"normalAttributesValueMap": {
				"disabled": true,
				"visible": true
			},
			"marketingPicture": {
				"disabled": false,
				"visible": false
			},
			"spVideo": {
				"disabled": false,
				"visible": false
			}
		},
		"skuFieldConfig": {
			"upcCode": {
				"disabled": true,
				"required": true,
				"visible": true
			},
			"weight": {
				"disabled": false,
				"required": true,
				"visible": true
			},
			"box": {
				"disabled": false,
				"visible": false
			},
			"minOrderCount": {
				"disabled": false,
				"visible": false
			},
			"specName": {
				"disabled": true,
				"visible": true
			},
			"suggestedPrice": {
				"disabled": true,
				"visible": false
			}
		}
	},
	"success": true
}