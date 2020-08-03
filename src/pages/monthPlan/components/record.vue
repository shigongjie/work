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
      <div class="search">
        <span>年月</span>
        <el-date-picker
          size="small"
          v-model="value1"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        ></el-date-picker>
      </div>
      <div class="btns">
        <el-button
          type="primary"
          size="small"
          @click="showPlan = true"
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
            <el-button type="text" @click="see(scope.row.id)">编辑</el-button>
            <el-button type="text" @click="see(scope.row.id)">报送</el-button>
            <el-button type="text" style="color: red;" @click="see(scope.row.id)">删除</el-button>
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
</template>

<script>
import commonMix from "@/mixins/common";
export default {
  mixins: [commonMix],
  data() {
    return {
      value1:'',
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_task_master",
        moduleName: "OA_PAGETASKV2"
      }
    };
  },
  mounted() {},
  methods: {
    async getList() {}
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
</style>