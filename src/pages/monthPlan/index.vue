<template>
  <div>
    <el-card>
      <el-tabs v-model="currentTab" class="tab-container" @tab-click="changeTab">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.columnName">
          <span slot="label">
            <el-badge :hidden="item.count ===0 " :value="item.count" class="item">
              <span>{{item.columnName}}</span>
            </el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
      <search
        style="min-width:1130px"
        ref="searchList"
        @generalSearch="searchData"
        :value.sync="isShowSearch"
        :searchParams="searchParams"
        :searchList="searchList"
      ></search>
      <!-- <div class="head"> -->
      <!-- <div class="search">
              <span>年月</span>
              <el-date-picker
                size="small"
                v-model="quickParams.timeArr"
                type="monthrange"
                @change="changeTimer"
                range-separator="至"
                format="yyyy-MM"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
              ></el-date-picker>
      </div>-->
      <div class="btns">
        <el-button type="primary" size="small" @click="seeMounthPlan('',2)">新建</el-button>
        <el-button type="primary" size="small" @click="exportShow=true">导出</el-button>
        <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
        <el-button
          class="clounmTitle"
          icon="el-icon-search"
          @click="isShowSearch = !isShowSearch;"
          size="small"
        >搜索</el-button>
      </div>
      <!-- </div> -->

      <div>
        <el-table
          :max-height="changeHeight"
          :data="tabData"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          size="small"
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
          <el-table-column width="220px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="seeMounthPlan(scope.row,1)">
                <span v-if="scope.row.approveStatus==2">修订</span>
                <span v-else-if="scope.row.approveStatus==4">编辑</span>
                <span v-else>查看</span>
                </el-button>
              <!-- <el-button type="text" @click="see(scope.row.id)">编辑</el-button> -->
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
    </el-card>
    <el-dialog
      width="96%"
      min-width="1300px;"
      top="20px"
      custom-class="dialogClss"
      title
      :visible.sync="mounthPlanDialog"
      append-to-body
    >
      <seeplan
        v-if="mounthPlanDialog"
        @clear="clearData"
        :formData="thisForm"
        :tableDatas="tableData"
      />
    </el-dialog>
  </div>
</template>

<script>
import seeplan from "./components/seeplan";
import dragTableMixin from "@/mixins/dragTable";
import tableMixin from "@/mixins/table";
import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
// import commonMix from "@/mixins/common";
import search from "@/components/search";
export default {
  mixins: [tableMixin, dragTableMixin],
  components: {
    seeplan,
    search,
    dragTable,
    exportPage
  },
  data() {
    return {
      changeHeight: document.documentElement.clientHeight - 200,
      isShowSearch: false,
      thisForm: {},
      tableData: [],
      mounthPlanDialog: false,
      currentTab: "本部门",
      tabList: [
        { label: "月计划列表", name: "list" },
        { label: "报送记录", name: "record" }
      ],
      Listparams: {
        pageNum: 1,
        pageSize: 10,
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      dbName: "d_oa",
      tableName: "rec_month_plan",
      moduleName: "OA_MONTH_PLAN",
      belongTime: "",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_month_plan",
        moduleName: "OA_MONTH_PLAN"
      },
      dragColumn: [],
      searchList: [], // 通用搜索
      editPlan: false,
      showPlan: false,
      form: {
        month: ""
      },
      editData: "",
      quickParams: {
        timeArr: []
      }
    };
  },
  mounted() {
    this.listColumn(0);
    this.listColumn(1);
    this.listColumn(2);
    this.getlistSpecialColumnForMonthPlan();
    window.onresize = () => {
      this.changeHeight = document.documentElement.clientHeight - 200;
    };
    // this.getList();
  },
  methods: {
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
      this.Listparams.queryEntityDto.baseQueryDtoList = search;
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
    changeTab() {
      // 切换标签
      this.tabList.forEach(item => {
        if (item.columnName == this.currentTab) {
          this.Listparams.columnValue = item.columnValue + "";
        }
      });
      this.getList();
    },
    // 查看月计划listSpecialColumnForMonthPlan
    async seeMounthPlan(row, type) {
      if (type == 1) {
        const d = await this.post(this.$api.plan.getMonthPlan, {
          id: row.id
        });
        if (d.code === 0) {
          this.thisForm = d.data;
          if (this.thisForm.approveStatus == 4) {
            this.thisForm.seeOrEdit = 2;
            this.thisForm.createFlag = true;
          } else {
            this.thisForm.seeOrEdit = 1;
          }
          this.mounthPlanDialog = true;
        }
      } else if (type == 2) {
        // type=2新建 这里入参加上当前年月，获取当前年月的草稿
        let year = new Date().getFullYear();
        let mounth = new Date().getMonth() + 1;
        const d = await this.post(this.$api.plan.draftMonthPlan, {
          // id: row.id
          belongYear: year,
          belongMonth: mounth
        });
        if (d.code === 0) {
          this.thisForm = d.data;
          if (this.thisForm.approveStatus == 4) {
            this.thisForm.seeOrEdit = 2;
            this.thisForm.createFlag = true;
          } else {
            this.thisForm.seeOrEdit = 2;
          }

          this.mounthPlanDialog = true;
        }
      }
    },
    changeTimer() {
      this.params.pageNum = 1;
      this.getList();
    },
    async getlistSpecialColumnForMonthPlan() {
      const d = await this.post(this.$api.plan.listSpecialColumnForMonthPlan);
      if (d.code === 0) {
        this.tabList = d.data;
        this.Listparams.columnValue = this.tabList[0].columnValue;
        this.getList();
      }
    },
    async getList() {
      this.Listparams.pageNum = this.currentPage;
      this.Listparams.pageSize = this.pageSize;
      const d = await this.post(this.$api.plan.pageMonthPlan, {
        ...this.Listparams
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    clearData() {
      this.mounthPlanDialog = false;
      this.getList();
    },
    // 新增月计划
    async addOrEditMonthPlan() {
      const d = await this.post(this.$api.plan.addOrEditMonthPlan, {
        belongTime: this.belongTime
      });
      if (d.code === 0) {
        this.getList();
      }
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
          phaseName: this.phaseName,
          columnValue: this.params.columnValue
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
    // 编辑月计划
    // async editMonthPlan(val) {
    //   const d = await this.post(this.$api.plan.getMonthPlanTree, {
    //     id: val
    //   });
    //   if (d.code === 0) {
    //     this.editPlan = true;
    //     this.editData = d.data;
    //   }
    // },
    // submit() {
    //   this.$refs.form.validate(valid => {
    //     if (valid) {
    //       this.addOrEditMonthPlan();
    //     }
    //   });
    //   this.clearData();
    // }
  }
};
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  .search {
    font-size: 14px;
    span {
      display: inline-block;
      padding-right: 10px;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}
</style>