<template>
  <div class="anomaly-card">
    <div class="desc-wrapper">
      <img v-if="picture" :src="picture" class="pic">
      <div v-else class="pic pic-empty"><Icon local="picture" size="22" /></div>
      <div class="title">{{ data.title }}</div>
    </div>
    <div class="sku-wrapper">
      <div v-for="(item, index) in data.skus" class="sku-box" :key="index">
        <div class="spec">{{ item.spec }}</div>
        <div class="sell-count" v-if="anomalyType !== TYPE.UNSALABLE">{{ item.sellCount }}</div>
        <div class="price">
          <EditInput
            :value="item.price"
            inputPrefix="￥"
            :disabled="anomalyType !== TYPE.PRICE_ANOMALY"
            size="small"
            @on-confirm="(value) => handleEditPrice(value, item, index)"
          />
        </div>
        <div class="stock">
          <EditInput
            :value="item.stock"
            :disabled="anomalyType !== TYPE.STOCK_ANOMALY"
            size="small"
            @on-confirm="(value) => handleEditStock(value, item, index)"
          />
        </div>
        <div class="tag" v-if="anomalyType === TYPE.UNSALABLE">
          <EditTag
            v-if="index === 0"
            :tag-id="tagId"
            :data="tagList"
            size="small"
            :on-confirm="handleEditTag"
          >
            <slot v-slot:display="{ value: displayTag }"></slot>
          </EditTag>
          <!--<Cascader v-if="index === 0" v-model="tagId" :data="tagList" size="small" trigger="hover" @change="handleEditTag" />-->
        </div>
        <div :class="['oprs', { 'flex-end': anomalyType === TYPE.PRICE_ANOMALY }]">
          <ButtonGroup>
            <template v-if="index === 0">
              <Button v-if="anomalyType !== TYPE.PRICE_ANOMALY" class="text-btn" size="small" type="text" @click="handleClickOffShelf">下架</Button>
              <Button class="text-btn" size="small" type="text" @click="handleGoEdit">修改</Button>
            </template>
            <Button v-if="anomalyType === TYPE.PRICE_ANOMALY" class="text-btn" size="small" type="text" @click="handleCheckPrice(index)" v-mc="{ bid: 'b_aj7adiyz', val: { sku_id: item.skuId } }">核对价格</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>

    <Modal
      :width="400"
      :value="modal"
      :title="MODAL[curModalType].title"
      :loading="submitting"
      :ok-text="MODAL[curModalType]['ok-text']"
      :cancel-text="MODAL[curModalType]['cancel-text']"
      @on-ok="handlePriceSubmit"
      @on-cancel="modal = false"
    >
      {{ MODAL[curModalType]['content'] }}
    </Modal>
  </div>
</template>

