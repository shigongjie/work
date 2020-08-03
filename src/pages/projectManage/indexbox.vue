<template>
  <div>
    <div class="content">
      <div class="treeBlock">
        <el-button type="primary" size="small" @click="addBusiness">添加业务范围</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="form.grade!='2'&&form.grade!='3'"
          @click="addMoudel"
        >添加下级</el-button>
        <el-button type size="small" v-if="currentChecked!=''" @click="delThis">删除</el-button>
        <div class="inputWarp">
          <el-input class="serachInput" placeholder="输入关键字搜索" v-model="filterText"></el-input>
          <i class="el-icon-search"></i>
        </div>

        <!-- @node-contextmenu="rightclick" -->

        <el-tree
          class="filter-tree"
          :highlight-current="false"
          :filter-node-method="filterNode"
          @node-click="clickNode"
          :data="data"
          :props="defaultProps"
          node-key="id"
          :default-expand-all="false"
          ref="tree"
          :expand-on-click-node="false"
        ></el-tree>
      </div>

      <div class="tableWarp">
        <el-form ref="form" :model="parentform" label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="parentform.itemName"></el-input>
          </el-form-item>

          <el-form-item label="级别">
            <el-input disabled v-model="parentform.gradeName"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <el-select
              v-model="parentform.departmentId"
              :disabled="parentform.departmentName==null"
              @change="changeDepartment"
              placeholder="请选择部门"
            >
              <el-option
                v-for="(item,index) in DepartmentList"
                :key="index"
                :label="item.departmentName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="负责人" prop="itemName">
            <el-select
              v-model="parentform.modulePrincipalUseId"
              :disabled="parentform.modulePrincipalUseName==null"
              placeholder="请选择负责人"
            >
              <el-option
                v-for="(item,index) in userByDepartmentIdList"
                :key="index"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="任务性质" prop="itemName">
            <el-select
              v-model="parentform.characteristics"
              placeholder="请选择任务性质"
            >
              <el-option
                v-for="(item,index) in properties"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="部门名称">
            <el-input v-model="parentform.departmentName"></el-input>
          </el-form-item>

          <el-form-item label="负责人">
            <el-input v-model="parentform.modulePrincipalUseName"></el-input>
          </el-form-item>

          <el-form-item label="客户负责人">
            <el-input v-model="parentform.customerName"></el-input>
          </el-form-item>-->

          <div style="text-align:right">
            <el-button type="primary" size="small" @click="editSave">保存</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 添加业务弹窗 -->

    <el-dialog v-if="addBusinessDialog" title :visible.sync="addBusinessDialog">
      <el-form :model="bussinessform" label-width="100px" style="margin-top:50px">
        <el-row>
          <el-col :span="18">
            <el-form-item label="业务范围" prop="itemName">
              <el-input v-model="bussinessform.itemName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="部门" prop="departmentId">
          <el-select
            v-model="bussinessform.departmentId"
            @change="changeDepartmentBusiness"
            placeholder="请选择部门"
          >
            <el-option
              v-for="(item,index) in DepartmentList"
              :key="index"
              :label="item.departmentName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="负责人" prop="modulePrincipalUseId">
          <el-select
            @change="test"
            v-model="bussinessform.modulePrincipalUseId"
            placeholder="请选择负责人"
          >
            <el-option
              v-for="(item,index) in userByDepartmentIdList"
              :key="index"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务性质" prop="characteristics">
          <el-select v-model="bussinessform.characteristics" placeholder="请选择任务性质">
            <el-option
              v-for="(item,index) in properties"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addBusinessDialog = false">取 消</el-button>

        <el-button type="primary" @click="sureAddBusinessForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加下级弹窗 -->

    <el-dialog title :visible.sync="addMoudelDialog">
      <el-form :model="addform" label-width="100px" style="margin-top:50px">
        <el-row>
          <el-col :span="18">
            <el-form-item label="名称" prop="itemName">
              <el-input v-model="addform.itemName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="addform.departmentId" @change="changeDepartment" placeholder="请选择部门">
            <el-option
              v-for="(item,index) in DepartmentList"
              :key="index"
              :label="item.departmentName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="负责人" prop="itemName">
          <el-select @change="test1" v-model="addform.modulePrincipalUseId" placeholder="请选择负责人">
            <el-option
              v-for="(item,index) in userByDepartmentIdList"
              :key="index"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!--   <el-form-item label="客户" prop="itemName">
          <el-select v-model="addform.customerMasterId" placeholder="请选择客户">
            <el-option
              v-for="(item,index) in customerList"
              :key="index"
              :label="item.customerName"
              :value="item.customerMasterId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客户负责人" prop="itemName">
          <el-select v-model="addform.customerPrincipalUseId" placeholder="请选择负责人">
            <el-option
              v-for="(item,index) in customerRespon"
              :key="index"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        -->
        <el-row>
          <el-col :span="18">
            <el-form-item label="阶段" prop="itemName">
              <el-input v-model="addform.phaseArray"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="任务性质" prop="characteristics">
            <el-select
              v-model="addform.characteristics"
              placeholder="请选择任务性质"
            >
              <el-option
                v-for="(item,index) in properties"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addMoudelDialog = false">取 消</el-button>

        <el-button type="primary" @click="sureAddBusiness">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let id = 1000;
