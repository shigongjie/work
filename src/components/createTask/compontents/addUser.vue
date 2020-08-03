<template>
  <el-dialog
    title="新增"
    :visible.sync="showValue"
    width="600px"
     top='20px'
    class="addOrUpCustomer"
    :before-close="clearForm"
  >
    <div class="dialog">
      <el-form ref="contactForm" size="small" :rules="rules" :model="form" label-width="110px">
        <el-form-item label="所在部门" prop="belong">
          <el-input type="text" v-model="form.belong"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input type="text" v-model="form.position"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input type="text" v-model="form.contact"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input type="text" v-model="form.telephone"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input type="text" v-model="form.qq"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="winxin">
          <el-input type="text" v-model="form.winxin"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input type="text" v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" size="small" @click="addContact">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  props: {
    customerMasterId: String
  },
  mixins: [modalMixin],
  watch: {
    isShowAddContacts() {}
  },
  data() {
    return {
      form: {
        belong: "",
        position: "",
        contact: "",
        id: "",
        telephone: "",
        qq: "",
        winxin: "",
        address: ""
      },
      rules: {
        belong: [{ required: true, message: "部门不能为空", trigger: "blur" }],
        position: [
          { required: true, message: "职位不能为空", trigger: "change" }
        ],
        contact: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],

        qq: [{ required: true, message: "qq不能为空", trigger: "change" }],
        winxin: [
          { required: true, message: "微信不能为空", trigger: "change" }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 关闭清除增加
    clearForm() {
      this.$refs.contactForm.resetFields();
      this.form = {
        belong: "",
        position: "",
        contact: "",
        id: "",
        telephone: "",
        qq: "",
        winxin: "",
        address: ""
      };
      this.showValue = false;
    },
    // 增加行
    addContact() {
      this.$refs.contactForm.validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.customer.addOrEditCustomerDetail,
            {
              customerId: this.customerMasterId,
              ...this.form
            }
          );
          if (d.code === 0) {
            this.$emit("listCustomerDetail");
            this.clearForm();
          }
        }
      });
    }
  }
};
</script>

<style>
</style>