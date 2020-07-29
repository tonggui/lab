import StandardProductLibraryAgreement from '@/views/components/agreement/standard-product-library'
export const EXCEL_TYPE = {
  STANDARD: 'standard',
  CUSTOM: 'custom'
}

export const normalExcel = [{
  type: EXCEL_TYPE.STANDARD,
  title: '使用条形码创建',
  link: '',
  linkName: '条码匹配商品库商品表格.xls',
  description: '仅适用于有条形码的商品。创建成功后，将自动匹配平台商品库中相关商品信息。',
  tip: ({
    data () {
      return {
        visible: false
      }
    },
    methods: {
      showModal () {
        this.visible = true
      }
    },
    render () {
      return (
        <div>
          <StandardProductLibraryAgreement mode="view" vModel={this.visible} />
          <div>
            平台商品库提供大量商品信息，帮助您提高商品创建效率。当创建的商品为商品库已有商品时，即可创建成功并自动匹配商品信息 (如商品名称、类目、图片、规格、重量等信息，可自行修改)。详细请查看
            <span vOn:click={this.showModal} style={{ cursor: 'pointer', textDecoration: 'underline' }}>《美团商品库声明》</span>
          </div>
        </div>
      )
    }
  })
}, {
  type: EXCEL_TYPE.CUSTOM,
  title: '自定义创建',
  link: '',
  linkName: '自行创建商品表格.xls',
  description: '适用于无条形码商品、平台商品库暂未收录的有条形码商品。创建成功后，需手动补全其他必填商品信息。',
  tip: ({
    render () {
      return <div>商品创建成功后，需编辑单个商品或使用批量操作补全商品信息。<span class="highlight-text">必填信息填写完全后，商品才可上架售卖。</span></div>
    }
  })
}]

export const medicineExcel = [{
  title: '通过美团点评商品库快速获取药品',
  link: '',
  linkName: '通过条码匹配美团药品库.xls'
}]
