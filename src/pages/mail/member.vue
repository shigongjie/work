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
      <div class="left-page el-card">
        <div class="head-title">
          <p>部门</p>
        </div>
        <el-divider></el-divider>
        <tree @getList="getList"></tree>
      </div>

      <el-card class="right-page">
        <div class="head">
          <div>
            <span>|</span>
            <span style="margin-left:10px">{{departmentName}}</span>
          </div>
          <div>
            <el-button type="primary" size="small" @click="showValue=true">添加</el-button>
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
          max-height="600"
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
              <el-button type="text" @click="upUser(scope.row)">编辑</el-button>
              <el-button type="text" style="color:red" @click="delUser(scope.row)">删除</el-button>
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
        <addUser :value.sync="showValue" :departmentId="departmentId" @getList="getList"></addUser>
        <upUserInfo
          :value.sync="infoShow"
          :departmentId="departmentId"
          :userId="userId"
          @getList="getList"
        ></upUserInfo>
      </el-card>
    </div>
  </div>
</template>

<script>
import addUser from "./components/addUser";
import tableMixin from "@/mixins/table";
import upUserInfo from "./components/upUserInfo";
import dragTableMixin from "@/mixins/dragTable";
import search from "@/components/search";
import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
import tree from "@/components/tree";
export default {
  components: { tree, search, dragTable, addUser, upUserInfo,exportPage },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      isShowSearch: false,
      userId: "",
      showValue: false,
      exportShow: false,
      departmentName: "",
      infoShow: false,
      searchList: [], // 通用搜索
      dragColumn: [],
      tabData: [],
      exportData:[],
      departmentId: "",
      moduleName: "DEPARTMENT_MEMBER",
      tableName: "rec_user_extend_info",
      dbName: "d_oa",
      searchParams: {
        moduleName: "DEPARTMENT_MEMBER",
        tableName: "rec_user_extend_info",
        dbName: "d_oa"
      },
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
  watch: {
    departmentId(val) {
      return val + "";
    }
  },
  methods: {
    upUser(row) {
      this.userId = row.userId + "";
      this.infoShow = true;
    },
    async delUser(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.mail.delMember, {
          departmentId: this.departmentId,
          userId: row.userId + ""
        });
        if (d.code === 0) {
          this.getList();
        }
      });
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
    async getList(obj) {
      if(obj){
        this.departmentId =  obj.id || this.departmentId;
        this.departmentName = obj.departmentName || this.departmentName;
        this.departmentId = this.departmentId + "";
      }
      const d = await this.post(this.$api.mail.pageMemberByDepartment, {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto,
        departmentId: this.departmentId
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
          queryEntityDto: JSON.stringify(this.params.queryEntityDto),
          fieldStringArray: d.data,
          modifyStatus: "0",
          uuid: d.data,
          dbName: this.dbName,
          tableName: this.tableName,
          moduleName: this.moduleName,
          repertoryStatus: "0"
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
  display: flex;
  .left-page {
    min-width: 200px;
    box-shadow: 3px -2px 17px gainsboro;
  }
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
.head-title {
  padding: 20px;
  padding-bottom: 0;
}
.el-divider--horizontal {
  margin: 15px auto;
}
</style>
