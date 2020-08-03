<template>
  <div class="test-form">
    <parser :key="key2" v-if="!showEnter" :form-conf="formConf" @submit="sumbitForm2" />
    <enterStudent v-if="showEnter" :fieldsJson="query" :tableData="tableData" @test="sumbitForm2" />
    <!-- <el-button type="primary" size="mini" @click="sumbitForm2">确 定</el-button> -->
  </div>
</template>

<script>
// 若parser是通过安装npm方式集成到项目中的，使用此行引入
import enterStudent from "@/components/dynamicTable/enterStudent";
import Parser from "form-gen-parser";
export default {
  components: {
    Parser,
    enterStudent
  },
  props: {
    FileTableJson: "",
    masterId: "",
    itemId: "",
    businessId: "",
    responsibilityId: "",
    editId: ""
  },
  data() {
    return {
      query: "",
      tableData: {},
      showEnter: false,
      responsibilityIds: "",
      masterIds: "",
      itemIds: "",
      businessIds: "",
      userList: [],
      key2: +new Date(),
      formConf: {
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
      }
    };
  },
  computed: {},
  watch: {
    FileTableJson(val) {
      if (this.$props.editId == "") {
        this.formConf = val;
        if (this.$props.itemId == 10 || this.$props.itemId == 9) {
          this.listDepartmentAndUser();
        } else if (this.$props.itemId == 5) {
          this.query = this.$props.FileTableJson;
          this.showEnter = true;
        } else {
          this.showEnter = false;
          this.fillFormData(this.formConf, {});
          this.key2 = +new Date();
        }
      }else{
        this.getData(this.$props.editId);
      }
    },
    masterId(val) {
      this.masterIds = val;
    },
    itemId(val) {
      this.itemIds = val;
    },
    businessId(val) {
      this.businessIds = val;
    },
    responsibilityId(val) {
      this.responsibilityIds = val;
    },
    editId(val) {
      if (val != "") {
        this.getData(val);
      }
    }
  },
  created() {},
  mounted() {
    if (this.$props.editId) {
      this.getData(this.$props.editId);
    }
    this.formConf = this.$props.FileTableJson;
    this.fillFormData(this.formConf, {});
    this.key2 = +new Date();
    this.masterIds = this.$props.masterId;
    this.itemIds = this.$props.itemId;
    this.businessIds = this.$props.businessId;
  },
  methods: {
    async getData(id) {
      const c = await this.post("/oa-boot/customer/v2/detail/get", {
        id: id
      });
      if (c.code === 0) {
        this.tableData = c.data;
        this.formConf = this.$props.FileTableJson;
        this.fillFormData(this.formConf, this.tableData);
        // 更新表单
        this.key2 = +new Date();
      }
    },
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.userList = d.data;
        this.$props.FileTableJson.fields.forEach(item => {
          if (item.__vModel__ == "dealer") {
            item.options = this.userList;
          }
        });
        this.fillFormData(this.formConf, {});
        this.key2 = +new Date();
      }
    },
    fillFormData(form, data) {
      form.fields.map(item => {
        const val = data[item.__vModel__];
        if (val) {
          item.__config__.defaultValue = val;
        }
        return item;
      });
    },
    // sumbitForm1(data) {
    //   console.log("sumbitForm1提交数据：", data);
    // },
    async sumbitForm2(data) {
      let params;
      if (data.arr) {
        params = data.arr[0];
        params.fileName = data.fileName;
      } else {
        params = data;
      }
      // let params = data;
      params.id = this.$props.editId;
      params.masterId = this.masterIds;
      params.itemId = this.itemIds;
      params.businessId = this.businessIds;
      params.responsibilityId = this.responsibilityIds;
      const d = await this.post(
        this.$api.customer.addOrEditTableDetail,
        params
      );
      if (d.code === 0) {
        this.$message.success("操作成功");
        // this.clearData();
        this.$emit("clear");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
</style>