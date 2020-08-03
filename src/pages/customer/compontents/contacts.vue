<template>
  <div>
    <el-dialog
      title="客户联系人"
      :visible.sync="showValue"
      width="1000px"
      top="20px"
      class="addOrUpCustomer"
      :before-close="clearTable"
    >
      <div class="dialog">
        <div class="head">
          <el-select v-model="copyCustomerId" filterable @change="changeContacts" placeholder="请选择">
            <el-option
              v-for="item in listCustomer"
              :key="item.value"
              :label="item.customerName"
              :value="item.customerMasterId"
            ></el-option>
          </el-select>
          <el-button size="small" type="primary" @click="showAddContact=true;contactId=''">新增</el-button>
        </div>
        <el-table ref="scoreTable" max-height="400" :data="contactTable" size="small">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
            v-for="(item, index) in tabClounm"
            :key="index"
            :prop="item.fieldName"
            :width="item.width"
            align="center"
            :label="item.fieldLabel"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column width="150px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="getCustomerDetail(scope.row.id)">编辑</el-button>
              <el-button type="text" style="color:red" @click="delCustomerDetail(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="clearTable">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="contactId?'编辑':'新增'"
      :visible.sync="showAddContact"
      width="600px"
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
  </div>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  props: {
    customerMasterId: String,
    customerId: String
  },
  data() {
    return {
      contactId: "",
      showAddContact: false,
      copyCustomerId: "",
      listCustomer: [],
      contactTable: [],
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
      tabClounm: [
        { fieldName: "belong", fieldLabel: "部门" },
        { fieldName: "position", fieldLabel: "职位" },
        { fieldName: "contact", fieldLabel: "负责人" },
        { fieldName: "telephone", fieldLabel: "联系电话" },
        { fieldName: "telephone", fieldLabel: "手机号" }
      ],
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
  watch: {
    showValue(val) {
      if (val) {
        if (this.customerId) {
          this.copyCustomerId = JSON.parse(JSON.stringify(this.customerId));
        } else {
          this.copyCustomerId = this.listCustomer[0].customerMasterId;
        }
        this.listCustomerMaster();
        this.listCustomerDetail();
      }
    }
  },
  mounted() {
    this.listCustomerMaster();
  },
  methods: {
    // 改变下拉
    changeContacts() {
      this.listCustomerDetail();
    },
    // 删除行
    delCustomerDetail(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.customer.delCustomerDetail, {
          customerDetailId: row.id
        });
        if (d.code === 0) {
          this.$message.success("删除成功");
          this.listCustomerDetail();
        }
      });
    },
    // 列表数据
    async getCustomerDetail(id) {
      this.contactId = id;
      this.showAddContact = true;
      const d = await this.post(this.$api.customer.getCustomerDetail, {
        customerDetailId: id
      });
      if (d.code === 0) {
        this.form = d.data;
      }
    },
    // 列表数据
    async listCustomerDetail() {
      const d = await this.post(this.$api.customer.listCustomerDetail, {
        customerMasterId: this.copyCustomerId
      });
      if (d.code === 0) {
        this.contactTable = d.data;
      }
    },
    // 下拉数据
    async listCustomerMaster() {
      const d = await this.post(this.$api.customer.listCustomerMaster);
      if (d.code === 0) {
        this.listCustomer = d.data;
      }
    },
    // 增加行
    addContact() {
      this.$refs.contactForm.validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.customer.addOrEditCustomerDetail,
            {
              customerId: this.copyCustomerId,
              ...this.form
            }
          );
          if (d.code === 0) {
            this.listCustomerDetail();
            this.clearForm();
          }
        }
      });
    },
    // 关闭清除增加
    clearForm() {
      this.$refs.contactForm.resetFields();
      (this.form = {
        belong: "",
        position: "",
        contact: "",
        id: "",
        telephone: "",
        qq: "",
        winxin: "",
        address: ""
      }),
        (this.contactId = "");
      this.showAddContact = false;
    },
    // 关闭清理表格
    clearTable() {
      this.showValue = false;
      this.contactTable = [];
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  margin: 15px 0;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.del {
  color: red;
  border: 1px solid red;
}
</style>