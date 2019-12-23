<template>
  <div class="product-unsalable">
    <BreadcrumbHeader>30日滞销商品</BreadcrumbHeader>
    <Alert type="error" class="warning">
      <Icon type="error-outline" size="17" color="red" /> 滞销为30日内无销量的商品，请根据提升方案进行调整
    </Alert>
    <div class="solutions-wrapper">
      <div class="solution-title">销量提升方案</div>
      <div class="solutions">
        <SolutionItem v-for="s in DETAIL" :key="s.title" :item="s">
          <span v-if="s.link" v-mc="{ bid: s.bid }">
            {{ s.content }}
            <a
              v-if="(isB && s.id === SOLUTIONS.MARKETING) || s.id === SOLUTIONS.MANAGE_TAG"
              href="javascript:;"
              @click="s => handleClick(s)"
            >
              {{ s.linkText }}
            </a>
          </span>
        </SolutionItem>
      </div>
    </div>
  </div>
</template>

<script>
  import BreadcrumbHeader from '@/views/components/breadcrumb-header'
  import SolutionItem from './components/solution-item'
  import { getPoiId } from '@/common/constants'
  import { SOLUTIONS, SOLUTIONS_DETAIL as DETAIL } from './constants'
  import { PROBLEM_TYPE } from '@/views/monitor/constants'

  export default {
    name: 'unsalable',
    components: {
      BreadcrumbHeader,
      SolutionItem
    },
    data () {
      return {
        SOLUTIONS,
        DETAIL,
        PROBLEM_TYPE,
        isB: window.isB // B端才显示跳转至营销活动的链接
      }
    },
    computed: {
      poiId () {
        return getPoiId()
      }
    },
    methods: {
      handleClick (solution) {
        const { id, link } = solution
        if (id === SOLUTIONS.MARKETING) {
          // eslint-disable-next-line
          if (window.bridge && window.bridge.jumpTo) {
            window.bridge.jumpTo({ href: link })
          }
        }

        if (id === SOLUTIONS.MANAGE_TAG) {
          this.$router.push({ path: link, query: { wmPoiId: this.poiId } })
        }
      }
    },
    created () {}
  }
</script>

<style lang='less'>
.product-unsalable {
  .warning {
    border: none;
    line-height: 34px;
    margin: 0;
  }
  .solutions-wrapper {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 20px;
    .solution-title {
      font: bold 20px/26px '微软雅黑';
      margin-bottom: 20px;
    }
    .solutions {
      display: flex;
      justify-content: space-between;
      .solution-item {
        flex-basis: 22%;
        .item-title {
          color: @primary-color;
          padding-left: 10px;
          border-left: 4px solid @color-gray3;
          line-height: 12px;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .item-content {
          color: @color-gray3;
          font-size: 12px;
          a {
            color: @brand-auxiliaray-color-2;
          }
        }
      }
    }
  }
}
</style>
