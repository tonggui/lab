<template>
  <div>
    <Button @click="createModal('info')">info</Button>
    <Button @click="createModal('success')">success</Button>
    <Button @click="createModal('error')">error</Button>
    <Button @click="createModal('warning')">warning</Button>
    <Button @click="createModal('confirm')">confirm</Button>
    <Button @click="createModal('open')">open</Button>
  </div>
</template>
<script>
  import Modal from './index'

  export default {
    name: 'modal-demo',
    data () {
      return { loading: false }
    },
    methods: {
      async handleOk () {
        this.loading = true
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 3000)
        })
        this.loading = false
      },
      createModal (type) {
        const options = {
          content: `content ${type}`,
          title: type,
          okText: `${type} ok`,
          cancelText: `${type} cancel`,
          width: 400,
          closable: true,
          centerLayout: true,
          iconType: '',
          headBackgroundType: 'success',
          onOk: () => this.handleOk()
        }
        if (type !== 'open') {
          return Modal[type](options)
        }
        const inst = Modal[type]({
          ...options,
          headBackgroundType: 'warning',
          render: () => {
            return <div>回家啊是代扣代缴啊剋</div>
          },
          renderFooter: () => (
            <div>
              <Button onClick={() => console.log('footer1CLick')}>foote1</Button>
              <Button onClick={() => console.log('footer1CLick')}>foote2</Button>
              <Button loading={this.loading} onClick={async () => {
                await this.handleOk()
                inst.destroy()
              }}>foote3</Button>
            </div>
          )
        })
        return inst
      }
    }
  }
</script>
