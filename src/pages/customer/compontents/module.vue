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
        <template slot-scope="scope"></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: { moduleData: Array },
  data() {
    return {
      tabClounm: [],
      tabData: [],
      dragColumn: [],
      dbName: "d_oa",
      tableName: "rec_task_master",
      moduleName: "CUSTOMER_PROJECT_INFO"
    };
  },
  watch:{
      moduleData(val){
          this.tabData = val
      }
  },
  mounted() {
    this.listColumn(0);
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
    }
  }
};
</script>

<style>
</style>