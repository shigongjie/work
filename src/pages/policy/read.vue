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
          <el-tabs v-model="params.columnValue" @tab-click="getList" class="tab-container">
            <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.value+''">
              <span slot="label">
                <el-badge
                  v-if="(item.value==0||item.value==3||item.value==4 )&&item.count!==0"
                  :value="item.count"
                  class="item"
                >
                  <span>{{item.name}}</span>
                </el-badge>
                <span v-else>{{item.name}}</span>
              </span>
            </el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button type="primary" size="small" @click="showValue=true;">添加</el-button>
            <!-- <el-button type="primary" size="small" @click="exportShow=true">导出</el-button> -->
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
            v-if="item.selectFlag==='1'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div
                v-if="scope.column.property ==='sourceArr'||scope.column.property ==='typeArr'||scope.column.property ==='directionArr'"
              >
                <span
                  v-for="(todo, index) in scope.row[item.fieldName]"
                  v-if="scope.row[item.fieldName]&&scope.row[item.fieldName].length>0"
                  :key="index"
                >{{todo.value}} {{scope.row[item.fieldName].length-1===index?'':','}}</span>
                <span v-else></span>
              </div>
              <span v-else>{{scope.row[item.fieldName]}}</span>
            </template>
          </el-table-column>
          <el-table-column width="160px" fixed="right" align="left" label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                type="text"
                @click="policyId=scope.row.id;showYes=true"
                v-if="scope.row.approveFlag&&~~scope.row.approveStatus===0"
              >同意</el-button>
              <el-button
                type="text"
                v-if="scope.row.approveFlag&&~~scope.row.approveStatus===0"
                @click="policyId=scope.row.id;showReturn=true"
              >退回</el-button> -->
              <el-button type="text" @click="policyId=scope.row.id.toString();showSeePolicy = true">查看</el-button>
              <el-button type="text" @click="policyId=scope.row.id;showPolicy = true">编辑</el-button>
              <el-button type="text" v-if="scope.row.createFlag&&scope.row.passFlag==false" @click="delPolicy(scope.row.id,1)">删除</el-button>
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
        <!-- <exportPage
          :exportData="exportData"
          ref="exportTab"
          :exportShow="exportShow"
          @exitExport="exitExport"
          @saveExport="saveExport"
        ></exportPage>-->
      </el-card>
    </div>
    <addPolicy  :value.sync="showValue" @getList="init"></addPolicy>
    <upPolicy :value.sync="showPolicy" @getList="init" :businessType="'政策'" :policyId="policyId"></upPolicy>
    <seePolicy
      :value.sync="showSeePolicy"
      @getList="init"
      :businessType="'政策'"
      :policyId="policyId"
    ></seePolicy>
    <returnPolicy :value.sync="showReturn" :policyId="policyId" @getList="init"></returnPolicy>
    <yesPolicy :value.sync="showYes" :policyId="policyId" @getList="init"></yesPolicy>
  </div>
</template>

<script>
import returnPolicy from "./compontents/returnPolicy";
import yesPolicy from "./compontents/yesPolicy";
import addPolicy from "./compontents/addPolicy";
import upPolicy from "./compontents/upPolicy";
import seePolicy from "./compontents/seePolicy";
import tableMixin from "@/mixins/table";
import dragTableMixin from "@/mixins/dragTable";
import search from "@/components/search";
// import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
export default {
  components: {
    search,
    dragTable,
    addPolicy,
    upPolicy,
    seePolicy,
    returnPolicy,
    yesPolicy
    // exportPage
  },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      showYes: false,
      showReturn: false,
      isShowSearch: false,
      policyId: "",
      exportData: [],
      exportShow: false,
      showValue: false,
      showPolicy: false,
      phaseName: "",
      showSeePolicy: false,
      tabList: [],
      searchList: [], // 通用搜索
      dragColumn: [],
      tabData: [],
      dbName: "d_oa",
      tableName: "rec_policy_master",
      moduleName: "OA_POLICY_V2",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_policy_master",
        moduleName: "OA_POLICY_V2"
      },
      params: {
        pageNum: "",
        pageSize: "",
        columnValue: "0",
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
  mounted() {
    this.listColumn(0);
    this.listColumn(1);
    this.listColumn(2);
    this.init();
    window.onresize = () => {
      this.changeHeight = document.documentElement.clientHeight - 200;
    };
  },
  methods: {
    init() {
      this.listColumnForPolicy();
      this.getList();
    },
    async listColumnForPolicy() {
      const d = await this.post(this.$api.policy.listColumnForPolicy, {
        queryEntityDto: this.params.queryEntityDto
      });
      if (d.code === 0) {
        this.tabList = d.data;
      }
    },
    async listColumn(columnFlag) {
      const d = await this.post(this.$api.common.basicslistColumn, {
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
      this.listColumnForPolicy()
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      const d = await this.post(this.$api.policy.pagePolicy, {
        ...this.params
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    async delPolicy(id) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.policy.delPolicy, {
          id: id
        });
        if (d.code === 0) {
          this.$message.success("删除成功");
          this.init();
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
</style>