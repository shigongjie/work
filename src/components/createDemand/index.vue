<template>
  <div class="All">
    <el-dialog
      title="发起审批"
      top="20px"
      :visible.sync="showValue"
      append-to-body
      :close-on-click-modal="false"
      width="96%"
      :before-close="clearData"
    >
      <div class="dialog">
        <el-form ref="form" size="small" :rules="rules" :model="form" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="审批类型" prop="approveType">
                <el-select
                  v-model="form.approveType"
                  @change="changeEngineering"
                  filterable
                  placeholder="请选择"
                >
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
              <el-form-item label="类别" prop="category">
                <el-select
                  v-model="form.category"
                  @change="getApprovedModule"
                  filterable
                  clearable
                  placeholder="请选择"
                >
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
                <el-switch v-model="form.stampFlag" active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="head">
            <el-form-item label="审批主题" style="flex:1" prop="subject">
              <el-input type="text" v-model="form.subject"></el-input>
            </el-form-item>
            <el-form-item label="截止时间" prop="deadlineTime">
              <el-date-picker
                v-model="form.deadlineTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </div>
          <el-form-item label="审批内容" prop="content">
            <tinymce-editor ref="editor" v-model="form.content" v-if="showValue" @onClick="onClick"></tinymce-editor>
          </el-form-item>
          <el-form-item label="附件" prop="attachmentJa">
            <div class="upWrap" style="margin-bottom:10px">
              <el-button size="small" class="btn" @click="globalUpload">上传文件</el-button>
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
                    :content="item.videoFileName"
                    placement="top-start"
                  >
                    <span class="oe">{{item.videoFileName}}</span>
                  </el-tooltip>
                </div>
                <div class="iconWarp">
                  <div @click="showFilePop(item)">
                    <a target="_blank"></a>
                    预览
                  </div>
                  <div @click="del(index,item)">删除</div>

                  <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
                </div>
              </div>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="text" size="small" @click="createClone(true)">创建并克隆</el-button>
        <el-button type="primary" size="small" @click="createClone(false)">创建</el-button>
      </span>
      <div class="CommentAndApprove">
        <approved
          v-if="showValue"
          @approvedGroup="getApprovedGroup"
          @copierList="copierList"
          :businessType="5"
          :approvedPram="form.approveListParam"
          :copier="form.copyPersonList"
        />
      </div>
    </el-dialog>

    <addUser
      :value.sync="isShowAddContacts"
      @listCustomerDetail="listCustomerDetail"
      :customerMasterId="form.customerMasterId"
    ></addUser>
  </div>
</template>

