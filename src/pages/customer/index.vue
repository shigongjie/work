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

    <el-card>
      <el-tabs @tab-click="getList" v-model="activeName" class="tab-container">
        <el-tab-pane v-if="$route.name=='center'" name="客户档案" label="客户档案"></el-tab-pane>
        <el-tab-pane
          v-for="(item,index) in tabList"
          :key="index"
          :name="item.name"
          :label="item.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="head">
        <span>
          <!-- 客户信息 -->
        </span>
        <div class="searchAndBtn" :class="{'close':$route.name!='center'}">
          <div v-if="($route.name=='center')">
            <el-form
              :inline="true"
              size="small"
              :model="searchForm"
              class="demo-form-inline"
              ref="searchForm"
            >
              <el-form-item
                label="客户名称"
                prop="userName"
                v-if="activeName=='客户档案'||activeName=='联系人'||activeName=='重要提醒'||activeName=='合作意向'||activeName=='合作状态'||activeName=='沟通日报'"
              >
                <el-input v-model="searchForm.customerName" placeholder="客户名称"></el-input>
              </el-form-item>
              <el-form-item v-if="activeName=='客户档案'">
                <el-select
                  style="width:115px"
                  @change="changeProvince"
                  v-model="searchForm.provinceAreaCode"
                  placeholder="请选择省"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="(item,index) in provinceAreaList"
                    :key="index"
                    :label="item.name"
                    :value="item.shortCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="activeName=='客户档案'">
                <el-select
                  style="width:115px;margin-left:10px;margin-right:10px;"
                  v-model="searchForm.cityAreaCode"
                  placeholder="请选择市"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="(item,index) in cityAreaList"
                    :key="index"
                    :label="item.name"
                    :value="item.shortCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                prop="occurTimeArr"
                label="发生时间"
                v-if="activeName=='合作意向'||activeName=='款项明细'||activeName=='往来票据'"
              >
                <el-date-picker
                  v-model="searchForm.occurTimeArr"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="沟通时间" v-if="activeName=='沟通记录'" prop="communicationTimeArr">
                <el-date-picker
                  v-model="searchForm.communicationTimeArr"
                  type="daterange"
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="创建时间"
                prop="createTimeArr"
                v-if="activeName=='客户意向'||activeName=='合作状态'||activeName=='沟通日报'||activeName=='款项明细'||activeName=='往来票据'||activeName=='往来文件'"
              >
                <el-date-picker
                  v-model="searchForm.createTimeArr"
                  type="daterange"
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div style="float:right!important">
            <el-button
              type="primary"
              size="small"
              v-if="$route.name=='center'"
              @click="addCustomentInfo"
            >添加客户</el-button>
            <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
            <el-button
              class="clounmTitle"
              icon="el-icon-search"
              @click="isShowSearch = !isShowSearch;"
              size="small"
            >搜索</el-button>
          </div>
        </div>
      </div>
      <el-table
        ref="scoreTable"
        max-height="600"
        :data="tabData"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        size="medium"
      >
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column
          v-for="(item, index) in tabClounm"
          :key="index"
          :prop="item.fieldName"
          :width="item.width||'200px'"
          align="center"
           v-if="item.selectFlag==='1'"
          :label="item.fieldLabel"
          :sortable="(item.orderByName ==='' || item.orderByName==null)?false:'custom'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div v-if="scope.column.property ==='customerName'">
              <el-button
                type="text"
                :disabled="scope.row[item.fieldName]==''"
                @click="seeOrEditCustomer(scope.row.id,activeName,'查看')"
              >{{scope.row[item.fieldName]}}</el-button>
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
          <template slot-scope="scope">
            <el-button type="text" @click="seeOrEditCustomer(scope.row.id,activeName,'编辑')">编辑</el-button>
            <el-button type="text" v-if="activeName!='客户档案'" @click="del(scope.row.detailId)">删除</el-button>
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
      <dragTable
        ref="dragTab"
        :tableData="dragColumn"
        @exitDialog="exitDialog"
        @listTableColumn="listTableColumn"
        :dragTabShow="dragTabShow"
        @saveClounm="saveClounm"
      ></dragTable>
      <exportPage
        :exportData="exportData"
        ref="exportTab"
        :exportShow="exportShow"
        @exitExport="exitExport"
        @saveExport="saveExport"
      ></exportPage>
    </el-card>
    <!-- <addUser :value.sync="isShowAddUser" :customerMasterId="customerMasterId" @getList="getList"></addUser>
    <importCustomer :value.sync="showImp" @getList="getList"></importCustomer>-->
    <!-- <contacts
      :value.sync="isShowContacts"
      :customerId="customerId"
      :customerMasterId="customerMasterId"
      @getList="getList"
    ></contacts>-->
    <!-- 添加客户信息新 -->
    <el-dialog
      width="1360px"
      title
      :visible.sync="addCustomentInfoDialog"
      :before-close="updateList"
      append-to-body
      top="1vh"
      :show-close="false"
    >
      <addCustomInfo
        v-if="addCustomentInfoDialog"
        :parentmasterId="masterId"
        :activeName="activeName"
        :editOrSee="editOrSee"
        @close="updateList"
      />
    </el-dialog>
    <el-dialog :title="'项目汇总'" top="10vh" :visible.sync="taskTable" width="1300px" append-to-body>
      <tasktable :value.sync="taskTable" :taskNum="taskNum" />
    </el-dialog>
  </div>
