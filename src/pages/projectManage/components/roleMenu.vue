<template>
  <div class="left-page">
    <div class="head">
      <p>项目/业务</p>
    </div>
    <el-divider></el-divider>
       <div style="text-align:center;margin-top:15px">
      <el-button type="primary" size="small" class="addBtn" @click="showRole=true;engineeringMasterId=''">添加</el-button>
    </div>
    <ul class="menuList">
      <li v-for="(item, index) in menuList" :key="index">
        <div>
          <div class="top">
            <div
              @click="link(index)"
              :class="index===activeIndex?'active':''"
              class="name"
              :title="item.engineeringName"
            >{{item.engineeringName}}</div>
            <div v-if="index===activeIndex" class="icon"></div>
            <el-popover placement="right" trigger="click">
              <ul class="menu">
                <li @click="upRole(item)">
                  <i class="el-icon-edit-outline"></i>
                  <span>编辑</span>
                </li>
                <li class="red" @click="isDelDictRole(item)">
                  <i class="el-icon-delete"></i>
                  <span>删除</span>
                </li>
              </ul>
              <i class="el-icon-more" slot="reference"></i>
            </el-popover>
          </div>
          <div class="msg" :title="item.departmentName">{{item.departmentName}}</div>
        </div>
      </li>
    </ul>
    <addOrUpProject
      :value.sync="showRole"
      :engineeringMasterId="engineeringMasterId"
      @getList="getList"
    ></addOrUpProject>
  </div>
</template>

<script>
import addOrUpProject from "./addOrUpProject";
export default {
  components: {
    addOrUpProject
  },
  data() {
    return {
      activeIndex: -1,
      showRole: false,
      roleId: "",
      engineeringMasterId: "",
      menuList: []
    };
  },
  mounted() {
    // this.getList();
    //  document.querySelector('.router-view').style.height=document.body.clientHeight-90+'px'
    this.getList();
  },
  methods: {
    upRole(item) {
      this.showRole = true;
      this.engineeringMasterId = item.id;
    },
    isDelDictRole(item) {
      this.$confirm("确定删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delEngineeringMaster(item);
      });
    },
    async getList(item) {
      const d = await this.post(this.$api.projectManage.listEngineeringMaster);
      if (d.code === 0) {
        this.menuList = d.data;
        if (this.menuList.length > 0) {
          this.activeIndex = 0;
          this.$emit("getList",this.menuList[0]);
        }
      }
    },
    async delEngineeringMaster(item) {
      const d = await this.post(this.$api.projectManage.delEngineeringMaster, {
        engineeringMasterId: item.id
      });
      if (d.code === 0) {
        this.$message.success("删除成功");
        this.getList();
      }
    },
    link(index) {
      this.activeIndex = index;
      this.$emit('getList',this.menuList[index])
    }
  }
};
</script>

<style lang='scss' scoped>
.el-divider--horizontal {
  margin: 10px auto;
}
.left-page {
  min-width: 200px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 3px -2px 17px gainsboro;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  .head {
    padding: 20px;
    padding-bottom: 0;
    display: flex;
    justify-content: space-between;
  }
}
.menu{
}
.menu li {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 35px;
  i {
    font-size: 18px;
  }
  &:hover {
    cursor: pointer;
    background-color: #e7f3fd;
    color: #0f88eb;
  }
}
.name {
  white-space: nowrap;
  overflow: hidden;
  width: 160px;
  text-overflow: ellipsis;
}
.red {
  color: #d12020 !important;
}
.menuList {
  height: 583px;
  padding: 0 20px;
  width: 200px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
  li {
    display: flex;
    align-items: center;
    height: 65px;
    & > div {
      width: 100%;
    }
  }
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
    margin-bottom: 4px;
    font-size: 14px;
    cursor: pointer;
    i {
      color: #aaaaaa;
      font-size: 16px;
    }
    .icon {
      position: absolute;
      left: -20px;
      height: 15px;
      width: 6px;
      background: #0f88eb;
    }
  }
  .msg {
    font-size: 12px;
    color: #999999;
    white-space: nowrap;
    overflow: hidden;
    width: 130px;
    text-overflow: ellipsis;
  }
  .active {
    color: #0f88eb;
  }
}
.addBtn {
  width: 160px;
  color: #0f88eb;
  height: 36px;
  background: #e6f1fc;
}
</style>
