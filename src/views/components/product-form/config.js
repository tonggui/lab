/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
export default () => {
  return [
    {
      layout: 'FormCard',
      title: '快捷新建1',
      children: [
        {
          key: 'name',
          type: 'Input',
          label: '商品名称',
          value: '',
          events: {
            'on-change' (e) { this.formData.name = e.target.value }
          }
        },
        {
          key: 'brand',
          type: 'Input',
          label: '商品品牌',
          value: '',
          rules: [
            {
              result: {
                value () { return this.formData.name },
                mounted () {
                  return this.formData.name !== '456'
                }
              }
            }
          ]
        }
      ],
      rules: [
        {
          result: {
            title () { return `快捷${this.context.modeString}` },
            tip () { return `提高${this.context.modeString}商品效率` },
            visible () {
              return this.formData.name !== '123'
            }
          }
        }
      ]
    }
  ]
}
