<template>
  <div class="menu">
    <!-- <i class="i-logo"></i> -->
    <!-- <img src="./images/title.png" > -->
    <div class="i-logo"></div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#2f4056"
      text-color="#fff"
      active-text-color="#fff"
    >
      <template v-for="(item, index) in menu">
        <el-submenu v-if="item.child.length" :key="index" :index="index + ''">
          <template slot="title">
            <i :class="item.icon" style="color:#fff"></i>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item
            v-for="(v, i) in item.child"
            :key="i"
            @click.native="routerItem(item,v)"
            :index="v.path"
          >{{v.title}}</el-menu-item>
        </el-submenu>
        <el-menu-item
          :index="item.path"
          v-else
          :key="index"
          class="el-menu-item1"
          @click.native="routerItems(item)"
        >
          <i :class="item.icon" style="color:#fff"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import menus from "./menu";
export default {
  name: "vMenu",
  data() {
    return {
      menu: [],
      activeIndex: ""
    };
  },
  watch: {
    $route(n) {
      var v = n.path.substring(n.path.length - 1);
      if (v == "/" && n.path.length > 1) {
        this.activeIndex = n.path.substring(0, n.path.length - 1);
      } else {
        this.activeIndex = n.path;
      }
    }
  },
  mounted() {
    this.setMenu();
    this.activeIndex = this.$router.history.current.path;
  },
  methods: {
    routerItems(item) {
      if (item.nativeIdentity == 1 || item.nativeIdentity == null) {
        this.$router.push({
          path: item.path
        });
      } else if (item.nativeIdentity == 0) {
        window.open(item.path);
      }
      // this.$router.push({
      //   path: item.path
      // });
    },
    routerItem(item, v) {
      if (v.nativeIdentity == 1) {
        this.$router.push({
          path: v.path
        });
      } else if (v.nativeIdentity == 0) {
        window.open(v.path);
      }
      this.$store.dispatch("setBtns", item.btns);
    },
    async setMenu() {
      // const dev = process.env.NODE_ENV == "development";
      // if (dev) {
      //   this.menu = menus;
      //   return;
      // }
      const d = await this.post(this.$api.listSubMenu, {
        // parentCode: "ZS_PARENT"
      });
      if (d.code === 0) {
        d.data.map(v => {
          var parent = {
            title: v.menuName,
            icon: v.menuIcon,
            path: v.menuUrl,
            child: [],
            btns: v.btns,
            nativeIdentity: v.nativeIdentity
          };
          v.subMenuDto.map(d => {
            parent.child.push({
              title: d.menuName,
              path: d.menuUrl,
              nativeIdentity: d.nativeIdentity
            });
          });
          this.menu.push(parent);
        });
        // setTimeout(() => {
        // }, 5000);
      }
    },
    setActiveName(n) {
      var is = true;
      this.menu.map(v => {
        if (v.child.length) {
          v.child.map(item => {
            if (n.fullPath == item.path) {
              this.activeName = item.path;
              is = false;
            }
          });
        } else {
          if (n.fullPath == v.path) {
            this.activeName = v.path;
            is = false;
          }
        }
      });
      is && (this.activeName = "");
    }
  }
};
</script>

<style scoped lang="scss">
.menu {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
.title {
  height: 60px;
  width: 100%;
  display: flex;
  font-style: oblique;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #ffffff;
}
.i-logo {
  width: 100%;
  height: 62px;
  background: url("./images/title.png") no-repeat center center;
}
.el-menu {
  border-right-width: 0;
  z-index: 10;
  .el-submenu .el-menu-item {
    min-width: 166px;
  }
}
.is-active {
  background-color: #409eff !important;
  color: #fff;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.icon {
  background-position: 0 center;
  background-repeat: no-repeat;
  padding-left: 20px;

  $list: home recruit analysis personal;
  @each $val in $list {
    &.icon-#{$val} {
      background-image: url("./images/#{$val}.png");
    }
  }
}
</style>
