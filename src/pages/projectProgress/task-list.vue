<template>
  <div>
    <search
      style="min-width:1130px"
      ref="searchList"
      @generalSearch="searchData"
      :value.sync="isShowSearch"
      :searchParams="searchParams"
      :searchList="searchList"
    ></search>
    <div class="head" v-if="phaseList && phaseList.length>0">
      <el-card class="right-head">
        <div class="progress-wrap">
          <div
            class="lis"
            v-for="(item,index) in phaseList"
            :key="index"
            @click="changActive(item,index)"
          >
            <p :class="index===activeIndex?'active':''">
              {{index+1}}、{{item.phaseName}}
              <span>({{item.phaseNum}}%)</span>
            </p>
            <el-progress
              :text-inside="true"
              :show-text="false"
              :stroke-width="12"
              :percentage="item.phaseNum"
            ></el-progress>
          </div>
        </div>
      </el-card>
    </div>
    <div class="wrap">
      <div class="right-page el-card">
        <div class="main-head">
          <el-tabs
            v-model="paramsOther.columnValue"
            @tab-click="changeStatus"
            class="tab-container"
          >
            <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.columnValue+''">
              <span slot="label">
                <el-badge :hidden="item.count ===0 " :value="item.count" class="item">
                  <span>{{item.columnName}}</span>
                </el-badge>
                <!-- <span>{{item.columnName}}</span> -->
              </span>
            </el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button
              type="primary"
              size="small"
              @click="taskId = '', showUpTask = true; read=false"
            >建任务</el-button>
            <el-button type="primary" size="small" @click="exportShow=true">导出</el-button>
            <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
            <el-button
              class="clounmTitle"
              icon="el-icon-search"
              @click="isShowSearch = !isShowSearch;"
              size="small"
            >搜索</el-button>
          </div>
        </div>
        <div>
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
                <!-- <div
                  type="primary"
                  style="color:#409eff"
                  v-if="scope.column.property ==='content'"
                  @mouseenter="showContent(scope.row)"
                >查看详情</div> -->

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
            <el-table-column width="220px" fixed="right" align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="taskId = scope.row.id;showUpTask = true; read=true"
                >查看</el-button>
                <el-button v-if="scope.row.status!=4" type="text" @click="see(scope.row.id)">编辑</el-button>
                <!-- <el-button type="text" @click="openDemand(scope.row.id)">发起审批</el-button> -->
                <!-- <el-button
                  type="text"
                  v-if="~~scope.row.status!==2 && scope.row.approveFlag &&~~scope.row.approveStatus===0"
                  @click="yesUpdateOperateStatus(scope.row.id,0,1)"
                >审批</el-button>
                <el-button
                  type="text"
                  v-if="~~scope.row.status==0 &&~~scope.row.approveStatus===1"
                  @click="delMember(scope.row,1)"
                >开始</el-button>
                <el-button
                  type="text"
                  v-if="~~scope.row.status==1 &&~~scope.row.assignStatus===0 &&scope.row.assignFlag"
                  @click="updateOperateStatus(scope.row.id,1,1)"
                >完成</el-button>
                <el-button
                  type="text"
                  v-if="~~scope.row.status==2 && (~~scope.row.currentOperator===3|| ~~scope.row.currentOperator===1)"
                  @click="delMember(scope.row,0)"
                >激活</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </div>

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
    </div>
    <!-- <createTask :value.sync="showValue" @getList="getList" :taskId="taskId"></createTask> -->
    <!-- <createDemand :value.sync="showDemand" :isClone="true" :taskId="demandId" @getList="getList"></createDemand> -->
    <upTask
      :read="read"
      :value.sync="showUpTask"
      @getList="getList"
      :params="{...params, ...paramsOther}"
      :taskId="taskId"
      @setTaskId="setTaskId"
    ></upTask>
    <!-- <seeTask
      :value.sync="showSeeTask"
      @getList="getList"
      :engineeringMasterId="params.engineeringMasterId"
      :params="{...paramsOther.columnValue, ...params.queryEntityDto}"
      :businessType="'任务'"
      :taskId="taskId"
      @setTaskId="setTaskId"
    ></seeTask>-->
    <!-- <yesTaskAndDemand
      :value.sync="showYes"
      :id="id"
      :businessType="0"
      :operateType="operateType"
      :operateStatus="Number(operateStatus)"
      @getList="getList"
    ></yesTaskAndDemand>-->

    <contentDetail :bigImg="content" :title="title" :value.sync="isShowContent"></contentDetail>
  </div>
