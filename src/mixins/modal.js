export default {
  props: {
    value: Boolean,
  },
  data () {
    return {
      showValue: false,
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('update:value', val);
    }
  },
}
