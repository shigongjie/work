<template>
  <div class="All">
    <div class="dialog">
      <el-form
        :disabled="canEdit=='查看'"
        ref="form"
        size="small"
        :rules="rules"
        :model="form"
        label-width="100px"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item
              label="审批类型"
              prop="approveType"
              :class="{'red':!editField.indexOf('approveType')}"
            >
              <el-select v-model="form.approveType" filterable placeholder="请选择">
                <el-option
                  v-for="(item,index) in ApproveTypeList"
                  :key="index"
                  :label="item.tpeName"
                  :value="item.tpeName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="类别"
              prop="category"
              :class="{'red':!editField.indexOf('category')}"
            >
              <el-select v-model="form.category" filterable placeholder="请选择">
                <el-option
                  v-for="(item,index) in ApproveTypeCategoryList"
                  :key="index"
                  :label="item.categoryName"
                  :value="item.categoryName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="编号" :class="{'red':!editField.indexOf('category')}">
              <el-input disabled type="text" v-model="form.num"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="head">
          <el-form-item
            label="审批主题"
            style="flex:1"
            prop="subject"
            :class="{'red':!editField.indexOf('subject')}"
          >
            <el-input type="text" v-model="form.subject"></el-input>
          </el-form-item>
          <el-form-item
            label="截止时间"
            prop="deadlineTime"
            :class="{'red':!editField.indexOf('deadlineTime')}"
          >
            <el-date-picker
              v-model="form.deadlineTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="审批内容" prop="content" :class="{'red':!editField.indexOf('content')}">
          <tinymce-editor ref="editor" v-model="form.content"></tinymce-editor>
        </el-form-item>
        <el-form-item
          label="附件"
          prop="attachmentJa"
          :class="{'red':!editField.indexOf('attachmentJa')}"
        >
          <div class="upWrap">
            <el-button size="small" class="btn">上传文件</el-button>
            <div class="name-wrap">
              <span class="tip"></span>
            </div>
          </div>
          <el-form-item
            label
            prop="attachmentJa"
            v-for="(item,index) in FileList"
            :key="index"
            :class="{'red':!editField.indexOf('attachmentJa')}"
          >
            <div class="check-file">
              <div class="zz">
                <img src alt />
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.fileName"
                  placement="top-start"
                >
                  <span class="oe">{{item.fileName}}</span>
                </el-tooltip>
              </div>
              <div class="i-con-wrap">
                <img style="margin-right:20px" src="~@/assets/images/del2.png" alt />
                <a :href="item.url" target="_blank">
                  <img src="~@/assets/images/check.png" alt />
                </a>
              </div>
            </div>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>

    <div class="rightComment">
      <approved
        @approvedGroup="getApprovedGroup"
        @copierList="copierList"
        :formValue="approvalPeopleList"
        :isDemand="canEdit"
        :copier="form.copierListParam"
      />
      <!-- <comments v-if="showValue" ref="comments" :height="200" :businessType="businessType" :businessId="demandId"></comments> -->
    </div>
  </div>
</template>

<script>
import Bus from "@/axios/bus";
import returnTaskAndDemand from "./returnTaskAndDemand";
import yesTaskAndDemand from "./yesTaskAndDemand";
import comments from "@/components/comment";
import modalMixin from "@/mixins/modal";
import approved from "../../policy/compontents/seeapproved";
import TinymceEditor from "@/components/Tinymce";
export default {
  mixins: [modalMixin],
  components: {
    approved,
    comments,
    returnTaskAndDemand,
    yesTaskAndDemand,
    TinymceEditor
  },
  props: {
    policyId: String,
    demandId: String,
    businessType: String,
    params: Object,
    formData: {}
  },
  data() {
    return {
      // 撤回重新发布按钮显示
      isrepublic: false,
      isrecall: true,
      canEdit: "查看",
      //
      // 历史审批
      historyValue: "",
      historyList: [],
      //
      // 需要标红的字段
      editField: [],
      approvalPeopleList: [],
      options: [],
      fileList: [],
      showCreateTask: false,
      approvalPersonList: false,
      assignPersonList: false,
      copyPersonList: false,
      isLoad: false,
      isShowAddContacts: false,
      returnedItem: {},
      form: {
        approveType: "",
        category: "",
        subject: "",
        content: "",
        deadlineTime: "",
        attachmentJa: [],
        approveListParam: [], // 审批人
        copyPersonList: [], // 抄送,
        republish: "0",
        approveStatus: "0",
        rejectFlag: "0"
      },
      copierListParam: [],
      FileList: [],
      showYes: false,
      showNo: false,
      operateType: 0,
      operateStatus: "",
      statusList: [],
      copyData: {},
      fileSize: "",
      fileName: "",
      approveFlag: false,
      status: "",
      assignFlag: false,
      assignStatus: "",
      currentApproveStatus: "",
      approveStatus: "",
      departmentList: [],
      moduleList: [],
      currentOperator: "0",
      customerList: [],
      menuList: [],
      userList: [],
      ApproveTypeList: [],
      ApproveTypeCategoryList: [],
      rules: {}
    };
  },
  mounted() {
    this.listDepartmentAndUser();
    this.form = this.$props.formData;
    this.FileList = this.form.attachmentJa;
    this.approvalPeopleList = this.form.approveListParam;
    this.copyPersonList = this.form.copierListParam;
  },
  methods: {
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.options = d.data;
      }
    },
    // 从子组件获取审批人和抄送人
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    }
  }
};
</script>

