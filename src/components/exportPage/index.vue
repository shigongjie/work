<template>
  <div>
    <el-dialog
      id="exportWrap"
      v-if="isClear"
      title="自定义导出数据"
      :close-on-click-modal="false"
      :visible.sync="exportShow"
      append-to-body
      width="700px"
      :before-close="exitShow"
    >
      <el-table
        v-if="isClear"
        border
        id="exportId"
        :data="exportData"
        size="mini"
        ref="exportRef"
        tooltip-effect="dark"
        @select="handleSelectionChange"
        @select-all="handAllSelect"
      >
        <el-table-column type="selection" align="center" :selectable="selectable" width="55"></el-table-column>
        <el-table-column align="left" prop="fieldLabel" label="名称"></el-table-column>
      </el-table>
      <div class="btn-wrap">
        <el-button class="btns" @click="exitShow" size="small">取消</el-button>
        <el-button class="btns" @click="saveData" type="primary" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  name: "dragTable",
  props: {
    exportData: Array,
    exitExport: Function,
    saveExport: Function,
    exportShow: Boolean
  },
  data() {
    return {
      multipleSelection: [],
      copyData: [],
      isClear: true
    };
  },
  created() {},
  mounted() {},
  watch: {
    exportData(val) {
      if (val.length !== 0) {
        this.exportData.forEach(item => {
          item.selectFlag = "1";
        });
        this.copyData = JSON.parse(JSON.stringify(this.exportData));
      }
    },
    exportShow(val) {
      this.isClear = val;
      if (val) {
        this.columnDrop();
        this.computedData();
      }
    }
  },
  destroyed() {
    this.isClear = false;
  },
  methods: {
    exitShow() {
      this.$emit("exitExport");
    },
    handAllSelect(selection) {
      if (selection.length !== 0) {
        this.copyData.forEach(item => {
          item.selectFlag = "0";
          selection.forEach(todo => {
            if (todo.fieldName == item.fieldName) {
              item.selectFlag = "1";
            }
          });
        });
      } else {
        this.copyData.forEach(item => {
          item.selectFlag = "0";
        });
      }
    },
    isShowTab() {
      this.isClear = false;
    },
    saveData() {
      let fieldStringArray = this.copyData.filter(item => {
        return item.selectFlag === "1" || item.requiredFlag === "1";
      });
      this.$emit("saveExport", fieldStringArray);
    },
    computedData() {
      this.$nextTick(() => {
        this.exportData.forEach(item => {
          // 将原有的角色数据在Table中进行渲染
          this.$refs.exportRef.toggleRowSelection(item, true);
        });
      });
    },
    selectable(row, index) {
      return row.requiredFlag !== "1";
    },
    handleSelectionChange(val) {
      this.copyData.forEach(item => {
        item.selectFlag = "0";
        val.forEach(todo => {
          if (item.fieldName === todo.fieldName) {
            item.selectFlag = "1";
          }
        });
      });
    },
    // 数据根据序号变化排序
    sortByIndex(data, newIndex, oldIndex) {
      const minIndex = newIndex >= oldIndex ? oldIndex : newIndex;
      const maxIndex = newIndex < oldIndex ? oldIndex : newIndex;
      const currRow = data.splice(oldIndex, 1)[0];
      data.splice(newIndex, 0, currRow);
      data.forEach((item, i) => {
        if (minIndex <= i && i <= maxIndex) {
          item.sortNo = i;
        }
      });
      return data;
    },
    //列拖拽
    columnDrop() {
      let that = this;
      this.$nextTick(() => {
        const wrapperTr = document.querySelector(
          "#exportId .el-table__body-wrapper tbody"
        );
        var sortable = Sortable.create(wrapperTr, {
          animation: 150,
          swap: true,
          swapClass: "highlight",
          ghostClass: "blue-background-class",
          onEnd: function(evt) {
            let oldIndex = evt.oldIndex;
            let newIndex = evt.newIndex;
            let sortArr = that.sortByIndex(that.copyData, newIndex, oldIndex);
            that.copyData = sortArr;
          },
          onChoose: function(evt) {
            that.copyData.forEach((item, index) => {
              item.sortNo = index;
            });
            that.$set(that.copyData);
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#exportWrap {
  .el-dialog__body {
    overflow: auto;
  }
  #exportId {
    cursor: move;
    .el-input__inner {
      border: none;
    }
  }
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }
  .div {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
  .btn-wrap {
    height: 60px;
    line-height: 50px;
    text-align: left;
    .btns {
      // width: 80px;
    }
  }
}
</style>