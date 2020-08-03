<template>
  <!-- <el-dialog
    title="申报"
    :visible.sync="showValue"
    top="20px"
    width="600px"
    :close-on-click-modal="false"
    :before-close="clearData"
    append-to-body
  >-->
  <div class="dialog">
    <el-form
      :style="{maxHeight: changeHeight+'px'}"
      ref="form"
      size="small"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <template v-for="item in fields">
        <el-form-item v-if="item.fieldType === 9">
          <div class="item-title" slot="label">{{item.fieldLabel}}</div>
        </el-form-item>
        <div v-else style="padding: 0 30px">
          <template v-if="item.fieldType === 8 && item.showFlag">
            <el-form-item prop="telephone" :rules="rules.telephone">
              <span slot="label">
                {{item.fieldLabel}}
                <el-tooltip
                  v-if="item.markedWords"
                  class="item"
                  effect="dark"
                  :content="item.markedWords"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.telephone" type="number" :placeholder="item.fieldDescriptor"></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item :prop="item.fieldName">
              <span slot="label">
                {{item.fieldLabel}}
                <el-tooltip
                  v-if="item.markedWords"
                  class="item"
                  effect="dark"
                  :content="item.markedWords"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input
                :placeholder="item.fieldDescriptor"
                v-if="item.fieldType === 1"
                :type="item.dataFormat | changeType(item.fieldName)"
                v-model="fileName"
                :disabled="!item.editFlag"
              ></el-input>
              <el-select
                :placeholder="item.fieldDescriptor"
                v-else-if="item.fieldType === 2"
                v-model="form[item.fieldName]"
                :disabled="!item.editFlag"
                style="width: 100%;"
              >
                <el-option
                  v-for="(option,index) in item.optionArray"
                  :key="option.fieldKey"
                  :label="option.fieldKey"
                  :value="option.fieldValue"
                ></el-option>
              </el-select>
              <el-select
                :placeholder="item.fieldDescriptor"
                v-else-if="item.fieldType === 3"
                v-model="form[item.fieldName]"
                multiple
                :disabled="!item.editFlag"
                style="width: 100%;"
              >
                <el-option
                  v-for="(option,index) in item.optionArray"
                  :key="option.fieldKey"
                  :label="option.fieldKey"
                  :value="option.fieldValue"
                ></el-option>
              </el-select>
              <el-date-picker
                size="small"
                v-else-if="item.fieldType === 7"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :disabled="!item.editFlag"
                :placeholder="item.fieldDescriptor"
                v-model="form[item.fieldName]"
                style="width: 100%;"
              ></el-date-picker>
              <el-cascader
                style="width: 100%;"
                v-else-if="item.fieldType === 10"
                v-model="form[item.fieldName]"
                :placeholder="item.fieldDescriptor"
                :disabled="!item.editFlag"
                :options="item.optionArray"
                :props="defaultProps"
                clearable
                filterable
              ></el-cascader>
              <!-- <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleChange"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>-->
              <el-upload
                v-else-if="item.fieldType === 5"
                class="upload-demo"
                ref="upload"
                :file-list="fileList"
                :limit="1"
                name="multipartFile"
                :on-preview="test"
                :on-remove="(file, fileList)=>onRemove(fileList, item.fieldName)"
                :on-exceed="handleExceed"
                :action="`${$config.host}${$api.common.upload}`"
                :on-success="(res, file, fileList)=>handleSuccess(res, fileList, item.fieldName)"
              >
                <el-button size="small" type="primary" style="margin-right:20px">点击上传</el-button>
              </el-upload>
              <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
            </el-form-item>
          </template>
        </div>
      </template>
      <el-col :span="24" class="btn-submit">
        <!-- <el-button size="small" @click="clearData">取 消</el-button> -->
        <el-button type="primary" size="small" @click="upload()">提交</el-button>
      </el-col>
    </el-form>
  </div>
  <!-- </el-dialog> -->
</template>

