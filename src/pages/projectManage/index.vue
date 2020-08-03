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
      <roleMenu @getList="getList"></roleMenu>
      <el-card class="right-page">
        <div class="head">
          <div class="left-head">
            <span>{{engineeringName}}</span>
            <span style="font-size:15px;color:#d9dfea;margin:0 7px">|</span>
            <span>
              <span>主负责人：{{principalName}}</span>
            </span>
          </div>
          <div>
            <el-button type="primary" size="small" @click="showValue=true;moduleId=''">添加</el-button>
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
        <el-table
          ref="scoreTable"
          max-height="550"
          :data="tabData"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          size="small"
        >
           <el-table-column type="index" label="序号">
            <template scope="scope">{{scope.$index+(currentPage-1)*pageSize+1}}</template>
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
          ></el-table-column>
          <el-table-column width="150px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="moduleId =scope.row.id;showValue = true">编辑</el-button>
              <el-button
                type="text"
                @click="delEngineeringModule(scope.row.id)"
                style="color:red"
              >删除</el-button>
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
        <addModular
          :value.sync="showValue"
          :engineeringMasterId="engineeringMasterId"
          :engineeringName="engineeringName"
          :moduleId="moduleId"
          @getList="getList"
        ></addModular>
      </el-card>
    </div>
  </div>
</template>

<script>
import roleMenu from "./components/roleMenu";
import addModular from "./components/addModular";
import tableMixin from "@/mixins/table";
import dragTableMixin from "@/mixins/dragTable";
import search from "@/components/search";
import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
export default {
  components: { search, dragTable, roleMenu, addModular ,exportPage},
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      isShowSearch: false,
      userId: "",
      showValue: false,
      engineeringName: "",
      moduleId: "",
      principalName:'',
      exportShow:false,
      engineeringName:"",
      infoShow: false,
      searchList: [], // 通用搜索
      exportData: [],
      dragColumn: [],
      tabData: [],
      dbName: "d_oa",
      moduleName: "ENGINEERING_MODULE",
      tableName: "rec_engineering_module",
      dbName: "d_oa",
      searchParams: {
        moduleName: "ENGINEERING_MODULE",
        tableName: "rec_engineering_module",
        dbName: "d_oa"
      },
      engineeringMasterId: "", //项目主表id
      params: {
        pageNum: 1,
        pageSize: 10,
        allotStatus: 0, // 页签状态
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      }
    };
  },
  mounted() {
    this.listColumn(0);
    this.listColumn(1);
    this.listColumn(2);
  },
  methods: {
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
    async getList(item) {
      if (item) {
        this.engineeringMasterId = item.id;
        this.engineeringName = item.engineeringName;
        this.principalName = item.principalName
        this.engineeringName = item.engineeringName
      }
      const d = await this.post(this.$api.projectManage.pageEngineeringModule, {
        pageNum: this.currentPage,
        engineeringMasterId: this.engineeringMasterId,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    // 保存拖拽
    async delEngineeringModule(moduleId) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(
          this.$api.projectManage.delEngineeringModule,
          {
            moduleId: moduleId
          }
        );
        if (d.code === 0) {
          this.$message.success('删除成功')
          this.getList()
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
          userId: this.$store.state.userInfo.data.userId+'',
          engineeringMasterId: this.engineeringMasterId,
          phaseName: "",
          columnValue: ""
        };
        let url = "/oa-boot/export/commonExport";
        this.$refs.exportTab.isShowTab();
        this.exportShow = false;
        this.$common.exportXls(query, url);
      }
    },
        async listTableColumn() {
      const d = await this.post(this.$api.common.resetTableColumn, {
        businessId:'',
        moduleName: this.moduleName,
        dbName: this.dbName,
        tableName: this.tableName,
        fieldModuleEnum: ''
      });
      if (d.code === 0) {
        this.exitDialog();
        this.$refs.dragTab.isShowTab();
      }
    },
    // 退出导出
    exitExport() {
      this.exportShow = false;
      this.exportColumn();
    }
  }
};
</script>

<style lang='scss' scoped>
.wrap {
  height: 100%;
  display: flex;
  .right-page {
    flex: 1;
    .head {
      display: flex;
      margin-bottom: 10px;
      justify-content: space-between;
    }
  }
  .clounmTitle {
    color: #409eff;
    border-color: #409eff;
    width: 70px;
  }
}
.left-head {
  color: #666666;
}
</style>
