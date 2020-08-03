<template>
  <div class="all">
    <div class="left">
      <el-form ref="form" size="small" :model="form" class="form" label-width="60px">
        <el-row>
          <el-col style="width:280px">
            <el-form-item label="年份" prop="belongYear">
              <el-select v-model="form.belongYear" @change="getYearPlan()">
                <el-option
                  v-for="(item,index) in yearData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="width:280px">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="form.departmentId" @change="changeDepartment" placeholder="请选择部门">
                <el-option
                  v-for="(item,index) in DepartmentList"
                  :key="index"
                  :label="item.departmentName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="width:280px">
            <el-form-item label="负责人" prop="itemCodes">
              <el-select v-model="form.principleId">
                <el-option
                  v-for="(item,index) in userByDepartmentIdList"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
              <!-- <el-input type="text" v-model="form.belongMonth"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tableWarp">
        <div class="btns" style="padding-bottom:10px">
          <el-button
            type="primary"
            size="small"
            :disabled="form.id==''||form.id==undefined"
            @click="showUpTask = true,upTaskId=''"
          >新建</el-button>
          <el-button type="primary" size="small" @click="exportShow=true">导出</el-button>
          <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
          <el-button
            class="clounmTitle"
            icon="el-icon-search"
            @click="isShowSearch = !isShowSearch;"
            size="small"
          >搜索</el-button>
        </div>
        <el-table :data="tabData" size="small">
          <el-table-column type="index" label="序号">
            <template slot-scope="scope">{{scope.$index+(currentPage-1)*pageSize+1}}</template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tabClounm"
            :key="index"
            :prop="item.fieldName"
            :width="item.width"
            align="center"
            :label="item.fieldLabel"
            :sortable="(item.orderByName ==='' || item.orderByName==null)?false:'custom'"
            :show-overflow-tooltip="item.fieldName!=='progressDtoStr'"
          ></el-table-column>
          <el-table-column width="180px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="upTaskId=scope.row.id,showUpTask=true">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <dragTable
          ref="dragTab"
          :tableData="dragColumn"
          @exitDialog="exitDialog"
          :dragTabShow="dragTabShow"
          @listTableColumn="listTableColumn"
          @saveClounm="saveClounm"
        ></dragTable>
        <exportPage
          :exportData="exportData"
          ref="exportTab"
          :exportShow="exportShow"
          @exitExport="exitExport"
          @saveExport="saveExport"
        ></exportPage>
      </div>
      <div class="btnWarp">
        <el-button
          v-if="form.createFlag==true&&~~form.approveStatus===0"
          type="primary"
          @click="startApprove(1)"
          size="small"
        >发起审批</el-button>
        <el-button
          v-if="form.approveFlag==true&&~~form.approveStatus===1"
          type="primary"
          @click="agreeApprove(1)"
          size="small"
        >审批</el-button>
        <el-button
          v-if="form.approveFlag==true&&~~form.approveStatus===1"
          @click="agreeApprove(2)"
          type="primary"
          size="small"
        >拒绝</el-button>
        <el-button type="primary" size="small" @click="save()">保存</el-button>
      </div>
    </div>
    <div class="right CommentAndApprove">
      <seeapprove
        :isDemand="form.approveStatus==1?'查看':'编辑'"
        @approvedGroup="getApprovedGroup"
        @copierList="copierList"
        :formValue="form.approveListParam"
        :copier="form.copierListParam"
        :businessType="9"
        :creatName="form.createUserName"
        :creatTime="form.updateTime"
      />
      <comments
        v-if="form.id!=''"
        ref="comments"
        :height="200"
        :businessType="9"
        :businessId="form.id"
      ></comments>
    </div>
    <el-dialog
      width="96%"
      min-width="1300px;"
      top="20px"
      height="100%"
      custom-class="dialogClss"
      title
      :visible.sync="showUpTask"
      append-to-body
    >
      <creatdetail v-if="showUpTask" @clear="updateList" :masterId="form.id" :id="upTaskId" />
    </el-dialog>
  </div>
</template>

