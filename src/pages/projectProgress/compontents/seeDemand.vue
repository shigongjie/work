<template>
  <div class="All">
    <el-dialog
      title="查看"
      top="20px"
      :visible.sync="showValue"
      append-to-body
      :close-on-click-modal="false"
      width="96%"
      :before-close="clearData"
    >
      <!-- <el-form ref="historyform" class="demo-form-inline history">
        <el-form-item class="display" label="历史审批">
          <el-select
            @change="getHistoryDetail"
            v-model="historyValue"
            placeholder="查看历史审批"
            size="mini"
          >
            <el-option
              v-for="(item,index) in historyList"
              :key="index"
              :label="'第'+index+'次审批'"
              :value="item.historyId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>-->
      <div class="dialog">
        <el-form ref="form" size="small" :rules="rules" :model="form" label-width="100px" style="width:100%">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="审批类型"
                prop="approveType"
                :class="{'red':!editField.indexOf('approveType')}"
              >
                <el-select disabled v-model="form.approveType" filterable placeholder="请选择">
                  <el-option
                    v-for="(item,index) in ApproveTypeList"
                    :key="index"
                    :label="item.tpeName"
                    :value="item.tpeName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="类别"
                prop="category"
                :class="{'red':!editField.indexOf('category')}"
              >
                <el-select disabled v-model="form.category" filterable placeholder="请选择">
                  <el-option
                    v-for="(item,index) in ApproveTypeCategoryList"
                    :key="index"
                    :label="item.categoryName"
                    :value="item.categoryName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否盖章" prop>
                <el-switch disabled v-model="form.stampFlag" :active-value=1 :inactive-value=0></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
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
              <el-input disabled type="text" v-model="form.subject"></el-input>
            </el-form-item>
            <el-form-item
              label="截止时间"
              prop="deadlineTime"
              :class="{'red':!editField.indexOf('deadlineTime')}"
            >
              <el-date-picker
                disabled
                v-model="form.deadlineTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </div>
          <el-form-item label="审批内容" prop="content" :class="{'red':!editField.indexOf('content')}">
            <tinymce-editor
              disabled
              ref="editor"
              v-model="form.content"
              v-if="showValue"
              @onClick="onClick"
            ></tinymce-editor>
          </el-form-item>
          <el-form-item
            label="附件"
            prop="attachmentJa"
            :class="{'red':!editField.indexOf('attachmentJa')}"
          >
            <div class="upWrap">
              <el-button disabled size="small" class="btn" @click="globalUpload">上传文件</el-button>
              <div class="name-wrap">
                <span class="tip"></span>
              </div>
            </div>
            <el-form-item label prop="attachmentJa" v-for="(item,index) in FileList" :key="index">
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
                <div class="iconWarp">
                  <div @click="showFilePop(item)">
                    <a target="_blank">
                    </a>
                    预览
                  </div>
                  <div @click="downLoad(index,item)">
                    下载
                  </div>

                  <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
                </div>
                <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
              </div>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
      <div class="CommentAndApprove">
        <seeapproved
          v-if="showValue"
          :formValue="approvalPeopleList"
          :isDemand="'查看'"
          :copier="form.copierListParam"
          :creatName="form.createName"
          :creatTime='form.createTime'
        />
        <comments ref="comments" :height="300" :businessType="businessType" :businessId="demandId"></comments>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Bus from "@/axios/bus";
