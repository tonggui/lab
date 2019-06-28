export const getFormConfig = () => {
  const formConfig = [
    {
      key: 'isMedicine',
      type: 'iSwitch',
      value: false,
      events: {
        'on-change' (v) {
          this.context.isMedicine = v
        }
      },
      rules: [
        {
          result: {
            value () {
              return this.context.isMedicine
            }
          }
        }
      ]
    },
    {
      key: 'upc',
      type: 'Input',
      value: '',
      visible: true,
      options: {
        placeholder: '请输入商品条码'
      },
      events: {
        'on-change' (v) {
          this.formData.upc = v.target.value
        }
      },
      rules: [
        {
          result: {
            visible () {
              return this.context.isMedicine
            }
          }
        }
      ]
    },
    {
      key: 'name',
      type: 'Input',
      value: '',
      options: {
        placeholder: '请输入商品名称'
      },
      events: {
        'on-change' (v) {
          this.formData.name = v.target.value
        }
      }
    },
    {
      key: 'edit-name',
      type: 'EditInput',
      value: '',
      options: {
        displayMaxWidth: 400,
        onConfirm (v) {
          return new Promise(resolve => {
            setTimeout(() => {
              this.formData.name = v
              resolve()
            }, 1000)
          })
        }
      },
      rules: [
        {
          result: {
            value () {
              return this.formData.name
            }
          }
        }
      ]
    },
    {
      key: 'labels',
      type: 'ProductLabels',
      value: [],
      events: {
        'on-change' (v) {
          this.formData.labels = v
        }
      }
    }
  ]
  return formConfig
}
