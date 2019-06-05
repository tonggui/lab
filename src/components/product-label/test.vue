<script>
export default {
  methods: {
    content() {
      return <span>11111</span>;
    },
    click() {
      console.log(1);
    }
  },
  mounted() {
    console.log(this.$refs);
  },
  render() {
    let content = this.content();
    return (
      <div ref="testRef" class={{ x: true }} onClick={this.click} vShow={false}>
        {content}
      </div>
    );
  }
};
</script>
