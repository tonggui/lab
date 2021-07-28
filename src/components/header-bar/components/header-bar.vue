<template>
  <div class="wrapper">
    <div class="left">
      <div class="title">
        商品新建
        <Tooltip placement="right-start" max-width="430">
          <Doubt name="doubt" class="doubt" />
          <template slot="content">
            <div class="tooltip-content">
              <span class="tooltip-title">手动新建：</span>
              <span class="tooltip-des"
                >适用于单次创建1～5个商品。创建前，请准备好商品信息。完整填写信息，有利于销量提升。</span
              >
            </div>
            <div class="tooltip-content">
              <span class="tooltip-title">搜索新建：</span>
              <span class="tooltip-des"
                >适用于单次创建1～100个商品。直接从平台商品库选择，创建成功商品无需审核。</span
              >
            </div>
            <div class="tooltip-content">
              <span class="tooltip-title">批量新建：</span>
              <span class="tooltip-des"
                >适用于单次5～2000个商品。使用Excel表格快速创建。</span
              >
            </div>
            <div class="tip-link">
              <a target="_blank" href="https://daxue.meituan.com/m/shangoushang/article/7581?mtdxSource=wmsj_l360gx">如何选择？</a>
            </div>
          </template>
        </Tooltip>
      </div>
      <template v-for="(menu, index) in left">
        <div v-if="index !== 0" class="border" :key="index"></div>
        <transition :name="menu.transitionName" :key="index">
          <component
            :is="leftComponent(menu.key)"
            is-native-tag
            component="IconItem"
            btn-type="CREATE"
            :need-permission="needPermission"
            :showBorder="index !== 0"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
        </transition>
      </template>
      <Tooltip
        placement="right-start"
        max-width="320"
        :always="isShowTips"
        :disabled="disabledTip"
      >
        <div class="tip"></div>
        <template slot="content">
          <div class="tooltip-content">“新建商品功能”全部放到这里了哦～选择合适的建品方式，可节省您的宝贵时间。</div>
          <div class="tip-link">
            <a @click="hideTip">我知道了 </a>
            <a target="_blank" href="https://daxue.meituan.com/m/shangoushang/article/7581?mtdxSource=wmsj_l360gx"> 如何选择？</a>
          </div>
        </template>
      </Tooltip>
    </div>
    <div class="right">
      <div class="other-title">其它操作</div>
      <div :class="`link-item-wrapper ` + rightClassName">
        <template v-for="(menu, index) in right">
          <transition :name="menu.transitionName" :key="index">
            <LinkItem
            v-if="menu.label !== '回收站'"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
          <PermissionBtn
            v-else
            component="LinkItem"
            :need-permission="needPermission"
            btn-type="RECYCLE_BIN"
            :id="menu.id"
            :menu="menu"
            @click="handleClick"
            :disabled="disabled"
            v-show="!menu.hide"
          />
          </transition>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import IconItem from './IconItem'
  import LinkItem from './LinkItem'
  import PermissionBtn from '@/views/components/permission-bth'
  import Doubt from '@/assets/icons/doubt.svg'
  import LocalStorage, { KEYS } from '@/common/local-storage'
  import {
    POI_PRODUCT_CUBE_ENTRANCE,
    POI_PRODUCT_NEW_ARRIVAL_SWITCH
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'header-bar',
    components: {
      IconItem,
      LinkItem,
      Doubt
    },
    props: {
      left: Array,
      right: Array,
      disabled: Boolean,
      needPermission: Boolean
    },
    data () {
      return {
        firstStatus: true
      }
    },
    computed: {
      ...mapModule({
        newArrivalSwitch: POI_PRODUCT_NEW_ARRIVAL_SWITCH,
        supportProductCube: POI_PRODUCT_CUBE_ENTRANCE
      }),
      rightClassName () {
        if (this.right.length <= 3) {
          return 'link-item-wrapper-3'
        } else if (this.right.length <= 6) {
          return 'link-item-wrapper-6'
        } else {
          return 'link-item-wrapper-9'
        }
      },
      isShowTips () {
        return !LocalStorage[KEYS.PRODUCT_NEW_CREATE]
      },
      disabledTip () {
        return LocalStorage[KEYS.PRODUCT_NEW_CREATE]
      }
    },
    methods: {
      leftComponent (key) {
        const withoutPermissionButton = ['createProduct', 'productLibrary', 'batchCreate']
        if (!withoutPermissionButton.includes(key)) return IconItem
        return PermissionBtn
      },
      handleClick (menu) {
        this.$emit('click', menu)
      },
      hideTip () {
        LocalStorage[KEYS.PRODUCT_NEW_CREATE] = true
      }
    }
  }
</script>

<style lang="less" scoped>
.wrapper {
  height: 120px;

  .title,
  .other-title {
    font-weight: 500;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #222222;
    line-height: 20px;
    margin-bottom: 20px;

    .doubt {
      font-size: 13px;
      margin-left: 5px;
      &:hover {
        cursor: pointer;
      }
    }

    .tooltip-content {
      font-weight: 400;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      line-height: 20px;
      width: 414px;
      text-align: left;
      display: flex;

      .tooltip-title {
        display: inline-block;
        width: 70px;
      }
      .tooltip-des {
        display: inline-block;
        text-align: left;
        width: 344px;
      }
    }
  }

  .tip-link {
    text-align: right;
    margin: 4px 0 0 0;
  }

  .other-title {
    margin-bottom: 0;
  }

  .tip {
    height: 30px;
  }
}

.left {
  width: 624px;
  height: 120px;
  background: #fff;
  padding: 20px 24px 10px;
  margin-right: 10px;
  float: left;

  .border {
    height: 34px;
    width: 0;
    border-left: 1px #eee solid;
    display: inline-block;
    margin-right: 22px;
    margin-left: 22px;
  }
}

.right {
  width: calc(100% - 634px);
  height: 120px;
  float: left;
  background: #fff;
  padding: 20px 24px 10px;

  .link-item-wrapper {
    display: flex;
    flex-wrap: wrap;

    & > span,
    & > div {
      line-height: 20px;
      height: 20px;
    }
  }

  .link-item-wrapper-3 > span,
  .link-item-wrapper-3 > button,
  .link-item-wrapper-3 > a,
  .link-item-wrapper-3 > div {
    width: 33%;
    margin-top: 26px;

    @media screen and (max-width: 1140px) {
      margin-top: 12px;
      width: 50%;
    }
  }

  .link-item-wrapper-6 > span,
  .link-item-wrapper-6 > button,
  .link-item-wrapper-6 > a,
  .link-item-wrapper-6 > div {
    width: 33%;
    margin-top: 12px;

    @media screen and (max-width: 1140px) {
      margin-top: 5px;
      width: 50%;
    }
  }

  .link-item-wrapper-9 > span,
  .link-item-wrapper-9 > button,
  .link-item-wrapper-9 > a,
  .link-item-wrapper-9 > div {
    width: 33%;
    margin-top: 5px;

    @media screen and (max-width: 1140px) {
      width: auto;
    }
  }

}
</style>
