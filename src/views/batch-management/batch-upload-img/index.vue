<template>
  <div class="batch-upload-img">
    <ItemLayout
      identifier="1"
      title="选择命名方式并准备图片"
    >
      <div>选择方式：</div>
      <small>
        使用商品名称、UPC/EAN/条形码或SKU码/货号命名，同一批图片只能使用其中一种命名方式。举例：
        <ul style="list-style-type: korean-hanja-informal; list-style-position: inside;">
          <li>用商品标题命名，上传多张“商品图片”：命名时需要加前缀“ZS1-”；如：ZS1-爆米花、ZS2-爆米花</li>
          <li>用商品标题命名，上传“商品条码图”：命名时需要增加前缀“BC-”；如：BC-爆米花</li>
        </ul>
      </small>
      <RadioGroup
        class="card-list"
        v-model="typeValue"
        :options="uploadRuleList"
      >
        <template #default="{ item, disabled, selected, clickHandler }">
          <ImageCard
            :disabled="disabled"
            :checked="selected"
            mode="img"
            @click="clickHandler"
          >
            <template #header>{{item.title}}</template>
            <template #content><img :src="item.content" /></template>
            <template #desc>{{item.desc}}</template>
          </ImageCard>
        </template>
      </RadioGroup>
      <div>图片要求：</div>
      <small>
        单张图片分辨率需大于600*450（或600*600），图片像素宽/高比例4 : 3（或1：1），单张
        <br />
        大小不超过500Kb，同一商品最大不超过5张图
      </small>
      <div class="pic-list">
        <div
          class="pic"
          v-for="(item, idx) in pictureDemoList"
          :key="idx">
          <img :src="item.src" />
          <div>{{item.memo}}</div>
        </div>
      </div>
    </ItemLayout>
    <ItemLayout
      identifier="2"
      title="上传压缩包"
    >
      <FileUpload
        v-model="file"
        :inlineUpload="false"
        initButtonText="添加压缩包"
        accept=".zip"
        manual
        :validator="handleCheckFile"
      />
      <small>
        整理压缩：将需要上传的图片放入1个文件夹
        <span className="error">（请勿创建子文件夹）</span>，
        将文件夹压缩为Zip格式的压缩包
      </small>
    </ItemLayout>
    <div class="submit-btn-container">
      <Button
        type="primary"
        :loading="loading"
        @click="handleSubmit"
        v-mc="{ bid: 'b_3dtqifg4' }"
      >开始上传</Button>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@components/file-upload'
  import RadioGroup from '@components/group/radio-group'
  import { fetchSubmitBatchUploadImg } from '@/data/repos/batch'
  import ImageCard from '../components/image-card'
  import ItemLayout from './components/item-layout'
  import { PictureUploadRuleTypeList, PICTURE_MEMOS } from './constants'

  const MAX_SIZE = 50 * 1024 * 1024

  export default {
    name: 'BatchUploadImg',
    components: {
      ItemLayout,
      FileUpload,
      RadioGroup,
      ImageCard
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
      }
    },
    methods: {
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
          await fetchSubmitBatchUploadImg({
            file,
            type: this.type
          })
          this.$Message.success('批量上传轮播图成功')
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
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
    .pic-list {
      display: flex;
      margin: 20px 0;
      .pic {
        img {
          width: 120px;
          height: 120px;
        }
        &:not(:last-child) {
          margin-right: 10px;
        }
        > div {
          margin-top: 10px;
          font-size: var(--small-font-size);
          text-align: center;
        }
      }
    }
    small {
      color: @color-gray3;
      font-size: 12px;
    }
    .submit-btn-container {
      text-align: right;
    }
  }
</style>
