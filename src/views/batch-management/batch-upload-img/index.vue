<template>
  <div v-if="havePermission" class="batch-upload-img">
    <OrderFormItem label="准备图片">
      <div>可同时批量上传商品图片、商品条码图。</div>
      <CollapsePanel title="商品图片">
        <div>
          <span class="text-indicator">1. 图片要求：</span>支持图片比例尺寸为1:1、4:3（大于600*600、600*450像素）。每个商品最多可上传8张，支持.jpg、.png格式。建议使用白色背景，图片构图合理、突出商品、清晰完整。详细请查看
          <a href="https://daxue.meituan.com/m/shangoushang/article/2072?ehwebview=1">图片规范</a>
        </div>
        <div class="pic-list">
          <div
            class="pic"
            v-for="(item, idx) in pictureDemoList"
            :key="idx">
            <img :src="item.src" />
            <div class="pic-memo">{{item.memo}}</div>
          </div>
        </div>
        <div>
          <span class="text-indicator">2. 命名格式：</span>使用“商品名称”、“条形码”或“SKU码/货号”三种方式命名，同一批图片只能使用其中一种命名方式。“ZS-”前缀表示商品图片，同一商品多张图片时需要加前缀：“ZS0-”（编号0代表第一张主图），如：ZS0-爆米花、ZS1-爆米花、ZS2-爆米花。
        </div>
      </CollapsePanel>
      <CollapsePanel title="商品条码图" enabled :collapsed="true">
        <div>
          <span class="text-indicator">1. 图片要求：</span>图片要求:每个商品仅需 1 张条形码图，支持.jpg、.png格式。图中的条形码需清晰、完整(图片仅供平台运营审核使用，不向顾客 展示)。
        </div>
        <div class="pic-list">
          <div
            class="pic"
            v-for="(item, idx) in upcPictureDemoList"
            :key="idx">
            <img :src="item.src" />
            <div class="pic-memo">{{item.memo}}</div>
          </div>
        </div>
        <div>
          <span class="text-indicator">2. 命名格式：</span>使用“商品名称”、“条形码”或“SKU码/货号”三种方式命名，同一批图片只能使用其中一种命名方式。“BC0-”前缀表示商品条码图，如:BC0-爆米花。
        </div>
      </CollapsePanel>
    </OrderFormItem>
    <OrderFormItem label="上传压缩包">
      <div class="selector-upload-type">
        <div class="selector-label">选择命名方式</div>
        <RadioGroup
          v-model="typeValue"
          :options="uploadRuleList"
          :formatter="itemFormatter"
          @change="lxMc({ bid: 'b_4948g8wg' })"
        />
      </div>
      <div class="upload-image-operator-tip">
        将上传的图片放于1个文件夹
        <span class="error">（请勿创建子文件夹）</span>
        后压缩为Zip格式。
      </div>
      <FileSelect
        v-model="file"
        accept=".zip"
        select-text="点击选择文件"
        :validator="handleCheckFile"
        v-mc="{ bid: 'b_52w6lsne' }"
      />
    </OrderFormItem>
    <StickFooter
      :submitting="loading"
      @confirm="handleSubmit"
      :bid="['b_3dtqifg4']"
    />
  </div>
  <EmptyTip v-else/>
</template>

<script>
  import FileSelect from '@components/file-select'
  import { fetchSubmitBatchUploadImg } from '@/data/repos/batch'
  import RadioGroup from '@components/group/radio-group'
  import OrderFormItem from '@components/order-form-item'
  import StickFooter from '@/views/batch-management/components/footer'
  import lx from '@/common/lx/lxReport'
  import CollapsePanel from './components/panel'
  import { PictureUploadRuleTypeList, PICTURE_MEMOS, UPC_PICTURE_MEMOS } from './constants'
  import { mapStateWatcher } from '@/plugins/router-leave-confirm'
  import { forceGetPermission } from '@/views/components/permission-bth/getPermissionMixin'
  import EmptyTip from '../components/empty-tip'

  const MAX_SIZE = 50 * 1024 * 1024

  export default {
    name: 'BatchUploadImg',
    mixins: [forceGetPermission('EDIT')],
    components: {
      FileSelect,
      StickFooter,
      CollapsePanel,
      RadioGroup,
      OrderFormItem,
      EmptyTip
    },
    props: {
      submitData: {
        type: Function,
        default: fetchSubmitBatchUploadImg
      }
    },
    data () {
      return {
        type: null,
        file: null,
        loading: false
      }
    },
    computed: {
      typeValue: {
        get () {
          return PictureUploadRuleTypeList.find(type => type.value === this.type)
        },
        set (ruleValue) {
          this.type = ruleValue ? ruleValue.value : null
        }
      },
      uploadRuleList () {
        return PictureUploadRuleTypeList
      },
      pictureDemoList () {
        return PICTURE_MEMOS
      },
      upcPictureDemoList () {
        return UPC_PICTURE_MEMOS
      }
    },
    watch: {
      ...mapStateWatcher('loading', {
        pageName: '批量上传图片',
        content: '上传文件暂未提交成功。离开后，文件将无法保存。确定离开？'
      })
    },
    methods: {
      lxMc (option) {
        lx.mc(option)
      },
      handleCheckFile (file) {
        let error = false
        if (!file) {
          this.$Message.error('请先选择文件')
          error = true
        } else if (file && file.size > MAX_SIZE) {
          this.$Message.error('文件过大，单个压缩包最大支持50M')
          error = true
        }
        return error
      },
      async handleSubmit () {
        if (!this.type) {
          this.$Message.error('请选择匹配方式')
          return
        }
        const file = this.file
        const error = this.handleCheckFile(file)
        if (error) {
          return
        }
        try {
          this.loading = true
          await this.submitData({
            file,
            type: this.type
          })
          this.$Message.success('批量上传轮播图成功')
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      itemFormatter (item) {
        return {
          value: item,
          label: item.title
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .batch-upload-img {
    .card-list {
      display: flex;
      margin: 20px 0;
      .image-card {
        width: 160px;
      }
    }
    .text-indicator {
      font-weight: 600;
      font-size: 12px;
      color: #444444;
    }
    .pic-list {
      display: flex;
      margin: 10px 20px 10px 0;
      .pic {
        img {
          width: 120px;
          height: 120px;
        }
        &:not(:last-child) {
          margin-right: 10px;
        }
        &:first-child {
          .pic-memo {
            color: #60c034;
          }
        }
        .pic-memo {
          color: #FA5555;
          font-size: @font-size-small;
          text-align: center;
        }
      }
    }
    .upload-image-operator-tip {
      font-size: 12px;
      margin: 12px 0;
      color: #585A6E;
      .error {
        color: #FA5555;
      }
    }
    /deep/ .collapse-panel {
      margin-top: 10px;
      width: 720px;
    }
    .selector-upload-type {
      display: flex;
      .selector-label {
        margin-right: 16px;
        color: #585A6E;
      }
    }
  }
</style>
