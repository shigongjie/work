<template>
  <div>
    <el-dialog
      id="dragWrap"
      v-if="isOpen"
      title="自定义列表项"
      :close-on-click-modal="false"
      :visible.sync="dragTabShow"
      :before-close="exitShow"
      append-to-body
      width="700px"
    >
      <el-table
        v-if="isOpen"
        border
        id="testId"
        :data="tableData"
        size="mini"
        ref="rolePickerDialogTable"
        tooltip-effect="dark"
        @select="handleSelectionChange"
        @select-all="handAllSelect"
      >
        <el-table-column type="selection" align="center" width="55" :selectable="selectable"></el-table-column>
        <!-- <el-table-column label="序号" align="center" prop="sortNo" type="index" show-overflow-tooltip width="50"></el-table-column> -->
        <el-table-column align="left" prop="fieldLabel" label="名称"></el-table-column>

        <el-table-column align="center" class="div" width="200px" label="操作">
          <template slot-scope="{row}">
            <span class="div" style="color:#b3b5b6">宽度</span>
            <el-input
              class="edit-cell allInput div"
              size="mini"
              style="width:60px"
              v-model="row.width"
            />
            <span style="color:#b3b5b6">px</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="btnWarp" slot="footer">
        <el-button
          class="btns"
          :disabled="saveLoading"
          :loading="initLoading"
          @click="initColumn"
          size="small"
        >重置</el-button>
        <el-button class="btns" @click="exitShow" size="small">取消</el-button>
        <el-button
          class="btns"
          @click="saveData"
          type="primary"
          :loading="saveLoading"
          size="small"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  name: "dragTable",
  props: {
    tableData: Array,
    saveClounm: Function,
    exitDialog: Function,
    dragTabShow: Boolean
  },
  data() {
    return {
      copyData: [],
      isOpen: false,
      saveLoading: false,
      initLoading: false
    };
  },
  created() {},
  mounted() {
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  watch: {
    tableData(val) {
      if (val.length !== 0) {
        this.copyData = JSON.parse(JSON.stringify(this.tableData));
      }
    },
    dragTabShow(val) {
      this.isOpen = val;
      if (this.isOpen) {
        this.columnDrop();
        this.computedData();
      }
    }
  },
  destroyed() {
    this.isOpen = false;
  },
  methods: {
    initColumn() {
      this.initLoading = true;
      this.$emit("listTableColumn");
    },
    selectable(row, index) {
      return row.requiredFlag !== "1";
    },
    exitShow() {
      this.$emit("exitDialog");
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
      this.initLoading = false;
      this.saveLoading = false;
    },
    saveData() {
      // this.copyData = this.copyData.map((item, index) => ({
      //   id: item.id,
      //   fieldLabel: item.fieldLabel,
      //   fieldName: item.fieldName,
      //   selectFlag: item.selectFlag,
      //   requiredFlag: item.requiredFlag,
      //   width: item.width,
      //   sortNo: index
      // }));
      this.tableData.forEach(item => {
        this.copyData.forEach(todo => {
          if (item.fieldName === todo.fieldName) {
            todo.width = item.width;
          }
        });
      });
      this.saveLoading = true;
      this.$emit("saveClounm", this.copyData);
      this.$emit("getList");
    },
    computedData() {
      this.$nextTick(() => {
        this.tableData.forEach(item => {
          if (item.selectFlag === "1") {
            // 将原有的角色数据在Table中进行渲染
            this.$refs.rolePickerDialogTable.toggleRowSelection(item, true);
          }
        });
      });
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
          "#testId .el-table__body-wrapper tbody"
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
<style lang="scss" scope>
#dragWrap {
  .el-dialog {
    position: absolute;
    top: 15px;
    left: 0;
    left: 0;
    right: 0;
    margin: 0 auto !important;
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  .el-dialog__body {
    overflow: auto;
  }
  #testId {
    cursor: move;
  }
  .el-input__inner {
    border: none;
  }
  .div {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
.btnWarp {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>