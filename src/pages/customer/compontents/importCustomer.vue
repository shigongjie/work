<template>
  <el-dialog title="导入" :visible.sync="showValue" :before-close="clearForm" width="420px">
    <div style="padding:20px 0">
      <el-form ref="form" size="small" :model="form" label-width="80px">
        <el-form-item label="附件导入" prop="url">
          <el-upload
            class="upload-demo"
            ref="upload"
            :auto-upload="false"
            :on-remove="onRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <el-button size="small" type="primary" style="margin-right:20px">点击上传</el-button>
            <el-link type="primary" @click="toUrl">模板下载</el-link>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <el-button class="btns" @click="importCustomerExcel" type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  props: {
    userId: String,
    infoShow: Boolean,
    roleAppCode: String
  },
  data() {
    return {
      formData: new FormData(),
      fileList: [],
      form: {
        url: ""
      }
    };
  },
  watch: {
    showValue(val) {
      if (val) {
      }
    }
  },
  mounted() {},
  methods: {
    async importCustomerExcel() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post3(
            this.$api.customer.importCustomerExcel,
            this.formData
          );
          if (d.code === 0) {
            this.clearForm();
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
            this.$notify({
              title: "提示",
              message: d.data,
              duration: 0,
              type: "warning"
            });
            this.$emit("getList");
          }
        }
      });
    },
    onRemove(file, fileList) {
      console.log(fileList);
      this.fileList = fileList;
      var formData = new FormData();
      this.formData = formData;
    },
    fileChange(file) {
      this.fileList = [{ name: file.name }]; // 重新手动赋值filstList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
      this.imageLoad(file);
    },
    async imageLoad(e) {
      var formData = new FormData();
      formData.append("multipartFile", e.raw);
      formData.append("file", e.raw);
      this.$message({
        message: "上传成功",
        type: "success"
      });
      this.formData = formData;
      // const d = await this.post2(this.$api.upload, formData);
      // if (d.code === 0) {
      // }
    },
    clearForm() {
      this.$refs["form"].resetFields();
      this.ruleForm = {
        url: ""
      };
      this.showValue = false;
    },
    toUrl() {
      window.open(
        "https://qcwl-oss.oss-cn-shenzhen.aliyuncs.com/fastdfs/ae044872-e991-4086-b385-931e1c8cdf01.xlsx"
      );
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
.item {
  width: 300px;
}
</style>