<template>
  <div class="left-page">
    <div class="head">
      <el-select
        v-model="roleAppCode"
        filterable
        @change="getList"
        size="small"
        style="width:160px;margin-bottom: 5px;"
        placeholder="请选择"
      >
        <el-option
          v-for="(item,index) in systemList"
          :key="index"
          :label="item.appName"
          :value="item.appCode"
        ></el-option>
      </el-select>
    </div>
    <el-divider></el-divider>
    <div style="text-align:center;margin-top:15px">
      <el-button type="primary" size="small" class="addBtn" @click="showRole=true;roleId=''">添加</el-button>
    </div>
    <div></div>
    <ul class="menuList">
      <li
        class="lis"
        v-for="(item, index) in menuList"
        :key="index"
        :class="index===activeIndex?'active':''"
      >
        <div @click="link(index,item)" class="name">{{item.roleName}}</div>
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
      </li>
    </ul>
    <addOrUpRole
      :value.sync="showRole"
      :roleId="roleId"
      :roleAppCode="roleAppCode"
      @getList="getList"
    ></addOrUpRole>
  </div>
</template>

<script>
import addOrUpRole from "./addOrUpRole";
export default {
  components: {
    addOrUpRole
  },
  data() {
    return {
      activeIndex: -1,
      showRole: false,
      roleId: "",
      menuList: [],
      systemList: [],
      roleAppCode: "OA_PC"
    };
  },
  mounted() {
    this.getList();
    this.listCfgAppStrategy();
  },
  watch: {
    roleAppCode(val) {
    }
  },
  methods: {
    upRole(item) {
      this.showRole = true;
      this.roleId = item.id;
    },
    isDelDictRole(item) {
      this.$confirm("确定删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delDictRole(item);
      });
    },
    async listCfgAppStrategy(item) {
      const d = await this.post(this.$api.common.listCfgAppStrategy);
      if (d.code === 0) {
        this.systemList = d.data;
      }
    },
    async delDictRole(item) {
      const d = await this.post(this.$api.mail.delDictRole, {
        roleId: item.id,
        roleAppCode: this.roleAppCode
      });
      if (d.code === 0) {
        this.getList();
      }
    },
    async getList(val) {
      const d = await this.post(this.$api.mail.listDictRole, {
        roleAppCode: this.roleAppCode
      });
      if (d.code === 0) {
        this.menuList = d.data;
        if (this.menuList.length > 0) {
          this.activeIndex = 0;
          this.$emit("getList", this.menuList[0].id, this.roleAppCode,this.menuList[0].roleName);
        }else{
           this.$emit("getList", '', "",'');
        }
      }
    },
    link(index, item) {
      this.activeIndex = index;
      this.$emit("getList", item.id, this.roleAppCode,item.roleName);
    }
  }
};
</script>

<style lang='scss' scoped>
.el-divider--horizontal {
  margin: 10px auto;
}
.addBtn {
  width: 160px;
  color: #0f88eb;
  height: 36px;
  background: #e6f1fc;
}
.left-page {
  box-shadow: 3px -2px 17px gainsboro;
  // z-index: 1;
  min-width: 200px;
  border: 1px solid #ebeef5;
  background-color: #fff;
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
.menu li {
  display: flex;
  justify-content: space-evenly;
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
  flex: 1;
  height: 100%;
  align-items: center;
  display: flex;
}
.red {
  color: #d12020 !important;
}
.menuList {
  height: 566px;
  padding: 0 20px;
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
    height: 50px;
    justify-content: space-between;
    align-items: center;
    color: #606266;
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
  .active {
    color: #0f88eb;
  }
}
</style>