export default {
  data() {
    return {
      properties: [
        { label: "集团重点", value: "集团重点" },
        { label: "部门重点", value: "部门重点" },
        { label: "个人重点", value: "个人重点" },
        { label: "其他", value: "其他" }
      ],
      customerRespon: [],
      customerList: [],
      bussinessformmodulePrincipalUseId: "",
      bussinessform: {},
      addform: {},
      currentChecked: "",
      addMoudelDialog: false,
      addProjectDialog: false,
      addBusinessDialog: false,
      parentform: {
        itemName: "",
        id: "",
        departmentName: "",
        departmentNo: "",
        parentItemCode: "",
        grade: "",
        resource: "",
        phaseArray: ""
      },
      form: {
        parentItemCode: "",
        itemName: "",
        grade: "",
        departmentId: "",
        customerMasterId: "",
        customerPrincipalUseId: "",
        phaseArray: "",
        modulePrincipalUseId: ""
      },
      data: [],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "itemName"
      },
      tabClounm: [],
      tabData: [],
      tableHead: {
        dbName: "d_oa",
        tableName: "rec_task_item",
        moduleName: "OA_ITEM_MODULE"
      },
      currentPage: 1,
      params: {
        pageNum: 1,
        pageSize: 10,
        allotStatus: 0, // 页签状态
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      // 部门列表
      DepartmentList: [],
      // 人员列表
      userByDepartmentIdList: []
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.listCustomerDetail();
    this.getbusiness();
    this.listColumn();
    this.getDepartment();
    this.listPrincipal();
  },
  methods: {
    async listPrincipal() {
      const d = await this.post(this.$api.projectManage.listPrincipal);
      if (d.code === 0) {
        this.customerRespon = d.data;
      }
    },
    async listCustomerDetail() {
      const d = await this.post(this.$api.customer.listCustomerMaster);
      if (d.code === 0) {
        this.customerList = d.data;
      }
    },
    // 删除
    delThis() {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.del();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async del() {
      const d = await this.post("/oa-boot/item/delItem", {
        id: this.currentChecked
      });
      if (d.code === 0) {
        this.getbusiness();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      }
      // console.log(this.currentChecked, this.parentform);
    },
    // 获取部门
    async getDepartment() {
      const d = await this.post(this.$api.projectManage.listAllDepartment);
      if (d.code === 0) {
        this.DepartmentList = d.data;
      }
    },
    // 获取部门下的用户
    async changeDepartment(id) {
      this.addform.modulePrincipalUseId = "";
      this.parentform.modulePrincipalUseId = "";
      const d = await this.post(
        this.$api.projectManage.listUserByDepartmentId,
        { departmentId: id }
      );
      if (d.code === 0) {
        this.userByDepartmentIdList = d.data;
      }
    },
    test1(val) {
      let obj = { ...this.addform };
      obj.modulePrincipalUseId = val;
      this.addform = obj;
    },
    // 保存修改
    async save() {
      let params = {};
      params.itemName = this.parentform.itemName;
      params.id = this.parentform.id;
      params.grade = this.parentform.grade;
      params.modulePrincipalUseId = this.parentform.modulePrincipalUseId;
      params.departmentId = this.parentform.departmentId;
      params.customerMasterId = this.parentform.customerMasterId;
      params.customerPrincipalUseId = this.parentform.customerPrincipalUseId;
      params.phaseArray = this.parentform.phaseArray;
      params.parentItemCode = this.parentform.parentItemCode;
      params.characteristics = this.parentform.characteristics;
      const d = await this.post(this.$api.projectManage.addOrEditItem, {
        ...params
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        this.getbusiness();
      }
    },
    editSave() {
      this.$confirm("是否保存修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.save();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    rightclick(data) {},
    // 获取详情
    async getItem(id) {
      const d = await this.post("/oa-boot/item/getItem", {
        id: id
      });
      if (d.code === 0) {
        this.parentform = d.data;
        this.form = d.data;
        const c = await this.post(
          this.$api.projectManage.listUserByDepartmentId,
          { departmentId: d.data.departmentId }
        );
        if (c.code === 0) {
          this.userByDepartmentIdList = c.data;
        }
      }
    },
    handleSelectionChange() {},
    sortChange() {},
    //   获取表头
    async listColumn() {
      const d = await this.post("/basics-boot/column/listColumn", {
        columnFlag: "0",
        businessId: "",
        ...this.tableHead
      });
      if (d.code === 0) {
        this.tabClounm = d.data;
      }
    },
    //   获取表单列表
    async getList(code) {
      const d = await this.post("/oa-boot/item/pageItem", {
        pageNum: this.params.pageNum,
        parentItemCode: code,
        pageSize: this.params.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    // 获取业务
    async getbusiness() {
      const d = await this.post("/oa-boot/item/listTree", {
        pageNum: "1",
        pageSize: "10",
        parentItemCode: "0"
      });
      if (d.code === 0) {
        this.data = d.data;
      }
    },
    clearData() {},
    filterNode(value, data) {
      if (!value) return true;
      return data.itemName.indexOf(value) !== -1;
    },
    clickNode(data, Node) {
      this.currentChecked = data.id;
      this.getItem(data.id);
    },
    async changeDepartmentBusiness() {
      // console.log(this.bussinessform.modulePrincipalUseId);
      this.bussinessform.modulePrincipalUseId = "";
      const d = await this.post(
        this.$api.projectManage.listUserByDepartmentId,
        { departmentId: this.bussinessform.departmentId }
      );
      if (d.code === 0) {
        this.userByDepartmentIdList = d.data;
      }
    },
    test(val) {
      this.bussinessformmodulePrincipalUseId = val;
      let obj = { ...this.bussinessform };
      obj.modulePrincipalUseId = val;
      this.bussinessform = obj;
    },

    async addBusiness() {
      this.addBusinessDialog = true;
      const d = await this.post(this.$api.projectManage.listAllDepartment);
      if (d.code === 0) {
        this.DepartmentList = d.data;
      }
    },
    // 确认添加下级
    async sureAddBusiness() {
      const d = await this.post(this.$api.projectManage.addOrEditItem, {
        ...this.addform
      });
      if (d.code === 0) {
        this.addMoudelDialog = false;
        this.addform = {};
        this.getbusiness();
      }
    },
    async sureAddBusinessForm() {
      this.bussinessform.parentItemCode = "0";
      this.bussinessform.grade = "0";
      const d = await this.post(this.$api.projectManage.addOrEditItem, {
        ...this.bussinessform
      });
      if (d.code === 0) {
        this.addBusinessDialog = false;
        this.bussinessform = {};
        this.getbusiness();
      }
    },
    async addMoudel() {
      if (this.parentform.grade == 0) {
        this.addform.grade = "1";
      } else if (this.parentform.grade == 1) {
        this.addform.customerMasterId = "";
        this.addform.customerPrincipalUseId = "";
        this.addform.grade = "2";
      }
      this.addform.parentItemCode = this.parentform.itemCode;
      this.addform.phaseArray = this.parentform.phaseArray;

      this.addMoudelDialog = true;
      const d = await this.post(this.$api.projectManage.listAllDepartment);
      if (d.code === 0) {
        this.DepartmentList = d.data;
      }
    },
    // 新增或编辑: 业务，项目和模块
    async editItem(grade) {}
  }
};
</script>

<style lang='scss' scoped>
.treeBlock {
  width: 45%;
  min-width: 350px;
  margin-top: 32px;
  background: #fff;
  padding: 20px 20px;
}

.serachInput {
  margin-top: 20px;
  margin-bottom: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.content {
  display: flex;
  .tableWarp {
    flex: 1;
    background: white;
    padding: 50px;
    margin-left: 30px;
    margin-top: 34px;
    .btnWarp {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10px;
    }
  }
}

/deep/ .el-tree-node__content {
  height: 45px;
}

/deep/ .el-tree-node__label {
  padding: 2px 10px;
}

/deep/ .el-tree-node:focus > .el-tree-node__content {
  background: none;
}

/deep/ .el-tree-node:hover > .el-tree-node__content {
  background: none;
}

/deep/ .el-tree-node:focus > .el-tree-node__content > .el-tree-node__label {
  background-color: #a3e7ff;
  border-radius: 5px;
}

/deep/ .el-tree-node__label:hover {
  background-color: #e6f7ea;
  border-radius: 5px;
}

/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: white;
}

/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  > .el-tree-node__label {
  background-color: #a3e7ff;
  border-radius: 5px;
}
/deep/.el-form-item__label {
  font-size: 14px !important;
  color: #666666 !important;
}
.inputWarp {
  i {
    position: absolute;
    right: 12px;
    font-size: 18px;
    top: 31px;
  }
}
</style>
