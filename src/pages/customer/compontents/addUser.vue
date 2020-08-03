<template>
  <el-dialog
    :title="customerMasterId?'编辑':'新增'"
    :visible.sync="showValue"
    top="20px"
    width="600px"
    class="addOrUpCustomer"
    :before-close="clearData"
  >
    <div class="dialog">
      <el-form ref="form" size="small" :rules="rules" :model="form" label-width="110px">
        <el-form-item label="客户名称" prop="customerName">
          <el-input type="text" v-model="form.customerName"></el-input>
        </el-form-item>
        <el-form-item label="客户来源" prop="customerSource">
          <el-input type="text" v-model="form.customerSource"></el-input>
        </el-form-item>
        <el-form-item label="总负责人" prop="contact">
          <el-input type="text" v-model="form.contact"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input type="text" v-model="form.telephone"></el-input>
        </el-form-item>
        <el-form-item label="所在部门" prop="belong">
          <el-input type="text" v-model="form.belong"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input type="text" v-model="form.position"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input type="text" v-model="form.qq"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="winxin">
          <el-input type="text" v-model="form.winxin"></el-input>
        </el-form-item>
        <el-form-item label="发票抬头" prop="invoice">
          <el-input type="text" v-model="form.invoice"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxpayerNumber">
          <el-input type="text" v-model="form.taxpayerNumber"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input type="text" v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="开户名称" prop="openAccountName">
          <el-input type="text" v-model="form.openAccountName"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank">
          <el-input type="text" v-model="form.bank"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input type="text" v-model="form.bankAccount"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" size="small" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  props: {
    customerMasterId: String
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      }
      if (!/^1[345789]\d{9}$/.test(value)) {
        callback(new Error("手机格式错误"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      let reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
      if (value && value.length > 0) {
        if (!reg.test(value)) {
          callback([new Error("姓名输入不合法")]);
        } else {
          callback();
        }
      } else if (value.length == 0) {
        callback();
      } else {
        callback(new Error("姓名输入不合法"));
      }
    };
    var validateCard = (rule, value, callback) => {
      var pattern = /^([1-9]{1})(\d{14}|\d{18})$/,
        str = value.replace(/\s+/g, "");
      if (value === "") {
        callback();
      }
      if (!pattern.test(str)) {
        callback(new Error("请正确输入银行账号！"));
      } else {
        callback();
      }
    };
    return {
      form: {
        customerName: "",
        customerSource: "",
        contact: "",
        telephone: "",
        belong: "",
        position: "",
        qq: "",
        winxin: "",
        invoice: "",
        taxpayerNumber: "",
        address: "",
        openAccountName: "",
        bank: "",
        bankAccount: ""
      },
      departmentList: [],
      roleList: [],
      rules: {
        customerName: [
          { required: true, message: "客户来源不能为空", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        customerSource: [
          { required: true, message: "客户来源不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "总负责人不能为空", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        telephone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ],

        belong: [
          { required: true, message: "所在部门不能为空", trigger: "blur" }
        ],
        position: [
          { required: true, message: "职位不能为空", trigger: "change" }
        ],
        qq: [{ required: false, message: "qq不能为空", trigger: "change" }],
        winxin: [
          { required: false, message: "微信不能为空", trigger: "change" }
        ],
        invoice: [
          { required: false, message: "发票抬头不能为空", trigger: "change" }
        ],
        taxpayerNumber: [
          {
            required: false,
            message: "纳税人识别号不能为空",
            trigger: "change"
          }
        ],
        address: [
          { required: false, message: "地址不能为空", trigger: "change" }
        ],
        openAccountName: [
          { required: false, message: "开户名称不能为空", trigger: "change" }
        ],
        bank: [
          { required: false, message: "开户银行不能为空", trigger: "change" }
        ],
        bankAccount: [
          { required: false, validator: validateCard, trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    showValue(val) {
      if (val && this.customerMasterId) {
        this.getMember();
      }
    }
  },
  created() {},
  methods: {
    async getMember() {
      const d = await this.post(this.$api.customer.getCustomer, {
        customerMasterId: this.customerMasterId + ""
      });
      if (d.code === 0) {
        this.form = d.data;
      }
    },
    clearData() {
      this.showValue = false;
      this.$refs["form"].resetFields();
    },
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.customer.addOrEditCustomerMaster,
            {
              customerMasterId: this.customerMasterId,
              ...this.form
            }
          );
          if (d.code === 0) {
            this.clearData();
            this.$emit("getList");
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