<script>
import comments from "@/components/comment";
import commonMix from "@/mixins/common";
import seeapprove from "../../policy/compontents/seeapproved";
import creatdetail from "./creatdetail";
export default {
  props: { tableDatas: Array, formData: Object },
  mixins: [commonMix],
  components: { seeapprove, comments, creatdetail },
  data() {
    return {
      DepartmentList: [],
      userByDepartmentIdList: [],
      active: "",
      departmentName: "",
      belongYear: "",
      belongMonth: "",
      canEdit: "编辑",
      upTaskId: "",
      yearData: [],
      MounthData: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      type: "1",
      showUpTask: false,
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_year_plan_detail",
        moduleName: "list"
      },
      defaultForm: {},
      form: {
        id: "",
        belongYear: "",
        departmentId: ""
      },
      tabData: [],
      tabClounm: [],
      userList: [],
      rules: {
        belongYear: [
          { required: true, message: "年份不能为空", trigger: "change" }
        ],
        departmentId: [{ required: true, message: "部门不能为空", trigger: "change" }],
        applyDepartId: [
          { required: true, message: "提报部门不能为空", trigger: "blur" }
        ],
        period: [
          { required: true, message: "时间不能为空", trigger: "change" }
        ],
        coopNature: [
          { required: true, message: "事项性质不能为空", trigger: "change" }
        ],
        coopTarget: [
          { required: true, message: "事项目标不能为空", trigger: "change" }
        ],
        recordUserIdArr: [
          { required: true, message: "记录人不能为空", trigger: "change" }
        ],
        coopDetails: [
          { required: true, message: "协同事项详情不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.form = this.$props.formData;
    // 获取年份
    this.getDate();
    // 获取部门
    this.getDepartment();
    this.getlistYearPlanDetail();
  },
  methods: {
    // 发起审批
    async startApproveAjax() {
      const d = await this.post(this.$api.yearplan.submitApprove, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "发起成功!"
        });
        this.$emit("clear");
      }
    },
    startApprove() {
      this.$confirm("发起审批后将无法编辑该计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.startApproveAjax();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    updateList() {
      this.showUpTask = false;
      this.getlistYearPlanDetail();
    },
    // 获取年计划细项
    async getlistYearPlanDetail(id) {
      if (this.form.id != "" && this.form.id != undefined) {
        const d = await this.post(this.$api.yearplan.listYearPlanDetail, {
          masterId: this.form.id
        });
        if (d.code === 0) {
          this.tabData = d.data;
        }
      }
    },
    // 根据年份部门获取年计划，无则返回草稿
    async getYearPlan() {
      if (this.form.departmentId == "" || this.form.departmentId == undefined) {
        this.$message({
          message: "请选择部门",
          type: "warning"
        });
      } else if (this.form.belongYear == "") {
        this.$message({
          message: "请选择年份",
          type: "warning"
        });
      } else {
        const d = await this.post(this.$api.yearplan.getYearPlanByYear, {
          belongYear: this.form.belongYear,
          departmentId: this.form.departmentId
        });
        if (d.code === 0) {
          this.form = d.data;
          this.getlistYearPlanDetail();
        }
      }
    },
    // 获取部门
    async getDepartment() {
      const d = await this.post(this.$api.projectManage.listAllDepartment);
      if (d.code === 0) {
        this.DepartmentList = d.data;
        // 有部门ID时请求该部门下的人员
        if (this.form.departmentId && this.form.departmentId != "") {
          const c = await this.post(
            this.$api.projectManage.listUserByDepartmentId,
            { departmentId: this.form.departmentId }
          );
          if (c.code === 0) {
            this.userByDepartmentIdList = c.data;
          }
        }
      }
    },
    // 获取部门下的用户
    async changeDepartment(id) {
      const d = await this.post(
        this.$api.projectManage.listUserByDepartmentId,
        { departmentId: id }
      );
      if (d.code === 0) {
        this.userByDepartmentIdList = d.data;
        this.getYearPlan();
      }
    },
    async getMonthPlanByYearAndMonth() {
      const d = await this.post(this.$api.plan.getMonthPlanByYearAndMonth, {
        belongYear: this.form.belongYear,
        belongMonth: this.form.belongMonth
      });
      if (d.code === 0) {
        this.form = d.data;
        this.getTaskByuser();
        if (this.form.approveStatus == 4) {
          this.form.seeOrEdit = 2;
        }
      }
    },
    // 确认通过审批
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
    // 通过审批请求
    async agree(status, value) {
      const d = await this.post(this.$api.approve.doApprove, {
        businessType: "9",
        businessId: this.form.id,
        operateStatus: status,
        comment: value
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$emit("clear");
      }
    },
    // 根据用户获取列表
    async getTaskByuser(id) {
      this.active = id;
      const d = await this.post(this.$api.plan.getTaskByuser, {
        monthPlanId: this.form.id,
        userId: id
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
      }
    },
    // 从子组件获取审批人和抄送人
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copierListParam = params;
    },
    async save() {
      const d = await this.post(this.$api.yearplan.addOrEditYearPlan, {
        ...this.form
      });
      if (d.code === 0) {
        this.$emit("clear");
      }
    },
    async seeMounthPlan(row) {
      this.active = "";
      const d = await this.post(this.$api.plan.mounthpageTask, {
        monthPlanId: this.form.id
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.personMonthPlan();
      }
    },
    //   获取年份
    getDate() {
      let date = new Date();
      let y = date.getFullYear();
      this.yearData.push(y - 1, y, y + 1);
    },
    // 获取人员列表
    async personMonthPlan() {
      //   this.thisForm = row;
      const d = await this.post(this.$api.plan.getMembersByMonthId, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.userList = d.data;
      }
    }
  }
};
</script>

<style lang='scss' scpoed>
.all {
  display: flex;
  width: 100%;
  .left {
    min-width: 0;
    flex: 1;
  }
  //   .right {
  //     border-left: 1px solid #eee;
  //     margin-left: 20px;
  //   }
  .peopleWarp {
    // width: 850px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    .seeAll {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .eachPeople {
      margin-right: 10px;
      margin-top: 10px;
      border: 1px solid #ccc;
      width: 100px;
      height: 100px;
      display: flex;
      .headPortrait {
        width: 60px;
        .pic {
          width: 40px;
          height: 40px;
          margin: 30px auto;
          border-radius: 50%;
          background: #0f88eb;
        }
      }
      .text {
        width: 100%;
        display: flex;
        padding: 5px 5px;
        flex-direction: column;
        justify-content: center;
        div:nth-child(1) {
          text-align: center;
          padding-bottom: 10px;
        }
        div {
          width: 100%;
          font-size: 12px;
          text-align: left;
        }
      }
    }
    .eachPeople:hover {
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      border: none !important;
      cursor: pointer;
    }
  }
  .tableWarp {
    padding: 20px 0;
  }
}
.btnWarp {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
.btns {
  display: flex;
  justify-content: flex-end;
  // padding-bottom: 10px;
}
.red {
  background: #409eff;
  border: none !important;
  box-shadow: 1px 1px 1px 1px #409eff;
  color: white !important;
}
.fontColorRed {
  color: red;
}
.fontColorGreen {
  color: green;
}
</style>