<style lang='scss' scoped>
.All {
  display: flex;
}
/deep/ .el-dialog__body {
  display: flex;
}

.dialog {
  padding-right: 20px;
  .left-main {
    flex: 1;
    margin-bottom: 60px;
    max-height: 560px;
    padding: 10px;
    display: flex;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    } //滚动条的滑块
    &::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 3px;
    }
  }
  .footerBtns {
    position: absolute;
    bottom: 10px;
    right: 270px;
  }
}

.del {
  color: red;
  border: 1px solid red;
}

.upWrap {
  display: flex;
  align-items: center;
  .name-wrap {
    display: flex;
    margin-left: 10px;
    align-items: center;
  }
}

.head {
  display: flex;
}

.addBtn {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
  color: #50a8f0;
}

.wrap {
  display: flex;
  height: 32px;
  align-items: center;
}

.el-tag {
  margin-right: 10px;
}

.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}

.tip {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999999;
}

.check {
  position: absolute;
  top: 0;
  left: -90px;
}

.el-dialog__footer {
  margin-right: 260px;
}

.check-file {
  width: 240px;
  height: 36px; // margin-bottom: 8px;
  background: #f8f8f8;
  color: #939393;
  font-size: 14px;
  border-radius: 3px;
  display: flex;
  cursor: pointer;
  padding: 10px;
  align-items: center;
  margin-top: 10px;
  &:hover {
    .i-con-wrap {
      display: block;
    }
    .zz {
      opacity: 0.3;
    }
  }
}

.zz {
  display: flex;
  align-items: center;
  background: #f8f8f8;
  opacity: 1;
}

.oe {
  width: 140px;
  margin-right: 10px;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialog {
  display: flex;
  width: 800px;
  .left-main {
    flex: 1;
    margin-bottom: 60px;
    max-height: 650px;
    padding: 10px;
    display: flex;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    } //滚动条的滑块
    &::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 3px;
    }
  }
  .footerBtns {
    position: absolute;
    bottom: 10px;
    right: 270px;
  }
}

.del {
  color: red;
  border: 1px solid red;
}

.upWrap {
  display: flex;
  align-items: center;
  .name-wrap {
    display: flex;
    margin-left: 10px;
    align-items: center;
  }
}

.head {
  display: flex;
}

.addBtn {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
  color: #50a8f0;
}

.wrap {
  display: flex;
  height: 32px;
  align-items: center;
}

.el-tag {
  margin-right: 10px;
}

.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}

.tip {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999999;
}

.check {
  position: absolute;
  top: 0;
  left: -90px;
}

.el-dialog__footer {
  margin-right: 260px;
}

.rightComment {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  } //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}

.history {
  width: 260px;
  position: absolute;
  right: 16px;
  font-size: 12px;
  z-index: 20;
}

.display {
  display: flex;
}
.red {
  /deep/ .el-form-item__label {
    color: red !important;
  }
  /deep/ .el-form-item__content {
    /deep/ .el-input {
      input {
        color: red !important;
      }
    }
  }
  input {
    color: red !important;
  }
}
.buttonWarp {
  position: absolute;
  bottom: 20px;
  right: 450px;
}
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: white!important;
  border-color: #e4e7ed!important;
  color: black!important;
  cursor: not-allowed!important;
}
</style>