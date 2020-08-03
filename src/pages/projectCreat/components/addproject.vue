<template>
  <div class="all">
    <div class="left">
      <el-form
        ref="form"
        size="small"
        :rules="rules"
        :model="form"
        class="form"
        label-width="120px"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="业务/项目/模块" prop="itemCode">
              <el-cascader
                v-model="form.itemCode"
                :props="{ checkStrictly: true, value: 'itemCode', label: 'itemName', expandTrigger: 'hover' }"
                :options="menuList"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="类别" prop="type">
              <el-select v-model="form.type" placeholder="请选择类别" clearable>
                <el-option
                  v-for="(item,index) in TypeList"
                  :key="index"
                  :label="item.value"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="项目周期" prop="projectCycle">
              <el-date-picker
                v-model="form.projectCycle"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="项目负责人" prop="principalId">
              <el-cascader
                :props="{ expandTrigger: 'hover' }"
                v-model="form.principalId"
                :options="DepartmentAndUserList"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="7">
          <el-form-item label="申请部门" prop="customerType">
            <el-select v-model="form.customerType" placeholder="请选择申请部门" clearable>
              <el-option
                v-for="(item,index) in DarpartMentList"
                :key="index"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题" prop="title">
              <el-input type="textarea" rows="1" v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="10">
          <el-form-item label="预算（万元）" prop="customerType">
            <el-input type="textarea" rows="1" v-model="form.summary"></el-input>
          </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目概括" prop="summary">
              <el-input type="textarea" v-model="form.summary" placeholder="国内外同类研究情况，包括技术水平"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目目标" prop="customerType">
              <el-table size="mini" style="width: 100%" :data="projectTargetTable">
                <el-table-column label="序号" width="180" type="index" :index="indexMethod"></el-table-column>
                <el-table-column prop="indexType" label="项目类型"></el-table-column>
                <el-table-column prop="targetValue" label="指标值"></el-table-column>
                <el-table-column prop="date" label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="editRow(scope, projectTargetTable)"
                      type="text"
                      size="small"
                    >编辑</el-button>
                    <el-button
                      @click.native.prevent="deleteRow(scope, projectTargetTable,'index')"
                      type="text"
                      size="small"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align:center">
                <i class="el-icon-circle-plus-outline add" @click="addMoreTargetFn()"></i>
              </div>
            </el-form-item>
            <el-dialog append-to-body :visible.sync="addMoreTarget" width="500px">
              <div style="display:flex">
                <span class="form-label">指标类型：</span>
                <el-select size="mini" v-model="indexs" placeholder="请选择">
                  <el-option
                    v-for="item in indexType"
                    :key="item.value"
                    :label="item.code"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div style="display:flex;margin-top:10px;">
                <span class="form-label">指标值：</span>
                <el-input size="mini" v-model="indexsValue" type="number" placeholder="请输入内容"></el-input>
              </div>
              <div class="btnWarp">
                <el-button type="primary" size="mini" @click="addMoreTarget=false">取消</el-button>
                <el-button type="primary" size="mini" @click="addprojectTarget()">确认</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="市场分析" prop="customerType">
              <el-input
                type="textarea"
                v-model="form.marketAnalysis"
                placeholder="需求、经济、社会、生态效益、目标客户等分析"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="主要研究内容、技术关键、开发内容/功能" prop="customerType">
              <el-input
                rows="6"
                type="textarea"
                v-model="form.content"
                placeholder="主要研究内容、技术关键、开发内容/功能"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="实施方案" prop="implementationPlan">
              <el-input
                rows="6"
                type="textarea"
                v-model="form.implementationPlan"
                placeholder="包括运营计划等"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="已有条件分析" prop="existingConditionsAnalysis">
              <el-input
                rows="6"
                type="textarea"
                v-model="form.existingConditionsAnalysis"
                placeholder="包括原有基础、技术力量的投入、科研手段和研究成果的生产或应用去向"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="经费来源" prop="customerType">
              <el-input rows="1" type="textarea" v-model="form.fundingSource"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预期目标" prop="expectedGoal">
              <el-input
                rows="6"
                type="textarea"
                v-model="form.expectedGoal"
                placeholder="要达到的主要技术经济指标；知识产权申请情况
