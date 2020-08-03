<template>
  <div>
    <el-table :max-height="500" :data="tabData" size="small" border>
      <el-table-column
        v-for="(item, index) in tabColumns"
        :key="index"
        :prop="item.fieldName"
        align="center"
        :label="item.fieldLabel"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import module from "./module";
import task from "./task";
export default {
  props: { taskNum:"" },
  components: { module, task },
  data() {
    return {
      tabColumns: [
        { fieldLabel: "业务", fieldName: "projectName" },
        { fieldLabel: "项目", fieldName: "engineeringName" },
        { fieldLabel: "模块", fieldName: "moduleName" },
        { fieldLabel: "任务", fieldName: "name" },
        { fieldLabel: "流水", fieldName: "流水NowValue" },
        { fieldLabel: "流量", fieldName: "流量NowValue" }
      ],
      tabData:[],
      itemId: "",
      taskData: {},
      nodata: false,
      moduleTitle: "",
      moduleData: [],
      taskTitle: "",
      moudleSee: false,
      taskSee: false,
      datas: {}
    };
  },
  watch: {
    taskNum(val) {
      console.log(val,1111)
      this.tabData = val;
      // if (this.tabData.list.length == 0) {
      //   this.nodata = true;
      // } else {
      //   this.nodata = false;
      // }
    }
  },
  mounted() {
    // this.customerProjectList();
    // this.datas = this.res.data;
  },
  methods: {
    async seeModule(ob) {
      this.moudleSee = true;
      this.moduleTitle = ob.label;
      const d = await this.post(this.$api.task.customerProjectInfo, {
        itemCode: ob.value
      });
      if (d.code === 0) {
        this.moduleData = d.data;
      }
    },
    async seetask(ob, val) {
      this.taskSee = true;
      this.taskTitle = ob.label;
      this.itemId = ob.value;
      const d = await this.post(this.$api.task.customerModuleInfo, {
        pageNum: "1",
        pageSize: "10",
        itemCode: ob.value
      });
      if (d.code === 0) {
        this.taskData = d.data;
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.all {
  margin-bottom: 20px;
}
.test {
  div {
    box-sizing: border-box;
  }
  border: 1px solid;
  border-top: none;
  border-bottom: none;
  display: flex;
}
.test3 {
  // border: 1px solid yellow;
  display: flex;
}
.borderBottom {
  border-bottom: none !important;
}
.nodata {
  width: 100%;
  height: 200px;
  text-align: center;
  line-height: 200px;
  font-size: 16px;
}
.havbottom {
  border-bottom: 1px solid;
}
</style>
