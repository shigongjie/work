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
          v-model="quickParams.timeArr"
          type="monthrange"
          @change="changeTimer"
          range-separator="至"
          format="yyyy-MM"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        ></el-date-picker>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" @click="showPlan = true">新建</el-button>
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
            <el-button type="text" @click="editMonthPlan(scope.row.id)">编辑</el-button>
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
    <el-dialog width="400px" title :visible.sync="showPlan" append-to-body>
      <div class="dialog">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="计划月份" prop>
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="belongTime"
              type="month"
              placeholder="选择月"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPlan = false" size="small">取消</el-button>
        <el-button type="primary" @click="submit" size="small">确认</el-button>
      </div>
    </el-dialog>
    <!-- 编辑月计划 -->
    <el-dialog width="60%" title :visible.sync="editPlan" append-to-body>
      <detiallist :editData='editData'/>
    </el-dialog>
  </div>
</template>

<script>
import detiallist from "./detiallist";
import commonMix from "@/mixins/common";
export default {
  components: { detiallist },
  mixins: [commonMix],
  data() {
    return {
      belongTime: "",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_month_plan",
        moduleName: "OA_MONTH_PLAN"
      },
      editPlan: false,
      showPlan: false,
      form: {
        month: ""
      },
      editData:'',
      quickParams: {
        timeArr: []
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    changeTimer() {
      this.params.pageNum = 1;
      this.getList();
    },
    async getList() {
      const d = await this.post(this.$api.plan.pageMonthPlan, {
        ...this.params,
        ...this.quickParams
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    clearData() {
      this.showPlan = false;
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
    // 编辑月计划
    async editMonthPlan(val) {
      const d = await this.post(this.$api.plan.getMonthPlanTree, {
        id: val
      });
      if (d.code === 0) {
        this.editPlan = true;
        // console.log(d);
        this.editData = d.data
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.addOrEditMonthPlan();
        }
      });
      this.clearData();
    }
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