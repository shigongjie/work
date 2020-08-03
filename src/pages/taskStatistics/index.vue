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
    <div class="head">
      <el-card class="left-head">
        <div class="select">
          <span class="title">筛选条件</span>
          <el-radio-group v-model="radio" @change="clearRadio">
            <el-radio label="assignId">
              <el-select
                filterable
                v-model="params.assignId"
                clearable
                @change="getList"
                placeholder="按员工"
              >
                <el-option
                  v-for="(item,index) in principalList"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId+''"
                ></el-option>
              </el-select>
            </el-radio>
            <el-radio label="customerId" style="margin:0 20px">
              <el-select
                filterable
                clearable
                v-model="params.customerId"
                @change="getList"
                placeholder="一校一策"
              >
                <el-option
                  v-for="(item,index) in customerList"
                  :key="index"
                  :label="item.customerName"
                  :value="item.customerMasterId+''"
                ></el-option>
              </el-select>
            </el-radio>
            <el-radio label="engineeringMasterId">
              <el-select
                filterable
                clearable
                v-model="params.engineeringMasterId"
                @change="getList"
                placeholder="按项目"
              >
                <el-option
                  v-for="(item,index) in menuList"
                  :key="index"
                  :label="item.engineeringName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-radio>
          </el-radio-group>
        </div>
      </el-card>
    </div>
    <div class="wrap">
      <el-card class="right-page">
        <div class="main-head">
          <el-tabs v-model="params.columnValue" @tab-click="changeStatus" class="tab-container">
            <el-tab-pane
              v-for="(item,index) in tabList"
              :key="index"
              :label="item.columnName"
              :name="item.columnValue"
            ></el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button type="primary" size="small" @click="isShowContacts=true;">客户联系人</el-button>
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
            size="small"
          >
          <el-table-column type="index" label="序号">
            <template scope="scope">
              {{scope.$index+(currentPage-1)*pageSize+1}}
            </template>
          </el-table-column>
            <el-table-column
              v-for="(item, index) in tabClounm"
              :key="index"
              :prop="item.fieldName"
              :width="item.width"
              align="left"
              :label="item.fieldLabel"
              :sortable="(item.orderByName ==='' || item.orderByName==null)?false:'custom'"
              v-if="item.selectFlag==='1'"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <!-- <span v-if="scope.column.property ==='content'" v-html="scope.row[item.fieldName]"></span> -->
                <el-link
                  type="primary"
                  v-if="scope.column.property ==='content'"
                  @click="showContent(scope.row)"
                >查看详情</el-link>

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
            <el-table-column width="190px" fixed="right" align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="see(scope.row.id)">查看</el-button>
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
          @listTableColumn="listTableColumn"
          :dragTabShow="dragTabShow"
          @saveClounm="saveClounm"
        ></dragTable>
        <exportPage
          :exportData="exportData"
          ref="exportTab"
          :exportShow="exportShow"
          @exitExport="exitExport"
          @saveExport="saveExport"
        ></exportPage>
      </el-card>
    </div>
    <!-- <createTask :value.sync="showValue" @getList="getList"></createTask> -->
    <upTask
      :value.sync="showUpTask"
      @getList="getList"
      :params="params"
      :businessType="tableName"
      :taskId="taskId"
      @setTaskId="setTaskId"
    ></upTask>
    <contacts :value.sync="isShowContacts" @getList="getList"></contacts>
    <contentDetail :bigImg="content" :value.sync="isShowContent"></contentDetail>
  </div>
</template>

