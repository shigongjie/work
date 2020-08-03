<template>
  <div class="v-view-header">
    <span>{{title}}</span>
    <slot name="main"></slot>
  </div>
</template>

<script>
  export default {
    name: 'v-view-header',
    props: {
      title: {
        type: String,
        default: '这里是一个标题'
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
  .v-view-header{
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #eee;

    span{
      font-size: 18px;
      color: #000;
    }
    .btn-list{
      text-align: right;
      float: right;
    }
  }
</style>