</template>

<script>
import yesTaskAndDemand from "./compontents/yesTaskAndDemand";
import seeTask from "./compontents/seeTask";
import upTask from "./compontents/upTask";
import createTask from "@/components/createTask";
import createDemand from "@/components/createDemand";
import contentDetail from "@/components/contentDetail";
import commonMix from "@/mixins/common";

export default {
  components: {
    createTask,
    createDemand,
    upTask,
    contentDetail,
    seeTask,
    yesTaskAndDemand
  },
  mixins: [commonMix],
  data() {
    return {
      read: false,
      showYes: false,
      id: "",
      operateType: 0,
      operateStatus: 0,
      taskId: "",
      showValue: false,
      exportShow: false,
      showUpTask: false,
      showSeeTask: false,
      testEditor: "",
      activeIndex: -1,
      tabList: [],
      roleId: "",
      // menuList: [],
      phaseList: [],
      copyCustomerList: [],
      demandId: "",
      title: "",
      isShowContent: false,
      content: "",
      customerList: [],
      showDemand: false,
      dbName: "d_oa",
      tableName: "rec_task_master",
      moduleName: "OA_PAGETASKV2",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_task_master",
        moduleName: "OA_PAGETASKV2"
      },
      a: "",
      paramsOther: {
        columnValue: "0"
      }
    };
  },
  mounted() {
    // this.listEngineeringMaster();
    // this.listSpecialColumnForTask();
    this.getList();
  },
  methods: {
    outStyle() {
      console.log(1111);
    },
    async listSpecialColumnForTask() {
      const d = await this.post(this.$api.task.listSpecialColumnForTask, {
        businessType: 0
      });
      if (d.code === 0) {
        this.tabList = d.data;
      }
    },
    remoteMethod(val) {
      this.params.customerId = val;
      const pinyinMatch = require("pinyin-match");
      if (val) {
        let result = [];
        this.copyCustomerList.forEach(item => {
          var m = pinyinMatch.match(item.customerName, val);
          if (m) {
            result.push(item);
          }
        });
        this.customerList = result;
      } else {
        this.customerList = this.copyCustomerList;
      }
    },
    async listCustomerMaster() {
      const d = await this.post(this.$api.customer.listCustomerMaster);
      if (d.code === 0) {
        this.copyCustomerList = d.data;
        this.customerList = d.data;
      }
    },
    showContent(row) {
      console.log(row);
      this.content = row.content;
      this.title = row.name;
      this.isShowContent = true;
    },
    setTaskId(id) {
      this.taskId = id;
    },
    yesUpdateOperateStatus(id, operateType, operateStatus) {
      this.id = id;
      this.operateType = operateType;
      this.operateStatus = operateStatus;
      this.showYes = true;
    },
    async updateOperateStatus(id, operateType, operateStatus) {
      this.$confirm(
        operateType === 0 ? "确定审批通过吗?" : "确定完成吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const d = await this.post(
          this.$api.projectProgress.updateOperateStatus,
          {
            businessType: 0,
            businessId: id,
            operateType: operateType,
            operateStatus: operateStatus
          }
        );
        if (d.code === 0) {
          if (operateType === 0) {
            if (operateStatus === 1) {
              this.$message.success("审批成功");
            } else {
              this.$message.success("取消审批成功");
            }
          } else {
            this.$message.success("状态更改成功");
          }
          this.getList();
        }
      });
    },
    see(id) {
      this.taskId = id;
      this.showUpTask = true;
      this.read = false;
    },
    openDemand(id) {
      this.demandId = id;
      this.showDemand = true;
    },
    changActive(item, index) {
      this.activeIndex = index;
      this.params.phaseName = item.phaseName;
      this.getList();
    },
    changeStatus() {
      this.currentPage = 1;
      this.getList();
    },
    changeStatus1() {
      this.params.phaseName = "";
      this.activeIndex = -1;
      this.getList();
    },
    async getList() {
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      const d = await this.post(this.$api.task.pageTask, {
        columnValue: this.paramsOther.columnValue,
        ...this.params
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
        this.listSpecialColumnForTask();
      }
    },
    async delMember(row, status) {
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
          businessId: row.id + "",
          status: status,
          businessType: 0
        });
        if (d.code === 0) {
          this.getList();
        }
      });
    },
    // 保存拖拽
    async saveClounm(val) {
      const d = await this.post(this.$api.common.saveColumn, {
        moduleName: this.moduleName,
        dbName: this.dbName,
        tableName: this.tableName,
        columnJa: val
      });
      if (d.code === 0) {
        this.exitDialog();
        this.$refs.dragTab.isShowTab();
        this.getList();
      }
    },
    // 退出拖拽
    exitDialog(val) {
      this.dragTabShow = false;
      this.listColumn(0);
    },
    // 查询
    searchData(search) {
      this.currentPage = 1;
      this.params.queryEntityDto.baseQueryDtoList = search;
      this.getList();
    },
    // 最后导出调用下载
    saveExport(data) {
      let fieldStringArray = data.map(item => {
        return item.fieldName;
      });
      this.cacheExportField(fieldStringArray);
    },
    async cacheExportField(fieldStringArray) {
      const d = await this.post(this.$api.common.cacheExportField, {
        fieldStringArray: fieldStringArray.join(",")
      });
      if (d.code === 0) {
        var query = {
          pageNum: 1,
          pageSize: 1000,
          queryDto: JSON.stringify(this.params.queryEntityDto),
          fieldStringArray: d.data,
          uuid: d.data,
          dbName: this.dbName,
          tableName: this.tableName,
          moduleName: this.moduleName,
          userId: this.$store.state.userInfo.data.userId + "",
          engineeringMasterId: this.params.engineeringMasterId,
          phaseName: this.params.phaseName,
          columnValue: this.paramsOther.columnValue
        };
        let url = "/oa-boot/export/commonExport";
        this.$refs.exportTab.isShowTab();
        this.exportShow = false;
        this.$common.exportXls(query, url);
      }
    },
    async listTableColumn() {
      const d = await this.post(this.$api.common.resetTableColumn, {
        businessId: "",
        moduleName: this.moduleName,
        dbName: this.dbName,
        tableName: this.tableName,
        fieldModuleEnum: ""
      });
      if (d.code === 0) {
        this.exitDialog();
        this.$refs.dragTab.isShowTab();
      }
    },
    async listTableColumn() {
      const d = await this.post(this.$api.common.resetTableColumn, {
        businessId: "",
        moduleName: this.moduleName,
        dbName: this.dbName,
        tableName: this.tableName,
        fieldModuleEnum: ""
      });
      if (d.code === 0) {
        this.exitDialog();
        this.$refs.dragTab.isShowTab();
      }
    },
    // 退出导出
    exitExport() {
      this.exportShow = false;
      // this.exportColumn();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-divider--horizontal {
  margin: 15px 0;
}
.head {
  display: flex;
  margin-bottom: 10px;
  .left-head {
    flex: 1;
    margin-right: 10px;
  }
  .right-head {
    flex: 1;
    .lis {
      cursor: pointer;
      width: 180px;
      margin-right: 90px;
      p {
        margin-bottom: 10px;
        font-size: 14px;
      }
      .active {
        color: #0f88eb;
      }
    }
  }
  .progress-wrap {
    display: flex;
  }
}
.title {
  color: #999999;
  font-size: 14px;
  margin-right: 10px;
}
.wrap {
  display: flex;
  .right-page {
    padding: 7px 20px 15px 20px;
    flex: 1;
    .main-head {
      .left-main-head {
        display: flex;
      }
      .btns {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
      }
    }
  }
  .clounmTitle {
    color: #409eff;
    border-color: #409eff;
    width: 70px;
  }
}

</style>
