<template>
  <div>
    <div class="btnWarp">
      <el-button type="primary" size="small" @click="add()">添加审批流程</el-button>
    </div>
    <el-table
      border
      size="mini"
      style="width: 100%;margin:auto;margin-top:10px"
      :data="projectTargetTable"
    >
      <el-table-column label="序号" width="80" type="index" :index="indexMethod"></el-table-column>
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
      <!-- <el-table-column prop="approveType" width="180" label="审批类型"></el-table-column>
      <el-table-column prop="category" width="180" label="审批类别"></el-table-column>
      <el-table-column prop="recDescribe" label="审批流程"></el-table-column>-->
      <el-table-column prop="date" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteConfirm(scope.row.id)">移除</el-button>
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
    <el-dialog
      title="添加审批流程"
      :visible.sync="addApprovaldialog"
      width="1000px"
      :before-close="clearData"
    >
      <el-form ref="form" size="small" :model="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门" prop="approveType">
              <el-select
                v-model="departmentName"
                filterable
                placeholder="请选择"
                @change="changeDepartment"
              >
                <el-option
                  v-for="(item,index) in DepartmentList"
                  :key="index"
                  :label="item.departmentName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批类型" prop="approveType">
              <el-select
                v-model="form.approveType"
                @change="changeEngineering"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in ApproveTypeList"
                  :key="index"
                  :label="item.tpeName"
                  :value="item.tpeName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类别" prop="category">
              <el-select
                v-model="form.category"
                @change="getApprovedModule"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in ApproveTypeCategoryList"
                  :key="index"
                  :label="item.categoryName"
                  :value="item.categoryName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="padding-left:22px;">
          <approved
            @approvedGroup="getApprovedGroup"
            @copierList="copierList"
            :businessType="5"
            :approvedPram="form.approveListParam"
            :copier="form.copierListParam"
          />
        </div>
      </el-form>
      <div class="btnWarp">
        <el-button type="primary" size="small" @click="sureAdd()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import approved from "../../../pages/policy/compontents/approved";
import tableMixin from "@/mixins/table";
import commonMix from "@/mixins/common";
export default {
  components: { approved },
  mixins: [tableMixin, commonMix],
  data() {
    return {
      searchParams: {
        dbName: "d_oa",
        tableName: "cfg_template_approve",
        moduleName: "OA_TEMPLATE_APPROVE"
      },
      departmentName: "",
      DepartmentList: [],
      params: {
        pageNum: 1,
        pageSize: 10,
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      //当前页
      currentPage: 1,
      //每页大小
      pageSize: 10,
      //总页数
      total: 0,
      //每页页码条数列表
      pageSizeList: [10, 20, 30, 40, 50, 100],
      addApprovaldialog: false,
      projectTargetTable: [],
      form: {},
      ApproveTypeList: [],
      ApproveTypeCategoryList: []
    };
  },
  mounted() {
    this.listApproveType();
    this.getpageTemplate();
    this.getDepartment();
  },
  methods: {
    getLocalStorage(key) {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : false;
    },
    changeDepartment() {
      this.DepartmentList.forEach(item => {
        if (item.id == this.departmentName) {
          this.form.departmentId = item.id;
          this.form.departmentName = item.departmentName;
          this.form.departmentNo = item.departmentNo;
        }
      });
    },
    async getDepartment() {
      const d = await this.post(this.$api.projectManage.listAllDepartment);
      if (d.code === 0) {
        this.DepartmentList = d.data;
        let x = this.getLocalStorage("vuex");
        this.departmentName = x.userInfo.data.departmentName;
        this.DepartmentList.forEach(item => {
          if (item.departmentName == this.departmentName) {
            this.form.departmentId = item.id;
            this.form.departmentName = item.departmentName;
            this.form.departmentNo = item.departmentNo;
          }
        });
      }
    },
    // 审批类型
    async listApproveType() {
      const d = await this.post(this.$api.approve.listApproveType);
      if (d.code === 0) {
        this.ApproveTypeList = d.data;
      }
    },
    // 审批类别
    async listApproveTypeCategory() {
      const d = await this.post(this.$api.approve.listApproveTypeCategory, {
        approveTypeName:
          this.form.approveType === "" ? "" : this.form.approveType
      });
      if (d.code === 0) {
        this.ApproveTypeCategoryList = d.data;
      }
    },
    clearData() {
      this.form = {};
      this.form.approveListParam = [];
      this.form.copierListParam = [];
      this.addApprovaldialog = false;
      let x = this.getLocalStorage("vuex");
      this.departmentName = x.userInfo.data.departmentName;
      this.DepartmentList.forEach(item => {
        if (item.departmentName == this.departmentName) {
          this.form.departmentId = item.id;
          this.form.departmentName = item.departmentName;
          this.form.departmentNo = item.departmentNo;
        }
      });
    },
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    },
    add() {
      this.addApprovaldialog = true;
    },
    async sureAdd() {
      const d = await this.post(this.$api.approve.addOrEditTemplate, {
        ...this.form
      });
      if (d.code === 0) {
        this.getpageTemplate();
        this.clearData();
        // this.addApprovaldialog = false;
      }
    },
    async getpageTemplate() {
      const d = await this.post(this.$api.approve.pageTemplate, {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (d.code === 0) {
        this.projectTargetTable = d.data.data;
        this.total = d.data.total;
      }
    },
    changeEngineering() {
      this.listApproveTypeCategory();
    },
    getApprovedModule() {},
    indexMethod(index) {
      return index + 1;
    },
    async edit(id) {
      const d = await this.post(this.$api.approve.getTemplate, { id: id });
      if (d.code === 0) {
        this.form = d.data;
        this.departmentName=this.form.departmentName
        this.addApprovaldialog = true;
        
      }
    },
    deleteConfirm(id) {
      this.$confirm("此操作将删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteIt(id);
        })
        .catch(val => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async deleteIt(id) {
      const d = await this.post(this.$api.approve.delTemplate, { id: id });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getpageTemplate();
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getpageTemplate();
    },
    //点击页码触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getpageTemplate();
    }
  }
};
</script>

<style lang='scss' scoped>
.btnWarp {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  padding-bottom: 10px;
}
</style>