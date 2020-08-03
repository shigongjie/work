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
    <div class="wrap">
      <el-card class="right-page">
        <div class="main-head">
          <el-tabs v-model="params.columnName" @tab-click="getList" class="tab-container">
            <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.columnName">
              <span slot="label">
                <el-badge
                  v-if="item.columnValue!==-1 && item.columnValue !==0 "
                  :value="item.columnValue"
                  class="item"
                >
                  <span>{{item.columnName}}</span>
                </el-badge>
                <span v-else>{{item.columnName}}</span>
              </span>
            </el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button type="primary" size="small" @click="showValue=true;">发起审批</el-button>
            <el-button type="primary" size="small" @click="exportShow=true">导出</el-button>
            <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
            <el-button
              class="clounmTitle"
              icon="el-icon-search"
              @click="isShowSearch = !isShowSearch;"
              size="small"
            >搜索</el-button>
          </div>
        </div>
        <el-table
          ref="scoreTable"
          :max-height="changeHeight"
          :data="tabData"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          size="medium"
        >
          <el-table-column v-if="params.columnName=='备忘'" type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号">
            <template slot-scope="scope">{{scope.$index+(currentPage-1)*pageSize+1}}</template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in tabClounm"
            :key="index"
            :prop="item.fieldName"
            :width="item.width"
            align="center"
            :label="item.fieldLabel"
            :sortable="(item.orderByName ==='' || item.orderByName==null)?false:'custom'"
            v-if="item.selectFlag==='1'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- <span v-if="scope.column.property ==='content'" v-html="scope.row[item.fieldName]"></span> -->
              <el-link
                type="primary"
                v-if="scope.column.property ==='content'"
                @click="showContent(scope.row)"
              >查看详情</el-link>
              <!--  :class="'type'+~~scope.row[item.fieldName]" -->
              <div
                style="display: flex;justify-content:center;"
                v-else-if="scope.column.property ==='degreeType'"
              >
                <div class="degree">{{scope.row[item.fieldName]}}</div>
              </div>

              <el-tooltip
                placement="left"
                v-else-if="scope.column.property ==='progressDtoStr'&&scope.row[item.fieldName]"
              >
                <div slot="content" v-html="scope.row[item.fieldName]"></div>
                <span class="oe">{{scope.row[item.fieldName]}}</span>
              </el-tooltip>
              <span
                v-else
                :class="{'red':scope.row[item.fieldName]=='不通过',
                'isApprove':scope.row[item.fieldName]=='审批中',
                'agreeApprove':scope.row[item.fieldName]=='同意',
                'doApprove':scope.row[item.fieldName]=='正在审批',
                'nouse':scope.row[item.fieldName]=='无需审批',
                'already':scope.row[item.fieldName]=='已通过',
                }"
              >{{scope.row[item.fieldName]}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="demandId=scope.row.id;showDemandSee = true">查看</el-button>
              <el-button
                type="text"
                v-if="params.columnName=='备忘'"
                @click="removeRem(scope.row.id)"
              >移除</el-button>
              <el-button
                type="text"
                @click="demandId=scope.row.id;showDemand = true"
                v-if="scope.row. createFlag==true &&scope.row.passFlag ==false&&params.columnName!='备忘'"
              >编辑</el-button>
              <!-- <el-popover placement="bottom" trigger="click">
                <el-button  type="text">多</el-button>
                <el-button slot="reference" type="text">更多</el-button>
              </el-popover>-->
              <el-button
                type="text"
                v-if="~~scope.row.approveStatus===1&&scope.row.passFlag ==false&&scope.row.createFlag==true&&scope.row.enabledFlag==1&&params.columnName!='备忘'"
                @click="republic(scope.row.id)"
              >重新发布</el-button>
              <el-button
                type="text"
                v-if="~~scope.row.approveStatus===1&&scope.row.passFlag ==false&&scope.row.createFlag==true&&scope.row.enabledFlag==0&&params.columnName!='备忘'"
                @click="reVoid(scope.row.id)"
              >取消作废</el-button>
              <el-button
                type="text"
                v-if="~~scope.row.approveStatus===1&&scope.row.passFlag ==false&&scope.row.createFlag==true&&scope.row.enabledFlag==1&&params.columnName!='备忘'"
                @click="Void(scope.row.id)"
              >作废</el-button>
              <!--审批原先的逻辑按钮 @click="agreeApprove(1,scope.row.id)" -->
              <el-button
                type="text"
                :class="btnColor(scope.row.deadlineTime)"
                v-if="scope.row.approveFlag&&~~scope.row.approveStatus===0&&params.columnName!='备忘'"
                @click="demandId=scope.row.id;showDemand = true"
              >审批</el-button>
              <el-button
                type="text"
                v-if="scope.row.createFlag&&~~scope.row.approveStatus===0&&scope.row.passFlag ==false&&scope.row.enabledFlag==1&&params.columnName!='备忘'"
                @click="recall(scope.row.id)"
              >撤回修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager">
          <div v-if="params.columnName=='备忘'" style="text-align:left">
            <el-button type="primary" size="mini" @click="remove()">批量移除</el-button>
          </div>

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
    </div>
    <createDemand :value.sync="showValue" @getList="getList"></createDemand>
    <upDemand
      :value.sync="showDemand"
      @getList="getList"
      :businessType="'审批中心'"
      :params="params"
      :demandId="demandId"
      @setDemandId="setDemandId"
    ></upDemand>
    <seeDemand
      :value.sync="showDemandSee"
      @getList="getList"
      :businessType="'审批中心'"
      :params="params"
      :demandId="demandId"
    ></seeDemand>
    <contentDetail :bigImg="content" :title="title" :value.sync="isShowContent"></contentDetail>
    <yesTaskAndDemand
      :value.sync="showYes"
      :id="id"
      :businessType="1"
      :operateType="operateType"
      :operateStatus="Number(operateStatus)"
      @getList="getList"
    ></yesTaskAndDemand>

    <el-dialog :visible.sync="nothighestApproveLevelFlag" width="400px">
      <el-form :model="highestApproveLevelFlagForm">
        <el-form-item label="审批意见">
          <el-radio-group v-model="highestApproveLevelFlagForm.resource">
            <el-radio label="1" value="1">同意</el-radio>
            <el-radio label="2" value="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="理由" prop="desc">
          <el-input type="textarea" v-model="highestApproveLevelFlagForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="nothighestApproveLevelFlag = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="yes(2)" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import yesTaskAndDemand from "./compontents/yesTaskAndDemand";
import seeDemand from "./compontents/seeDemand";
import upDemand from "./compontents/upDemand";
import createDemand from "@/components/createDemand";
import tableMixin from "@/mixins/table";
import dragTableMixin from "@/mixins/dragTable";
import contentDetail from "@/components/contentDetail";
import search from "@/components/search";
import exportPage from "@/components/exportPage";
import dragTable from "@/components/dragTable/index";
export default {
  components: {
    search,
    dragTable,
    createDemand,
    upDemand,
    contentDetail,
    exportPage,
    seeDemand,
    yesTaskAndDemand
  },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      // 备忘选择的数组
      Notes: [],
      // 审批操作弹窗
      nothighestApproveLevelFlag: false,
      highestApproveLevelFlagForm: {},
      //
      showYes: false,
      id: "",
      operateType: 0,
      operateStatus: 0,
      isShowSearch: false,
      demandId: "",
      exportData: [],
      exportShow: false,
      showValue: false,
      showDemand: false,
      phaseName: "",
      showDemandSee: false,
      tabList: [],
      searchList: [], // 通用搜索
      dragColumn: [],
      tabData: [],
      dbName: "d_oa",
      tableName: "rec_approve_master ",
      moduleName: "OA_APPROVE",
      searchParams: {
        dbName: "d_oa",
        tableName: "rec_approve_master",
        moduleName: "OA_APPROVE"
      },
      params: {
        pageNum: "",
        pageSize: "",
        columnName: "未审批",
        engineeringMasterId: "",
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      specailparams: {
        pageNum: "",
        pageSize: "",
        engineeringMasterId: "",
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      content: "",
      isShowContent: false,
      title: "",
      changeHeight: document.documentElement.clientHeight - 200
    };
  },
  computed: {
    btnColor() {
      return val => {
        if (val) {
          let t = new Date().getTime();
          let d = new Date(val).getTime() - 24 * 60 * 60 * 1000; //24小时 * 60分钟 * 60秒 * 1000
          return d <= t ? "green" : "";
        }
      };
    }
  },
  mounted() {
    this.listColumn(0);
    this.listColumn(1);
    this.listColumn(2);
    this.listSpecialColumn();
    window.onresize = () => {
      this.changeHeight = document.documentElement.clientHeight - 200;
    };
  },
  methods: {
    // 备忘选择
    handleSelectionChange(val) {
      this.Notes = [];
      val.forEach(item => {
        this.Notes.push(item.id);
      });
    },
    // 批量移除
    async removeAll(id) {
      const d = await this.post(this.$api.approve.removeBatchMemoApprove, {
        ids: id
      });
      if (d.code === 0) {
        this.getList();
      }
    },
    remove() {
      this.$confirm("是否移除所选备忘？", "提示", {
        confirmButtonText: "确定移除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeAll(this.Notes);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    async removeTip(id) {
      const d = await this.post(this.$api.approve.removeBatchMemoApprove, {
        ids: [id]
      });
      if (d.code === 0) {
        this.getList();
      }
    },
    removeRem(id) {
      this.$confirm("是否移除备忘？", "提示", {
        confirmButtonText: "确定移除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeTip(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 撤回or重新发布请求
    async recallAjax(id, type) {
      const d = await this.post(this.$api.approve.setApproveStatus, {
        id: id,
        value: type
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.getList();
        this.isrepublic = true;
        this.isrecall = false;
        this.$emit("getList");
      }
    },
    // 撤回修改
    recall(id) {
      this.$confirm("撤回修改后，已审批的人员将重新审批, 确定撤回？", "提示", {
        confirmButtonText: "确定撤回",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.recallAjax(id, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回"
          });
        });
    },
    // 重新发布
    republic(id) {
      this.$confirm("重新发布将重新审批, 确定发布？", "提示", {
        confirmButtonText: "确定发布",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.recallAjax(id, 0);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 作废
    Void(id) {
      this.$confirm(
        "确定作废该审批？作废后可以在【全部】审批中取消作废",
        "提示",
        {
          confirmButtonText: "确定作废",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.reVoidAjax(id, 0);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 取消作废
    reVoid(id) {
      this.$confirm("确定取消作废？取消后可以在【我发起的】继续使用", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.reVoidAjax(id, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 作废请求
    async reVoidAjax(id, type) {
      const d = await this.post(this.$api.approve.updateApproveEnabledFlag, {
        id: id,
        value: type
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.getList();
        this.$emit("getList");
      }
    },
    async listSpecialColumn() {
      const d = await this.post(this.$api.projectProgress.listSpecialColumn, {
        type: 5,
        ...this.specailparams
      });
      if (d.code === 0) {
        this.tabList = d.data;
        this.params.columnName = this.tabList[0].columnName;
        this.getList();
      }
    },
    // 通过审批请求
    async agree(status, id) {
      const d = await this.post(this.$api.approve.doApprove, {
        businessType: "5",
        businessId: id,
        operateStatus: status
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.listSpecialColumn();
        this.$emit("getList");
      }
    },
    // 发送理由
    async sendReson(type, value, id) {
      const d = await this.post(this.$api.common.send, {
        businessType: "审批中心",
        businessId: id,
        comment: value,
        commentType: type
      });
      if (d.code === 0) {
        this.highestApproveLevelFlagForm.desc = "";
      }
    },
    agreeApprove(status, id) {
      this.highestApproveLevelFlagForm.id = id;
      this.nothighestApproveLevelFlag = true;
    },
    yes() {
      this.sendReson(
        this.highestApproveLevelFlagForm.resource,
        this.highestApproveLevelFlagForm.desc,
        this.highestApproveLevelFlagForm.id
      );
      this.agree(
        this.highestApproveLevelFlagForm.resource,
        this.highestApproveLevelFlagForm.id
      );
      this.highestApproveLevelFlagForm.resource = "";
      this.nothighestApproveLevelFlag = false;
    },
    async updateOperateStatus(id, operateType, operateStatus) {
      this.$confirm(
        operateType === 0 ? "确定审批通过吗?" : "确定完成吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(async () => {
        const d = await this.post(
          this.$api.projectProgress.updateOperateStatus,
          {
            businessType: 1,
            businessId: id,
            operateType: operateType,
            operateStatus: operateStatus
          }
        );
        if (d.code === 0) {
          if (operateType === 0) {
            if (operateStatus === 1) {
              this.$message.success("审批成功");
            } else {
              this.$message.success("取消审批成功");
            }
          } else {
            this.$message.success("状态更改成功");
          }
          this.listSpecialColumn();
        }
      });
    },
    showContent(row) {
      this.content = row.content;
      this.title = row.name;
      this.isShowContent = true;
    },
    setDemandId(id) {
      this.demandId = id;
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
    async getList() {
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      // this.listSpecialColumn();
      const d = await this.post(this.$api.projectProgress.pageDemand, {
        ...this.params
      });
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.total = d.data.total;
        const c = await this.post(this.$api.projectProgress.listSpecialColumn, {
          type: 5,
          ...this.specailparams
        });
        if (c.code === 0) {
          this.tabList = c.data;
          // this.params.columnName = this.tabList[0].columnName;
          // this.getList();
        }
      }
    },
    async delMember(row, status) {
      let tip;
      switch (status) {
        case 0:
          tip = "确定激活吗?";
          break;
        case 1:
          tip = "确定开始吗?";
          break;
        case 4:
          tip = "确定取消吗?";
          break;
      }
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.projectProgress.updateTaskStatus, {
          businessId: row.id + "",
          status: status,
          businessType: 1
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
          engineeringMasterId: this.params.engineeringMasterId,
          phaseName: this.phaseName,
          columnValue: this.params.columnValue
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
      // this.exportColumn();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-divider--horizontal {
  margin: 15px 0;
}
.head {
  display: flex;
  margin-bottom: 15px;
  .left-head {
    flex: 1;
    margin-right: 15px;
  }
  .right-head {
    flex: 1;
    .lis {
      cursor: pointer;
      margin-right: 40px;
      p {
        margin-bottom: 10px;
        font-size: 14px;
      }
      .active {
        color: #0f88eb;
      }
    }
  }
  .progress-wrap {
    display: flex;
  }
}
.title {
  color: #999999;
  font-size: 14px;
  margin-right: 10px;
}
.wrap {
  display: flex;
  .right-page {
    flex: 1;
    .main-head {
      .left-main-head {
        display: flex;
      }
      .btns {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .clounmTitle {
    color: #409eff;
    border-color: #409eff;
    width: 70px;
  }
}
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: white !important;
  border-color: #e4e7ed !important;
  color: black !important;
  cursor: not-allowed !important;
}
.red {
  color: #ff5c5c !important;
}
.green {
  color: #67c23a;
}
.agreeApprove {
  color: #0f88eb;
}
.doApprove {
  color: #014978;
}
.nouse {
  color: #666666;
}
.already {
  color: #2fb887;
}
.isApprove {
  color: #f8b551;
}
</style>