<script>
// const wpsFile = resolve => require(["components/wpsFile"], resolve);
import wpsFile from "@/components/wpsFile";
import modalMixin from "@/mixins/modal";
export default {
  components: { wpsFile },
  name: "sharePage",
  mixins: [modalMixin],
  props: {
    query: Object,
    fieldsJson: "",
    tableData: ""
  },
  data() {
    return {
      showFile: false,
      currFile: [],
      fileName: "",
      showValue: true,
      defaultProps: {
        label: "text",
        value: "id",
        multiple: true
      },
      fileList: [],
      formData: new FormData(),
      phoneField: "",
      title: "",
      fields: [],
      changeHeight: document.documentElement.clientHeight - 120,
      form: {
        telephone: "",
        code: ""
      },
      rules: {
        telephone: [
          { required: true, message: "必需填写手机号", trigger: "blur" },
          {
            pattern: /^1[23456789]\d{9}$/,
            message: "请正确填写手机号",
            trigger: "blur"
          }
        ],
        code: [{ required: true, message: "必需填写验证码", trigger: "blur" }]
      },
      isDisable: false,
      btnSend: "发送验证码",
      codeImg: "",
      securityCode: ""
    };
  },
  filters: {
    changeType(val, fieldName) {
      return fieldName === "training_number" ? "number" : val;
    }
  },
  created() {},
  mounted() {
    this.fields = this.$props.fieldsJson;
    if (this.$props.tableData.fileName != undefined) {
      this.fileName = this.$props.tableData.fileName;
      this.fileList.push({
        name: this.$props.tableData.name,
        url: this.$props.tableData.url,
        preview: this.$props.tableData.preview,
        extendId:this.$props.tableData.extendId,
        fileName:this.$props.tableData.name,
        fileType:this.$props.tableData.fileType
      });
    }
  },
  watch: {
    showValue(val) {
      if (val) {
        this.$nextTick(() => {
          this.listCfgCustomField();
          this.getImageVerifyCode();
        });
      }
    }
  },
  methods: {
    test(file) {
      this.currFile = [file];
      this.showFile = true;
    },
    upload() {
      this.$emit("test", { arr: this.fileList, fileName: this.fileName });
    },
    onRemove(fileList, fieldName) {
      this.fileList.name = fieldName;
      this.fileList.data = fileList;
    },
    handleSuccess(res, fileList, fieldName) {
      // this.fileList.name = fieldName;
      // this.form[fieldName] = fileList;
      this.fileList = [];
      fileList.map(item => {
        if (item.status === "success") {
          if (item.response) {
            this.fileList.push(item.response.data);
          } else {
            this.fileList.push(item);
          }
        }
      });
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    async getEnrollStuInfo() {
      const d = await this.post(this.$api.train.getSchoolTrainingDeclare, {
        declareMasterId: this.query.enterId
      });
      if (d.code === 0) {
        this.form = JSON.parse(d.data.declareJson);
      }
    },
    clearData() {
      this.$refs["form"].resetFields();
      this.fields = [];
      this.fileList = [];
      this.showValue = false;
    },
    getRandomCode(length) {
      if (length > 0) {
        let data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let nums = "";
        for (let i = 0; i < length; i++) {
          let r = parseInt(Math.random() * 10);
          nums += data[r];
        }
        return nums;
      } else {
        return false;
      }
    },
    async getImageVerifyCode() {
      this.randomKey = this.getRandomCode(12);
      const d = await this.post(
        this.$api.getImageVerifyCode,
        {
          key: this.randomKey,
          verifyCodeType: 11
        },
        false
      );
      if (d.code === 0) {
        this.codeImg = d.data;
      }
    },
    async sendCodeSms() {
      if (this.securityCode === "") {
        this.$message.error("请输入图形验证码");
        return;
      }
      if (this.isDisable) {
        return;
      }
      let valid = this.$refs.form.validateField("telephone");
      if (valid) {
        return;
      }
      const d = await this.post(this.$api.sendVerifyCode, {
        telephone: this.form.telephone,
        templateCode: "SMS_YSS_VERIFY_CODE",
        securityCode: this.securityCode,
        key: this.randomKey,
        verifyCodeType: 11
      });
      if (d.code === 0) {
        this.getCode();
        this.$message.success("短信发送成功");
      }
    },
    getCode() {
      this.isDisable = true;
      let count = 59;
      for (let i = 0; i <= count; i++) {
        setTimeout(() => {
          if (count != 0) {
            this.btnSend = `<em style="color: #0099ff">${count}s</em>后可重新发送`;
            count--;
          } else {
            this.isDisable = false;
            this.btnSend = "发送验证码";
          }
        }, i * 1000);
      }
    },
    async listCfgCustomField() {
      const d = await this.post(this.$api.enroll.listCfgCustomField, {
        filedMasterId: this.query.rowId
      });
      if (d.code === 0) {
        this.title = d.data2;
        this.fields = d.data;
        this.setForm();
      }
    },
    setForm() {
      this.fields.map(item => {
        if (item.fieldType !== 9 && item.fieldType !== 8) {
          let val;
          let arr = [];
          if (item.fieldType === 3 || item.fieldType === 5) {
            val = [];
          } else {
            val = item.fieldType === 1 ? item.defaultValue : "";
          }
          this.$set(this.form, item.fieldName, val);
          if (item.requiredFlag) {
            if (
              item.fieldType === 2 ||
              item.fieldType === 3 ||
              item.fieldType === 5
            ) {
              arr.push({
                required: true,
                message: "请选择" + item.fieldLabel,
                trigger: "change"
              });
            } else {
              arr.push({
                required: true,
                message: "必须填写" + item.fieldLabel,
                trigger: "blur"
              });
            }
            let phone = /^1[23456789]\d{9}$/;
            let card = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            let email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (item.dataFormat) {
              if (item.dataFormat === "mobile_phone") {
                arr.push({
                  pattern: phone,
                  message: "请正确填写" + item.fieldLabel,
                  trigger: "blur"
                });
              }
              if (item.dataFormat === "identity_card") {
                arr.push({
                  pattern: card,
                  message: "请正确填写" + item.fieldLabel,
                  trigger: "blur"
                });
              }
              if (item.dataFormat === "mail_box") {
                arr.push({
                  pattern: email,
                  message: "请正确填写" + item.fieldLabel,
                  trigger: "blur"
                });
              }
            }
            this.$set(this.rules, item.fieldName, arr);
          }
        }
        if (item.fieldType === 8) {
          this.phoneField = item.fieldName;
          this.$set(this.form, item.fieldName, "");
        }
      });
      if (this.query.enterId) {
        this.$nextTick(() => {
          this.getEnrollStuInfo();
        });
      }
    },
    submit() {
      this.$refs.form.validate().then(async result => {
        if (result) {
          // console.log(666666, this.fileList);
          // console.log(555555, this.form[this.fileList.name]);
          if (this.fileList.name) {
            this.form[this.fileList.name] = JSON.parse(
              JSON.stringify(this.fileList.data)
            );
          }
          let verifyJo = {};
          verifyJo.telephone = this.form.telephone;
          verifyJo.code = this.form.code;
          this.form[this.phoneField] = this.form.telephone;
          const d = await this.post(this.$api.train.addOrUpdateTrainingScheme, {
            id: this.query.id,
            declareMasterId: this.query.enterId,
            declareJson: {
              ...this.form,
              verifyJo
            }
          });
          if (d.code === 0) {
            this.$message.success("提交成功");
            this.$emit("getList");
            this.clearData();
          }
        }
      });
    },
    clear() {
      this.btnSend = "发送验证码";
      this.codeImg = "";
      this.securityCode = "";
      this.setForm();
      this.form.code = "";
      this.form.telephone = "";
      this.$refs.form.clear();
    }
  }
};
</script>

<style scoped lang="scss">
/deep/.el-input__suffix-inner {
  height: 100%;
  display: flex;
  align-items: center;
}
.el-form {
  margin-top: 20px;
  overflow: auto;
}
.el-form-item {
  position: relative;
}
.item-title {
  color: #303133;
  font-size: 16px;
  &:before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 3px;
    height: 15px;
    margin-right: 8px;
    background-color: #2196f3;
  }
}
.btn-submit {
  display: flex;
  margin: 30px auto;
  justify-content: center;
  .el-button {
    padding: 10px 50px;
  }
}
</style>