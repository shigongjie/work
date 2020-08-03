<template>
  <div class="all">
    <div class="left">
      <el-form ref="form" size="small" :model="form" class="form" label-width="60px">
        <el-row>
          <el-col style="width:280px">
            <el-form-item label="年份" prop="itemCode">
              <el-select v-model="form.belongYear">
                <el-option
                  v-for="(item,index) in yearData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <!-- <el-input type="text" :readonly="type==2" v-model="defaultForm.belongYear"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col style="width:280px">
            <el-form-item label="月份" prop="itemCodes">
              <el-select v-model="form.belongMonth" @change="getMonthPlanByYearAndMonth()">
                <el-option
                  v-for="(item,index) in MounthData"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <!-- <el-input type="text" v-model="form.belongMonth"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col style="width:280px">
            <el-form-item label="部门" prop="itemCodes">
              <el-input type="text" readonly v-model="form.departmentName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="peopleWarp">
        <div
          class="eachPeople"
          v-for="(item,index) in userList"
          :key="index"
          :class="{'red':active==item.userId}"
        >
          <!-- <div class="headPortrait">
            <div class="pic"></div>
          </div>-->
          <div class="text" @click="getTaskByuser(item.userId)">
            <div>{{item.userName}}</div>
            <div>
              个人总分：
              <span
                :class="{'fontColorRed':item.totalSystemScore<100,'fontColorGreen':item.totalSystemScore>=100}"
              >{{item.totalSystemScore}}</span>
            </div>
            <div>
              个人得分：
              <span>{{item.totalOneselfScore}}</span>
            </div>
            <div>
              领导评分：
              <span>{{item.totalLeaderScore}}</span>
            </div>
          </div>
        </div>
        <div class="eachPeople seeAll" @click="seeMounthPlan()">查看全部</div>
      </div>
      <div class="tableWarp">
        <div class="btns" style="padding-bottom:10px">
          <el-button
            type="primary"
            size="small"
            v-if="form.approveStatus==4||form.approveStatus==5||form.approveStatus==3"
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
        <el-table
          :max-height="changeHeight"
          :data="tabData"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          size="medium"
        >
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
            v-if="item.selectFlag==='1'"
            :show-overflow-tooltip="item.fieldName!=='progressDtoStr'"
          >
            <template slot-scope="scope">
              <!-- <el-link
                type="primary"
                v-if="scope.column.property ==='content'"
                @click="showContent(scope.row)"
              >查看详情</el-link>-->
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
              <!-- <el-tooltip
                placement="Top Left"
                v-if="scope.column.property ==='content'&&scope.row[item.fieldName]"
              >
                <div slot="content" v-html="scope.row[item.fieldName]"></div>
                <span v-html="scope.row[item.fieldName]" class="oe"></span>
              </el-tooltip>-->
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
          <el-table-column width="180px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="upTaskId=scope.row.id,showUpTask=true">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
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
          v-if="form.createFlag==true&&form.approveStatus==4"
          type="primary"
          @click="StartApprove(1)"
          size="small"
        >发起审批</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="form.approveStatus!=4&&form.approveStatus!=5&&form.createFlag"
          @click="mounthPlanreturnBack()"
        >撤回修改</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="form.approveStatus===5&&form.createFlag"
          @click="mounthPlanrepublic()"
        >重新发布</el-button>
        <el-button
          v-if="form.approveFlag==true&&~~form.approveStatus===1&&form.seeOrEdit==1"
          type="primary"
          @click="agreeApprove(1)"
          size="small"
        >通过</el-button>
        <el-button
          v-if="form.approveFlag==true&&~~form.approveStatus===1&&form.seeOrEdit==1"
          type="primary"
          size="small"
          @click="agreeApprove(2)"
        >不通过</el-button>
        <el-button type="primary" v-if="form.approveStatus==4" size="small" @click="save()">保存</el-button>
      </div>
    </div>
    <contentDetail :bigImg="content" :title="title" :value.sync="isShowContent"></contentDetail>
    <div class="right CommentAndApprove">
      <seeapprove
        :isDemand="(form.approveStatus==5&&form.createFlag==true)||(form.approveStatus==4&&form.createFlag==true)?'编辑':'查看'"
        @approvedGroup="getApprovedGroup"
        @copierList="copierList"
        :formValue="form.approveListParam"
        :copier="form.copierListParam"
        :businessType="8"
        :creatName="form.writeByUserName"
        :creatTime="form.writeTime"
      />
      <comments
        v-if="form.id!=''"
        ref="comments"
        :height="200"
        :businessType="8"
        :businessId="form.id"
      ></comments>
    </div>
    <upTask
      :value.sync="showUpTask"
      @getList="seeMounthPlan"
      :mounthId="form.id"
      :taskId="upTaskId"
    />
  </div>
