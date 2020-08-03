<template>
  <el-dialog title="编辑" :visible.sync="showValue" width="490px"  top='20px' :before-close="clearData">
    <div class="dialog">
      <el-form ref="form" size="small" :rules="rules" :model="form" label-width="82px">
        <el-form-item label="姓名" prop="userName">
          <el-input type="text" v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="userNo">
          <el-input type="text" v-model="form.userNo"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="text" v-model="form.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="工作电话" prop="workPhone">
          <el-input type="text" v-model="form.workPhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="departmentIds">
          <el-select v-model="form.departmentIds" filterable multiple clearable placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.departmentName"
              :value="item.id+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" filterable multiple clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id+''"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="delUser" size="small" class="del">删 除</el-button>
      <el-button type="primary" size="small" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  props: {
    userId: String,
    departmentId: String,
    roleId: String,
    roleAppCode: {
      type:String,
      default:''
    },
  },
  data() {
    return {
      form: {
        userName: "",
        userNo: "",
        phone: "",
        workPhone: "",
        email: "",
        departmentIds: [],
        roleIds: []
      },
      departmentList: [],
      roleList: [],
      rules: {
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        userNo: [{ required: false, message: "编号不能为空", trigger: "blur" }],
        phone: [{ required: false, message: "电话不能为空", trigger: "blur" }],
        workPhone: [
          { required: false, message: "工作电话不能为空", trigger: "blur" }
        ],
        email: [{ required: false, message: "邮箱不能为空", trigger: "blur" }],
        departmentIds: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        roleIds: [
          { required: true, message: "角色不能为空", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        this.getMember();
      }
    }
  },
  created() {
    this.listDictRole();
    this.listAllDepartment();
  },
  methods: {
    delUser() {
      this.$confirm("确定要删除所选成员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        if (this.roleId) {
          this.delRuleMember();
        } else {
          this.delMember();
        }
      });
    },
    async delMember() {
      const d = await this.post(this.$api.mail.delMember, {
        departmentId: this.departmentId,
        userId: this.userId
      });
      if (d.code === 0) {
        this.clearData();
        this.$emit("getList");
      }
    },
    async delRuleMember() {
      const d = await this.post(this.$api.mail.delRuleMember, {
        roleId: this.roleId,
        userId: this.userId,
        roleAppCode: this.roleAppCode,
      });
      if (d.code === 0) {
        this.clearData();
        this.$emit("getList",this.roleId,this.roleAppCode);
      }
    },
    async listDictRole() {
      const d = await this.post(this.$api.mail.listDictRole);
      if (d.code === 0) {
        this.roleList = d.data;
      }
    },
    async listAllDepartment() {
      const d = await this.post(this.$api.mail.listAllDepartment);
      if (d.code === 0) {
        this.departmentList = d.data;
      }
    },
    async getMember() {
      const d = await this.post(this.$api.mail.getMember, {
        userId: this.userId,
        roleAppCode: this.roleAppCode,
      });
      if (d.code === 0) {
        this.form = d.data;

        for (let i = 0; i < this.form.roleIds.length; i++) {
          this.form.roleIds[i] = this.form.roleIds[i] + "";
        }
        for (let i = 0; i < this.form.departmentIds.length; i++) {
          this.form.departmentIds[i] = this.form.departmentIds[i] + "";
        }
      }
    },
    clearData() {
      this.$refs["form"].resetFields();
      this.showValue = false;
    },
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.mail.editMember, {
            userId: this.userId,
            roleAppCode: this.roleAppCode,
            ...this.form
          });
          if (d.code === 0) {
            this.$emit("getList",this.roleId,this.roleAppCode);
            this.clearData();
          }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  margin-bottom: 15px;
}
.del {
  color: red;
  border: 1px solid red;
}
</style>