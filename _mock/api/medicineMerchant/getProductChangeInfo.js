/**
 * @url /reuse/mpc/product/r/getProductChangeInfo
 */
module.exports = function(req) {
  
  return {
    data: {
      basicInfoListSize: 1,
      basicInfoListIterator: [
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '18.0',
          oldValue: '0.0',
          field: '12',
          setField: true
        }
      ],
      setBasicInfoList: true,
      categoryInfoListSize: 3,
      categoryInfoListIterator: [
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '100003537',
          oldValue: '0',
          field: '1200000088',
          setField: true
        },
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '',
          oldValue: '0',
          field: '020109',
          setField: true
        },
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '',
          oldValue: '0',
          field: '020105',
          setField: true
        }
      ],
      setCategoryInfoList: true,
      basicInfoList: [
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '18.0',
          oldValue: '0.0',
          field: '12',
          setField: true
        }
      ],
      categoryInfoList: [
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '100003537',
          oldValue: '0',
          field: '1200000088',
          setField: true
        },
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '',
          oldValue: '0',
          field: '020109',
          setField: true
        },
        {
          setOldValue: true,
          setNewValue: true,
          newValue: '',
          oldValue: '0',
          field: '020105',
          setField: true
        }
      ]
    },
    code: 0,
    msg: '成功'
  };
}
