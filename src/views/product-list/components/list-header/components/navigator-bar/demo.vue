<template>
  <div>
    <div class="anchor">
      <Button @click="showModal" ref="container">打开弹框</Button>
      <transition name="bounce">
        <Button v-show="hidden">新生成</Button>
      </transition>
    </div>
    <!-- <Button class="test">测试动画</Button> -->
    <Modal :mask="true" :class-name="`modal-container ${hidden ? '' : 'show'}`" :value="modalVisible" :transition-names="transitionNames" title="测试弹框" @on-cancel="handleAnimate" @on-ok="handleAnimate" ref="modal">
      <div>电脑课拉萨的那首，电脑课索伦蒂诺恐龙蛋克拉的你都快拉上你的扣篮都快拉上你的快乐撒的呢</div>
      <!-- <div>1</div> -->
    </Modal>
  </div>
</template>
<script>

  export default {
    // name: 'modal-animate',
    // data () {
    //   return {
    //     hidden: false,
    //     modalVisible: false,
    //     transitionNames: ['modal-animate-scale', 'modal-animate-fade']
    //   }
    // },
    // methods: {
    //   showModal () {
    //     this.modalVisible = true
    //     setTimeout(() => {
    //       const $container = this.$refs.modal.$el.querySelector('.boo-modal')
    //       $container.style.left = `${0}px`
    //     }, 300)
    //   },
    //   handleAnimate () {
    //     const $dom = this.$refs.container.$el
    //     const domeRect = $dom.getBoundingClientRect()
    //     const $modal = this.$refs.modal.$el.querySelector('.boo-modal')
    //     const modalRect = $modal.getBoundingClientRect()
    //     $modal.style.transformOrigin = `${(domeRect.right + 20 + 36) - (modalRect.left)}px 0`
    //     const $container = this.$refs.modal.$el.querySelector('.boo-modal')
    //     $container.style.top = `${domeRect.top + 16}px`
    //     this.modalVisible = false
    //     setTimeout(() => {
    //       this.hidden = true
    //     }, 400)
    //   }
    // }
  }
</script>
<style lang="less">
  // .anchor {
  //   background: #fff;
  //   padding: 40px 60px;
  //   margin: 100px;
  //   button {
  //     margin-right: 20px;
  //   }
  // }
  // @keyframes scale-out {
  //   0% {
  //     opacity: 1;
  //     transform: scale(1);
  //   }
  //   100% {
  //     opacity: .5;
  //     transform: scale(0.1);
  //   }
  // }
  // @keyframes scale-in {
  //   0% {
  //       opacity: 0;
  //       transform: scale(0.9);
  //   }
  //   100% {
  //       opacity: 1;
  //       transform: scale(1);
  //   }
  // }

  // @keyframes fade-in {
  //   0% {
  //       opacity: 0;
  //   }
  //   100% {
  //       opacity: 1;
  //   }
  // }
  // @keyframes fade-out {
  //   0% {
  //       opacity: 1;
  //   }
  //   100% {
  //       opacity: 0;
  //   }
  // }

  // @keyframes bounce-in {
  //   0%,to {
  //     transform: translateZ(0)
  //   }

  //   20%, 60% {
  //     transform: translate3d(-10px,0,0)
  //   }

  //   40%, 80% {
  //     transform: translate3d(10px,0,0)
  //   }
  // }

  // .bounce-enter-active {
  //   animation-name: bounce-in;
  //   animation-duration: .4s;
  //   animation-timing-function: linear;
  // }

  // @in-duration: .3s;
  // @out-duration: .4s;

  // .modal-container {
  //   .boo-modal {
  //     transition: left @out-duration linear, top @out-duration cubic-bezier(0,0,.08,.8);
  //   }
  //   // transition-property: transform;
  //   // transition-duration: @out-duration;
  //   // transition-timing-function: linear;
  //   .boo-modal {
  //     transform-origin: 100% 0;
  //     top: 500px;
  //   }
  //   &.show {
  //     &, .boo-modal {
  //       display: block !important;
  //     }
  //   }
  // }

  // .modal-animate-fade {
  //   &-enter-active {
  //     animation-name: fade-in;
  //     animation-timing-function: linear;
  //     animation-duration: @in-duration;
  //   }
  //   &-leave-active {
  //     animation-name: fade-out;
  //     animation-duration: @out-duration;
  //     animation-timing-function: linear;
  //   }
  // }
  // .modal-animate-scale {
  //   &-enter-active {
  //     animation-name: scale-in;
  //     animation-timing-function: linear;
  //     animation-duration: @in-duration;
  //   }
  //   &-leave-active {
  //     animation-name: scale-out;
  //     animation-duration: @out-duration;
  //     animation-timing-function: linear;
  //   }
  // }
</style>
