<template>
  <div class="role">
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
      <el-card v-if="!isOpen" class="right-page emt">
        <div>
          <img src="@/assets/images/icon_emt.png" alt width="140" height="140" />
          <p>页面空空的，请先添加角色！</p>
        </div>
      </el-card>
      <el-card class="right-page" v-else>
        <div class="head">
          <div>
            <span>|</span>
            <span style="margin-left:10px">{{roleName}}</span>
          </div>
          <div>
            <el-button type="primary" size="small" @click="showValue=true;">添加</el-button>
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
              <el-button type="text" @click="userId =scope.row.userId;infoShow = true">编辑</el-button>
              <el-button type="text" style="color:red" @click="delMember(scope.row)">删除</el-button>
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
        <addRoleUser
          :value.sync="showValue"
          :roleId="roleId+''"
          :roleAppCode="roleAppCode"
          @getList="getList"
        ></addRoleUser>
        <upUserInfo
          :value.sync="infoShow"
          :roleId="roleId+''"
          :userId="userId+''"
          :roleAppCode="roleAppCode"
          @getList="getList"
        ></upUserInfo>
      </el-card>
    </div>
  </div>
</template>

<script>
import addRoleUser from "./components/addRoleUser";
import tableMixin from "@/mixins/table";
import upUserInfo from "./components/upUserInfo";
import exportPage from "@/components/exportPage";
import dragTableMixin from "@/mixins/dragTable";
import search from "@/components/search";
import dragTable from "@/components/dragTable/index";
import roleMenu from "./components/roleMenu";
export default {
  components: { search, dragTable, addRoleUser, upUserInfo, roleMenu,exportPage },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      isShowSearch: false,
      userId: "",
      showValue: false,
      exportShow: false,
      infoShow: false,
      isOpen: true,
      roleName: "",
      roleId: "",
      roleAppCode: "",
      searchList: [], // 通用搜索
      dragColumn: [],
      exportData: [],
      tabData: [],
      dbName: "d_oa",
      tableName: "rec_user_extend_info",
      moduleName: "ROLE_MEMBER",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_user_extend_info",
        moduleName: "ROLE_MEMBER"
      },
      params: {
        pageNum: 1,
        pageSize: 10,
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
    async getList(roleId, roleAppCode, roleName) {
      this.roleAppCode = roleAppCode;
      this.roleName = roleName;
      if (roleId) {
        this.roleId = roleId + "";
        this.isOpen = true;
      } else {
        this.isOpen = false;
        this.tabData = [];
        this.total = 0;
        return;
      }
      const d = await this.post(this.$api.mail.pageMemberByRole, {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        roleAppCode: this.roleAppCode,
        queryEntityDto: this.params.queryEntityDto,
        roleId: this.roleId
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    async delMember(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.mail.delRuleMember, {
          roleId: this.roleId + "",
          userId: row.userId + "",
          roleAppCode: this.roleAppCode
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
.role {
  .wrap {
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
}
.emt {
  text-align: center;
  padding-top: 150px;
}
</style>