import returnTaskAndDemand from "./returnTaskAndDemand";
import yesTaskAndDemand from "./yesTaskAndDemand";
import comments from "@/components/comment";
import modalMixin from "@/mixins/modal";
import seeapproved from "../../policy/compontents/seeapproved";
import TinymceEditor from "@/components/Tinymce";
import wpsFile from "@/components/wpsFile";
export default {
  mixins: [modalMixin],
  components: {
    seeapproved,
    comments,
    returnTaskAndDemand,
    yesTaskAndDemand,
    TinymceEditor,
    wpsFile
  },
  props: {
    policyId: String,
    demandId: String,
    businessType: String,
    params: Object
  },
  data() {
    return {
      currFile: [],
      showFile: false,
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
        engineeringId: "",
        moduleId: "",
        phaseName: "",
        createName: "",
        customerMasterId: "",
        customerDetailId: "",
        name: "",
        content: "",
        attachmentJa: [],
        predictFinishTime: "",
        predictBeginTime: "",
        realFinishTime: "",
        reassignFlag: 0, // 是否转派
        approvalPersonList: [], // 审批人
        assignPersonList: [], // 指派
        copyPersonList: [], // 抄送
        status: "0"
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
      rules: {
        category: [
          { required: true, message: "审批类别不能为空", trigger: "change" }
        ],
        approveType: [
          { required: true, message: "审批类型为空", trigger: "change" }
        ],
        subject: [
          { required: true, message: "审批主题不能为空", trigger: "change" }
        ],
        deadlineTime: [
          { required: true, message: "截止时间不能为空", trigger: "change" }
        ],
        // attachmentJa: [
        //   { required: true, message: "附件不能为空", trigger: "change" }
        // ],
        content: [
          { required: true, message: "附件不能为空", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        if (this.demandId) {
          this.getDemand();
        }
      }
    }
    // currentOperator(val) {
    //   console.log(val);
    // }
  },
  mounted() {
    // 文件上传成功的回调
    Bus.$on("fileSuccess", data => {
      this.FileList.push({
        extendId:data.extendId,
        fileId:data.fileId,
        fileSize:data.fileSize,
        fileType:data.fileType,
        name:data.name,
        preview:data.preview,
        url: data.url,
        fileName: data.name
      });
      // this.videoUrl = data.url;
      // this.videoFileName = data.name;
      this.form.attachmentJa.push({
        extendId: data.extendId
      });
    });
    this.listApproveType();
  },
  created() {
    // this.listTaskStatus();
    // this.listDepartmentAndUser();
  },
  methods: {
    // 下载
    downLoad(index,item){
      window.open(item.url)
    },
    showFilePop(val) {
      this.currFile = [val];
      this.showFile = true;
    },
    // 获取指定历史记录详情
    async getHistoryDetail() {
      console.log(this.$refs.form);
      let _index = "";
      this.historyList.forEach((item, index) => {
        if (item.historyId == this.historyValue) {
          _index = index - 1;
        }
      });
      const c = await this.post(this.$api.approve.getHistoryDetail, {
        businessType: "5",
        historyId: this.historyValue,
        preHistoryId:
          this.historyList[_index] === undefined
            ? ""
            : this.historyList[_index].historyId
      });
      if (c.code === 0) {
        this.editField = c.data.editField;
        this.form = JSON.parse(c.data.businessSnapshoot);
      }
    },
    // 通过审批请求
    async agree() {
      const d = await this.post(this.$api.approve.doApprove, {
        businessType: "5",
        businessId: this.$props.demandId,
        operateStatus: "1",
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "通过审批!"
        });
      }
    },
    // 确认通过审批
    agreeApprove() {
      this.$confirm("确认通过审批？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.agree();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    // 撤回修改
    recall() {
      this.$confirm("撤回修改后，已审批的人员将重新审批, 确定撤回？", "提示", {
        confirmButtonText: "确定撤回",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "成功撤回!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    // 审批类型
    async listApproveType() {
      const d = await this.post(this.$api.approve.listApproveType);
      if (d.code === 0) {
        this.ApproveTypeList = d.data;
      }
    },
    // 审批类别
    async listApproveTypeCategory() {
      const d = await this.post(this.$api.approve.listApproveTypeCategory, {
        approveTypeName:
          this.form.approveType === "" ? "" : this.form.approveType
      });
      if (d.code === 0) {
        this.ApproveTypeCategoryList = d.data;
      }
    },
    globalUpload() {
      let fieldFormat = [];
      // 打开文件选择框
      Bus.$emit("openUploader", { fieldFormat });
    },
    onClick() {},
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    previousOrNext(num) {
      if (num === 0) {
        this.$emit("setDemandId", this.form.previousId);
        this.getDemand(this.form.previousId);
      } else {
        this.$emit("setDemandId", this.form.nextId);
        this.getDemand(this.form.nextId);
      }
    },
    isUpdateOperateStatus(operateType, operateStatus, isYes) {
      this.operateType = operateType;
      this.operateStatus = operateStatus;
      if (isYes) {
        this.showYes = true;
      } else {
        this.showNo = true;
      }
    },
    async updateOperateStatus(operateType, operateStatus) {
      const d = await this.post(this.$api.projectProgress.updateOperateStatus, {
        businessType: 1,
        businessId: this.demandId,
        operateType: operateType,
        operateStatus: operateStatus
      });
      if (d.code === 0) {
        this.$message.success("操作成功");
        this.getDemand();
      }
    },
    preview(file) {
      window.open(file.url);
    },
    async listTaskStatus() {
      const d = await this.post(this.$api.projectProgress.listTaskStatus);
      if (d.code === 0) {
        this.statusList = d.data;
      }
    },
    refData() {
      this.$emit("getList");
    },
    async getDemand(id) {
      const d = await this.post(this.$api.projectProgress.getDemand, {
        id: id || this.demandId
      });
      if (d.code === 0) {
        if (d.data.businessSnapshoot) {
          this.form = JSON.parse(d.data.businessSnapshoot);
        } else {
          this.approvalPeopleList = d.data.approveListParam;
          this.copyPersonList = d.data.copierListParam;
          this.form = d.data;
          this.currentOperator = d.data.currentOperator;
          this.approveFlag = d.data.approveFlag;
          this.approveStatus = d.data.approveStatus;
          this.assignFlag = d.data.assignFlag;
          this.assignStatus = d.data.assignStatus;
          this.status = d.data.status;
          this.currentApproveStatus = d.data.currentApproveStatus;
          this.form.status = this.form.status + "";
          this.form.engineeringId = this.form.engineeringId + "";
          this.form.moduleId = this.form.moduleId + "";
          this.form.phaseName = this.form.phaseName + "";
          if (this.form.customerMasterId) {
            this.form.customerMasterId = this.form.customerMasterId + "";
          } else {
            this.form.customerMasterId = "";
          }
          if (this.form.customerDetailId) {
            this.form.customerDetailId = this.form.customerDetailId + "";
          } else {
            this.form.customerDetailId = "";
          }
          setTimeout(() => {
            this.isLoad = true;
          }, 10);
          this.FileList = this.form.attachmentJa;
          this.$nextTick(() => {
            this.$refs.comments.listComments();
          });
          const c = await this.post(this.$api.approve.listHistory, {
            businessId: id || this.demandId,
            businessType: "5"
          });
          if (c.code === 0) {
            this.historyList = c.data;
          }
        }
      }
    },

    // 删除人员
    handleClose(name, index) {
      this.form[name].splice(index, 1);
      if (~~this.currentOperator === 1 && ~~this.form.reassignFlag === 0) {
        let obj = {
          userId: this.form.createBy,
          userName: this.form.createName,
          operateStatus: 0,
          businessType: 1,
          operateType: 1
        };
        this.form[name].push(obj);
        this.$message("创建人没有开启转指派功能，只能指派回给创建人");
      }
    },
    // 显示级联人员
    showInput(name) {
      this[name] = true;
    },
    // 递归找name
    find(arr, id) {
      arr.some(item => {
        if (item.value === id) {
          this.returnedItem = item;
          return item;
        } else if (item.children && item.children.length > 0) {
          this.find(item.children, id);
        }
      });
    },
    visibleChange(isTrue, name) {
      if (!isTrue) {
        setTimeout(() => {
          this[name] = false;
        }, 10);
      } else {
        this.copyData = JSON.parse(JSON.stringify(this.form[name]));
      }
    },
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.options = d.data;
        this.isLoad = true;
      }
    },
    //选择人员后
    handleInputConfirm(val, name, operateType) {
      let isReturn = true;
      this.form[name].some(item => {
        if (item.userId + "" === val[val.length - 1] + "") {
          isReturn = false;
          this.form[name] = JSON.parse(JSON.stringify(this.copyData));
          return this.$message.error("用户已添加");
        }
      });
      if (isReturn) {
        let arr = this.find(this.options, val[val.length - 1]);
        if (this.returnedItem) {
          let obj = {
            userId: this.returnedItem.value,
            userName: this.returnedItem.label,
            operateStatus: 0,
            businessType: 1,
            operateType: operateType
          };
          this.form[name].push(obj);
          this[name] = false;
          this.returnedItem = {};
        }
      }
    },
    handleAvatarSuccess(res, file, flieList, type, name) {
      let obj = {
        fileName: res.data.name,
        url: res.data.url,
        name: res.data.name,
        extendId: res.data.extendId,
        fileSize: this.fileSize,
        fileType: res.data.name.substring(file.name.lastIndexOf(".") + 1)
      };
      this.form.attachmentJa.push(obj);
    },
    handleRemove(file, fileList) {
      let remIndex;
      this.form.attachmentJa.some((item, index) => {
        if (item.fileName === file.name) {
          remIndex = index;
        }
      });
      this.form.attachmentJa.splice(remIndex, 1);
    },
    async delMember(status) {
      let tip;
      switch (status) {
        case 0:
          tip = "确定激活吗?";
          break;
        case 1:
          tip = "确定开始吗?";
          break;
      }
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.projectProgress.updateTaskStatus, {
          businessId: this.demandId + "",
          status: status,
          businessType: 1
        });
        if (d.code === 0) {
          this.getDemand();
        }
      });
    },
    clearData() {
      this.$refs["form"].resetFields();
      // this.$refs.upload.clearFiles();
      this.historyValue = "";
      this.editField = [];
      this.$emit("getList");
      this.showValue = false;
    },
    async createClone() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.projectProgress.addOrEditDemand, {
            demandId: this.demandId,
            ...this.form
          });
          if (d.code === 0) {
            this.clearData();
            this.$refs.comments.listComments();
            this.$message.success("保存成功");
          }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-dialog__body {
  display: flex;
  padding: 0!important;
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
  background: url("~@/assets/images/file.png") no-repeat left center;
  width: 230px;
  height: 36px;
  // margin-bottom: 8px;
  // background: #f8f8f8;
  // color: #939393;
  font-size: 14px;
  border-radius: 3px;
  display: flex;
  cursor: pointer;
  padding: 10px;
  align-items: center;
  .iconWarp {
    div {
      width: 50px;
      padding-left: 16px;
      font-size: 12px;
    }
    div:nth-child(1) {
      background: url("~@/assets/images/preview.png") no-repeat left center;
    }
    div:nth-child(2) {
      background: url("~@/assets/images/download.png") no-repeat left center;
    }
    div:nth-child(1):hover {
      color: #0f88eb;
      background: url("~@/assets/images/preViewhover.png") no-repeat left center;
    }
    div:nth-child(2):hover {
      color: #0f88eb;
      background: url("~@/assets/images/downloadhover.jpg") no-repeat left center;
    }
    display: flex;
    margin-left: 5px;
  }
  &:hover {
    .i-con-wrap {
      // display: block;
    }
    .zz {
      opacity: 0.8;
    }
  }
}
.zz {
  display: flex;
  align-items: center;
  opacity: 1;
}
.oe {
  margin-right: 10px;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialog {
  display: flex;
  min-width: 0;
  flex: 1;
  /deep/ .el-form{
    width: 100%
  }
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
  // padding-bottom: 20px;
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
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: white !important;
  border-color: #e4e7ed !important;
  color: black !important;
  cursor: not-allowed !important;
}
</style>