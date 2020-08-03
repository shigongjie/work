<template>
  <div class="admin-index">
    <el-container class="view">
      <el-aside :class="{'hideSlide': $store.state.menu.isCollapse}">
        <v-menu></v-menu>
      </el-aside>
      <el-main>
        <div class="main-wrap">
          <v-header></v-header>
          <transition name="slide-fade-bottom" mode="out-in">
            <router-view class="router-view"></router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<style media="screen" lang="scss" scoped>
.admin-index {
  height: 100%;
}
.view {
  height: 100%;
  display: flex;
}
.el-aside {
  width: 200px !important;
  z-index: 99;
  height: 100%;
  background: #2f4056;
  // position: fixed;
  // left: 0;
  // top: 0px;
  &.hideSlide {
    width: 0 !important;
  }
}

.el-main {
  flex: 1;
  padding: 0;

  // padding: 70px 10px 10px 210px;
  // position: absolute;
  // left: 0;
  // top: 0;
  // width: 100%;
  // height: 100%;

  // min-width: 1130px;
  .main-wrap {
    min-width: 1130px;
    overflow: auto;
  }
  .router-view {
    padding: 10px;
  }
}
</style>
<script>
import vMenu from "components/menu";
import vHeader from "components/header";
export default {
  name: "admin-index",
  data() {
    return {
      //Component Data
      example: true,
      foo: "bar"
    };
  },

  components: {
    vMenu,
    vHeader
  },
  mounted() {},

  methods: {}
};
</script>
