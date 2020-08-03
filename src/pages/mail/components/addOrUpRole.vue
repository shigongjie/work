<template>
  <el-dialog
    :title="!roleId?'添加角色':'编辑角色'"
    :visible.sync="showValue"
     top='20px'
    :before-close="clearData"
    width="420px"
  >
    <div style="margin-bottom:20px;">
      <p class="title">请输入角色名称</p>
      <el-input v-model="roleName"></el-input>
    </div>
    <div slot="footer">
      <el-button class="btns" @click="addOrEditDictRole" type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  props: {
    roleId: {
      type: String,
      default: ""
    },
    roleAppCode: {
      type: String,
      default: ""
    },
  },
  mixins: [modalMixin],
  data() {
    return { roleName: "" };
  },
  watch: {
    showValue(val) {
      if(val&&this.roleId){
        this.getDictRole()
      }
    }
  },
  methods: {
    clearData() {
      this.roleName = "";
      this.showValue = false;
      this.$emit("getList");
    },
    async addOrEditDictRole() {
      if(this.roleName===''){
        return this.$message.error('请输入角色名称')
      }
      const d = await this.post(this.$api.mail.addOrEditDictRole, {
        roleName: this.roleName,
        roleId: this.roleId,
        roleAppCode:this.roleAppCode
      });
      if (d.code === 0) {
        this.clearData();
      }
    },
    async getDictRole() {
      const d = await this.post(this.$api.mail.getDictRole, {
        roleId: this.roleId
      });
      if (d.code === 0) {
        this.roleName = d.data.roleName
      }
    },
  }
};
</script>

<style lang='scss' scoped>

.title {
  font-size: 14px;
  color: #999999;
  margin-bottom: 15px;
}
</style>