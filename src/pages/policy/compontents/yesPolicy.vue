<template>
  <el-dialog title="同意理由" :visible.sync="showValue" :before-close="clearForm" width="420px">
    <div style="padding:20px 0">
      <el-form ref="form" size="small" @submit.native.prevent :model="form" label-width="80px">
        <el-form-item label="同意理由" prop="returnReason">
          <el-input
            type="text"
            class="item"
            @keyup.enter.native="returnFun"
            v-model="form.returnReason"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <el-button class="btns" @click="returnFun" type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  props: {
    policyId: String
  },
  data() {
    return {
      form: {
        returnReason: ""
      }
    };
  },
  methods: {
    clearForm() {
      this.$refs["form"].resetFields();
      this.form.returnReason = "";
      this.showValue = false;
    },
    async send() {
      const d = await this.post(this.$api.common.send, {
        businessType: "政策",
        businessId: this.policyId,
        comment: this.form.returnReason,
        images: [],
        commentType: 1
      });
      if (d.code === 0) {
        this.clearForm();
        this.$emit("getList");
      }
    },
    async returnFun() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.policy.updateOperateStatusForPolicy,
            {
              policyId: this.policyId,
              operateStatus: 1
            }
          );
          if (d.code === 0) {
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
            this.send();
          }
        }
      });
    }
  }
};
</script>

<style scoped lang='scss'>
</style>