<script>
  import EditInput from './edit-input'
  import EditTag from './edit-tag'
  import { validate } from '@sgfe/product-validate'
  import {
    fetchSubmitModProductSku,
    fetchSubmitSetSellStatus,
    fetchSubmitCheckPrice,
    fetchSubmitUpdateTag
  } from '@/data/repos/product'
  import { PROBLEM_TYPE as TYPE } from '@/views/monitor/constants'
  import { MODAL_TYPE, PRICE_ANOMALY_MODAL as MODAL } from './constants'

  export default {
    name: 'anomaly-card',
    components: {
      EditInput,
      EditTag
    },
    props: {
      anomalyType: {
        type: Number,
        default: 1101
      },
      data: {
        type: Object,
        default: () => {}
      },
      tagList: {
        type: Array,
        default: () => []
      },
      poiId: {
        type: [Number, String]
      }
    },
    data () {
      return {
        TYPE,
        MODAL,
        picture: this.convertToCompatiblePicture(this.data.picture),
        tagId: this.data.tagId.split(',').map(id => Number(id)),
        curModalType: MODAL_TYPE.CHECK,
        curSkuIndex: 0,
        curEditPrice: null,
        modal: false,
        submitting: false
      }
    },
    methods: {
      /**
       * 转化为兼容模式图片
       * 目前展现层只显示单张主图，所以需要将多图转化为单图显示
       * @param src 标品库返回图片内容
       * @return {string | string}
       */
      convertToCompatiblePicture (src) {
        const sourceMainPicture = (src || '').split(',')[0]
        return sourceMainPicture || ''
      },

      reloadAfterOneMin () {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      },

      priceValidator (value) {
        const res = validate('sku.price', value)
        if (res.code > 0) {
          return res.msg
        }
      },

      stockValidator (value) {
        const res = validate('sku.stock', value)
        if (res.code > 0) {
          return res.msg
        }
      },

      async handleEditPrice (value, item, index) {
        // TODO lx report edit price && 91402
        this.curModalType = MODAL_TYPE.DB_CHECK
        this.curSkuIndex = index
        this.curEditPrice = value
        if (value < item.floorPrice) {
          const content = MODAL[this.curModalType].content(value, this.data.title, item.spec)
          this.MODAL[this.curModalType].content = content
          this.modal = true
          return
        } else {
          const skuId = this.data.skus[this.curSkuIndex].skuId
          await fetchSubmitModProductSku(skuId, { 'price': { value: this.curEditPrice } }, this.poiId)
          this.data.skus[this.curSkuIndex]['price'] = this.curEditPrice
          this.$Message.success('已优化')
          this.reloadAfterOneMin()
        }
        const msg = this.priceValidator(value)
        if (msg) {
          this.$Message.warning(msg)
        } else {
          this.handlePriceSubmit(item.skuId, value)
        }
      },

      async handlePriceSubmit (skuId = this.data.skus[this.curSkuIndex].skuId, price = this.curEditPrice, poiId = this.poiId) {
        this.submitting = true
        try {
          if (this.curModalType === MODAL_TYPE.CHECK) {
            await fetchSubmitCheckPrice(skuId)
          }
          if (this.curModalType === MODAL_TYPE.DB_CHECK) {
            await fetchSubmitModProductSku(skuId, { 'price': { value: price } }, poiId)
            this.data.skus[this.curSkuIndex]['price'] = price
          }
          this.$Message.success('已优化')
          this.reloadAfterOneMin()
        } catch (err) {
          this.$Message.error(err.message || err)
        } finally {
          this.submitting = false
        }
      },

      handleEditStock (value, item, index) {
        // TODO lx report edit stock && 91403
        const msg = this.stockValidator(value)
        if (msg) {
          this.$Message.warning(msg)
        } else {
          this.submitting = true
          fetchSubmitModProductSku(item.skuId, { 'stock': value }, this.poiId).then(res => {
            this.data.skus[index]['stock'] = value
            this.$Message.success('已优化')
            this.reloadAfterOneMin()
          }).catch(err => {
            this.$Message.error(err.message || err)
          }).finally(() => {
            this.submitting = false
          })
        }
      },

      handleEditTag (value) {
        if (!value || value.length <= 0) {
          this.$Message.error('店内分类不能为空')
          return false
        }
        const prevTagId = this.tagId
        this.tagId = value.map(v => v.id)
        const params = {
          tagId: this.tagId.join(','),
          spuIds: this.data.spuId,
          wmPoiId: this.poiId,
          v2: 1,
          opTab: 0,
          viewStyle: 0
        }
        return fetchSubmitUpdateTag(params).then(() => {
          this.$Message.success('已优化')
          this.reloadAfterOneMin()
        }).catch(err => {
          this.tagId = prevTagId
          this.$Message.error(err.message || err)
        })
      },

      handleClickOffShelf () {
        // TODO lx report set offShelf && 91405
        this.submitting = true
        fetchSubmitSetSellStatus(this.poiId, this.data.spuId).then(res => {
          this.$Message.success('已优化')
          this.reloadAfterOneMin()
        }).catch(err => {
          this.$Message.error(err.message || err)
        }).finally(() => {
          this.submitting = false
        })
      },

      handleGoEdit () {
        // TODO lx report goto edit
        setTimeout(() => {
          this.$router.push({ path: '/product/edit', query: { wmPoiId: this.poiId, spuId: this.data.spuId } })
        }, 500)
      },

      handleCheckPrice (index) {
        this.curModalType = MODAL_TYPE.CHECK
        this.curSkuIndex = index
        this.modal = true
      }
    },
    created () {}
  }
</script>

<style lang='less'>
.anomaly-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 15px 20px 15px 0;
  border-bottom: 1px dashed @color-gray5;
  cursor: pointer;
  .desc-wrapper {
    flex-basis: 24%;
    padding-left: 20px;
    .pic {
      display: inline-block;
      width: 48px;
      height: 48px;
      object-fit: cover;
      vertical-align: middle;
      border: 1px solid #ebeef2;
      &.pic-empty {
        text-align: center;
        line-height: 48px;
        vertical-align: middle;
      }
    }
    .title {
      display: inline-block;
      text-align: left;
      line-height: 1.5;
      vertical-align: middle;
      padding-left: 10px;
      width: 180px;
    }
  }
  .sku-wrapper {
    flex-basis: 76%;
    .sku-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 48px;
      .spec, .sell-count, .price, .stock, .tag, .oprs {
        text-align: center;
      }
      .spec, .sell-count {
        flex-basis: 10%;
      }
      .price, .stock {
        flex-basis: 20%;
      }
      .tag {
        flex-basis: 28%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .oprs {
        flex-basis: 18%;
        display: flex;
        justify-content: center;
        align-items: center;
        &.flex-end {
          justify-content: flex-end;
        }
        .text-btn {
          color: @highlight-color;
          &.boo-btn {
            padding: 0 4px;
          }
        }
      }
    }
  }
}
</style>
