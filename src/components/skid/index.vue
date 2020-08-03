<template>
  <div class="v-skid">
    <i class="i-return" @click="$router.go(-1)"></i>
    <div class="header">
      <div>
        <slot name="header"></slot>
      </div>
    </div>
    <div class="view">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'vSkid',
    props: {
      title: {
        type: String,
        default: '这里是一个标题'
      },
      width: {
        type: Number,
        default(){
          return document.body.clientWidth - 166
        }
      },
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .v-skid{
    padding: 0 0 0 40px;
    height: 100%;
    overflow: hidden;
  }
  .i-return{
    width: 40px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -20px;
    cursor: pointer;
    background: url('./images/1.png') no-repeat center center;
  }
  .header{
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: #fff;
    padding: 0 20px 0 40px;

    > div{
      height: inherit;
      border-bottom: 1px solid #eee;
      padding: 14px 0;

      .text{
        font-size: 18px;
        color: #000;
        line-height: 32px;
        float: left;
      }
      .btn-list{
        float: right;
        text-align: right;
      }
    }
  }
  .view{
    overflow-y: scroll;
    padding-right: 20px;
    padding-top: 80px;
    height: 100%;
  }
</style>