</template>

<script>
import tasktable from "./compontents/tasktable";
import addUser from "./compontents/addUser";
import contacts from "./compontents/contacts";
import tableMixin from "@/mixins/table";
import dragTableMixin from "@/mixins/dragTable";
import search from "@/components/search";
import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
import importCustomer from "./compontents/importCustomer";
import addCustomInfo from "./compontents/addcustomInfo";

export default {
  components: {
    search,
    dragTable,
    addUser,
    contacts,
    exportPage,
    importCustomer,
    tasktable,
    addCustomInfo
  },
  props: { seeMoreListData: {} },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      // 省级市级地区列表
      provinceAreaList: [],
      cityAreaList: [],
      districtAreaList: [],
      taskNum: {},
      searchForm: {
        customerName: "",
        createTimeArr: "",
        occurTimeArr: "",
        communicationTimeArr: "",
        provinceAreaCode: "",
        cityAreaCode: ""
      },
      // formInline: {},
      taskTable: false,
      queryId: "",
      masterId: "",
      editOrSee: "",
      activeName: "客户档案",
      tabList: [],
      // 添加客户信息窗口
      addCustomentInfoDialog: false,
      showImp: false,
      isShowSearch: false,
      searchList: [], // 通用搜索
      customerId: "",
      isShowAddUser: false,
      exportShow: false,
      customerMasterId: "", //客户行id
      isShowContacts: false,
      tabData: [],
      dragColumn: [],
      exportData: [],
      dbName: "d_oa",
      tableName: "rec_customer_master",
      moduleName: "CUSTOMER_MASTER",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_customer_master",
        moduleName: "CUSTOMER_MASTER"
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      }
    };
  },
  watch: {
    seeMoreListData(val) {
      if (this.$props.seeMoreListData) {
        this.activeName = this.$props.seeMoreListData.params.name;
        this.masterId = this.$props.seeMoreListData.masterId;
        this.getList(this.$props.seeMoreListData.params);
      }
    },
    $route(val) {
      this.currentPage = 1;
      this.queryId = val.name;
      switch (this.queryId) {
        case "commit":
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_communication_record";
          this.listColumn(0);
          this.listColumn(1);
          this.listColumn(2);
          this.pageCommunicationRecordWithPriv();
          break;
        case "intention":
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_intention";
          this.listColumn(0);
          this.listColumn(1);
          this.listColumn(2);
          this.pageIntentionWithPriv();
          break;
        case "task":
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_task";
          this.listColumn(0);
          this.listColumn(1);
          this.listColumn(2);
          this.pageTaskWithPriv();
          break;
        case "manager":
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_manager";
          this.listColumn(0);
          this.listColumn(1);
          this.listColumn(2);
          this.pageManagerWithPriv();
          break;
        case "center":
          this.activeName = "客户档案";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_master";
          this.moduleName = "CUSTOMER_MASTER";
          this.listColumn(0);
          this.listColumn(1);
          this.listColumn(2);
          this.getpageWithPriv();
          break;
      }
    }
  },
  mounted() {
    this.queryId = this.$route.name;
    this.getProvince();
    this.listColumn(0);
    this.listColumn(1);
    this.listColumn(2);
    this.getSpeacilColumn();
    if (this.$props.seeMoreListData) {
      this.activeName = this.$props.seeMoreListData.params.name;
      this.getList(this.$props.seeMoreListData.params);
    } else if (this.$route.name == "center") {
      this.getpageWithPriv();
    }
    switch (this.$route.name) {
      case "commit":
        this.activeName = "";
        this.dbName = "d_oa";
        this.tableName = "rec_customer_detail";
        this.moduleName = "vertical_axis_communication_record";
        this.listColumn(0);
        this.pageCommunicationRecordWithPriv();
        break;
      case "intention":
        this.activeName = "";
        this.dbName = "d_oa";
        this.tableName = "rec_customer_detail";
        this.moduleName = "vertical_axis_intention";
        this.listColumn(0);
        this.pageIntentionWithPriv();
        break;
      case "task":
        this.activeName = "";
        this.dbName = "d_oa";
        this.tableName = "rec_customer_detail";
        this.moduleName = "vertical_axis_task";
        this.listColumn(0);
        this.pageTaskWithPriv();
        break;
      case "manager":
        this.activeName = "";
        this.dbName = "d_oa";
        this.tableName = "rec_customer_detail";
        this.moduleName = "vertical_axis_manager";
        this.listColumn(0);
        this.pageManagerWithPriv();
        break;
      case "center":
        this.activeName = "客户档案";
        this.dbName = "d_oa";
        this.tableName = "rec_customer_master";
        this.moduleName = "CUSTOMER_MASTER";
        this.listColumn(0);
        this.getpageWithPriv();
        break;
    }
  },
  methods: {
    //   获取省份
    async getProvince() {
      const d = await this.post(this.$api.policy.getArea, {
        parentShortCode: "0"
      });
      if (d.code === 0) {
        this.provinceAreaList = d.data;
      }
    },
    // 改变省份
    async changeProvince() {
      const d = await this.post(this.$api.policy.getArea, {
        parentShortCode: this.searchForm.provinceAreaCode
      });
      if (d.code === 0) {
        this.cityAreaList = d.data;
        this.searchForm.cityAreaCode = "";
        // this.$nextTick(() => {

        // });
      }
    },
    // 改变市区
    async changeCity() {
      const d = await this.post(this.$api.policy.getArea, {
        parentShortCode: this.searchForm.cityAreaCode
      });
      if (d.code === 0) {
        this.districtAreaList = d.data;
      }
    },
    closeDialog() {
      this.addCustomentInfoDialog = false;
    },
    async onSubmit() {
      let params = {};
      this.tabList.forEach(item => {
        if (this.activeName == item.name) {
          params = item;
        }
      });
      if (this.activeName == "客户档案") {
        const c = await this.post("/oa-boot/customer/v2/pageWithPriv", {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          queryEntityDto: this.params.queryEntityDto,
          ...this.searchForm
        });
        if (c.code === 0) {
          this.tabData = c.data.data;
          this.total = c.data.total;
        }
      } else {
        const c = await this.post("/oa-boot/customer/v2/detail/pageWithPriv", {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          queryEntityDto: this.params.queryEntityDto,
          itemId: params.id,
          customerId: this.$props.seeMoreListData
            ? this.$props.seeMoreListData.masterId
            : "",
          ...this.searchForm
        });
        if (c.code === 0) {
          this.tabData = c.data.data;
          this.total = c.data.total;
        }
      }
    },
    // 删除细表
    async delAjax(id, type) {
      if (type == "infomation") {
        const d = await this.post(this.$api.customer.deleteDetailInfomation, {
          id: id
        });
        if (d.code === 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getInfomationShare(1);
          this.getInfomationShare(2);
        }
      } else {
        const d = await this.post(this.$api.customer.deleteDetail, {
          id: id
        });
        if (d.code === 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getList();
        }
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
    // 客户沟通情况
    async pageCommunicationRecordWithPriv() {
      this.activeName = "";
      const c = await this.post(
        this.$api.customer.pageCommunicationRecordWithPriv,
        {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          queryEntityDto: this.params.queryEntityDto
        }
      );
      if (c.code === 0) {
        this.tabData = c.data.data;
        this.total = c.data.total;
      }
    },
    // 客户意向情况
    async pageIntentionWithPriv() {
      const c = await this.post(this.$api.customer.pageIntentionWithPriv, {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (c.code === 0) {
        this.tabData = c.data.data;
        this.total = c.data.total;
      }
    },
    // 客户任务情况
    async pageTaskWithPriv() {
      const c = await this.post(this.$api.customer.pageTaskWithPriv, {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (c.code === 0) {
        this.tabData = c.data.data;
        this.total = c.data.total;
      }
    },
    // 客户经理
    async pageManagerWithPriv() {
      const c = await this.post(this.$api.customer.pageManagerWithPriv, {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (c.code === 0) {
        this.tabData = c.data.data;
        this.total = c.data.total;
      }
    },
    async customerProjectList(id) {
      const d = await this.post(this.$api.customer.listTaskByCustomer, {
        customerId: id
      });
      // const d = await this.post(this.$api.task.customerProjectList, {
      //   customerId: id
      // });
      if (d.code === 0) {
        this.taskNum = d.data;
        console.log(this.taskNum);
      }
    },
    seeOrEditCustomer(ob, name, type) {
      if (this.$route.name == "task") {
        this.customerProjectList(ob);
        this.taskTable = true;
      } else if (this.$route.name == "commit") {
        this.activeName = "沟通日报";
        this.editOrSee = type;
        this.masterId = ob;
        this.addCustomentInfoDialog = true;
      } else if (this.$route.name == "intention") {
        this.activeName = "合作意向";
        this.editOrSee = type;
        this.masterId = ob;
        this.addCustomentInfoDialog = true;
      } else if (this.$route.name == "manager") {
        this.activeName = "合作状态";
        this.editOrSee = type;
        this.masterId = ob;
        console.log(this.activeName);
        this.addCustomentInfoDialog = true;
      } else {
        this.editOrSee = type;
        this.masterId = ob;
        this.addCustomentInfoDialog = true;
      }
    },
    // 获取客户列表
    async getpageWithPriv() {
      const c = await this.post("/oa-boot/customer/v2/pageWithPriv", {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        queryEntityDto: this.params.queryEntityDto
      });
      if (c.code === 0) {
        this.tabData = c.data.data;
        this.total = c.data.total;
      }
    },
    // 获取特殊表头
    async getSpeacilColumn() {
      const d = await this.post("/oa-boot/customerItem/list", {
        columnFlag: "1"
      });
      if (d.code === 0) {
        this.tabList = d.data;
      }
    },
    addCustomentInfo() {
      this.masterId = "";
      this.editOrSee = "编辑";
      this.addCustomentInfoDialog = true;
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
    async getList(ob) {
      if (this.activeName) {
        let params = {};
        if (this.tabList.length == 0) {
          params = ob;
        } else {
          this.tabList.forEach(item => {
            if (this.activeName == item.name) {
              params = item;
            }
          });
        }
        if (this.activeName == "客户档案") {
          params.dbName = "d_oa";
          params.tableName = "rec_customer_master";
          params.moduleName = "CUSTOMER_MASTER";
          this.listColumn(0);
          this.getpageWithPriv();
        } else if (this.activeName != "客户档案") {
          const c = await this.post(
            "/oa-boot/customer/v2/detail/pageWithPriv",
            {
              pageNum: this.currentPage,
              pageSize: this.pageSize,
              queryEntityDto: this.params.queryEntityDto,
              itemId: params.id,
              customerId: this.$props.seeMoreListData
                ? this.$props.seeMoreListData.masterId
                : ""
            }
          );
          if (c.code === 0) {
            this.tabData = c.data.data;
            this.total = c.data.total;
          }
          const d = await this.post(this.$api.common.basicslistColumn, {
            columnFlag: 0,
            dbName: params.dbName,
            tableName: params.tableName,
            moduleName: params.listModuleName
          });
          if (d.code === 0) {
            this.tabClounm = d.data;
            this.dragColumn = JSON.parse(JSON.stringify(d.data));
          }
        }
      } else {
        if (this.activeName == "客户档案") {
          params.dbName = "d_oa";
          params.tableName = "rec_customer_master";
          params.moduleName = "CUSTOMER_MASTER";
          this.listColumn(0);
          this.getpageWithPriv();
        } // 客户沟通情况
        else if (this.queryId == "commit") {
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_communication_record";
          this.listColumn(0);
          this.pageCommunicationRecordWithPriv();
        }
        // 客户意向情况
        else if (this.queryId == "intention") {
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_intention";
          this.listColumn(0);
          this.pageIntentionWithPriv();
        }
        // 客户任务情况
        else if (this.queryId == "task") {
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_task";
          this.listColumn(0);
          this.pageTaskWithPriv();
        } else if (this.queryId == "manager") {
          this.activeName = "";
          this.dbName = "d_oa";
          this.tableName = "rec_customer_detail";
          this.moduleName = "vertical_axis_manager";
          this.listColumn(0);
          this.pageManagerWithPriv();
        }
      }
    },
    async delMember(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.customer.delCustomerMaster, {
          customerMasterId: row.id
        });
        if (d.code === 0) {
          this.getList();
        }
      });
    },
    // 保存拖拽
    async saveClounm(val) {
      const d = await this.post(this.$api.common.saveColumn, {
        moduleName: this.moduleName,
        dbName: this.dbName,
        tableName: this.tableName,
        columnJa: val
      });
      if (d.code === 0) {
        this.exitDialog();
        this.$refs.dragTab.isShowTab();
      }
    },
    // 获取搜索模板
    async listConditionColumn() {
      const d = await this.post(this.$api.recruit.listConditionColumn, {
        moduleName: "teacherList"
      });
      if (d.code === 0) {
        this.searchList = d.data;
      }
    },
    // 退出拖拽
    exitDialog(val) {
      this.dragTabShow = false;
      this.listColumn(0);
    },
    // 查询
    searchData(search) {
      this.currentPage = 1;
      this.params.queryEntityDto.baseQueryDtoList = search;
      this.getList();
    },
    // 最后导出调用下载
    saveExport(data) {
      let fieldStringArray = data.map(item => {
        return item.fieldName;
      });
      this.cacheExportField(fieldStringArray);
    },
    async cacheExportField(fieldStringArray) {
      const d = await this.post(this.$api.common.cacheExportField, {
        fieldStringArray: fieldStringArray.join(",")
      });
      if (d.code === 0) {
        var query = {
          pageNum: 1,
          pageSize: 1000,
          queryDto: JSON.stringify(this.params.queryEntityDto),
          fieldStringArray: d.data,
          uuid: d.data,
          dbName: this.dbName,
          tableName: this.tableName,
          moduleName: this.moduleName,
          userId: this.$store.state.userInfo.data.userId + "",
          engineeringMasterId: "",
          phaseName: "",
          columnValue: ""
        };
        let url = "/oa-boot/export/commonExport";
        this.$refs.exportTab.isShowTab();
        this.exportShow = false;
        this.$common.exportXls(query, url);
      }
    },
    async listTableColumn() {
      const d = await this.post(this.$api.common.resetTableColumn, {
        businessId: "",
        moduleName: this.moduleName,
        dbName: this.dbName,
        tableName: this.tableName,
        fieldModuleEnum: ""
      });
      if (d.code === 0) {
        this.exitDialog();
        this.$refs.dragTab.isShowTab();
      }
    },
    // 退出导出
    exitExport() {
      this.exportShow = false;
      this.exportColumn();
    },
    // 关闭新增客户页面
    updateList() {
      // this.activeName = "客户档案";
      if (this.$route.name == "center") {
        this.getList();
      }
      this.addCustomentInfoDialog = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.head {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
}
.clounmTitle {
  color: #409eff;
  border-color: #409eff;
  width: 70px;
}
// /deep/ .el-tabs__nav {
//   float: right;
// }
.searchAndBtn {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.close {
  display: flex;
  justify-content: flex-end;
}
</style>
