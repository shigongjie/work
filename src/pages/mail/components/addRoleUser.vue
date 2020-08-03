<template>
  <el-dialog
    title="添加成员"
    :visible.sync="showValue"
    top="20px"
    width="490px"
    :before-close="clearData"
  >
    <div class="dialog">
      <p class="title">请搜索成员或直接选择</p>
      <div class="head-wrap">
        <el-input v-model="telephone" style="flex:1" placeholder="请输入成员手机号"></el-input>
        <el-button type="primary" style="60px;margin-left:5px" @click="getUser">搜索</el-button>
      </div>
      <div class="content">
        <div class="item" v-if="userInfo.id">
          <div class="left-info">
            <img src="@/assets/images/avatar.png" alt />
            <div>
              <p>
                <span class="name">{{userInfo.userName}}</span>
                <span class="dian">·</span>
                <span class="phone">{{userInfo.phone}}</span>
              </p>
              <p class="msg">{{userInfo.departmentAndRoleName}}</p>
            </div>
          </div>
          <div class="right-info">
            <i class="el-icon-success add" v-if="false"></i>
            <i class="el-icon-circle-plus-outline" v-else @click="addMember"></i>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  props: {
    roleId: String,
    roleAppCode: String
  },
  data() {
    return {
      telephone: "",
      userInfo: {
        id: "",
        userName: "",
        phone: "",
        departmentAndRoleName: ""
      }
    };
  },
  methods: {
    async getUser() {
      const d = await this.post(this.$api.mail.getUserInfoByTelephone, {
        telephone: this.telephone,
        roleAppCode: this.roleAppCode
      });
      if (d.code === 0) {
        this.userInfo = d.data;
      }
    },
    async addMember(userId) {
      const d = await this.post(this.$api.mail.addRoleMember, {
        roleId: this.roleId,
        userId: this.userInfo.userId + "",
        roleAppCode: this.roleAppCode
      });
      if (d.code === 0) {
        this.$message.success("添加成功");
        this.clearData();
      }
    },
    clearData() {
      this.telephone = "";
      this.userInfo = {
        id: "",
        userName: "",
        phone: "",
        departmentAndRoleName: ""
      };
      this.showValue = false;
      this.$emit("getList", this.roleId, this.roleAppCode);
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  margin-bottom: 15px;
  .head-wrap{
    display: flex;
  }
  .title {
    font-size: 14px;
    color: #999999;
    margin-bottom: 15px;
  }
  .content {
    overflow-y: scroll;
    margin-top: 20px;
    max-height: 290px;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    //滚动条的滑块
    &::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 3px;
    }
    .item {
      padding: 15px;
      height: 65px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      background: #f9f9f9;
      .left-info {
        display: flex;
        img {
          height: 37px;
          width: 37px;
          border-radius: 50%;
          margin-right: 10px;
        }
        div {
          p {
            font-size: 14px;
            color: #333333;
          }
          .dian {
            margin: 0 8px;
            font-weight: bold;
          }
        }
        .msg {
          margin-top: 2px;
          font-size: 12px;
          color: #999999;
        }
      }
      .right-info {
        i {
          color: #0f88eb;
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>