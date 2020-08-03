<template>
  <div>
    <el-dialog
      :title="taskId?(read?'查看':'编辑任务'):'建任务'"
      :visible.sync="showValue"
      top="20px"
      :close-on-click-modal="false"
      width="96%"
      class="taskDialog"
      :before-close="clearData"
      append-to-body
    >
      <div class="dialog taskPop">
        <div class="scrollWrap">
          <el-form
            ref="form"
            :disabled="read"
            size="small"
            :rules="rules"
            :model="form"
            class="form"
            label-width="120px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="业务/项目/模块" prop="itemCodes">
                  <el-cascader
                    ref="itemCode"
                    v-model="form.itemCodes"
                    :options="menuList"
                    @change="changeItem"
                    :props="{ checkStrictly: true, value: 'itemCode', label: 'itemName', expandTrigger: 'hover' }"
                    clearable
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="阶段" prop="phaseName">
                  <el-select v-model="form.phaseName" placeholder="请选择">
                    <el-option
                      v-for="(item,index) in phaseList"
                      :key="index"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="任务性质" prop="characteristics">
                  <el-input type="text" readonly v-model="form.characteristics"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="立项项目" prop="projectId">
                  <el-select v-model="form.projectId" filterable clearable placeholder="请选择">
                    <el-option
                      v-for="(item,index) in projectList"
                      :key="index"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属计划" prop="yearPlanId">
                  <el-select v-model="form.yearPlanId" filterable clearable placeholder="请选择">
                    <el-option
                      v-for="(item,index) in scheduleList"
                      :key="index"
                      :label="item.title"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属月份" prop="monthPlanId">
                  <el-select
                    v-model="form.monthPlanId"
                    filterable
                    clearable
                    placeholder="请选择"
                    @change="changeMounth()"
                  >
                    <el-option
                      v-for="(item,index) in monthSchedule"
                      :key="index"
                      :label="item.belongTimeStr"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户" prop="customerMasterId">
                  <el-select
                    :disabled="isDefaultMaster"
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
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人" v-if="form.customerMasterId" prop="customerDetailId">
                  <el-select v-model="form.customerDetailId" filterable clearable placeholder="请选择">
                    <el-option
                      v-for="(item,index) in userList"
                      :key="index"
                      :label="item.customerContact"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="任务名称" prop="name">
                  <el-input type="text" v-model="form.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
              </el-col>
            </el-row>
            <el-form-item label="任务内容" prop="content">
              <tinymce-editor
                ref="editor"
                :showValue="showValue"
                :disabled="read"
                :isLoad="showValue"
                plugins="lists image preview fullscreen"
                :toolbar="['bold forecolor backcolor | fontsizeselect |fullscreen | alignleft aligncenter alignright alignjustify  lists image  table  | bullist numlist outdent indent | preview', '']"
                v-model="form.content"
                v-if="showValue"
              ></tinymce-editor>
            </el-form-item>
            <el-form-item label="附件" prop="attachmentJa">
              <fileUpload
                @getChildren="getUploadFile"
                :fileList="form.attachmentJa==undefined?[]:form.attachmentJa"
              ></fileUpload>
            </el-form-item>
            <template v-if="taskId">
              <el-form-item label="进展">
                <span
                  class="el-button el-button--primary el-button--small"
                  @click="addOrEditProgress('添加')"
                >添加进展</span>
                <!-- <span
                class="el-button el-button--primary el-button--small"
                @click="showMorePros('添加')"
                >查看更多进展</span>-->
                <!-- <el-button type="primary" @click="addOrEditProgress('添加')">添加进展</el-button> -->
                <!-- <el-button type="primary" @click="showMorePros()">查看更多进展</el-button> -->
                <span
                  class="el-button el-button--primary el-button--small"
                  @click="showMorePros()"
                >查看更多进展</span>
              </el-form-item>
              <div style="margin-bottom: 20px; padding-left: 120px;">
                <el-table :max-height="500" :data="tabData" size="small" border>
                  <el-table-column
                    v-for="(item, index) in tabColumns"
                    :key="index"
                    :prop="item.fieldName"
                    align="center"
                    :label="item.fieldLabel"
                    show-overflow-tooltip
                  ></el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope" v-if="scope.row.createBy==locaByUser">
                      <span
                        class="el-button el-button--text"
                        @click="addOrEditProgress('编辑',scope.row)"
                      >编辑</span>
                      <!-- <el-button type="text" v-else @click="addOrEditProgress('编辑',scope.row)">编辑</el-button> -->
                      <span
                        class="el-button el-button--text"
                        @click="addOrEditProgress('删除',scope.row.detailId)"
                      >删除</span>
                      <!-- <el-button
                      type="text"
                      v-if="scope.row.createBy==locaByUser"
                      @click="addOrEditProgress('删除',scope.row.detailId)"
                      >删除</el-button>-->
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
            <el-form-item label="任务预计时间" prop="predictTimeArr">
              <el-date-picker
                v-model="form.predictTimeArr"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="指标类型" prop="indexType">
                  <el-select
                    v-model="form.indexType"
                    placeholder="请选择"
                    @change="()=>listFinishRelation()"
                  >
                    <el-option
                      v-for="(item,index) in typeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="指标值" prop="targetValue">
                  <el-input disabled type="text" v-model="form.targetValue"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="unit" label-width="15px">
                  <el-select v-model="form.unit" placeholder="请选择">
                    <el-option
                      v-for="(item,index) in unitList"
                      :key="index"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="任务完成者" prop="finishListParam" required>
              <el-button type="primary" @click="showFinisher=true, finisher={}">添加任务完成者</el-button>
            </el-form-item>
          </el-form>
          <div style="padding-left: 120px;">
            <el-table
              :max-height="500"
              :data="form.finishListParam.finisherList"
              size="small"
              border
            >
              <el-table-column type="index" label="序号">
                <template slot-scope="scope">{{scope.$index+1}}</template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in form.finishListParam.labels"
                :key="index"
                :prop="item.fieldName"
                align="center"
                :label="item.fieldLabel"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div
                    v-if="item.fieldName === 'leaderScore' && $store.state.userInfo.data.directorFlag"
                  >
                    <span v-if="scope.row[item.fieldName]">{{scope.row[item.fieldName]}}</span>
                    <span
                      v-else
                      @click="getFinishByLeader(scope.row)"
                      style="color: #999;cursor: pointer;"
                    >请填写评分</span>
                  </div>
                  <span v-else>{{scope.row[item.fieldName]}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120px" fixed="right" align="center" label="操作" v-if="!read">
                <template slot-scope="scope">
                  <el-button type="text" @click="see(scope.row)">编辑</el-button>
                  <el-button type="text" style="color: red" @click="delRelation(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <span class="footerBtns">
          <!-- 编辑 -->
          <template v-if="taskId">
            <template v-if="!read">
              <!-- 创建者 -->
              <template v-if="form.createFlag">
                <el-button type="warning" size="small" @click="closeTask(5)">关闭任务</el-button>
                <template v-if="form.approveStatus <= 1||form.approveStatus==4||form.approveStatus==5">
                  <el-button type="success" size="small" @click="save">保存</el-button>
                </template>
                <template v-if="form.approveStatus === 1 && form.status !== 7">
                  <el-button type="danger" size="small" @click="recall">撤回重新申请</el-button>
                </template>
                <template v-if="form.status === 7">
                  <el-button type="primary" size="small" @click="save">重新提交</el-button>
                </template>
              </template>
              <!-- 审批者 未审批通过前 -->
              <template v-if="form.approveFlag && form.approveStatus === 1">
                <el-button type="success" size="small" @click="pass">审批</el-button>
                <el-button type="warning" size="small" @click="reject">拒绝</el-button>
              </template>

              <!-- 任务完成者 -->
              <template
                v-if="form.finishFlag && (form.approveStatus === 3 || form.approveStatus === 0)"
              >
                <el-button
                  v-if="form.status === 0"
                  type="success"
                  size="small"
                  @click="updateTaskStatus(1)"
                >开始任务</el-button>
                <el-button v-else type="success" size="small" @click="getFinishByOneself">完成任务</el-button>
              </template>
            </template>
            <el-button type="primary" plain size="small" @click="submit('clone')">克隆任务</el-button>
            <el-button type="primary" size="small" @click="pre0rNextTask(0)">上一个</el-button>
            <el-button type="primary" size="small" @click="pre0rNextTask(1)">下一个</el-button>
          </template>
          <!-- 创建 -->
          <template v-else>
            <el-button type="text" size="small" @click="submit('createClone')">创建并克隆</el-button>
            <el-button type="primary" size="small" @click="submit('create')">创建</el-button>
          </template>
        </span>
      </div>

      <!-- <span slot="footer">
        <template v-if="taskId">
          <template v-if="!read">
            <template v-if="form.createFlag">
              <el-button type="success" size="small" @click="save">保存</el-button>
              <el-button type="warning" size="small" @click="closeTask(5)">关闭任务</el-button>
            </template>
            <template v-if="form.approveFlag && form.approveStatus === 1">
              <el-button type="success" size="small" @click="pass">审批</el-button>
              <el-button type="warning" size="small" @click="reject">拒绝</el-button>
            </template>
            <el-button type="primary" plain size="small" @click="submit('clone')">克隆任务</el-button>
            <template
              v-if="form.finishFlag && (form.approveStatus === 3 || form.approveStatus === 0)"
            >
              <el-button
                v-if="form.status === 0"
                type="success"
                size="small"
                @click="updateTaskStatus(1)"
              >开始任务</el-button>
              <el-button v-else type="success" size="small" @click="getFinishByOneself">完成任务</el-button>
            </template>
          </template>

          <el-button type="primary" size="small" @click="pre0rNextTask(0)">上一个</el-button>
          <el-button type="primary" size="small" @click="pre0rNextTask(1)">下一个</el-button>
        </template>
        <template v-else>
          <el-button type="text" size="small" @click="submit('createClone')">创建并克隆</el-button>
          <el-button type="primary" size="small" @click="submit('create')">创建</el-button>
        </template>
      </span>-->

      <div class="CommentAndApprove" v-if="showValue&&approveShow">
        <approved
          v-if="!taskId"
          :formValue="form.approveListParam"
          :businessType="0"
          :copier="form.copierListParam"
          @approvedGroup="getApprovedGroup"
          @copierList="copierList"
        />
        <seeapproved
          v-else
          @approvedGroup="getApprovedGroup"
          @copierList="copierList"
          :formValue="form.approveListParam"
          :businessType="0"
          :isDemand="!read&&form.createFlag?'编辑':'查看'"
          :copier="form.copierListParam"
          :creatName="form.createName"
          :creatTime="form.createTime"
        />
        <comments
          v-if="showValue && taskId"
          ref="comments"
          :height="200"
          :businessType="0"
          :businessId="taskId"
        ></comments>
      </div>
    </el-dialog>
    <addFinisher
      :value.sync="showFinisher"
      :item="form"
      :finisher="finisher"
      @getList="listFinishRelation"
    ></addFinisher>
    <!-- <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile> -->
    <el-dialog :visible.sync="showScore" :close-on-click-modal="false" width="450" append-to-body>
      <div class="dialog">
        <el-form
          size="small"
          :model="scoreForm"
          :rules="scoreRules"
          ref="scoreForm"
          label-width="100px"
        >
          <el-form-item label="任务分值" prop="systemScore">
            <el-input v-model.number="scoreForm.systemScore" disabled type="number"></el-input>
          </el-form-item>
          <el-form-item label="超额数" prop="excessive">
            <el-input
              v-model.number="scoreForm.excessive"
              :disabled="$store.state.userInfo.data.directorFlag && !isFinisher"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="领导评分"
            prop="leaderScore"
            v-if="$store.state.userInfo.data.directorFlag && !isFinisher"
          >
            <el-input v-model.number="scoreForm.leaderScore" type="number"></el-input>
          </el-form-item>
          <el-form-item label="评分标准" prop="standard">
            <el-input
              v-model="scoreForm.standard"
              type="textarea"
              disabled
              :autosize="{minRows: 3, maxRows: 5}"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="clearScore">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="$store.state.userInfo.data.directorFlag && !isFinisher"
          @click="doFinishByLeader"
        >确 定</el-button>
        <el-button v-else type="primary" size="small" @click="doFinish">确 定</el-button>
      </div>
    </el-dialog>
    <addProgress
      :value.sync="showProgress"
      :formItem="form"
      :editData="editData"
      :itemId="itemId"
      @getList="pageByBusinessId"
    ></addProgress>
    <listProgress :value.sync="showMorePro" :formItem="form" @getList="pageByBusinessId"></listProgress>
  </div>
</template>

<script>
import TinymceEditor from "@/components/Tinymce";
import modalMixin from "@/mixins/modal";
import approved from "@/pages/policy/compontents/approved";
import seeapproved from "@/pages/policy/compontents/seeapproved";
import addFinisher from "@/components/createTask/compontents/addFinisher";
import Bus from "@/axios/bus";
import comments from "@/components/comment";
import fileUpload from "@/components/fileUpoad";
import addProgress from "@/components/createTask/compontents/addProgress";
import listProgress from "@/components/createTask/compontents/listProgress";

export default {
  mixins: [modalMixin],
  components: {
    TinymceEditor,
    approved,
    seeapproved,
    addFinisher,
    addProgress,
    listProgress,
    fileUpload,
    comments
  },
  props: {
    taskId: {
      type: String,
      default: ""
    },
    params: Object,
    read: {
      type: Boolean,
      default: false
    },
    defaultMaster: "",
    mounthId: ""
  },
  data() {
    return {
      // 是否显示审批人
      approveShow: true,
      locaByUser: "",
      editData: "",
      itemId: "",
      isFinisher: true,
      isDefaultMaster: false,
      showProgress: false,
      showMorePro: false,
      showScore: false,
      currFile: [],
      showFile: false,
      showFinisher: false,
      finisher: {},
      menuList: [],
      degreeList: [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
        { id: 5, name: "5" }
      ],
      phaseList: [],
      customerList: [],
      userList: [],
      typeList: [
        { label: "请选择", value: "" },
        { label: "百分比", value: "百分比" },
        { label: "数值", value: "数值" }
        // { label: "招生人数", value: "招生人数" },
        // { label: "招生老师人数", value: "招生老师人数" }
      ],
      scheduleList: [],
      monthSchedule: [],
      projectList: [],
      scoreForm: {
        id: "",
        systemScore: "",
        // oneselfScore: "",
        leaderScore: "",
        standard: "",
        excessive: ""
      },
      scoreRules: {
        // excessive: [
        //   {
        //     required: true,
        //     message: "超额数不能为空",
        //     trigger: "blur"
        //   }
        // ],
        leaderScore: [
          {
            required: true,
            message: "领导评分不能为空",
            trigger: "blur"
          }
        ]
      },
      tabData: [],
      tabColumns: [
        { fieldLabel: "进展类型", fieldName: "itemName" },
        { fieldLabel: "进展内容", fieldName: "content" },
        { fieldLabel: "创建人", fieldName: "createUserName" },
        { fieldLabel: "创建时间", fieldName: "createTime" },
        { fieldLabel: "客户", fieldName: "customName" }
      ],
      unitList: ["%", "万元", "人", "个", "元", "套", "台", "本"],
      form: {
        id: "",
        name: "",
        phaseName: "",
        content: "",
        degreeType: "",
        predictTimeArr: [],
        indexType: "",
        targetValue: 0,
        customerMasterId: "",
        customerDetailId: "",
        predictBeginTime: "",
        predictFinishTime: "",
        approveListParam: [],
        copierListParam: [],
        finishListParam: {},
        attachmentJa: [],
        itemCodes: [],
        progressList: [],
        status: 0,
        characteristics: "",
        unit: "",
        monthPlanId: "",
        projectId: "",
        yearPlanId: ""
      },
      rules: {
        itemCodes: [
          {
            required: true,
            message: "业务/项目/模块/不能为空",
            trigger: "change"
          }
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
          { required: true, message: "预计时间不能为空", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    showValue(val) {
      // 默认所属月计划
      if (this.$props.mounthId != undefined) {
        this.form.monthPlanId = this.$props.mounthId;
      }
      this.getLocalStorage("userInfo");
      if (val) {
        if (this.$props.defaultMaster != undefined) {
          this.form.customerMasterId = this.$props.defaultMaster;
          this.isDefaultMaster = true;
          this.listWithPriv();
        }
        this.form.id = this.taskId;
        this.listCustomerMaster();
        this.treeItem();
        this.listMonthPlan();
        this.$nextTick(() => {
          if (this.taskId) {
            this.getTask();
            this.pageByBusinessId();
          } else {
            this.draftTask();
          }
        });
      }
    }
  },
  mounted() {
    // 文件上传成功的回调
    // Bus.$on("fileSuccess", data => {
    //   this.form.attachmentJa.push(data);
    // });
  },
  methods: {
    // 所属月计划
    changeMounth() {
      this.approveShow = true;
      this.monthSchedule.forEach(item => {
        if (item.id == this.form.monthPlanId) {
          if (
            item.approveStatus == 1 ||
            item.approveStatus == 4 ||
            item.approveStatus == 5
          ) {
            this.approveShow = false;
            this.form.copyPersonList = [];
          }
        }
      });
    },
    recall() {
      this.$confirm("是否撤回?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.updateTaskStatus(7);
        })
        .catch(e => e);
    },

    getUploadFile(val) {
      this.form.attachmentJa = val;
    },
    async listMonthPlan() {
      const d = await this.post(this.$api.task.listMonthPlan);
      if (d.code === 0) {
        this.monthSchedule = d.data;
        this.changeMounth();
      }
    },
    async listProject() {
      const d = await this.post(this.$api.projectCreat.listProject, {
        itemCode: this.form.itemCodes[this.form.itemCodes.length - 1]
      });
      if (d.code === 0) {
        this.projectList = d.data;
      }
    },
    async listYearPlanDetail() {
      const d = await this.post(this.$api.projectCreat.listYearPlanDetail, {
        itemCode: this.form.itemCodes[this.form.itemCodes.length - 1]
      });
      if (d.code === 0) {
        this.scheduleList = d.data;
      }
    },
    getLocalStorage(key) {
      var value = localStorage.getItem(key);
      if (value) {
        value = JSON.parse(value);
        this.locaByUser = value.userId;
      } else {
        return false;
      }
    },
    showMorePros() {
      this.showMorePro = true;
      this.editData = "";
    },
    addOrEditProgress(type, data) {
      if (type == "添加") {
        this.showProgress = true;
        this.editData = "";
        this.itemId = "";
      }
      if (type == "编辑") {
        this.showProgress = true;
        this.editData = data.detailId;
        this.itemId = data.itemId;
      }
      if (type == "删除") {
        this.$confirm("删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delAjax(data);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    // 删除细表
    async delAjax(id) {
      const d = await this.post(this.$api.customer.deleteDetail, {
        id: id
      });
      if (d.code === 0) {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.pageByBusinessId();
      }
    },
    del(id, type) {
      this.$confirm("删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delAjax(id, type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //进展
    async pageByBusinessId() {
      const d = await this.post(this.$api.task.pageByBusinessId, {
        businessId: this.form.id,
        pageNum: 1,
        pageSize: 5
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.listFinishRelation()
      }
    },
    pass() {
      this.$confirm("是否确认审批通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => this.doApprove(1));
    },
    reject() {
      this.$prompt("拒绝原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(async ({ value }) => {
        const d = await this.post(this.$api.common.send, {
          businessType: "任务",
          businessId: this.form.id,
          comment: value,
          commentType: 2
        });
        this.doApprove(2);
      });
    },
    async doApprove(val) {
      const d = await this.post(this.$api.task.doApprove, {
        businessType: 0,
        businessId: this.form.id,
        operateStatus: val
      });
      if (d.code === 0) {
        this.$message.success("操作成功");
        this.clearData();
      }
    },
    async getFinishByOneself() {
      this.isFinisher = true;
      this.showScore = true;
      const d = await this.post(this.$api.task.getFinishByOneself, {
        businessType: 0,
        businessId: this.form.id
      });
      if (d.code === 0) {
        this.scoreForm = d.data;
      }
    },
    //领导评分回显
    async getFinishByLeader(item) {
      this.isFinisher = false;
      this.showScore = true;
      const d = await this.post(this.$api.task.getFinishByLeader, {
        id: item.id
      });
      if (d.code === 0) {
        this.scoreForm = d.data;
      }
    },
    clearScore() {
      this.isFinisher = true;
      this.showScore = false;
      this.scoreForm = {
        id: "",
        systemScore: "",
        oneselfScore: "",
        leaderScore: "",
        standard: ""
      };
    },
    async doFinish() {
      this.$refs.scoreForm.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.task.doFinish, {
            businessType: 0,
            businessId: this.form.id,
            oneselfScore: this.scoreForm.oneselfScore
          });
          if (d.code === 0) {
            this.$message.success("操作成功");
            this.clearScore();
            this.clearData();
            // this.listFinishRelation();
          }
        }
      });
    },
    async doFinishByLeader() {
      this.$refs.scoreForm.validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.task.doFinishByLeader,
            this.scoreForm
          );
          if (d.code === 0) {
            this.$message.success("操作成功");
            this.clearScore();
            this.listFinishRelation();
          }
        }
      });
    },
    async updateTaskStatus(status) {
      const d = await this.post(this.$api.task.updateTaskStatus, {
        id: this.form.id,
        status
      });
      if (d.code === 0) {
        this.$message.success("操作成功");
        this.clearData();
      }
    },
    //开始任务
    closeTask() {
      this.$confirm("是否确认关闭任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => this.updateTaskStatus(5));
    },
    //上一页 下一页
    async pre0rNextTask(val) {
      const d = await this.post(this.$api.task.pre0rNextTask, {
        ...this.params,
        id: this.form.id,
        nextFlag: val
      });
      if (d.code === 0) {
        this.form = {};
        this.form = d.data;
        if (d.data.predictBeginTime) {
          this.$set(this.form, "predictTimeArr", [
            this.form.predictBeginTime,
            this.form.predictFinishTime
          ]);
        }
      }
    },
    see(val) {
      this.finisher = val;
      this.showFinisher = true;
    },
    delRelation(id) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.task.delRelation, {
          id
        });
        if (d.code === 0) {
          this.$message.success("操作成功");
          this.listFinishRelation();
        }
      });
    },
    // 文件预览 start
    deleteFile(index) {
      this.form.attachmentJa.splice(index, 1);
    },
    showFilePop(val) {
      this.currFile = [val];
      this.showFile = true;
    },
    // 文件上传
    globalUpload() {
      let fieldFormat = [];
      // 打开文件选择框
      Bus.$emit("openUploader", { fieldFormat });
    },
    // 从子组件获取审批人和抄送人
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    },
    //任务完成者
    async listFinishRelation() {
      const d = await this.post(this.$api.task.listFinishRelation, {
        businessType: 0,
        businessId: this.form.id,
        indexType: this.form.indexType
      });
      if (d.code === 0) {
        this.form.finishListParam = d.data;
        this.form.targetValue = 0;
        if (this.form.indexType) {
          let num = 0;
          d.data.finisherList.map(item => {
            if (item.indexValue) {
              num = num * 100 + parseFloat(item.indexValue) * 100;
              // num = parseFloat(num) + parseFloat(item.indexValue);
              num = (num * 0.01).toFixed(2);
            }
          });
          if (!isNaN(num)) {
            this.form.targetValue = num;
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
    changeCustomer() {
      this.form.customerDetailId = "";
      this.listWithPriv();
    },
    //联系人
    async listWithPriv() {
      if (this.form.customerMasterId) {
        const d = await this.post(this.$api.task.list, {
          customerId: this.form.customerMasterId,
          itemId: 6
        });
        if (d.code === 0) {
          this.userList = d.data;
        }
      }
    },
    // async listCustomerDetail() {
    //   if (this.form.customerMasterId) {
    //     const d = await this.post(this.$api.customer.listCustomerDetail, {
    //       customerMasterId: this.form.customerMasterId
    //     });
    //     if (d.code === 0) {
    //       this.userList = d.data;
    //     }
    //   }
    // },
    //模块
    changeItem(val) {
      this.form.phaseName = "";
      if (this.form.itemCodes.length) {
        this.listPhase();
        this.listProject();
        this.listYearPlanDetail();
      }
      this.form.characteristics = "";
      let checkedArr = this.$refs.itemCode.getCheckedNodes();
      if (checkedArr[0].data.characteristics) {
        this.form.characteristics = checkedArr[0].data.characteristics;
      }
    },
    async treeItem() {
      const d = await this.post(this.$api.task.treeItem);
      if (d.code === 0) {
        this.menuList = d.data;
      }
    },
    //阶段
    async listPhase() {
      const d = await this.post(this.$api.task.listPhase, {
        itemCode: this.form.itemCodes[this.form.itemCodes.length - 1]
      });
      if (d.code === 0) {
        this.phaseList = d.data.phaseList;
      }
    },
    async draftTask() {
      const d = await this.post(this.$api.task.draftTask);
      if (d.code === 0) {
        this.form.id = d.data.id;
        this.listFinishRelation();
      }
    },
    async getTask() {
      const d = await this.post(this.$api.task.getTask, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.form = d.data;
        if (d.data.predictBeginTime) {
          this.$set(this.form, "predictTimeArr", [
            this.form.predictBeginTime,
            this.form.predictFinishTime
          ]);
        }
        this.listPhase();
        this.listProject();
        this.listYearPlanDetail();
        this.listWithPriv();
      }
    },
    clearForm() {
      this.$refs["form"].resetFields();
      this.form = {
        id: "",
        name: "",
        phaseName: "",
        content: "",
        degreeType: "",
        predictTimeArr: [],
        indexType: "",
        targetValue: 0,
        customerMasterId: "",
        customerDetailId: "",
        predictBeginTime: "",
        predictFinishTime: "",
        approveListParam: [],
        copierListParam: [],
        finishListParam: {},
        attachmentJa: [],
        itemCodes: [],
        progressList: [],
        status: 0,
        characteristics: "",
        monthPlanId: ""
      };
    },
    clearData() {
      this.clearForm();
      this.$emit("getList");
      this.showValue = false;
    },
    save() {
      if (this.form.status === 1 || this.form.status === 7) {
        this.$confirm("修改任务后将重新发起审批，是否发起?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.submit("save");
        });
      } else {
        this.submit("save");
      }
    },
    submit(flag) {
      if (flag === "clone") {
        this.cloneTask(1);
        return;
      }
      // if (
      //   this.form.approveListParam.length === 0 &&
      //   !this.$store.state.userInfo.data.directorFlag
      // ) {
      //   this.$message.error("审批人不能为空，请右边选择审批人");
      //   return;
      // }
      if (this.form.finishListParam.finisherList.length === 0) {
        this.$message.error("完成者不能为空，请添加完成者");
        return;
      }
      [
        this.form.predictBeginTime,
        this.form.predictFinishTime
      ] = this.form.predictTimeArr;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (flag === "createClone") {
            this.cloneTask(0);
          } else if (flag === "save" || flag === "create") {
            this.addOrEditTask();
          }
        }
      });
    },
    setTaskId(val) {
      this.$emit("setTaskId", val);
    },
    async cloneTask(val) {
      const d = await this.post(this.$api.task.cloneTask, {
        cloneType: val,
        ...this.form
      });
      if (d.code === 0) {
        this.clearForm();
        this.setTaskId("");
        this.$message.success("操作成功");
        this.form = d.data;
        if (d.data.predictBeginTime) {
          this.$set(this.form, "predictTimeArr", [
            this.form.predictBeginTime,
            this.form.predictFinishTime
          ]);
        }
      }
    },
    async addOrEditTask() {
      const d = await this.post(this.$api.task.addOrEditTask, {
        cloneType: 0,
        ...this.form,
        republishFlag: this.form.status === 7 ? 1 : 0
      });
      if (d.code === 0) {
        this.$message.success("操作成功");
        this.clearData();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}

.taskDialog {
  /deep/ .el-dialog__body {
    display: flex;
  }
  .dialog.taskPop {
    position: relative;
    flex: 1;
    min-width: 0;
    // max-height: 600px;
    padding: 10px;
    width: 100%;
    padding: 15px 0;
    // padding-bottom: 65px;
    background-color: #fff;
    // height: calc(100vh - 160px);
    .scrollWrap {
      // height: 100%;
      padding-right: 10px;
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
  /deep/ .form {
    .el-range-editor.is-disabled input,
    .el-range-editor.is-disabled,
    .el-input.is-disabled .el-input__inner {
      background-color: #fff;
      border-color: rgb(220, 223, 230);
      color: rgb(96, 98, 102);
    }
  }
  /deep/ .el-dialog__body {
    padding-right: 0;
    padding-bottom: 0;
  }
  .footerBtns {
    // position: absolute;
    // bottom: 0;
    // right: 0;
    display: flex;
    justify-content: flex-end;
    padding: 15px;
    width: 100%;
    text-align: right;
    background-color: #fff;
    z-index: 9;
  }
}
</style>
