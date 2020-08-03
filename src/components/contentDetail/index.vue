<template>
  <el-dialog
    :title="title"
    :visible.sync="showValue"
    append-to-body
    class="dialog-expert-apply"
  >
   <div class="dialog">
    <div v-html="bigImg"></div>
   </div>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  props: {
    bigImg: String,
    title: String,
  },
    mixins: [modalMixin],
  data() {
    return {};
  },
  mounted() {
      console.log( this.bigImg)
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.dialog {
  margin-bottom: 15px;
  max-height: 500px;
  padding: 10px;
  z-index: 0;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}
</style>
