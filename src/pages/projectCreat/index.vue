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
    <div class="wrap">
      <el-card class="right-page">
        <div class="main-head">
          <el-tabs v-model="params.columnName" @tab-click="getList" class="tab-container">
            <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.columnName">
              <span slot="label">
                <el-badge
                  v-if="item.columnValue!==-1 && item.columnValue !==0 "
                  :value="item.columnValue"
                  class="item"
                >
                  <span>{{item.columnName}}</span>
                </el-badge>
                <span v-else>{{item.columnName}}</span>
              </span>
            </el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button type="primary" size="small" @click="creatProject()">创建立项</el-button>
            <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
            <el-button
              class="clounmTitle"
              icon="el-icon-search"
              @click="isShowSearch = !isShowSearch;"
              size="small"
            >搜索</el-button>
          </div>
        </div>
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
              <span :class="{'red':scope.row[item.fieldName]=='拒绝'}">{{scope.row[item.fieldName]}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="seeDetail(scope.row.id)">查看详情</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.approveFlag==true&&scope.row.status==1"
                @click="seeDetail(scope.row.id)"
              >审批</el-button>
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
    <!-- 创建立项 -->
    <el-dialog
      title="创建立项"
      custom-class="creatDialog"
      :before-close="clear"
      :visible.sync="showValue"
      top="10px"
      width="96%"
    >
      <addproject v-if="showValue" :defaultForm="defaultForm" :iscreatId="iscreat" @clear="clear" />
    </el-dialog>
    <!-- 发起验收 -->
    <el-dialog title="发起验收" :visible.sync="startCheckDialog" width="800px">
      <div style="display:flex">
        <span class="form-label">项目名称：</span>
        <el-input size="mini" v-model="projectName" placeholder="请输入内容"></el-input>
      </div>
      <seeapprove :isChecked="'验收'" />
    </el-dialog>
  </div>
</template>

<script>
import tableMixin from "@/mixins/table";
import dragTableMixin from "@/mixins/dragTable";
// import contentDetail from "@/components/contentDetail";
import search from "@/components/search";
import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
import addproject from "./components/addproject";
import seeapprove from "../policy/compontents/seeapproved";
export default {
  components: {
    search,
    dragTable,
    addproject,
    // createDemand,
    // upDemand,
    // contentDetail,
    exportPage,
    seeapprove
    // seeDemand,
    // yesTaskAndDemand
  },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      startCheckDialog: false,
      projectName: "",
      iscreat: "",
      defaultForm: {},
      showYes: false,
      id: "",
      operateType: 0,
      operateStatus: 0,
      isShowSearch: false,
      demandId: "",
      exportData: [],
      exportShow: false,
      showValue: false,
      showDemand: false,
      phaseName: "",
      showDemandSee: false,
      tabList: [],
      searchList: [], // 通用搜索
      dragColumn: [],
      tabData: [],
      dbName: "d_oa",
      tableName: "rec_project_master",
      moduleName: "page",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_project_master",
        moduleName: "page"
      },
      params: {
        columnName: "进行中",
        pageNum: "",
        pageSize: "",
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      specailparams: {
        pageNum: "",
        pageSize: "",
        engineeringMasterId: "",
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      content: "",
      isShowContent: false,
      title: "",
      changeHeight: document.documentElement.clientHeight - 200
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
    this.getSpeacilColumn();
    this.getList();
    // this.listSpecialColumn();
    window.onresize = () => {
      this.changeHeight = document.documentElement.clientHeight - 200;
    };
  },
  methods: {
    // 发起验收
    startCheck() {
      this.startCheckDialog = true;
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
        this.getList();
      }
    },
    // 查看详情
    async seeDetail(id) {
      this.iscreat = id;
      const d = await this.post(this.$api.projectCreat.getProject, {
        id: id
      });
      if (d.code === 0) {
        this.defaultForm = d.data;
        this.showValue = true;
        // this.tabList = d.data;
      }
    },
    async getSpeacilColumn() {
      const d = await this.post(this.$api.projectProgress.listSpecialColumn, {
        type: "6"
      });
      if (d.code === 0) {
        this.tabList = d.data;
      }
    },
    clear() {
      this.showValue = false;
      this.getList();
    },
    async creatProject() {
      const d = await this.post(this.$api.projectCreat.draftProject, {});
      if (d.code === 0) {
        this.defaultForm = d.data;
        this.iscreat = "";
        this.showValue = true;
      }
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
    async getList() {
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      const d = await this.post(this.$api.projectCreat.pageProject, {
        ...this.params
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
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
  }
};
</script>

<style lang='scss' scoped>
.el-divider--horizontal {
  margin: 15px 0;
}
.head {
  display: flex;
  margin-bottom: 15px;
  .left-head {
    flex: 1;
    margin-right: 15px;
  }
  .right-head {
    flex: 1;
    .lis {
      cursor: pointer;
      margin-right: 40px;
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
    flex: 1;
    .main-head {
      min-height: 54px;
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
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: white !important;
  border-color: #e4e7ed !important;
  color: black !important;
  cursor: not-allowed !important;
}
.red {
  color: red;
}
.green {
  color: #67c23a;
}
.form-label {
  display: flex;
  align-items: center;
  width: 100px;
  justify-content: flex-end;
}
.rightComponent {
  padding-left: 20px;
  border: none !important;
}
/deep/ .creatDialog {
  /deep/ .el-dialog__body {
    padding-bottom: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