数字化目标（至少3个）
关键性目标（至少3个）"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目预算" prop="customerType">
              <el-table
                :summary-method="getSummaries"
                :show-summary="true"
                size="mini"
                style="width: 100%"
                :data="projectButGetTable"
              >
                <el-table-column label="序号" width="50" type="index" :index="indexMethod"></el-table-column>
                <el-table-column prop="expenditure" label="经费支出" width="150"></el-table-column>
                <el-table-column prop="budget" label="金额（元）" width="150"></el-table-column>
                <el-table-column prop="calculateBasis" label="测算依据"></el-table-column>
                <el-table-column prop="date" label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="editButGetRow(scope, projectButGetTable)"
                      type="text"
                      size="small"
                    >编辑</el-button>
                    <el-button
                      @click.native.prevent="deleteRow(scope, projectButGetTable,'butget')"
                      type="text"
                      size="small"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align:center">
                <i class="el-icon-circle-plus-outline add" @click="addMoreButGetFn()"></i>
              </div>
            </el-form-item>
            <el-dialog append-to-body :visible.sync="addMoreButGet" width="500px">
              <div style="display:flex">
                <span class="form-label">经费支出：</span>
                <el-input size="mini" v-model="expenditure" placeholder="请输入内容"></el-input>
              </div>
              <div style="display:flex;margin-top:10px;">
                <span class="form-label">金额：</span>
                <el-input size="mini" type="number" v-model="budget" placeholder="请输入内容"></el-input>
              </div>
              <div style="display:flex;margin-top:10px;">
                <span class="form-label">测算依据：</span>
                <el-input type="textarea" size="mini" v-model="calculateBasis" placeholder="请输入内容"></el-input>
              </div>
              <div class="btnWarp">
                <el-button type="primary" size="mini" @click="addMoreButGet=false">取消</el-button>
                <el-button type="primary" size="mini" @click="addprojectButGet()">确认</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-row>
        <el-row v-if="form.projectWorkList">
          <el-col :span="24">
            <el-form-item label="项目分工" prop="customerType">
              <el-table size="mini" style="width: 100%" :data="form.projectWorkList.list">
                <el-table-column label="序号" width="50" type="index" :index="indexMethod"></el-table-column>
                <el-table-column
                  v-for="(item, index) in form.projectWorkList.columnList"
                  :key="index"
                  :prop="item.fieldName"
                  :width="item.width"
                  align="center"
                  :label="item.fieldLabel"
                  :sortable="(item.orderByName ==='' || item.orderByName==null)?false:'custom'"
                  :show-overflow-tooltip="item.fieldName!=='progressDtoStr'"
                >
                  <template slot-scope="scope">
                    <el-link
                      type="primary"
                      v-if="scope.column.property ==='content'"
                      @click="showContent(scope.row)"
                    >查看详情</el-link>

                    <div
                      style="display: flex;justify-content: center;"
                      v-else-if="scope.column.property ==='degreeType'"
                    >
                      <div
                        class="degree"
                        :class="'type'+~~scope.row[item.fieldName]"
                      >{{scope.row[item.fieldName]}}</div>
                    </div>
                    <el-tooltip
                      placement="left"
                      v-else-if="scope.column.property ==='progressDtoStr'&&scope.row[item.fieldName]"
                    >
                      <div slot="content" v-html="scope.row[item.fieldName]"></div>
                      <span class="oe">{{scope.row[item.fieldName]}}</span>
                    </el-tooltip>

                    <span v-else>{{scope.row[item.fieldName]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.projectTaskList">
          <el-col :span="24">
            <el-form-item label="项目进度" prop="customerType">
              <el-table size="mini" style="width: 100%" :data="form.projectTaskList.list">
                <el-table-column label="序号" width="50" type="index" :index="indexMethod"></el-table-column>
                <el-table-column
                  v-for="(item, index) in form.projectTaskList.columnList"
                  :key="index"
                  :prop="item.fieldName"
                  :width="item.width"
                  align="center"
                  :label="item.fieldLabel"
                  :sortable="(item.orderByName ==='' || item.orderByName==null)?false:'custom'"
                  :show-overflow-tooltip="item.fieldName!=='progressDtoStr'"
                >
                  <template slot-scope="scope">
                    <div
                      placement="Top Left"
                      v-if="scope.column.property ==='content'&&scope.row[item.fieldName]"
                    >
                      <span class="oe seemore">
                        <el-tooltip popper-class="yes" placement="top">
                          <div slot="content" v-html="scope.row[item.fieldName]"></div>
                          <el-button type="text">查看详情</el-button>
                        </el-tooltip>
                      </span>
                    </div>

                    <div
                      style="display: flex;justify-content: center;"
                      v-else-if="scope.column.property ==='degreeType'"
                    >
                      <div
                        class="degree"
                        :class="'type'+~~scope.row[item.fieldName]"
                      >{{scope.row[item.fieldName]}}</div>
                    </div>
                    <el-tooltip
                      placement="left"
                      v-else-if="scope.column.property ==='progressDtoStr'&&scope.row[item.fieldName]"
                    >
                      <div slot="content" v-html="scope.row[item.fieldName]"></div>
                      <span class="oe">{{scope.row[item.fieldName]}}</span>
                    </el-tooltip>

                    <span v-else>{{scope.row[item.fieldName]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="附件" prop="customerType">
              <fileUpload
                @getChildren="getFileList"
                :fileList="form.attachmentJa==undefined?[]:form.attachmentJa"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="btnWarp">
        <el-button v-if="this.$props.iscreatId==''" type="primary" size="mini" @click="creat()">创建</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="form.approveFlag==true"
          @click="agreeApprove(1)"
        >审批</el-button>
        <el-button
          type="text"
          size="small"
          v-if="form.approveFlag==true"
          @click="agreeApprove(2)"
        >拒绝</el-button>
        <el-button
          type="primary"
          size="small"
          @click="returnItem(form.id)"
          v-if="form.createFlag&&form.republish==0&&!form.passFlag"
        >撤回修改</el-button>
        <el-button
          type="primary"
          size="small"
          @click="republish(form.id)"
          v-if="form.createFlag&&form.republish==1"
        >重新发布</el-button>
        <el-button
          type="primary"
          size="small"
          @click="startCheck(form.id)"
          v-if="form.acceptanceStatus==0"
        >发起验收</el-button>
        <!-- v-if="form.isAcceptanceFlag==true" -->
        <el-button
          type="primary"
          size="small"
          v-if="form.isAcceptanceFlag==true"
          @click="Checked(form.id)"
        >验收</el-button>
      </div>
    </div>
    <el-dialog title="验收" :visible.sync="CheckedDialog" width="30%" append-to-body>
      <el-radio v-model="checkedFlag" label="1">通过</el-radio>
      <el-radio v-model="checkedFlag" label="2">拒绝</el-radio>
      <div style="display:flex;margin-top:30px;">
        <span style="width:50px;display:flex;align-items:center;">理由：</span>
        <el-input type="text" size="mini" v-model="checkedReason" placeholder="请输入内容"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="CheckedDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doAcceptance">确 定</el-button>
      </span>
    </el-dialog>
    <div class="CommentAndApprove">
      <approve
        @approvedGroup="getApprovedGroup"
        @copierList="copierList"
        @acceptancePersonList="acceptancePersonList"
        :businessType="6"
        :creatName="form.createUserName"
        :creatTime="form.createTime"
        :copier="form.copyPersonList"
        :formValue="form.approvalPersonList"
        :checkedParams="form.acceptancePersonList"
        :isDemand="isDemand"
        :isChecked="'验收'"
      />
      <comments
        v-if="form.id!=''"
        ref="comments"
        :height="200"
        :businessType="6"
        :businessId="form.id"
      ></comments>
    </div>
  </div>
</template>

<script>
import comments from "@/components/comment";
import approve from "../../policy/compontents/seeapproved";
import fileUpload from "@/components/fileUpoad";
export default {
  components: { fileUpload, approve, comments },
  props: { defaultForm: "", iscreatId: "" },
  data() {
    return {
      checkedFlag: "1",
      checkedReason: "",
      CheckedDialog: false,
      isDemand: "创建",
      // 编辑的下标
      editOrAdd: "",
      _index: "",
      indexs: "",
      indexsValue: "",
      // 预算数据
      expenditure: "",
      budget: "",
      calculateBasis: "",
      TypeList: [],
      indexType: [
        { label: "流水", value: "0" },
        { label: "流量", value: "1" },
        { label: "教师数", value: "2" },
        { label: "学生数", value: "3" }
      ],
      addMoreButGet: false,
      addMoreTarget: false,
      menuList: [],
      DepartmentAndUserList: [],
      projectTargetTable: [],
      projectButGetTable: [],
      form: {},
      rules: {
        itemCode: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        type: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        projectCycle: [
          { required: true, message: "请输入项目周期", trigger: "blur" }
        ],
        principalId: [
          { required: true, message: "请输入项目负责人", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        summary: [
          { required: true, message: "请输入项目概括", trigger: "blur" }
        ],
        implementationPlan: [
          { required: true, message: "请输入实施方案", trigger: "blur" }
        ],
        expectedGoal: [
          { required: true, message: "请输入预期目标", trigger: "blur" }
        ],
        existingConditionsAnalysis: [
          { required: true, message: "请输入已有条件分析", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.form = this.$props.defaultForm;
    // this.form.projectCycle = ''
    this.treeItem();
    this.listProjectIndex();
    this.listDepartmentAndUser();
    this.listProjectBudget();
    this.listDictBasicObjByName("PROJECT_INDEX_TYPE");
    this.listDictBasicObjByName("PROJECT_TYPE");
    if (this.$props.iscreatId == "") {
      this.isDemand = "编辑";
    } else if (this.form.republish == "1") {
      this.isDemand = "编辑";
    } else {
      this.isDemand = "查看";
    }
  },
  methods: {
    async agree(status, value) {
      const d = await this.post(this.$api.approve.doApprove, {
        businessType: "6",
        businessId: this.form.id,
        operateStatus: status,
        comment: value
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.seeDetail();
      }
    },
    agreeApprove(status) {
      this.$prompt("请输入理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          // this.sendReson("1", value);
          this.agree(status, value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    async seeDetail(id) {
      const d = await this.post(this.$api.projectCreat.getProject, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.form = d.data;
      }
    },
    async launchAcceptance() {
      const d = await this.post(this.$api.projectCreat.launchAcceptance, {
        ...this.form
      });
      if (d.code === 0) {
        this.$emit("clear");
      }
    },
    async doAcceptance() {
      const d = await this.post(this.$api.projectCreat.doAcceptance, {
        businessType: "6",
        businessId: this.form.id,
        operateStatus: this.checkedFlag,
        comment: this.checkedReason
        // ...this.form
      });
      if (d.code === 0) {
        this.$emit("clear");
      }
    },
    Checked() {
      this.CheckedDialog = true;
      // this.$confirm(" 是否验收?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.doAcceptance();
      //   })
      //   .catch(val => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消发起验收"
      //     });
      //   });
    },
    startCheck() {
      if (this.form.acceptancePersonList.length == 0) {
        this.$message({
          type: "warning",
          message: "验收人不能为空"
        });
      } else {
        this.$confirm("该操作将发起验收, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.launchAcceptance();
          })
          .catch(val => {
            this.$message({
              type: "info",
              message: "已取消发起验收"
            });
          });
      }
    },
    async republishAjax() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.projectCreat.addOrEditProject, {
            ...this.form
          });
          if (d.code === 0) {
            this.$emit("clear");
          }
        }
      });
    },
    republish() {
      this.$confirm("重新发起立项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.republishAjax();
        })
        .catch(val => {
          this.$message({
            type: "info",
            message: "已取消重新发起"
          });
        });
    },
    // 撤回立项
    returnItem(id) {
      this.$confirm("此操作将撤回该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.returnAjax(id);
        })
        .catch(val => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    async returnAjax(id) {
      const d = await this.post(this.$api.projectCreat.returnBack, {
        id: id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.$emit("clear");
        // this.getList();
      }
    },
    acceptancePersonList(params) {
      this.form.acceptancePersonList = params;
    },
    getApprovedGroup(params) {
      this.form.approvalPersonList = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (index === 2) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += " 元";
          } else {
            sums[index] = "";
          }
          return;
        }
      });

      return sums;
    },
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.DepartmentAndUserList = d.data;
        // this.isLoad = true;
      }
    },
    async treeItem() {
      const d = await this.post(this.$api.task.treeItem);
      if (d.code === 0) {
        this.menuList = d.data;
      }
    },
    getFileList(params) {
      this.form.attachmentJa = params;
    },
    async listDictBasicObjByName(dictName) {
      const d = await this.post(this.$api.policy.listDictBasicObjByName, {
        dictName: dictName
      });
      if (d.code === 0) {
        if (dictName === "PROJECT_INDEX_TYPE") {
          this.indexType = d.data;
        }
        if (dictName === "PROJECT_TYPE") {
          this.TypeList = d.data;
        }
      }
    },
    // 获取立项指标列表
    async listProjectIndex() {
      const d = await this.post(this.$api.projectCreat.listProjectIndex, {
        masterId: this.$props.defaultForm.id
      });
      if (d.code === 0) {
        this.projectTargetTable = d.data;
      }
    },
    // 添加项目指标
    addMoreTargetFn() {
      this.editOrAdd = 2;
      this.indexs = "";
      this.indexsValue = "";
      this.addMoreTarget = true;
    },
    // 添加预算
    addMoreButGetFn() {
      this.editOrAdd = 2;
      this.expenditure = "";
      this.budget = "";
      this.calculateBasis = "";
      this.addMoreButGet = true;
    },
    // 确认添加编辑预算
    async addprojectButGet(id) {
      if (this.editOrAdd == 2) {
        id = "";
      } else {
        id = this.projectButGetTable[this._index].id;
        this.projectButGetTable[this._index].indexType = this.indexs;
        this.projectButGetTable[this._index].targetValue = this.indexsValue;
      }
      const d = await this.post(this.$api.projectCreat.addOrEditProjectBudget, {
        id: id,
        masterId: this.$props.defaultForm.id,
        budget: this.budget,
        expenditure: this.expenditure,
        calculateBasis: this.calculateBasis
      });
      if (d.code === 0) {
        this.listProjectBudget();
        this.addMoreButGet = false;
      }
    },
    async addprojectTarget(id) {
      if (this.editOrAdd == 2) {
        id = "";
      } else {
        id = this.projectTargetTable[this._index].id;
        this.projectTargetTable[this._index].indexType = this.indexs;
        this.projectTargetTable[this._index].targetValue = this.indexsValue;
      }

      const d = await this.post(this.$api.projectCreat.addOrEditProjectIndex, {
        id: id,
        masterId: this.$props.defaultForm.id,
        indexType: this.indexs,
        targetValue: this.indexsValue
      });
      if (d.code === 0) {
        this.listProjectIndex();
        this.addMoreTarget = false;
      }
    },
    async del(id) {
      const d = await this.post(this.$api.projectCreat.delProjectIndex, {
        id: id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.listProjectIndex();
      }
    },
    async delbutget(id) {
      const d = await this.post(this.$api.projectCreat.delProjectBudget, {
        id: id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.listProjectBudget();
      }
    },
    async deleteRow(scope, rows, type) {
      this.$confirm("此操作将删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type == "index") {
            this.del(scope.row.id);
          }
          if (type == "butget") {
            this.delbutget(scope.row.id);
          }
        })
        .catch(val => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editRow(data, rows) {
      this.editOrAdd = 1;
      this._index = data.$index;
      this.indexs = data.row.indexType;
      this.indexsValue = data.row.targetValue;
      this.addMoreTarget = true;
    },
    editButGetRow(data, rows) {
      this.editOrAdd = 1;
      this._index = data.$index;
      this.expenditure = data.row.expenditure;
      this.budget = data.row.budget;
      this.calculateBasis = data.row.calculateBasis;
      this.addMoreButGet = true;
    },
    // 获取立项预算列表
    async listProjectBudget() {
      const d = await this.post(this.$api.projectCreat.listProjectBudget, {
        masterId: this.$props.defaultForm.id
      });
      if (d.code === 0) {
        this.projectButGetTable = d.data;
      }
    },
    indexMethod(index) {
      return index + 1;
    },
    async creat() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.projectCreat.addOrEditProject, {
            ...this.form
          });
          if (d.code === 0) {
            this.$emit("clear");
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-date-editor {
  width: 100% !important;
}
/deep/ .el-select {
  width: 100% !important;
}
/deep/ .el-input {
  width: 100% !important;
}
/deep/ .el-cascader {
  width: 100% !important;
}
.add {
  line-height: 40px;
  color: #333333;
  font-size: 20px;
  margin-left: -4px;
}
.form-label {
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: flex-end;
}
.btnWarp {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  padding-bottom: 20px;
}
.all {
  display: flex;
}
.left {
  flex: 1;
  min-width: 0;
}
.right {
  border-left: 1px solid #eee;
  margin-left: 20px;
  width: 340px;
}
.rightComponent {
  border-left: none !important;
}
</style>