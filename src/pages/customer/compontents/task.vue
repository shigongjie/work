<template>
  <div>
    <el-table ref="scoreTable" max-height="600" :data="tabData" size="small">
      <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
      <el-table-column
        v-for="(item, index) in tabClounm"
        :key="index"
        :prop="item.fieldName"
        width="200px"
        align="center"
        :label="item.fieldLabel"
        :sortable="(item.orderByName ==='' || item.orderByName==null)?false:'custom'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.column.property ==='customerName'">
            <el-button type="text">{{scope.row[item.fieldName]}}</el-button>
          </div>
          <span v-else>{{scope.row[item.fieldName]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$route.name=='center'"
        width="150px"
        fixed="right"
        align="center"
        label="操作"
      >
        <!-- <template slot-scope="scope"></template> -->
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
  </div>
</template>

<script>
export default {
  props: { taskData: Object, itemId: "" },
  data() {
    return {
      itemIds: "",
      currentPage: 1,
      pageSize: 10,
      pageSizeList: [10, 20, 30, 40, 50, 100],
      tabClounm: [],
      tabData: [],
      total: 0,
      dragColumn: [],
      dbName: "d_oa",
      tableName: "rec_task_master",
      moduleName: "CUSTOMER_MODULE_INFO"
    };
  },
  mounted() {
    this.itemIds = this.$props.itemId
    this.listColumn(0);
  },
  watch: {
    taskData(val) {
      this.tabData = val.data;
      this.total = val.total;
    },
    itemId(val) {
      this.itemIds = val;
    }
  },
  methods: {
    async handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      const d = await this.post(this.$api.task.customerModuleInfo, {
        pageNum: "1",
        pageSize: val,
        itemCode: this.itemIds
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
      }
    },
    async handleCurrentChange(val) {
      this.currentPage = val;
      const d = await this.post(this.$api.task.customerModuleInfo, {
        pageNum: val,
        pageSize: this.pageSize,
        itemCode: this.itemIds
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
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
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-dialog__body {
  padding: 20px 10px !important;
}
</style>