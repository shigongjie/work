<template>
  <div>
    <div class="wrap">
      <el-card class="right-page">
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
        <!-- <div class="main-head"> -->
        <div class="btns">
          <el-button type="primary" size="small" @click="seeMounthPlan('',2)">新建</el-button>
          <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
          <el-button
            class="clounmTitle"
            icon="el-icon-search"
            @click="isShowSearch = !isShowSearch;"
            size="small"
          >搜索</el-button>
        </div>
        <!-- </div> -->
        <el-table
          ref="scoreTable"
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
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- <span v-if="scope.column.property ==='content'" v-html="scope.row[item.fieldName]"></span> -->
              <el-link
                type="primary"
                v-if="scope.column.property ==='content'"
                @click="showContent(scope.row)"
              >查看详情</el-link>
              <!--  :class="'type'+~~scope.row[item.fieldName]" -->
              <div
                style="display: flex;justify-content:center;"
                v-else-if="scope.column.property ==='degreeType'"
              >
                <div class="degree">{{scope.row[item.fieldName]}}</div>
              </div>

              <el-tooltip
                placement="left"
                v-else-if="scope.column.property ==='progressDtoStr'&&scope.row[item.fieldName]"
              >
                <div slot="content" v-html="scope.row[item.fieldName]"></div>
                <span class="oe">{{scope.row[item.fieldName]}}</span>
              </el-tooltip>
              <span
                v-else
                :class="{'red':scope.row[item.fieldName]=='拒绝'}"
              >{{scope.row[item.fieldName]}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="seeMounthPlan(scope.row,1)">查看</el-button>
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
    <el-dialog
      width="96%"
      min-width="1300px;"
      top="20px"
      custom-class="dialogClss"
      title
      :visible.sync="yearPlanDialog"
      append-to-body
    >
      <seeyearplan v-if="yearPlanDialog" :formData="thisForm" @clear="clearData" />
    </el-dialog>
  </div>
</template>

<script>
import commonMix from "@/mixins/common";
import tableMixin from "@/mixins/table";
import dragTableMixin from "@/mixins/dragTable";
import search from "@/components/search";
import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
import seeyearplan from "./components/seeyearplan";
export default {
  components: {
    search,
    dragTable,
    exportPage,
    seeyearplan
  },
  mixins: [tableMixin, dragTableMixin, commonMix],
  data() {
    return {
      yearPlanDialog: false,
      currentTab: "",
      quickParams: {
        timeArr: []
      },
      tabList: [],
      Listparams: {
        pageNum: 1,
        pageSize: 10,
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      searchList: [], // 通用搜索
      dragColumn: [],
      tabData: [],
      dbName: "d_oa",
      tableName: "rec_year_plan",
      moduleName: "page",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_year_plan",
        moduleName: "page"
      }
    };
  },
  computed: {
    btnColor() {
      return val => {
        if (val) {
          let t = new Date().getTime();
          let d = new Date(val).getTime() - 24 * 60 * 60 * 1000; //24小时 * 60分钟 * 60秒 * 1000
          return d <= t ? "green" : "";
        }
      };
    }
  },
  mounted() {
    this.listColumn(0);
    this.listColumn(1);
    this.listColumn(2);
    this.getlistSpecialColumnForMonthPlan();
  },
  methods: {
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
    clearData() {
      this.yearPlanDialog = false;
      this.getList();
    },
    // 查看或新建月计划listSpecialColumnForMonthPlan
    async seeMounthPlan(row, type) {
      if (type == 1) {
        const d = await this.post(this.$api.yearplan.getYearPlan, {
          id: row.id
        });
        if (d.code === 0) {
          this.thisForm = d.data;
          this.thisForm.seeOrEdit = 1;
          this.yearPlanDialog = true;
        }
      } else if (type == 2) {
        this.thisForm = {};
        this.yearPlanDialog = true;
      }
    },
    changeTab() {
      // 切换标签
      this.tabList.forEach(item => {
        if (item.columnName == this.currentTab) {
          this.Listparams.columnName = item.columnName;
        }
      });
      this.getList();
    },
    async getlistSpecialColumnForMonthPlan() {
      const d = await this.post(this.$api.projectProgress.listSpecialColumn, {
        type: 9
      });
      if (d.code === 0) {
        this.tabList = d.data;
        this.currentTab = this.tabList[0].columnName;
        this.Listparams.columnName = this.tabList[0].columnName;
        this.getList();
      }
    },
    changeTimer() {
      this.params.pageNum = 1;
      this.getList();
    },
    async getList() {
      const d = await this.post(this.$api.yearplan.pageYearPlan, {
        ...this.Listparams
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.main-head {
  display: flex;
  justify-content: space-between;
}
.btns {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}
 /deep/ .el-dialog__body {
    padding-bottom: 0px !important;
    padding-right: 0px;
  }
</style>