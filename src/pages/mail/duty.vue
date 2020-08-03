<template>
  <div class="all">
    <div class="left">
      <div class="btnWarp">
        <el-button size="mini" @click="addPost()" type="primary" icon="el-icon-plus">新建岗位</el-button>
      </div>

      <el-table :data="tabData" size="small" border>
        <el-table-column
          v-for="(item, index) in tabClounm"
          :key="index"
          :prop="item.fieldName"
          align="center"
          :label="item.fieldLabel"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="180px" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="seeUser(scope.row.id)">用户</el-button>
            <el-button type="text" @click="dutySet(scope.row.id)">职责授权</el-button>
            <!-- <el-button type="text" @click="demandId=scope.row.id">更多</el-button> -->
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
    </div>
    <div class="right" v-if="this.positionId!=''">
      <!-- <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="width:100%">
        <el-form-item label="用户账号">
          <el-input size="mini" v-model="searchForm.user" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>-->
      <div class="btnWarp">
        <!-- <el-button @click="addPost()" size="mini" type="primary" icon="el-icon-plus">新增用户</el-button> -->
        <el-button @click="addUser()" size="mini" type="primary" icon="el-icon-plus">已有用户</el-button>
      </div>

      <el-table :max-height="500" :data="userTabData" size="small" border>
        <el-table-column
          v-for="(item, index) in userCloumn"
          :key="index"
          :prop="item.fieldName"
          align="center"
          :label="item.fieldLabel"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
    <!-- 职责 -->
    <el-dialog title="职责授权" :visible.sync="dutySetDialog" width="60%">
      <el-checkbox-group v-model="checkDuty">
        <el-checkbox
          style="width:120px;"
          v-for="(item,index) in dutyArr"
          :key="index"
          :label="item.id"
        >{{item.content}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dutySetDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureChooseDuty" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新建岗位 -->
    <el-dialog title="新建岗位" :visible.sync="addPostDialog" width="500px">
      <div class="demo-input-suffix">
        岗位名称：
        <el-input placeholder="请输入岗位" v-model="PostName" clearable style="margin-top:20px;"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addPostDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureAddPost" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="500px">
      <el-tree
        :data="userData"
        show-checkbox
        node-key="key"
        ref="tree"
        :default-checked-keys="textArr"
        :default-expand-all="true"
        @check-change="changeCheck"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sureAddUser" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: { taskNum: "" },
  data() {
    return {
      userData: [],
      searchForm: {},
      //当前页
      currentPage: 1,
      //每页大小
      pageSize: 10,
      //总页数
      total: 0,
      //每页页码条数列表
      pageSizeList: [10, 20, 30, 40, 50, 100],
      //表格数据
      tableData: [],
      PostName: "",
      addUserDialog: false,
      addPostDialog: false,
      positionId: "",
      dutySetDialog: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      dutyArr: [],
      checkDuty: [],
      userCloumn: [],
      tabClounm: [],
      userTabData: [],
      tabData: [],
      itemId: "",
      taskData: {},
      nodata: false,
      moduleTitle: "",
      moduleData: [],
      taskTitle: "",
      moudleSee: false,
      taskSee: false,
      dbName: "d_oa",
      tableName: "dict_position",
      moduleName: "position_list",
      datas: {},
      textArr: [],
      checkedOne: "",
      checkOrNoCheck: true
    };
  },
  watch: {
    taskNum(val) {
      this.tabData = val;
    }
  },
  mounted() {
    this.listColumn(0);
    this.listColumnByuser();
    this.getPageDictPosition();
  },
  methods: {
    changeCheck(item, flag) {
      this.checkedOne = item.value;
      this.checkOrNoCheck = flag;
      this.delGetChilds(this.userData);
    },

    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 递归寻找删除或添加
    _delGetChilds(data) {
      if (data.value == this.checkedOne) {
        this.$refs.tree.setChecked(data.key, this.checkOrNoCheck);
      }
      if (data.children) {
        if (data.children.length > 0) {
          this.delGetChilds(data.children);
        }
      }
    },
    delGetChilds(data) {
      for (var i = 0; i < data.length; i++) {
        this._delGetChilds(data[i]);
      }
    },
    //   递归寻找
    _getChilds(data) {
      if (data.chosenFlag == true) {
        this.textArr.push(data.key);
      }
      if (data.children) {
        if (data.children.length > 0) {
          this.getChilds(data.children);
        }
      }
    },
    getChilds(data) {
      for (var i = 0; i < data.length; i++) {
        this._getChilds(data[i]);
      }
    },
    //   添加用户
    async addUser() {
      const d = await this.post(this.$api.mail.listUser, {
        positionId: this.positionId
      });
      if (d.code === 0) {
        this.userData = d.data;
        this.textArr = [];
        this.getChilds(this.userData);
        this.addUserDialog = true;
      }
    },
    // 确认添加用户
    async sureAddUser() {
      // console.log(this.$refs.tree.getCheckedNodes(true, true));
      let userList = [];
      this.$refs.tree.getCheckedNodes(true, true).forEach(item => {
        userList.push(item.value);
      });
      userList = this.unique(userList);
      //   console.log(userList);
      const d = await this.post(this.$api.mail.bindUser, {
        positionId: this.positionId,
        userIdList: userList
      });
      if (d.code === 0) {
        this.seeUser(this.positionId);
        this.addUserDialog = false;
      }
    },
    //   查询用户
    async onSubmit() {
      console.log(this.searchForm.user);
    },
    //   新建岗位
    addPost() {
      this.addPostDialog = true;
    },
    async sureAddPost() {
      const d = await this.post(this.$api.mail.addOrEditDictPosition, {
        name: this.PostName
      });
      if (d.code === 0) {
        this.addPostDialog = false;
        this.getPageDictPosition();
      }
    },
    //   点击用户
    async seeUser(val) {
      this.positionId = val;
      const d = await this.post(this.$api.mail.findUserListByPosition, {
        positionId: val
      });
      if (d.code === 0) {
        this.userTabData = d.data;
      }
    },
    // 职责授权
    async dutySet(val) {
      //   console.log(this.checkDuty);
      this.positionId = val;
      const d = await this.post(
        this.$api.mail.listDictResponsibilityByPosition,
        {
          positionId: val
        }
      );
      if (d.code === 0) {
        this.checkDuty = [];
        this.dutyArr = d.data;
        this.dutyArr.forEach(item => {
          if (item.chosenFlag == true) {
            this.checkDuty.push(item.id);
          }
        });
        this.dutySetDialog = true;
      }
    },
    //
    async sureChooseDuty() {
      // console.log(this.checkDuty)
      const d = await this.post(this.$api.mail.bindResponsibility, {
        positionId: this.positionId,
        responsibilityIdList: this.checkDuty
      });
      if (d.code === 0) {
        // this.dutyArr = d.data;
        this.dutySetDialog = false;
      }
    },
    async listColumnByuser() {
      const d = await this.post(this.$api.common.listColumn, {
        columnFlag: 0,
        dbName: "d_oa ",
        tableName: "dict_position",
        moduleName: "user_list"
      });
      if (d.code === 0) {
        this.userCloumn = d.data;
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
    },
    async getPageDictPosition(columnFlag) {
      const d = await this.post(this.$api.mail.pageDictPosition, {
        ...this.params
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
      }
    },
    //存储表格选中数据
    selectionChange(selection) {
      this.selectTbaleData = selection;
    },
    //选择每页显示条数触发
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getPageDictPosition();
    },
    //点击页码触发
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.currentPage = val;
      this.getPageDictPosition();
    }
  }
};
</script>

<style lang='scss' scoped>
.all {
  display: flex;
  .left {
    width: 45%;
    background: #fff;
    margin-right: 20px;
    padding: 5px 10px;
  }
  .right {
    padding: 5px 10px;
    background: #fff;
    width: 45%;
  }
}
.btnWarp {
  margin-bottom: 15px;
}
</style>