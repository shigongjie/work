<template>
  <div class="vheader">
    <div class="header-container">
      <div class="header-lf">
        <hamburger
          :is-active="$store.state.menu.isCollapse"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
        <div class="home">{{titleName}}</div>
      </div>

      <!-- <div class="bgWrap"> -->
      <!-- <img src="./images/title.png" alt /> -->
      <!-- </div> -->
      <div class="right-view">
        <div class="badge">
          <!-- <i class="el-icon-message"></i> -->
          <messageTip></messageTip>
          <!-- <span></span> -->
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="user-info" @click.stop="isShowOperating = !isShowOperating">
          <div>
            <!-- <i class="lazyimg avatar"></i> -->
            <i class="lazyimg avatar" v-if="userInfo.headIcon =='' || !userInfo.headIcon"></i>
            <i
              class="lazyimg avatar"
              v-else
              :style="`background-image: url('${userInfo.headIcon}')`"
            ></i>
          </div>
          <div class="userMsg">
            <p style="font-size:14px;color:#333333">{{$store.state.userInfo.data.userName}}</p>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$store.state.userInfo.data.departmentAndRoleName"
              placement="bottom"
            >
              <p
                style="font-size:12px;color:#999999;max-width:170px"
                class="oe"
              >{{$store.state.userInfo.data.departmentAndRoleName}}</p>
            </el-tooltip>
          </div>
          <img class="open" src="./images/2.png" />
        </div>
      </div>
      <transition name="slide-fade-top" mode="out-in">
        <div class="operating" v-show="isShowOperating">
          <div class="user" @click="$router.push({path:'/personalCenter'})">个人中心</div>
          <div
            class="info"
            @click="$router.push({ path: '/personalCenter/updatapwd' }), isShowOperating = false"
          >修改密码</div>
          <div class="out" @click="$fetch.loginOut">退出登录</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import messageTip from "../messageTip";
import Hamburger from "@/components/Hamburger";
export default {
  components: {
    messageTip,
    Hamburger
  },
  name: "vheader",
  data() {
    return {
      opened: false,
      titleName: "",
      isShowOperating: false,
      userInfo: {
        userName: "",
        headIcon: "",
        departmentAndRoleName: ""
      }
    };
  },
  watch: {
    $route(n) {
      this.titleName = n.meta.title;
      this.getLoginUserInfo();
    }
  },
  mounted() {
    this.titleName = this.$route.meta.title;
    document.onclick = () => {
      this.isShowOperating && (this.isShowOperating = false);
    };
  },

  created() {
    this.getLoginUserInfo();
  },
  methods: {
    toggleSideBar() {
      console.log(333, this.$store.state.menu.isCollapse);

      this.$store.dispatch("setIsCollapse", !this.$store.state.menu.isCollapse);
    },
    // 获取成员
    async getLoginUserInfo() {
      const d = await this.post(this.$api.home.getLoginUserInfo);
      if (d.code === 0) {
        this.userInfo = d.data;
        console.log(this.userInfo);
        this.$store.dispatch("setUserInfo", d.data);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.vheader {
  height: 60px;
  // position: fixed;
  // left: 0px;
  // padding-left: 200px;
  // top: 0;
  width: 100%;
  z-index: 10;

  .header-container {
    box-shadow: 0px 2px 2px #f0f0f0;
    height: inherit;
    width: 100%;
    background: rgb(255, 255, 255);
    display: flex;
    color: #808080;
    font-size: 16px;
    padding-right: 20px;
    align-items: center;
    justify-content: space-between;
    .home {
      margin-left: 20px;
      color: #606266;
      font-size: 14px;
    }
    // .bgWrap {
    //   background: linear-gradient(#0f88eb, #0276d6);
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   width: 200px;
    //   height: 60px;
    //   margin-right: 60px;
    // }
    .el-breadcrumb {
      line-height: 40px;
      float: left;
    }

    .right-view {
      height: 100%;
      display: flex;
      padding: 3px 0px;
      align-items: center;
      .badge {
        width: 26px;
        height: 100%;
        // background: url("./images/1.png") no-repeat center center;
        color: white;
        margin-left: 50px;
        display: flex;
        align-items: center;
        cursor: pointer;
        i {
          font-size: 30px;
        }

        span {
          background-color: #f56c6c;
          border-radius: 10px;
          color: #fff;
          display: inline-block;
          font-size: 12px;
          height: 14px;
          line-height: 18px;
          padding: 0 6px;
          text-align: center;
          white-space: nowrap;
          border: 1px solid #fff;
          position: absolute;
          left: 15px;
          top: 10px;
        }
      }
      .user-info {
        height: 100%;
        max-width: 230px;
        min-width: 140px;
        border-radius: 5px;
        background: white;
        cursor: pointer;
        display: flex;
        padding-right: 10px;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          background-image: url("./images/avatar.png");
        }
        .userMsg {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .open {
          color: #606266;
        }
      }
    }
    .user-phone {
      float: right;
    }
  }
}
.el-divider--vertical {
  height: 1.5em;
  margin: 1px 20px;
}
.operating {
  border-radius: 3px;
  width: 152px;
  height: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 30px;
  top: 70px;
  background: #fff;
  z-index: 999;
  padding: 0 10px;

  &:after {
    content: "";
    position: absolute;
    right: 35px;
    top: -6px;
    width: 14px;
    height: 6px;
    // background-image: url('~@/assets/images/triangle.png');
  }
  div {
    height: 54px;
    line-height: 54px;
    font-size: 14px;
    color: #333;
    padding-left: 54px;
    cursor: pointer;
    &.user {
      border-bottom: 1px solid #eee;
      background: url("./images/icon_grzx.png") no-repeat 28px center;
    }
    &.info {
      background: url("./images/3.png") no-repeat 28px center;
      border-bottom: 1px solid #eee;
    }
    &.out {
      background: url("./images/4.png") no-repeat 28px center;
    }
  }
}

.slide-fade-top-enter-active,
.slide-fade-top-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-top-enter,
.slide-fade-top-leave-active {
  transform: translateY(10px);
  opacity: 0;
}
.header-lf {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
