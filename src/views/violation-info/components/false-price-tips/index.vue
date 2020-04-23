<template>
  <div class="false-price-tips">
    <slot></slot>
    <Definition title="原价虚高定义" :disabled="disabled">
      <span>商家在美团外卖平台发布商品的价格，违反法律法规或其与美团外卖签订相应协议中关于价格的相关规定/约定，包括但不限于：相同商品价格高于其他平台、高于店铺实际定价或虚高原价后再打折促销等情形/场景。</span>
    </Definition>
    <Definition title="如何整改" :disabled="disabled">
      <p>1.通知：每周一20点后，您可登陆美团外卖商家端查看消息中心是否接到通知，通知标题“【重要】菜品原价虚高整改通知”。进入“门店违规”页面查看具体虚高菜品明细，可以直接点击“改价”进行价格调整，点击后价格变更为建议价格</p>
      <p>2.调整时限：整改时间截止为当周周五18点，如有不理解的地方，请联系您的业务经理（业务经理联系方式可登陆美团外卖商家端查看）；</P>
      <p>例：11月6日（周一）接到通知，需在11月10日（当周周五）18点前整改完毕</p>
      <p>整改方式</p>
      <ul>
        <li>1）将美团价格改为建议价格</li>
        <li>2）如其他平台已经不再经营，请及时下线；</li>
        <li>3）如建议价格不合理或有其他问题，可联系您的业务经理。</li>
      </ul>
      <p>备注：如因大小份规格问题造成的价格虚高，请需调整价格为建议价格，并设置相应的规格。</p>
      <p>例：水饺售价15元，建议价格10元</p>
      <p>整改方式：将该更改价格为10元，并设置规格为小份。</p>
      <p>新建菜品水饺价格：15   规格：大份</p>
    </Definition>
    <Definition title="未及时整改的处罚" :disabled="disabled">
      <p>1、通知：每周一晚20点后，您可登陆美团外卖商家端查看消息中心是否接到通知，通知标题“【重要】价格虚高*****通知”</p>
      <p>2、处罚措施：</p>
      <ul>
        <li>1）商品下架/删除</li>
        <li>2) 限制商家参加平台活动</li>
        <li>3）置休店铺，情节严重的，将下线店铺</li>
      </ul>
    </Definition>
    <slot name="extra"></slot>
  </div>
</template>

<script>
  import Definition from './definition'

  export default {
    name: 'false-price-tips',
    components: {
      Definition
    },
    props: {
      disabled: Boolean
    }
  }
</script>

<style lang='less' scoped>
.false-price-tips {
  font-size: 12px;
  color: @menu-item-color;
  ul {
    li {
      list-style: none;
    }
  }
}
</style>
