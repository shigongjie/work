<template>
  <el-dialog
    title="查看"
    :visible.sync="showValue"
    width="1050px"
    top="20px"
    class="addOrUpCustomer"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="dialog">
      <div class="head">
        <div>
          <div class="item el-form-item el-form-item--small">
            <label class="el-form-item__label">进展类型</label>
            <el-select
              v-model="params.itemId"
              filterable
              clearable
              @change="changeItem"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="(item,index) in progressList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="item el-form-item el-form-item--small">
            <label class="el-form-item__label">创建人</label>
            <el-select
              v-model="params.createBy"
              filterable
              clearable
              @change="changeItem"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="(item,index) in createdList"
                :key="index"
                :label="item.createUserName"
                :value="item.createBy"
              ></el-option>
            </el-select>
            <!-- <el-input type="text" v-model="params.createUserName"></el-input> -->
          </div>
        </div>
        <div style="display:block">
          <el-button type="primary" size="small" @click="addOrEditProgress('添加')">添加进展</el-button>
        </div>
      </div>
      <el-table :max-height="500" :data="tabData" size="small" border>
        <el-table-column
          v-for="(item, index) in tabColumns"
          :key="index"
          :prop="item.fieldName"
          align="center"
          :label="item.fieldLabel"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template
            slot-scope="scope"
            v-if="scope.row.createBy===$store.state.userInfo.data.userId"
          >
            <el-button type="text" @click="addOrEditProgress('编辑',scope.row)">编辑</el-button>
            <el-button type="text" @click="addOrEditProgress('删除',scope.row.detailId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager" style="padding: 20px 0px;">
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
    <addProgress
      :value.sync="showProgress"
      :formItem="form"
      :editData="editData"
      :itemId="itemId"
      @getList="pageByBusinessId"
    ></addProgress>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
import tabData from "@/mixins/table";
import addProgress from "@/components/createTask/compontents/addProgress";
export default {
  props: { formItem: Object },
  components: { addProgress },
  mixins: [modalMixin, tabData],
  data() {
    return {
      //当前页
      currentPage: 1,
      //每页大小
      pageSize: 10,
      editData: "",
      itemId: "",
      total: 0,
      form: {},
      showProgress: false,
      tabData: [],
      tabColumns: [
        { fieldLabel: "进展类型", fieldName: "itemName" },
        { fieldLabel: "进展内容", fieldName: "content" },
        { fieldLabel: "创建人", fieldName: "createUserName" },
        { fieldLabel: "创建时间", fieldName: "createTime" },
        { fieldLabel: "客户", fieldName: "customName" }
      ],
      createdList: [],
      progressList: [],
      params: {
        itemId: "",
        createUserName: "",
        createBy: "",
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  mounted() {},
  watch: {
    showValue(val) {
      if (val) {
        this.form = this.formItem;
        // this.businessIds = this.formItem.id;
        this.listWithLabel();
        this.pageByBusinessId();
        this.findByBusinessId();
      }
    }
  },
  methods: {
    // 删除细表
    async delAjax(id) {
      const d = await this.post(this.$api.customer.deleteDetail, {
        id: id
      });
      if (d.code === 0) {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.pageByBusinessId();
      }
    },
    del(id, type) {
      this.$confirm("删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delAjax(id, type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addOrEditProgress(type, data) {
      if (type == "添加") {
        this.showProgress = true;
        this.editData = "";
        this.itemId = "";
      }
      if (type == "编辑") {
        this.showProgress = true;
        this.editData = data.detailId;
        this.itemId = data.itemId;
      }
      if (type == "删除") {
        this.$confirm("删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delAjax(data);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    changeItem() {
      this.pageByBusinessId(this.params.itemId, this.params.createBy);
    },
    async listWithLabel() {
      const d = await this.post(this.$api.customer.listWithLabel, {
        processFlag: 1
      });
      if (d.code === 0) {
        this.progressList = d.data;
      }
    },
    //进展
    async pageByBusinessId(itemId, createBy) {
      const d = await this.post(this.$api.task.pageByBusinessId, {
        businessId: this.form.id,
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        itemId: itemId,
        createBy: createBy
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    //创建人？用不分页的列表请求过来的数据提取创建人
    async findByBusinessId() {
      const d = await this.post(this.$api.task.findByBusinessId, {
        businessId: this.form.id
      });
      if (d.code === 0) {
        this.createdList = d.data;
      }
    },
    //选择每页显示条数触发
    handleSizeChange(val) {
      this.currentPage = 1;
      this.params.pageSize = val;
      this.pageByBusinessId();
    },
    //点击页码触发
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.currentPage = val;
      this.pageByBusinessId();
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  width: 100%;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
.head {
  display: flex;
  justify-content: space-between;
  & > div {
    display: flex;
  }
  .item {
    label {
      width: 120px;
    }
    display: flex;
  }
}
</style>