</template>

<script>
import contentDetail from "@/components/contentDetail";
import comments from "@/components/comment";
import upTask from "../../projectProgress/compontents/upTask";
import commonMix from "@/mixins/common";
import seeapprove from "../../policy/compontents/seeapproved";
export default {
  props: { tableDatas: Array, formData: Object },
  mixins: [commonMix],
  components: { seeapprove, upTask, comments, contentDetail },
  data() {
    return {
      //当前页
      currentPage: 1,
      //每页大小
      pageSize: 10,
      //总页数
      total: 0,
      //每页页码条数列表
      pageSizeList: [10, 20, 30, 40, 50, 100],
      title: "",
      isShowContent: false,
      content: "",
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
      params: {
        pageNum: 1,
        pageSize: 10,
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_task_master",
        moduleName: "OA_PAGETASKV2"
      },
      defaultForm: {},
      form: { createFlag: true },
      tabData: [],
      tabClounm: [],
      userList: []
    };
  },
  mounted() {
    // 获取年份
    this.getDate();
    this.form = this.$props.formData;
    this.seeMounthPlan();
    this.personMonthPlan();
  },
  methods: {
    async startApproveAjax() {
      console.log(this.form);
      if (this.form.approveListParam.length == 0) {
        this.$message({
          type: "error",
          message: "请添加审批人"
        });
      } else {
        const d = await this.post(this.$api.plan.launchMonthPlan, {
          id: this.form.id
        });
        if (d.code === 0) {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$emit("clear");
        }
      }
    },
    StartApprove() {
      this.$confirm("确认发起审批？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.startApproveAjax();
        })
        .catch(e => e);
    },
    mounthPlanrepublic() {
      this.$confirm("确认重新发布？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.save();
        })
        .catch(e => e);
    },
    // 撤回修改
    async mounthPlanreturnBackAjax() {
      const d = await this.post(this.$api.plan.mounthPlanreturnBack, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "撤回成功"
        });
        const c = await this.post(this.$api.plan.getMonthPlan, {
          id: this.form.id
        });
        if (c.code === 0) {
          this.form = c.data;
        }
      }
    },
    mounthPlanreturnBack() {
      this.$confirm("确认撤回修改？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.mounthPlanreturnBackAjax();
        })
        .catch(e => e);
    },
    showContent(row) {
      this.content = row.content;
      this.title = row.name;
      this.isShowContent = true;
    },
    async getMonthPlanByYearAndMonth() {
      const d = await this.post(this.$api.plan.getMonthPlanByYearAndMonth, {
        belongYear: this.form.belongYear,
        belongMonth: this.form.belongMonth
      });
      if (d.code === 0) {
        this.form = d.data;
        this.getTaskByuser();
        this.personMonthPlan();
        if (this.form.approveStatus == 4) {
          this.form.seeOrEdit = 2;
          this.form.createFlag = true;
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
        businessType: "8",
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
        ...this.params,
        monthPlanId: this.form.id,
        userId: id
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    // 从子组件获取审批人和抄送人
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    },
    async save() {
      const d = await this.post(this.$api.plan.addOrEditMonthPlan, {
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
        this.total = d.data.total;
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
    },
    selectionChange(selection) {
      this.selectTbaleData = selection;
    },
    //选择每页显示条数触发
    handleSizeChange(val) {
      this.currentPage = 1;

      this.params.pageSize = val;
      this.getTaskByuser();
    },
    //点击页码触发
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.currentPage = val;
      this.getTaskByuser();
    }
  }
};
</script>

<style lang='scss' scpoed>
/deep/ .el-dialog__body {
  padding-bottom: 0px;
}
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
      width: 110px;
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
