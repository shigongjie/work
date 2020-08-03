<template>
  <el-dialog
    title="新增"
    :visible.sync="showValue"
    width="1050px"
    top="20px"
    class="addOrUpCustomer"
    :close-on-click-modal="false"
    :before-close="clearData"
    append-to-body
  >
    <div class="dialog">
      <el-form ref="form" size="small" :rules="rules" :model="form" label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称" prop="masterId">
              <el-select v-model="formItem.customerMasterId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="(item,index) in customerList"
                  :key="index"
                  :label="item.customerName"
                  :value="item.customerMasterId+''"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登记类型" prop="itemId">
              <el-select
                @change="getdynamicTable"
                v-model="form.itemId"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in progressList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属职责" prop="operateLevel">
              <el-select v-model="form.userId" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in jobList"
                  :key="index"
                  :label="item.responsibility"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <jsonparseform
        v-if="jsonShow"
        :FileTableJson="FileTableJson"
        :masterId="formItem.customerMasterId"
        :itemId="form.itemId"
        :businessId="businessIds"
        :responsibilityId="form.userId"
        @clear="clearData"
        :editId="editId"
      />
    </div>
    <span slot="footer">
      <!-- <el-button type="primary" size="small" @click="addOrEditTableDetail">确 定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import jsonparseform from "@/components/dynamicTable/jsonPrase.vue";
import modalMixin from "@/mixins/modal";
export default {
  components: { jsonparseform },
  props: {
    formItem: Object,
    masterId: "",
    businessId: "",
    editData: "",
    itemId: ""
  },
  mixins: [modalMixin],
  data() {
    return {
      editId: "",
      itemIds: "",
      jsonShow: false,
      businessIds: "",
      defaultcustomerMasterId: "",
      FileTableJson: {},
      customerList: [],
      progressList: [],
      jobList: [],
      form: {
        id: "",
        businessId: "",
        masterId: "",
        itemId: ""
      },
      rules: {}
    };
  },
  mounted() {
    this.defaultcustomerMasterId = this.formItem.customerMasterId;
  },
  watch: {
    masterId(val) {
      this.defaultcustomerMasterId = val + "";
    },
    businessId(val) {
      this.businessIds = val;
    },
    showValue(val) {
      if (val) {
        this.editId = this.editData;
        this.itemIds = this.itemId;
        // this.formItem.customerMasterId = this.form.masterId;
        this.defaultcustomerMasterId = this.formItem.customerMasterId;
        this.businessIds = this.formItem.id;
        this.listCustomerMaster();
        this.listWithLabel();
        this.getResponsibilities();
      }
    }
  },
  methods: {
    // 获取职责
    async getResponsibilities() {
      const d = await this.post(this.$api.task.findMyResponsibilities, {});
      if (d.code === 0) {
        this.jobList = d.data;
      }
    },
    // 获取动态表单
    async getdynamicTable() {
      this.jsonShow = true;
      let fieldId = "";
      let tableType = "";
      this.progressList.forEach(item => {
        if (item.id == this.form.itemId) {
          fieldId = item.fieldId;
          tableType = item.id;
        }
      });
      const d = await this.post(this.$api.customer.GetiJson, {
        filedMasterId: fieldId
      });
      if (d.code === 0) {
        if (tableType == 5) {
          this.FileTableJson = d.data;
        } else {
          this.FileTableJson = d.data2;
        }
      }
    },
    async listWithLabel() {
      const d = await this.post(this.$api.customer.listWithLabel, {
        processFlag: 1
      });
      if (d.code === 0) {
        this.progressList = d.data;
        if (this.itemIds == "") {
          this.form.itemId = this.progressList[0].id;
          const c = await this.post(this.$api.customer.GetiJson, {
            filedMasterId: this.progressList[0].fieldId
          });
          if (c.code === 0) {
            this.FileTableJson = c.data2;
            this.jsonShow = true;
          }
        } else {
          let fieldId;
          this.form.itemId = this.itemIds;
          this.progressList.forEach(item=>{
            if(item.id==this.itemIds){
              fieldId=item.fieldId
            }
          })
          const e = await this.post(this.$api.customer.GetiJson, {
            filedMasterId: fieldId
          });
          if (e.code === 0) {
            this.FileTableJson = e.data2;
            this.jsonShow = true;
          }
        }
      }
    },
    //客户
    async listCustomerMaster() {
      const d = await this.post(this.$api.customer.listCustomerMaster);
      if (d.code === 0) {
        this.customerList = d.data;
      }
    },

    // 关闭清除增加
    clearData() {
      this.form = {};
      this.$refs.form.resetFields();
      this.showValue = false;
      this.$emit("getList");
      this.FileTableJson = {
        fields: [],
        formRef: "elForm",
        formModel: "formData",
        size: "small",
        labelPosition: "right",
        labelWidth: 100,
        formRules: "rules",
        gutter: 15,
        disabled: false,
        span: 24,
        formBtns: false,
        unFocusedComponentBorder: false
      };
    },
    async addOrEditTableDetail() {
      console.log(this.editId)
      // this.$refs.test.sumbitForm2();
      // this.$refs.form.validate(async valid => {
      //   if (valid) {
      //     const d = await this.post(
      //       this.$api.customer.addOrEditTableDetail,
      //       this.form
      //     );
      //     if (d.code === 0) {
      //       this.$message.success("操作成功");
      //       this.clearData();
      //     }
      //   }
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  width: 100%;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
</style>
