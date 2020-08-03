<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <global-uploader></global-uploader>
  </div>
</template>

<script>
import vMenu from "./components/menu";
import globalUploader from "@/components/uploader/globalUploader.vue";
export default {
  name: "App",
  components: {
    vMenu,
    globalUploader
  },
  data() {
    return {
      socket: null
    };
  },
  watch: {
    "$store.state.token.data": {
      handler: function(newer, older) {
        if (newer.token) {
          console.log("存在", newer);
          this.connect();
        } else {
          // this.onclose();
          console.log("退出");
        }
      },
      deep: true // 开启深度监听
    }
  },
  created() {
    this.connect();
    this.handleScreen();
    window.addEventListener("resize", this.handleScreen);
  },
  methods: {
    handleScreen() {
      this.screenWidth = document.body.clientWidth;
      this.$nextTick(() => {
        if (this.screenWidth <= 767) {
          this.$store.dispatch("setIsCollapse", true);
        } else {
          this.$store.dispatch("setIsCollapse", false);
        }
      });
    },
    connect() {
      if (this.$store.state.token.data.token === "") {
        console.log(123);
        return;
      }
      let that = this;
      let url = this.$config.socketUrl;
      if (window.location.protocol === "https:") {
        url = this.$config.socketUrls;
      }
      var thirdId = this.$store.state.token.data.token;
      var opts = {
        query: "thirdId=" + thirdId + "&ac=OA_PC"
      };
      this.socket = io.connect(url, opts);
      this.socket.on("connect", function() {
        console.log("连接成功");
        //服务端处理成连接时直接注册
        // that.regAccount();
      });
      this.socket.on("push_event", function(data) {
        console.log(data, "push_event");
        if (data !== "") {
          that.$store.dispatch("setMessage", null);
          setTimeout(() => {
            that.$store.dispatch("setMessage", data);
          }, 10);
        }
      });

      this.socket.on("disconnect", function() {
        console.log("disconnect");
      });
    },
    async regAccount() {
      const d = await this.post(this.$api.regAccount, {
        thirdId: this.$store.state.token.data.token,
        firmsCode: "WEBSOCKET",
        msgType: "IM"
      });
      if (d.code === 0) {
      }
    },
    send() {
      console.log("发送数据");
      this.socket.emit("text", "你好");
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleScreen);
  }
};
</script>

<style lang="scss">
@import "./assets/css/common.scss";
@import "./assets/font/iconfont.css";
.el-container {
  height: 100%;
}
.el-header {
  padding: 0 15px;
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  position: fixed;
}
#app {
  height: 100%;
}
.el-table th {
  background: #f9f9f9 !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.demo-ruleForm .el-form-item__label {
  // color: red
}
/deep/ .el-input__inner {
  padding: 0 0px;
  padding-left: 12px;
}
</style>
