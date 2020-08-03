<template>
  <div>
    <el-dialog
      title="建任务"
      :visible.sync="showValue"
      top="20px"
      :close-on-click-modal="false"
      width="1100px"
      :before-close="clearData"
    >
      <div class="dialog">
        <el-form ref="form" size="small" :rules="rules" :model="form" label-width="100px">
          <el-form-item label="重点项目" v-if="form.customerMasterId" prop="schoolBookCode">
            <el-select v-model="form.schoolBookCode" filterable clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in oneSchoolList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="head">
            <el-form-item label="业务" prop="engineeringId">
              <el-select
                v-model="form.engineeringId"
                @change="changeEngineering"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in menuList"
                  :key="index"
                  :label="item.engineeringName"
                  :value="item.id+''"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属模块" prop="moduleId" v-if="form.engineeringId">
              <el-select v-model="form.moduleId" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in moduleList"
                  :key="index"
                  :label="item.moduleName"
                  :value="item.id+''"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="阶段" prop="phaseName" v-if="form.engineeringId">
              <el-select v-model="form.phaseName" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in phaseList"
                  :key="index"
                  :label="item.phaseName"
                  :value="item.phaseName"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="head">
            <el-form-item label="客户" prop="customerMasterId">
              <el-select
                v-model="form.customerMasterId"
                @change="changeCustomer"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in customerList"
                  :key="index"
                  :label="item.customerName"
                  :value="item.customerMasterId+''"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人" v-if="form.customerMasterId" prop="customerDetailId">
              <el-select v-model="form.customerDetailId" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in userList"
                  :key="index"
                  :label="item.contact"
                  :value="item.id+''"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-if="form.customerMasterId">
              <el-button
                size="small"
                style="margin-left:10px"
                @click="isShowAddContacts = true"
                type="primary"
              >新增联系人</el-button>
            </div>
          </div>

          <div class="head">
            <el-form-item label="任务名称" style="flex:1" prop="name">
              <el-input type="text" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item style="width:220px" label="优先级" prop="degreeType">
              <el-select v-model="form.degreeType" placeholder="请选择">
                <el-option
                  v-for="(item,index) in degreeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                  <div class="degree" :class="'type'+~~item.id">{{ item.id }}</div>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="任务内容" prop="content">
            <tinymce-editor ref="editor" v-model="form.content" v-if="showValue" @onClick="onClick"></tinymce-editor>
          </el-form-item>
          <el-form-item label="附件" prop="attachmentJa">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="`${$config.host}${$api.common.upload}`"
              name="multipartFile"
              multiple
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
            >
              <div class="upWrap">
                <el-button size="small" class="btn">上传文件</el-button>
                <div class="name-wrap">
                  <span class="tip"></span>
                </div>
              </div>
            </el-upload>
          </el-form-item>
          <div class="flex">
            <el-form-item label="预计时间" prop="predictTimeArr">
              <el-date-picker
                v-model="form.predictTimeArr"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="目标流水" prop="targetSerialNum">
              <el-input type="text" v-model="form.targetSerialNum"></el-input>
            </el-form-item>
            <el-form-item label="目标流量" prop="targetFlow">
              <el-input type="text" v-model="form.targetFlow"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="审批者顺序" prop="approvalPersonList">
            <div class="wrap">
              <div v-for="(item,index) in form.approvalPersonList" :key="index">
                <el-tag effect="plain" closable @close="handleClose('approvalPersonList',index)">
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
                  v-if="form.approvalPersonList&& index!==form.approvalPersonList.length-1"
                ></i>
              </div>
              <div class="block" v-if="approvalPersonList">
                <el-cascader
                  filterable
                  class="input-new-tag"
                  size="small"
                  ref="saveTagInput"
                  :props="{ expandTrigger: 'hover' }"
                  @change="(value)=>{handleInputConfirm(value,'approvalPersonList',0)} "
                  @visible-change="(isTrue)=>{visibleChange(isTrue,'approvalPersonList')} "
                  :options="options"
                  clearable
                ></el-cascader>
              </div>
              <i
                class="el-icon-circle-plus-outline addBtn"
                v-else
                @click="showInput('approvalPersonList')"
              ></i>
            </div>
          </el-form-item>
          <el-form-item label="任务完成者" prop="assignPersonList">
            <div class="wrap">
              <div v-for="(item,index) in form.assignPersonList" :key="index">
                <el-tag closable effect="plain" @close="handleClose('assignPersonList',index)">
                  <!-- <i class="el-icon-success" style="font-size: 15px;"></i> -->
                  {{item.userName}}
                </el-tag>
                <i
                  class="el-icon-arrow-right"
                  style="margin-right: 10px;"
                  v-if="form.assignPersonList&&index!==form.assignPersonList.length-1"
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
                ></el-cascader>
              </div>
              <i
                class="el-icon-circle-plus-outline addBtn"
                v-else
                @click="showInput('assignPersonList')"
              ></i>
            </div>
          </el-form-item>
          <el-form-item label="是否能转派" prop="reassignFlag">
            <el-switch v-model="form.reassignFlag" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="抄送给" prop="copyPersonList">
            <div class="wrap">
              <div v-for="(item,index) in form.copyPersonList" :key="index">
                <el-tag effect="plain" closable @close="handleClose('copyPersonList',index)">
                  <!-- <i class="el-icon-success" style="font-size: 15px;"></i> -->
                  {{item.userName}}
                </el-tag>
                <i
                  class="el-icon-arrow-right"
                  style="margin-right: 10px;"
                  v-if="form.copyPersonList&&index!==form.copyPersonList.length-1"
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
                v-else
                @click="showInput('copyPersonList')"
              ></i>
            </div>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in statusList"
                :key="index"
                :label="item.statusName"
                :value="item.statusValue+''"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="text" size="small" @click="createClone(true)">创建并克隆</el-button>
        <el-button type="primary" size="small" @click="createClone(false)">创建</el-button>
      </span>
    </el-dialog>
    <addUser
      :value.sync="isShowAddContacts"
      @listCustomerDetail="listCustomerDetail"
      :customerMasterId="form.customerMasterId"
    ></addUser>
  </div>