<script>
import Bus from "@/axios/bus";
import approved from "../../pages/policy/compontents/approved";
import TinymceEditor from "@/components/Tinymce";
import addUser from "../createTask/compontents/addUser";
import modalMixin from "@/mixins/modal";
import wpsFile from "@/components/wpsFile";
export default {
  mixins: [modalMixin],
  components: {
    addUser,
    TinymceEditor,
    approved,
    wpsFile
  },
  props: {
    taskId: String,
    isClone: Boolean
  },
  data() {
    return {
      showFile: false,
      currFile: [],
      // add组件
      options: [],
      dynamicTags: [],
      degreeList: [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
        { id: 5, name: "5" }
      ],
      approvalPersonList: false,
      assignPersonList: false,
      copyPersonList: false,
      isShowAddContacts: false,
      returnedItem: {},
      form: {
        stampFlag: 0,
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
      ApproveTypeCategoryList: [],
      ApproveTypeList: [],
      statusList: [],
      copyData: {},
      fileSize: "",
      fileName: "",
      departmentList: [],
      moduleList: [],
      customerList: [],
      FileList: [],
      menuList: [],
      userList: [],
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
        content: [
          { required: true, message: "内容不能为空", trigger: "change" }
        ],
        deadlineTime: [
          { required: true, message: "截止时间不能为空", trigger: "change" }
        ],
        assignPersonList: [
          { required: true, message: "指派对象不能为空", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        this.listDepartmentAndUser();
        if (this.taskId) {
          this.getTask();
        }
      }
    },
    "form.stampFlag"(val) {
      if(process.env.VUE_APP_NODE_ENV === "production"){
        if (val == 1) {
        var res1 = this.form.copyPersonList.find(item => {
          return item.userId == "424853353286078464";
        });
        if (res1 === undefined) {
          this.form.copyPersonList.push({
            businessType: 5,
            operateStatus: "0",
            operateType: "2",
            userId: "424853353286078464",
            userName: "李晓雯"
          });
        }
        var res2 = this.form.copyPersonList.find(item => {
          return item.userId == "424678510066405376";
        });
        if (res2 === undefined) {
          this.form.copyPersonList.push({
            businessType: 5,
            operateStatus: "0",
            operateType: "2",
            userId: "424678510066405376",
            userName: "张院长"
          });
        }
      } else if (val == 0) {
        this.form.copyPersonList.forEach((item, index) => {
          if (item.userId == "424853353286078464") {
            this.form.copyPersonList.splice(index, 1);
          }
        });
        this.form.copyPersonList.forEach((item, index) => {
          if (item.userId == "424678510066405376") {
            this.form.copyPersonList.splice(index, 1);
          }
        });
      }
      }else{
        if (val == 1) {
        var res1 = this.form.copyPersonList.find(item => {
          return item.userId == "503254812226228224";
        });
        if (res1 === undefined) {
          this.form.copyPersonList.push({
            businessType: 5,
            operateStatus: "0",
            operateType: "2",
            userId: "503254812226228224",
            userName: "部门总监"
          });
        }
        var res2 = this.form.copyPersonList.find(item => {
          return item.userId == "503258660504342528";
        });
        if (res2 === undefined) {
          this.form.copyPersonList.push({
            businessType: 5,
            operateStatus: "0",
            operateType: "2",
            userId: "503258660504342528",
            userName: "项目经理"
          });
        }
      } else if (val == 0) {
        this.form.copyPersonList.forEach((item, index) => {
          if (item.userId == "503254812226228224") {
            this.form.copyPersonList.splice(index, 1);
          }
        });
        this.form.copyPersonList.forEach((item, index) => {
          if (item.userId == "503258660504342528") {
            this.form.copyPersonList.splice(index, 1);
          }
        });
      }
      }
      
    }
  },
  mounted() {
    // 文件上传成功的回调
    Bus.$on("fileSuccess", data => {
      console.log(data);
      this.FileList.push({
        fileId: data.fileId,
        fileType: data.fileType,
        preview: data.preview,
        name: data.name,
        url: data.url,
        videoUrl: data.url,
        videoFileName: data.name
      });
      // this.videoUrl = data.url;
      // this.videoFileName = data.name;
      this.form.attachmentJa.push({
        extendId: data.extendId
      });
    });
    this.listApproveType();
  },
  methods: {
    // 获取审批模板
    async getApprovedModule() {
      const d = await this.post(this.$api.approve.getTemplates, {
        approveType: this.form.approveType,
        category: this.form.category
      });
      if (d.code === 0) {
        this.form.approveListParam = d.data.approveListParam;
        this.form.copyPersonList = d.data.copierListParam;
        // this.ApproveTypeList = d.data;
      }
    },
    showFilePop(val) {
      this.currFile = [val];
      this.showFile = true;
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
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    },
    onClick() {},
    async listTaskStatus() {
      const d = await this.post(this.$api.projectProgress.listTaskStatus);
      if (d.code === 0) {
        this.statusList = d.data;
      }
    },
    async getTask() {
      const d = await this.post(this.$api.projectProgress.getTask, {
        taskId: this.taskId,
        isClone: this.isClone
      });
      if (d.code === 0) {
        this.form = d.data;
        this.form.status = this.form.status + "";
        this.form.engineeringId = this.form.engineeringId + "";
        this.form.moduleId = this.form.moduleId + "";
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
        this.form.id = "";
        this.form.realBeginTime = "";
        this.form.realFinishTime = "";
        this.fileList = this.form.attachmentJa;
        this.listCustomerDetail();
        this.listEngineeringModule();
      }
    },

    async listEngineeringMaster() {
      const d = await this.post(this.$api.projectManage.listEngineeringMaster);
      if (d.code === 0) {
        this.menuList = d.data;
      }
    },
    changeCustomer() {
      this.form.customerDetailId = "";
      this.listCustomerDetail();
    },
    async listCustomerDetail() {
      if (this.form.customerMasterId) {
        const d = await this.post(this.$api.customer.listCustomerDetail, {
          customerMasterId: this.form.customerMasterId
        });
        if (d.code === 0) {
          this.userList = d.data;
        }
      }
    },
    async listCustomerMaster() {
      const d = await this.post(this.$api.customer.listCustomerMaster);
      if (d.code === 0) {
        this.customerList = d.data;
      }
    },
    changeEngineering() {
      this.listApproveTypeCategory();
    },
    async listEngineeringModule() {
      if (this.form.engineeringId) {
        const d = await this.post(
          this.$api.projectProgress.listEngineeringModule,
          {
            engineeringMasterId: this.form.engineeringId
          }
        );
        if (d.code === 0) {
          this.moduleList = d.data;
        }
      }
    },
    // 删除人员
    handleClose(name, index) {
      this.form[name].splice(index, 1);
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
    uniqueobj(arr) {
      let obj = {};
      let peon = arr.reduce((cur, next) => {
        obj[next.value] ? "" : (obj[next.value] = true && cur.push(next));
        return cur;
      }, []);
      return peon;
    },
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.options = d.data;
        this.isLoad = true;
      }
    },
    del(index, ob) {
      this.FileList.splice(index, 1);
      this.form.attachmentJa.splice(index, 1);
      // this.form.attachmentJa.forEach((item,index)=>{
      //   if()
      // })
      this.videoUrl = "";
      this.videoFileName = "";
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
            businessType: 5,
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
    clearData() {
      this.$refs["form"].resetFields();
      this.form.copyPersonList = [];
      this.form.approveListParam = [];
      this.form.attachmentJa = [];
      this.FileList = [];
      this.form.stampFlag = 0;
      // this.$refs.upload.clearFiles();
      this.$emit("getList");
      this.showValue = false;
    },
    async createClone(isClone) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.form.approveListParam) {
            if (this.form.approveListParam[0].members.length == 0) {
              this.$message.error("审批人不能为空");
            } else {
              const d = await this.post(
                this.$api.projectProgress.addOrEditDemand,
                {
                  ...this.form
                }
              );
              if (d.code === 0) {
                if (!isClone) {
                  this.clearData();
                  this.$message.success("创建成功");
                } else {
                  this.$emit("getList");
                  this.$message.success("创建并克隆成功");
                }
              }
            }
          } else {
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
  padding: 0 !important;
}
.dialog {
  min-width: 0;
  margin-bottom: 15px;
  max-height: 500px;
  padding: 10px;
  overflow: auto;
  flex: 1;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
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
      background: url("~@/assets/images/delete.png") no-repeat left center;
    }
    div:nth-child(1):hover {
      color: #0f88eb;
      background: url("~@/assets/images/preViewhover.png") no-repeat left center;
    }
    div:nth-child(2):hover {
      color: #0f88eb;
      background: url("~@/assets/images/deletehover.png") no-repeat left center;
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
.rightComment {
  margin-left: 10px;
  padding-left: 20px;
  border-left: 1px solid #ccc;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 20px;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  } //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}
</style>