<template>
  <el-dialog
    :title="engineeringMasterId?'编辑项目':'添加项目'"
    :visible.sync="showValue"
     top='20px'
    :before-close="clearData"
    width="420px"
  >
    <div style="margin-bottom:20px;">
      <el-form ref="form" size="small" :rules="rules" :model="form" label-width="82px">
        <el-form-item label="重点项目" prop="engineeringName">
          <el-input type="text" v-model="form.engineeringName"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="form.departmentId" filterable placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.departmentName"
              :value="item.id+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主负责人" prop="principalUseId">
          <el-select v-model="form.principalUseId" filterable placeholder="请选择">
            <el-option
              v-for="item in principalList"
              :key="item.value"
              :label="item.userName"
              :value="item.userId+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="phaseArray">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="用逗号分隔, 比如 立项,招标,开发,其他"
            v-model="form.phaseArray"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button class="btns" @click="addOrEditEngineeringMaster" type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  props: {
    engineeringMasterId: {
      type: String,
      default: ""
    }
  },
  mixins: [modalMixin],
  data() {
    return {
      roleName: "",
      principalList: [],
      departmentList: [],
      rules: {
        engineeringName: [
          { required: true, message: "重点项目不能为空", trigger: "blur" }
        ],
        departmentId: [
          { required: true, message: "部门不能为空", trigger: "blur" }
        ],
        principalUseId: [
          { required: true, message: "主负责人不能为空", trigger: "blur" }
        ],
      },
      form: {
        phaseArray: "",
        principalUseId: "",
        engineeringName: "",
        departmentId: ""
      }
    };
  },
  watch: {
    showValue(val) {
      if (val && this.engineeringMasterId) {
        this.getEngineeringMaster();
      }
    }
  },
  mounted() {
    this.listPrincipal();
    this.listAllDepartment();
  },
  methods: {
    clearData() {
      this.showValue = false;
      this.form = {
        phaseArray: "",
        principalUseId: "",
        engineeringName: "",
        departmentId: ""
      };
      this.$refs["form"].resetFields();
      this.$emit("getList");
    },
    async listPrincipal() {
      const d = await this.post(this.$api.projectManage.listPrincipal);
      if (d.code === 0) {
        this.principalList = d.data;
      }
    },
    async listAllDepartment() {
      const d = await this.post(this.$api.mail.listAllDepartment);
      if (d.code === 0) {
        this.departmentList = d.data;
      }
    },
    async addOrEditEngineeringMaster() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.projectManage.addOrEditEngineeringMaster,
            {
              ...this.form,
              engineeringMasterId: this.engineeringMasterId,
              status: ""
            }
          );
          if (d.code === 0) {
            this.$message.success("添加成功");
            this.clearData();
          }
        }
      });
    },
    async getEngineeringMaster() {
      const d = await this.post(this.$api.projectManage.getEngineeringMaster, {
        engineeringMasterId: this.engineeringMasterId
      });
      if (d.code === 0) {
        this.form = d.data;
        this.form.principalUseId = d.data.principalUseId+''
        this.form.departmentId = d.data.departmentId+''
      }
    }
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