</template>

<script>
import TinymceEditor from "@/components/Tinymce";
import addUser from "./compontents/addUser";
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  components: {
    addUser,
    TinymceEditor
  },
  props: {
    taskId: {
      type: String,
      default: ""
    },
    demandId: {
      type: String,
      default: ""
    },
    isClone: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
        engineeringId: "",
        moduleId: "",
        phaseName: "",
        customerMasterId: "",
        customerDetailId: "",
        name: "",
        content: "",
        attachmentJa: [],
        predictFinishTime: "",
        degreeType: "5",
        predictBeginTime: "",
        schoolBookCode: "",
        targetSerialNum: "",
        predictTimeArr: [],
        targetFlow: "",
        targetOther: "",
        reassignFlag: 0, // 是否转派
        approvalPersonList: [], // 审批人
        assignPersonList: [], // 指派
        copyPersonList: [], // 抄送
        status: "0"
      },
      statusList: [],
      copyData: {},
      fileSize: "",
      fileName: "",
      departmentList: [],
      moduleList: [],
      oneSchoolList: [],
      customerList: [],
      fileList: [],
      menuList: [],
      phaseList: [],
      userList: [],
      rules: {
        schoolBookCode: [
          { required: true, message: "重点项目不能为空", trigger: "change" }
        ],
        engineeringId: [
          { required: true, message: "业务不能为空", trigger: "change" }
        ],
        moduleId: [
          { required: true, message: "模块不能为空", trigger: "change" }
        ],
        phaseName: [
          { required: false, message: "阶段不能为空", trigger: "change" }
        ],
        name: [
          { required: true, message: "任务名称不能为空", trigger: "change" }
        ],
        content: [
          { required: true, message: "任务内容不能为空", trigger: "change" }
        ],
        // predictBeginTime: [
        //   { required: true, message: "预计开始时间不能为空", trigger: "change" }
        // ],
        // predictFinishTime: [
        //   { required: true, message: "预计结束时间不能为空", trigger: "change" }
        // ],
        predictTimeArr: [
          { required: true, message: "预计时间不能为空", trigger: "change" }
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
        this.listTaskStatus();
        this.listDepartmentAndUser();
        this.listEngineeringMaster();
        this.listSchoolBook();
        this.listEngineeringModule();
        this.listCustomerMaster();
        if (this.taskId) {
          this.getTask();
        }
        if (this.demandId) {
          this.getDemand();
        }
      }
    }
  },
  mounted() {},
  methods: {
    async listSchoolBook() {
      const d = await this.post(this.$api.projectProgress.listSchoolBook);
      if (d.code === 0) {
        this.oneSchoolList = d.data;
      }
    },
    async listTaskStatus() {
      const d = await this.post(this.$api.projectProgress.listTaskStatus);
      if (d.code === 0) {
        this.statusList = d.data;
      }
    },
    async getDemand() {
      const d = await this.post(this.$api.projectProgress.getDemand, {
        demandId: this.demandId,
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
        this.currentOperator = d.data.currentOperator;
        this.fileList = this.form.attachmentJa;
        this.listCustomerDetail();
        this.listEngineeringModule();
        this.listEngineeringPhaseName();
      }
    },
    async getTask() {
      const d = await this.post(this.$api.projectProgress.getTask, {
        taskId: this.taskId,
        isClone: this.isClone
      });
      if (d.code === 0) {
        this.form;
        Object.assign(this.form, d.data);
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
        this.form.id = "";
        this.form.realBeginTime = "";
        this.form.realFinishTime = "";
        this.fileList = this.form.attachmentJa;
        this.listCustomerDetail();
        this.listEngineeringModule();
        this.listEngineeringPhaseName();
      }
    },
    async listEngineeringPhaseName() {
      if (this.form.engineeringId) {
        const d = await this.post(
          this.$api.projectProgress.listEngineeringPhaseName,
          {
            engineeringMasterId: this.form.engineeringId
          }
        );
        if (d.code === 0) {
          this.phaseList = d.data;
        }
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
      this.form.schoolBookCode = "";
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
      this.form.moduleId = "";
      this.form.phaseName = "";
      this.listEngineeringModule();
      this.listEngineeringPhaseName();
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
    onClick() {},
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
      this.$refs.upload.clearFiles();
      this.$emit("getList");
      this.showValue = false;
    },
    async createClone(isClone) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.projectProgress.addOrEditTask, {
            ...this.form,
            predictBeginTime: this.form.predictTimeArr[0],
            predictFinishTime: this.form.predictTimeArr[1],
            taskId: ""
          });
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
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  margin-bottom: 15px;
  max-height: 500px;
  padding: 10px;
  z-index: 0;
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
.flex {
  display: flex;
}
</style>
