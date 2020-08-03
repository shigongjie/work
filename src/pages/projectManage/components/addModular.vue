<template>
  <el-dialog
    :title="moduleId?'编辑模块':'新增模块'"
    :visible.sync="showValue"
    :before-close="clearData"
    top="20px"
    width="420px"
  >
    <div style="margin:20px 0;">
      <el-form ref="form" size="small" :rules="rules" :model="form" label-width="95px">
        <el-form-item label="重点项目" prop="engineeringName">
          <span>{{engineeringName}}</span>
        </el-form-item>
        <el-form-item label="模块名称" prop="moduleName">
          <el-input type="text" v-model="form.moduleName"></el-input>
        </el-form-item>
        <el-form-item label="模块负责人" prop="principalUseId">
          <el-select v-model="form.principalUseId" filterable placeholder="请选择">
            <el-option
              v-for="item in principalList"
              :key="item.value"
              :label="item.userName"
              :value="item.userId+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button class="btns" @click="addOrEditEngineeringModule" type="primary" size="small">确定</el-button>
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
    },
    engineeringName: {
      type: String,
      default: ""
    },
    moduleId: {
      type: String,
      default: ""
    }
  },
  mixins: [modalMixin],
  data() {
    return {
      principalList: [],
      roleName: "",
      form: {
        moduleName: "",
        remark: "",
        principalUseId: "",
        status: ""
      },
      rules: {
        moduleName: [
          { required: true, message: "模块名称不能为空", trigger: "blur" }
        ],
        principalUseId: [
          { required: true, message: "模块负责人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    showValue(val) {
      if (val && this.moduleId) {
        this.handleInputConfirm();
      }
    }
  },
  mounted() {
    this.listPrincipal();
  },
  methods: {
    clearData() {
      this.showValue = false;
      this.$refs["form"].resetFields();
      this.$emit("getList");
    },
    async listPrincipal() {
      const d = await this.post(this.$api.projectManage.listPrincipal);
      if (d.code === 0) {
        this.principalList = d.data;
      }
    },
    async addOrEditEngineeringModule() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.projectManage.addOrEditEngineeringModule,
            {
              ...this.form,
              moduleId: this.moduleId,
              engineeringMasterId: this.engineeringMasterId
            }
          );
          if (d.code === 0) {
            this.$message.success("添加成功");
            this.clearData();
          }
        }
      });
    },
    async handleInputConfirm() {
      const d = await this.post(this.$api.projectManage.getEngineeringModule, {
        moduleId: this.moduleId
      });
      if (d.code === 0) {
        this.form = d.data;
        this.form.principalUseId = this.form.principalUseId + "";
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
