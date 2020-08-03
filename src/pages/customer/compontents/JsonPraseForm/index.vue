<template>
  <div class="test-form">
    <!-- <parser :form-conf="formConf" @submit="sumbitForm1" /> -->
    <parser :key="key2" v-if="!showEnter" :form-conf="formConf" @submit="sumbitForm2" />
    <enterStudent v-if="showEnter" :fieldsJson="query" :tableData="tableData" @test="sumbitForm2" />
    <!-- <el-button @click="change">change</el-button> -->
  </div>
</template>

<script>
import Parser from "form-gen-parser";
import enterStudent from "@/components/dynamicTable/enterStudent";
// 若parser是通过安装npm方式集成到项目中的，使用此行引入
// import Parser from 'form-gen-parser'
export default {
  components: {
    Parser,
    enterStudent
  },
  props: { Json: "", masterId: "", itemId: "", listId: "", FileTableJson: "" },
  data() {
    return {
      query: "",
      time: "",
      userList: [],
      showEnter: false,
      tableData: {},
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
        formBtns: true,
        unFocusedComponentBorder: false
      },
      formConf2: {
        fields: [
          {
            __config__: {
              label: "单行文本",
              labelWidth: null,
              showLabel: true,
              changeTag: true,
              tag: "el-input",
              tagIcon: "input",
              required: true,
              layout: "colFormItem",
              span: 24,
              document: "https://element.eleme.cn/#/zh-CN/component/input",
              regList: [
                {
                  pattern: "/^1(3|4|5|7|8|9)\\d{9}$/",
                  message: "手机号格式错误"
                }
              ]
            },
            __slot__: {
              prepend: "",
              append: ""
            },
            __vModel__: "mobile",
            placeholder: "请输入手机号",
            style: {
              width: "100%"
            },
            clearable: true,
            "prefix-icon": "el-icon-mobile",
            "suffix-icon": "",
            maxlength: 11,
            "show-word-limit": true,
            readonly: false,
            disabled: false
          },
          {
            __config__: {
              label: "日期范围",
              tag: "el-date-picker",
              tagIcon: "date-range",
              defaultValue: null,
              span: 24,
              showLabel: true,
              labelWidth: null,
              required: true,
              layout: "colFormItem",
              regList: [],
              changeTag: true,
              document:
                "https://element.eleme.cn/#/zh-CN/component/date-picker",
              formId: 101,
              renderKey: 1585980082729
            },
            style: {
              width: "100%"
            },
            type: "daterange",
            "range-separator": "至",
            "start-placeholder": "开始日期",
            "end-placeholder": "结束日期",
            disabled: false,
            clearable: true,
            format: "yyyy-MM-dd",
            "value-format": "yyyy-MM-dd",
            readonly: false,
            __vModel__: "field101"
          }
        ],
        formRef: "elForm",
        formModel: "formData",
        size: "small",
        labelPosition: "right",
        labelWidth: 100,
        formRules: "rules",
        gutter: 15,
        disabled: false,
        span: 24,
        formBtns: true,
        unFocusedComponentBorder: false
      },
      closeDialog: true
    };
  },
  computed: {},
  watch: {
    userList(val) {
      this.fillFormData(this.formConf, {
        发生时间: this.time,
        options: this.userList
      });
      this.key2 = +new Date();
    }
  },
  created() {},
  mounted() {
    var objD = new Date();
    var yy = objD.getYear();
    if (yy < 1900) yy = yy + 1900;
    var MM = objD.getMonth() + 1;
    if (MM < 10) MM = "0" + MM;
    var dd = objD.getDate();
    if (dd < 10) dd = "0" + dd;
    var hh = objD.getHours();
    if (hh < 10) hh = "0" + hh;
    var mm = objD.getMinutes();
    if (mm < 10) mm = "0" + mm;
    var ss = objD.getSeconds();
    if (ss < 10) ss = "0" + ss;
    var str = yy + MM + dd + hh + mm + ss;
    var str2 = yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
    this.time = str2;
    if (this.$props.listId != "") {
      // 是否文件上传
      if (this.$props.itemId == 5) {
        this.query = this.$props.FileTableJson;
        this.getFileData(this.$props.listId);
      } else {
        this.getData(this.$props.listId);
      }
    } else if (
      (this.$props.listId == "" && this.$props.itemId == 10) ||
      (this.$props.listId == "" && this.$props.itemId == 9)
    ) {
      this.listDepartmentAndUser();
      this.formConf = this.$props.Json;
      this.fillFormData(this.formConf, {
        occurTime: this.time,
        options: this.userList
      });
      this.key2 = +new Date();
    } else if (this.$props.itemId == 5) {
      this.query = this.$props.FileTableJson;
      this.showEnter = true;
    } else {
      this.formConf = this.$props.Json;
      this.fillFormData(this.formConf, {
        occurTime: this.time,
        options: this.userList
      });
      this.key2 = +new Date();
    }
  },
  methods: {
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.userList = d.data;
        this.$props.Json.fields.forEach(item => {
          if (item.__vModel__ == "dealer") {
            item.options = this.userList;
          }
        });
      }
    },
    async getFileData(id) {
      const c = await this.post("/oa-boot/customer/v2/detail/get", {
        id: id
      });
      if (c.code === 0) {
        this.tableData = c.data;
        this.showEnter = true;
      }
    },
    async getData(id) {
      const c = await this.post("/oa-boot/customer/v2/detail/get", {
        id: id
      });
      if (c.code === 0) {
        this.tableData = c.data;
        this.formConf = this.$props.Json;
        this.fillFormData(this.formConf, this.tableData);
        // 更新表单
        this.key2 = +new Date();
      }
    },
    fillFormData(form, data) {
      if (form.fields) {
        form.fields.map(item => {
          const val = data[item.__vModel__];
          if (val) {
            item.__config__.defaultValue = val;
          }
          return item;
        });
      }
    },
    change() {
      this.key2 = +new Date();
      const t = this.formConf;
      this.formConf = this.formConf2;
      this.formConf2 = t;
    },
    async sumbitForm1(data) {},
    async sumbitForm2(data) {
      let params;
      if (data.arr) {
        params = data.arr[0];
        params.fileName = data.fileName;
      } else {
        params = data;
      }
      const d = await this.post(this.$api.customer.addOrEditTableDetail, {
        masterId: this.$props.masterId,
        itemId: this.$props.itemId,
        id: this.$props.listId,
        ...params
      });
      if (d.code === 0) {
        this.closeDialog = false;
        this.tableData = {};
        this.$emit("isCloseDialog", this.closeDialog);
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