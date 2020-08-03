<template>
  <div>
    <el-dialog
      title="查看"
      top="2px"
      :visible.sync="showValue"
      :close-on-click-modal="false"
      width="1300px"
      append-to-body
      :before-close="clearData"
    >
      <div class="dialog">
        <div class="left-main">
          <el-form
            ref="form"
            size="small"
            style="width:100%"
            :rules="rules"
            :model="form"
            label-width="110px"
          >
            <el-form-item label="重点项目">
              <span>{{form.schoolBookName}}</span>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="业务">
                  <span>{{form.engineeringName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属模块" v-if="form.engineeringId">
                  <span>{{form.moduleName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="阶段" v-if="form.engineeringId">
                  <span>{{form.pauseName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户">
                  <span>{{form.customerName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人">
                  <span>{{form.contactName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="进展">
              <ul v-for="(item, index) in form.progressesList" :key="index">
                <li>
                  <span>{{item.progressDate}}</span>
                  <span style="margin:0 10px;">-</span>
                  <span>{{item.userName}}</span>
                  <span style="margin:0 10px;">-</span>
                  <span>{{item.progress}}</span>
                  <span style="margin:0 10px;">-</span>
                  <span>{{item.remark}}</span>
                </li>
              </ul>
            </el-form-item>

            <div class="head">
              <el-form-item style="flex:1" label="任务名称">
                <span>{{form.name}}</span>
              </el-form-item>
              <el-form-item style="flex:1;" label="优先级" prop="degreeType">
                <div
                  class="degree"
                  style="margin-top:5px"
                  :class="'type'+~~form.degreeType"
                >{{ form.degreeType }}</div>
              </el-form-item>
            </div>

            <el-form-item label="任务内容" prop="content">
              <div v-html="form.content"></div>
            </el-form-item>
            <el-form-item label="附件" prop="attachmentJa">
              <el-upload
                class="see-upload"
                ref="upload"
                :action="`${$config.host}${$api.common.upload}`"
                :on-preview="preview"
                name="multipartFile"
                multiple
                :file-list="fileList"
              ></el-upload>
            </el-form-item>
            <div class="flex">
              <el-form-item label="预计时间" prop="predictTimeArr">
                <span>{{form.predictBeginTime}}</span>
                <span style="margin:0 10px" v-if="form.predictFinishTime">至</span>
                <span>{{form.predictFinishTime}}</span>
              </el-form-item>
              <el-form-item label="实际时间" prop="realTimeArr">
                <span>{{form.realBeginTime}}</span>
                <span style="margin:0 10px" v-if="form.realFinishTime">至</span>
                <span>{{form.realFinishTime}}</span>
              </el-form-item>
            </div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="目标流水" prop="targetSerialNum">
                  <span>{{form.targetSerialNum}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="目标流量" prop="targetFlow">
                  <span>{{form.targetFlow}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="当前流水" prop="currSerialNum">
                  <span>{{form.currSerialNum}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="当前流量" prop="currFlow">
                  <span>{{form.currFlow}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="当前目标" prop="currOther">
                  <span>{{form.currOther}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="发起者">
              <el-tag effect="plain">{{form.createName}}</el-tag>
            </el-form-item>
            <el-form-item label="审批者顺序" prop="approvalPersonList">
              <div class="wrap">
                <div v-for="(item,index) in form.approvalPersonList" :key="index">
                  <el-tag
                    :closable="false"
                    effect="plain"
                    :type="~~item.operateStatus===2?'danger':''"
                    @close="handleClose('approvalPersonList',index)"
                  >
                    <i
                      class="el-icon-success"
                      style="font-size: 15px;"
                      v-if="~~item.operateStatus===1"
                    ></i>
                    <i
                      class="el-icon-error"
                      style="font-size: 15px;color:red"
                      v-if="~~item.operateStatus===2"
                    ></i>
                    {{item.userName}}
                  </el-tag>
                  <i
                    class="el-icon-arrow-right"
                    style="margin-right: 10px;"
                    v-if="index!==form.approvalPersonList.length-1"
                  ></i>
                </div>
                <div class="block" v-if="approvalPersonList">
                  <el-cascader
                    filterable
                    class="input-new-tag"
                    size="small"
                    ref="saveTagInput"
                    @change="(value)=>{handleInputConfirm(value,'approvalPersonList',0)} "
                    @visible-change="(isTrue)=>{visibleChange(isTrue,'approvalPersonList')} "
                    :options="options"
                    :props="{ expandTrigger: 'hover' }"
                    clearable
                  ></el-cascader>
                </div>
                <i
                  class="el-icon-circle-plus-outline addBtn"
                  v-if="false"
                  @click="showInput('approvalPersonList')"
                ></i>
              </div>
            </el-form-item>
            <el-form-item label="任务完成者" prop="assignPersonList">
              <div class="wrap">
                <div v-for="(item,index) in form.assignPersonList" :key="index">
                  <el-tag
                    :closable="false"
                    effect="plain"
                    @close="handleClose('assignPersonList',index)"
                  >
                    <i
                      v-if="~~item.operateStatus===1"
                      class="el-icon-success"
                      style="font-size: 15px;"
                    ></i>
                    {{item.userName}}
                  </el-tag>
                  <i
                    class="el-icon-arrow-right"
                    style="margin-right: 10px;"
                    v-if="index!==form.assignPersonList.length-1"
                  ></i>
                </div>
                <div class="block" v-if="assignPersonList">
                  <el-cascader
                    filterable
                    class="input-new-tag"
                    size="small"
                    ref="saveTagInput"
                    @change="(value)=>{handleInputConfirm(value,'assignPersonList',1)} "
                    @visible-change="(isTrue)=>{visibleChange(isTrue,'assignPersonList')} "
                    :options="options"
                    clearable
                    :props="{ expandTrigger: 'hover' }"
                  ></el-cascader>
                </div>
                <i
                  class="el-icon-circle-plus-outline addBtn"
                  v-if="false"
                  @click="showInput('assignPersonList')"
                ></i>
              </div>
            </el-form-item>
            <el-form-item label="是否能转派" prop="reassignFlag">
              <span>{{form.reassignFlag===0?'否':'是'}}</span>
            </el-form-item>
            <el-form-item label="抄送给" prop="copyPersonList">
              <div class="wrap">
                <div v-for="(item,index) in form.copyPersonList" :key="index">
                  <el-tag
                    effect="plain"
                    :closable="false"
                    @close="handleClose('copyPersonList',index)"
                  >
                    <i
                      class="el-icon-success"
                      style="font-size: 15px;"
                      v-if="~~item.operateStatus===1"
                    ></i>
                    {{item.userName}}
                  </el-tag>
                  <i
                    class="el-icon-arrow-right"
                    style="margin-right: 10px;"
                    v-if="index!==form.copyPersonList.length-1"
                  ></i>
                </div>
                <div class="block" v-if="copyPersonList">
                  <el-cascader
                    filterable
                    class="input-new-tag"
                    size="small"
                    ref="saveTagInput"
                    @change="(value)=>{handleInputConfirm(value,'copyPersonList',2)} "
                    @visible-change="(isTrue)=>{visibleChange(isTrue,'copyPersonList')} "
                    :options="options"
                    clearable
                  ></el-cascader>
                </div>
                <i
                  class="el-icon-circle-plus-outline addBtn"
                  v-if="false"
                  @click="showInput('copyPersonList')"
                ></i>
              </div>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <span>{{form.statusName}}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="footerBtns">
          <el-button
            type="primary"
            size="small"
            @click="updateOperateStatus(1,1)"
            v-if="assignFlag&&~~assignStatus===0&&~~status===1"
          >完成</el-button>
          <el-button
            type="primary"
            size="small"
            v-if="~~status===0 &&~~approveStatus===1"
            @click="delMember(1)"
          >开始</el-button>
          <el-button
            type="primary"
            size="small"
            @click="isUpdateOperateStatus(0,1,true)"
            v-if="approveFlag&&~~currentApproveStatus===0"
          >审批</el-button>
          <el-button
            type="primary"
            size="small"
            @click="isUpdateOperateStatus(0,1,true)"
            v-if="approveFlag &&~~currentApproveStatus===2"
          >重新审批</el-button>
          <el-button
            type="text"
            class="red"
            size="small"
            @click="isUpdateOperateStatus(0,2,false)"
            v-if="approveFlag &&~~currentApproveStatus===1"
          >取消审批</el-button>
          <el-button
            size="small"
            type="text"
            class="red"
            @click="isUpdateOperateStatus(0,2,false)"
            v-if="approveFlag &&~~currentApproveStatus===0"
          >拒绝</el-button>
          <el-button
            type="text"
            size="small"
            v-if="~~form.previousId!==-1"
            @click="previousOrNext(0)"
          >上一页</el-button>
          <el-button
            size="small"
            type="text"
            v-if="~~form.nextId!==-1"
            @click="previousOrNext(1)"
          >下一页</el-button>
        </div>
        <comments ref="comments" :height="670" :businessType="businessType" :businessId="taskId+''"></comments>
      </div>
    </el-dialog>
    <yesTaskAndDemand
      :value.sync="showYes"
      :id="taskId"
      :businessType="0"
      :operateType="operateType"
      :operateStatus="Number(operateStatus)"
      @getList="getTask"
    ></yesTaskAndDemand>
    <returnTaskAndDemand
      :value.sync="showNo"
      :id="taskId"
      :businessType="0"
      :operateType="operateType"
      :operateStatus="Number(operateStatus)"
      @getList="getTask"
    ></returnTaskAndDemand>
  </div>
</template>

<script>
import returnTaskAndDemand from "./returnTaskAndDemand";
import yesTaskAndDemand from "./yesTaskAndDemand";
import createTask from "@/components/createTask";
import TinymceEditor from "@/components/Tinymce";
import comments from "@/components/comment";
import addUser from "../../../components/createTask/compontents/addUser";
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  components: {
    addUser,
    comments,
    createTask,
    TinymceEditor,
    yesTaskAndDemand,
    returnTaskAndDemand
  },
  props: {
    taskId: String,
    businessType: String,
    engineeringMasterId: String,
    columnValue: String,
    params: Object
  },
  data() {
    return {
      // add组件
      options: [],
      dynamicTags: [],
      fileList: [],
      showCreateTask: false,
      showAddProgress: false,
      approvalPersonList: false,
      assignPersonList: false,
      copyPersonList: false,
      isShowAddContacts: false,
      returnedItem: {},
      form: {
        engineeringId: "",
        moduleId: "",
        phaseName: "",
        customerMasterId: "",
        customerDetailId: "",
        createName: "",
        name: "",
        content: "",
        attachmentJa: [],
        schoolBookName: "",
        predictFinishTime: "",
        predictBeginTime: "",
        predictTimeArr: [],
        realTimeArr: [],
        realBeginTime: "",
        realFinishTime: "",
        targetSerialNum: "",
        targetFlow: "",
        targetOther: "",
        currSerialNum: "",
        currFlow: "",
        currOther: "",
        progressesList: [],
        reassignFlag: 0, // 是否转派
        approvalPersonList: [], // 审批人
        assignPersonList: [], // 指派
        copyPersonList: [], // 抄送
        status: "0"
      },
      progressForm: {
        progressTime: "",
        progress: "",
        progressId: "",
        remark: ""
      },
      tabClounm: [
        { fieldName: "progressDate", fieldLabel: "日期" },
        { fieldName: "progress", fieldLabel: "进展" },
        { fieldName: "remark", fieldLabel: "备忘" }
      ],
      showYes: false,
      showNo: false,
      operateType: 0,
      operateStatus: 0,
      statusList: [],
      copyData: {},
      fileSize: "",
      assignFlag: false,
      assignStatus: "",
      approveFlag: false,
      isLoad: false,
      approveStatus: "",
      status: "",
      fileName: "",
      departmentList: [],
      currentApproveStatus: "",
      moduleList: [],
      currentOperator: "0",
      customerList: [],
      menuList: [],
      phaseList: [],
      userList: [],
      oneSchoolList: [],
      progressRules: {
        progressTime: [
          { required: true, message: "时间不能为空", trigger: "change" }
        ],
        progress: [
          { required: true, message: "进展不能为空", trigger: "change" }
        ]
      },
      rules: {
        engineeringId: [
          { required: true, message: "一校一策不能为空", trigger: "change" }
        ],
        moduleId: [
          { required: true, message: "模块不能为空", trigger: "change" }
        ],
        name: [
          { required: true, message: "任务名称不能为空", trigger: "change" }
        ],
        content: [
          { required: true, message: "任务内容不能为空", trigger: "change" }
        ],
        predictTimeArr: [
          { required: true, message: "预计时间不能为空", trigger: "blur" }
        ],
        realTimeArr: [
          { required: false, message: "实际时间不能为空", trigger: "blur" }
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
        if (this.taskId) {
          this.$nextTick(() => {
            this.getTask();
          });
        }
      }
    }
  },
  created() {
    this.listDepartmentAndUser();
  },
  methods: {
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
          businessId: this.taskId + "",
          status: status,
          businessType: 0
        });
        if (d.code === 0) {
          this.getTask();
        }
      });
    },
    previousOrNext(num) {
      if (num === 0) {
        this.$emit("setTaskId", this.form.previousId);
        this.getTask(this.form.previousId);
      } else {
        this.$emit("setTaskId", this.form.nextId);
        this.getTask(this.form.nextId);
      }
    },
    onClick() {},
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
        businessType: 0,
        businessId: this.taskId,
        operateType: operateType,
        operateStatus: operateStatus
      });
      if (d.code === 0) {
        this.$message.success("操作成功");
        this.getTask();
      }
    },
    preview(file) {
      window.open(file.url);
    },
    refData() {
      this.$emit("getList");
    },
    cloneData() {
      this.clearData();
      this.showCreateTask = true;
    },
    async getTask(id) {
      const d = await this.post(this.$api.projectProgress.getTask, {
        taskId: id || this.taskId,
        engineeringMasterId: this.engineeringMasterId,
        ...this.params
      });
      if (d.code === 0) {
        this.form = d.data;
        this.currentOperator = d.data.currentOperator;
        this.approveFlag = d.data.approveFlag;
        this.approveStatus = d.data.approveStatus;
        this.status = d.data.status;
        this.assignFlag = d.data.assignFlag;
        this.assignStatus = d.data.assignStatus;
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
        this.fileList = this.form.attachmentJa;
        setTimeout(() => {
          this.isLoad = true;
        }, 10);
        this.$refs.comments.listComments();
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
          businessType: 0,
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
            businessType: 0,
            operateType: operateType
          };
          this.form[name].push(obj);
          this[name] = false;
          this.returnedItem = {};
        }
      }
    },

    clearData() {
      this.$refs["form"].resetFields();
      this.$refs.upload.clearFiles();
      this.$emit("getList");
      this.showValue = false;
    },
    async createClone() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.projectProgress.addOrEditTask, {
            taskId: this.taskId,
            ...this.form,
            predictBeginTime: this.form.predictTimeArr[0],
            predictFinishTime: this.form.predictTimeArr[1],
            realBeginTime: this.form.realTimeArr[0],
            realFinishTime: this.form.realTimeArr[1]
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
.dialog {
  display: flex;
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
    }
    //滚动条的滑块
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
.center {
  text-align: center;
}
.left {
  text-align: left;
}
.flex {
  display: flex;
}
</style>