<script>
import contacts from "../customer/compontents/contacts";
import upTask from "../projectProgress/compontents/upTask";
// import createTask from "@/components/createTask";
import tableMixin from "@/mixins/table";
import contentDetail from "@/components/contentDetail";
import exportPage from "@/components/exportPage";
import dragTableMixin from "@/mixins/dragTable";
import search from "@/components/search";
import dragTable from "@/components/dragTable/index";
export default {
  components: {
    search,
    dragTable,
    upTask,
    contacts,
    contentDetail,
    exportPage
  },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      isShowSearch: false,
      taskId: "",
      exportShow: false,
      showValue: false,
      exportData: [],
      radio: "assignId",
      isShowContacts: false,
      showUpTask: false,
      tabList: [
        {
          columnName: "未完成",
          columnValue: "未完成"
        },
        {
          columnName: "已完成",
          columnValue: "已完成"
        },
        {
          columnName: "所有",
          columnValue: "所有"
        }
      ],
      engineeringMasterId: "",
      customerId: "",
      assignId: "",
      principalList: [],
      customerList: [],
      searchList: [], // 通用搜索
      dragColumn: [],
      menuList: [],
      tabData: [],
      dbName: "d_oa",
      tableName: "rec_task_master",
      moduleName: "OA_TASK_STATISTICS",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_task_master",
        moduleName: "OA_TOA_TASK_STATISTICSASK"
      },
      params: {
        columnValue: "未完成",
        engineeringMasterId: "",
        customerId: "",
        assignId: "",
        pageNum: "",
        pageSize: "",
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      content: "",
      isShowContent: false,
      changeHeight:document.documentElement.clientHeight -285,
    };
  },
  mounted() {
    this.listColumn(0);
    this.listColumn(1);
    this.listColumn(2);
    this.listPrincipal();
    this.listCustomerMaster();
    this.listEngineeringMaster();
    this.getList();
        window.onresize = () => {
      this.changeHeight = document.documentElement.clientHeight -285;
    };
  },
  methods: {
    showContent(row) {
      console.log(row);
      this.content = row.content;
      this.isShowContent = true;
    },
    changeRadio(val) {},
    async listCustomerMaster() {
      const d = await this.post(this.$api.customer.listCustomerMaster);
      if (d.code === 0) {
        this.customerList = d.data;
      }
    },
    async listPrincipal() {
      const d = await this.post(this.$api.projectManage.listPrincipal);
      if (d.code === 0) {
        this.principalList = d.data;
      }
    },
    getRadio(val) {},
    setTaskId(id) {
      this.taskId = id;
    },
    see(id) {
      let todo = JSON.parse(JSON.stringify(this.params[this.radio]));
      this.params.engineeringMasterId = "";
      this.params.customerId = "";
      this.params.assignId = "";
      this.params[this.radio] = todo;
      this.taskId = id;
      this.showUpTask = true;
    },
    changeStatus() {
      this.currentPage = 1;
      this.getList();
    },
    clearRadio(val) {
      let todo = JSON.parse(JSON.stringify(this.params[val]));
      this.params.engineeringMasterId = "";
      this.params.customerId = "";
      this.params.assignId = "";
      this.params[val] = todo;
      this.getList();
    },
    async listColumn(columnFlag) {
      const d = await this.post(this.$api.common.listColumn, {
        columnFlag: columnFlag,
        dbName: this.dbName,
        tableName: this.tableName,
        moduleName: this.moduleName
      });
      if (d.code === 0) {
        if (columnFlag === 0) {
          this.tabClounm = d.data;
          this.dragColumn = JSON.parse(JSON.stringify(d.data));
        }
        if (columnFlag === 1) {
          this.exportData = JSON.parse(JSON.stringify(d.data));
        }
        if (columnFlag === 2) {
          this.searchList = JSON.parse(JSON.stringify(d.data));
        }
      }
    },
    async listEngineeringMaster() {
      const d = await this.post(this.$api.projectManage.listEngineeringMaster);
      if (d.code === 0) {
        this.menuList = d.data;
      }
    },
    async getList() {
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      const d = await this.post(this.$api.projectProgress.pageTaskStatistics, {
        // status: 0,
        [this.radio]: this.params[this.radio],
        columnValue: this.params.columnValue,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    async delMember(row, status) {
      let tip = status === 4 ? "确定取消吗" : "确定关闭吗";
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
          phaseName: "",
          columnValue: this.params.columnValue,
          assignId: this.params.assignId,
          customerId: this.params.customerId
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
    flex: 1;
    .main-head {
      .left-main-head {
        display: flex;
      }
      .btns {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .clounmTitle {
    color: #409eff;
    border-color: #409eff;
    width: 70px;
  }
}
.el-radio {
  margin-right: 0;
}
.select {
  display: flex;
  align-items: center;
  span {
    margin-right: 20px;
  }
  .center {
    margin: 0 20px;
  }
}
</style>
