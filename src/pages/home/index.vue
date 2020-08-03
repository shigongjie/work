<template>
  <div>
    <div class="wrap">
      <img v-if="!isShowDiary" class="showDiary" @click="showDiary" src="./images/showIcon.png" />
      <div class="left">
        <!-- <div class="head el-card">
          <div class="task-wrap">
            <div class="task" v-for="(item,index) in msgNum" :key="index">
              <div class="tw">
                <div class="t1">
                  <p :title="item.name">{{item.name}}</p>
                  <i
                    class="el-icon-circle-plus-outline addBtn"
                    v-if="~~item.businessType===1"
                    @click="showCreateDemand=true"
                  ></i>
                  <i
                    class="el-icon-circle-plus-outline addBtn"
                    v-if="~~item.businessType===0"
                    @click="showCreateTask=true"
                  ></i>
                </div>
                <p class="t2">{{item.value}}</p>
              </div>
              <p class="linke" v-if="index!==0"></p>
            </div>
          </div>
        </div>-->
        <div class="head el-card news">
          <el-tabs
            tab-position="left"
            type="border-card"
            style="height: 358px;"
            v-model="currNews"
            @tab-click="tabNewsClick"
          >
            <el-tab-pane
              :label="item.typeName"
              :name="item.typeValue+''"
              v-for="(item,index) in newsType"
              :key="index"
            >
              <template v-if="newsTotal === 0">
                <span class="empty">暂无数据</span>
              </template>
              <template v-esle>
                <div style="height: 288px">
                  <ul class="newList">
                    <li
                      v-for="(item, index) in newsList"
                      :key="index"
                      @click="$router.push({name:'newsDetail',query:{id:item.id}})"
                    >
                      <div class="wrap">
                        <img :src="item.indexImageUrl" v-if="item.indexImageUrl" class="bg" alt />
                        <div class="right">
                          <div class="right-hd">
                            <p class="t1 oe">{{item.title}}</p>
                            <p
                              class="time"
                            >{{new Date(item.publishTime).getTime() | datetimeFormat('yyyy-MM-dd')}}</p>
                          </div>
                          <div class="footer">
                            <p class="t2 oe">{{item.summary}}</p>
                            <span class="border">
                              <!-- <i class="el-icon-d-arrow-right"></i> -->
                              <span>阅读全文</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="pager">
                  <el-pagination
                    background
                    @current-change="newsCurrentChange"
                    :current-page="newsParams.pageNum"
                    :page-size="newsParams.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="newsTotal"
                  ></el-pagination>
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="main el-card" :style="{height:changeHeight-18+'px'}">
          <el-tabs v-model="params.readingState" @tab-click="getList">
            <el-tab-pane label="未读" name="0"></el-tab-pane>
            <el-tab-pane label="已读" name="1"></el-tab-pane>
            <el-tab-pane label="我的日志" name="2"></el-tab-pane>
            <el-tab-pane label="全部日志" name="3" v-if="$store.state.btns.data.OA_PARENT01_01"></el-tab-pane>
          </el-tabs>
          <div class="exportBox">
            <el-form ref="exportForm" size="small" :model="exportForm" label-width="80px">
              <el-row>
                <el-col :span="14">
                  <el-form-item label="所属日期" prop="time">
                    <el-date-picker
                      class="exportForm_date"
                      prefix-icon="el-icon-date"
                      v-model="exportForm.time"
                      type="datetimerange"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptionsArr"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right"
                      @change="refreshList"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="姓名">
                    <el-select
                      style="width:115px;"
                      v-model="exportForm.name"
                      @change="nameChange"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="item in principalList"
                        :key="item.value"
                        :label="item.userName"
                        :value="item.userName"
                      ></el-option>
                    </el-select>
                    <!-- <el-input style="width:115px;" v-model="exportForm.name" @change="nameChange"></el-input> -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-button
              type="primary"
              class="exportBtn"
              v-if="$store.state.btns.data.OA_PARENT01_02"
              @click="exportDiary"
              size="small"
              icon="icon"
            >
              <i class="exportIcon"></i>导出日志
            </el-button>
          </div>
          <el-table
            size="medium"
            ref="scoreTable"
            :max-height="changeHeight-120+'px'"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange"
            :data="tabData"
            :header-cell-style="{'background': '#F1F1F1'}"
          >
            <el-table-column type="index" label="序号">
              <template scope="scope">{{scope.$index+(currentPage-1)*pageSize+1}}</template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in tabClounm"
              :key="index"
              :prop="item.fieldName"
              :width="item.width"
              align="center"
              :label="item.fieldLabel"
              :sortable="(item.orderByName ==='' || item.orderByName == null)?false:'custom'"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column fixed="right" align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="showDetail(scope)">查看</el-button>
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
      </div>
      <div :class="isShowDiary?'diary el-card':'dismissDiary'">
        <div class="diary-head">
          <p>写日志</p>
          <img class="dismisIcon" @click="showDiary" src="./images/dismissIcon.png" />
        </div>
        <div class="subTime" v-if="form.submitState===1">
          <span style="margin-right:10px">上次提交时间</span>
          <span>{{form.submitTime}}</span>
        </div>
        <div class="form-wrap" :style="{height:changeHeight+289+'px'}">
          <el-form ref="form" :model="form" label-position="top">
            <el-form-item label="所属日期" prop="data">
              <div>
                <el-date-picker
                  v-model="date"
                  value-format="yyyy-MM-dd"
                  style="width:100%"
                  align="right"
                  type="date"
                  @change="getCurrentDiary"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="进展" prop="todayProgress">
              <div>
                <!-- <p class="tipText">{{form.todayProgress}}</p> -->
                <el-input disabled type="textarea" :rows="4" v-model="form.todayProgress"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="日志" prop="todayResults">
              <div>
                <p class="tipText">{{form.autoTodayResult}}</p>
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="这里是今日成果"
                  v-model="form.todayResults"
                ></el-input>
                <i @click="todayShow=true" class="screen el-icon-full-screen"></i>
              </div>
            </el-form-item>
            <el-form-item label="明日任务" prop="tomorrowTask">
              <p class="tipText">{{form.autoTomorrowTask}}</p>
              <el-input
                type="textarea"
                :rows="4"
                placeholder="这里是明日任务,好的计划习惯事半功倍哦~"
                v-model="form.tomorrowTask"
              ></el-input>
            </el-form-item>
            <el-form-item label="待协调事项">
              <p class="tipText" style>{{form.autoToCoordinate}}</p>
              <el-input
                type="textarea"
                :rows="4"
                placeholder="这里是待协调事项，让领导知道你的困难，有助于提高效率~"
                v-model="form.toCoordinate"
              ></el-input>
            </el-form-item>
            <el-form-item label="截止时间">
              <el-date-picker
                v-model="form.deadlineTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                style="width:100%;"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="上班时长" class="toLeft">
                  <el-input-number style="width:72px" v-model="form.totalTime" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="自我评分" class="toLeft">
                  <el-input-number style="width:72px" v-model="form.selfRating" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="日志接收人">
              <!-- <el-cascader
              style="width:100%"
              :show-all-levels="false"
              :options="options"
              v-model="form.receiveList"
              filterable
              :props="{ multiple: true }"
              ></el-cascader>-->
              <el-select
                v-model="receiveList"
                @change="saveDiaryReceiver"
                style="width:100%"
                filterable
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="item in principalList"
                  :key="item.value"
                  :label="item.userName"
                  :value="item.userId+''"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            style="width:100%;height:30px;margin-bottom: 20px;"
            size="small"
            @click="addOrEditDiary"
          >提交</el-button>
        </div>
      </div>
      <!-- <el-dialog
        title="日志导出"
        :visible.sync="exportTime"
        width="500px"
        class="addOrUpCustomer"
        :before-close="clearTime"
      >
        <div style="padding:20px 0">
          <el-form
            ref="exportForm"
            size="small"
            :rules="exportRules"
            :model="exportForm"
            label-width="60px"
          >
            <el-form-item label="时间" prop="time">
              <el-date-picker
                prefix-icon="el-icon-date"
                v-model="exportForm.time"
                type="datetimerange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsArr"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer">
          <el-button type="primary" size="small" @click="exportDiary">确 定</el-button>
        </span>
      </el-dialog>-->
      <diaryDetail
        :value.sync="showValue"
        :diaryId="diaryId"
        :userId="userId"
        :createDate="createDate"
        :tabData="tabData"
        :params="params"
        @getList="getList"
        @setDiaryId="setDiaryId"
        @setDiaryUserId="setDiaryUserId"
        @setDiaryDate="setDiaryDate"
      ></diaryDetail>
      <createTask :value.sync="showCreateTask" @getList="getHomeIndex"></createTask>
      <createDemand :value.sync="showCreateDemand" @getList="getHomeIndex"></createDemand>
      <!-- <tree></tree> -->
    </div>
    <exportPage
      :exportData="exportData"
      ref="exportTab"
      :exportShow="exportShow"
      @exitExport="exitExport"
      @saveExport="saveExport"
    ></exportPage>
    <el-dialog title="今日备忘" :visible.sync="todayShow" width="500px" append-to-body>
      <div style="padding:20px">
        <el-input type="textarea" :rows="20" placeholder="这里是今日成果" v-model="form.todayResults"></el-input>
      </div>
      <!-- <span slot="footer">
        <el-button type="primary" size="small" @click="exportDiary">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
import exportPage from "@/components/exportPage";
import createDemand from "@/components/createDemand";
import createTask from "@/components/createTask";
import dragTableMixin from "@/mixins/dragTable";
import tableMixin from "@/mixins/table";
import diaryDetail from "./diaryDetail";
// import tree from "@/components/tree";
import $ from "jquery";
export default {
  components: {
    diaryDetail,
    // tree,
    createDemand,
    createTask,
    exportPage
  },
  mixins: [tableMixin, dragTableMixin],
  data() {
    return {
      exportData: [],
      todayShow: false,
      exportShow: false,
      pickerOptionsArr: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      exportForm: {
        time: [],
        name: ""
      },

      // exportRules: {
      //   time: [
      //     { required: true, message: "时间范围不能为空", trigger: "change" }
      //   ]
      // },
      msgNum: {},
      principalList: [],
      isLoad: false,
      startTime: "",
      endTime: "",
      diaryId: "",
      createDate: "",
      userId: "",
      showCreateTask: false,
      showCreateDemand: false,
      checkTimeShow: false,
      showValue: false,
      currIndex: 0,
      options: [],
      exportTime: false,
      dbName: "d_oa",
      tableName: "rec_diary_master",
      moduleName: "DIARY",
      date: new Date(),
      form: {
        autoTodayResult: "",
        todayResults: "",
        tomorrowTask: "",
        higherRating: "",
        toCoordinate: "",
        deadlineTime: "",
        totalTime: "",
        selfRating: "",
        submitTime: "",
        submitState: 0,
        todayProgress: ""
      },
      receiveList: [],
      changeHeight: document.documentElement.clientHeight - 440,
      params: {
        pageNum: 1,
        pageSize: 10,
        readingState: "0", // 页签状态
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      isShowDiary: false,
      newsType: [],
      newsList: [],
      currNews: "11",
      newsParams: {
        fuzzySearch: "",
        pageNum: 1,
        pageSize: 6
      },
      newsTotal: 0,
      loading: null
    };
  },
  watch: {
    activeName() {
      this.getList();
    }
  },
  created() {
    this.init();
    window.onresize = () => {
      this.changeHeight = document.documentElement.clientHeight - 370;
    };
  },
  methods: {
    clearTime(done) {
      this.$refs["exportForm"].resetFields();
      done();
    },
    exportDiary() {
      this.$refs.exportForm.validate(async valid => {
        if (valid) {
          if (this.exportForm.time.length > 0) {
            this.exportShow = true;
          } else {
            this.$message.warning("请填入所属日期");
          }
        }
      });
    },
    refreshList(value) {
      console.log("value", value);
    },

    init() {
      this.listColumn(0);
      this.listColumn(1);
      this.formatData();
      this.listDepartmentAndUser();
      this.getList();
      this.getCurrentDiary(); //当天日志
      this.getHomeIndex();
      this.listPrincipal();
      this.listDiaryReceiver();
      this.listNewsType();
    },
    formatData() {
      let date = new Date();
      let year = date.getFullYear() + "";
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

      this.date = year + "-" + month + "-" + day;
    },
    setDiaryId(id) {
      this.diaryId = id + "";
    },
    setDiaryUserId(userId) {
      this.userId = userId;
    },
    setDiaryDate(date) {
      this.createDate = date;
    },
    async listPrincipal() {
      const d = await this.post(this.$api.projectManage.listPrincipal);
      if (d.code === 0) {
        this.principalList = d.data;
      }
    },
    showDetail(scope) {
      this.currIndex = scope.$index;
      this.showValue = true;
      this.diaryId = scope.row.id + "";
      this.userId = scope.row.userId;
      this.createDate = scope.row.createDate;
    },
    setNum(val, num) {
      if (typeof this.form[num] == "string") {
        this.form[num] = 0;
      }
    },
    async saveDiaryReceiver() {
      const d = await this.post(
        this.$api.home.saveDiaryReceiver,
        {
          receiveList: this.receiveList
        },
        false
      );
      if (d.code === 0) {
      }
    },
    async listDiaryReceiver() {
      const d = await this.post(this.$api.home.listDiaryReceiver);
      if (d.code === 0) {
        this.receiveList = d.data.receiveList;
      }
    },
    async getCurrentDiary() {
      const d = await this.post(this.$api.home.getCurrentDiary, {
        date: this.date
      });
      if (d.code === 0) {
        this.form = d.data;
      }
    },
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.options = d.data;
        this.isLoad = true;
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
    async addOrEditDiary() {
      this.loading = this.$loading({ text: "正在提交日志" });
      try {
        const d = await this.post(this.$api.home.addOrEditDiary, {
          ...this.form,
          diaryMasterId: this.form.id
        });
        if (d.code === 0) {
          this.$message.success("日志提交成功");
          this.getCurrentDiary();
          this.getHomeIndex();
          this.getList();
        }
        this.loading.close();
      } catch (error) {
        this.$message.error("日志提交失败");
        this.loading.close();
      }
    },
    async getHomeIndex() {
      const d = await this.post(this.$api.home.getHomeIndex);
      if (d.code === 0) {
        this.msgNum = d.data;
      }
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
          pageSize: 5000,
          queryDto: JSON.stringify(this.params.queryEntityDto),
          fieldStringArray: d.data,
          uuid: d.data,
          dbName: this.dbName,
          tableName: this.tableName,
          moduleName: this.moduleName,
          userId: JSON.parse(localStorage.getItem("userInfo")).userId,
          readingState: 3,
          startTime: this.exportForm.time[0],
          endTime: this.exportForm.time[1],
          appCode: this.$config.appCode,
          searchUserName: this.exportForm.name ? this.exportForm.name : ""
        };
        let url = "/oa-boot/export/commonExport";
        this.$refs.exportTab.isShowTab();
        this.exportShow = false;
        this.$common.exportXls(query, url);
      }
    },
    // 退出导出
    exitExport() {
      this.exportShow = false;
      this.listColumn(1);
    },
    async getList() {
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      const d = await this.post(this.$api.home.pageDiary, {
        searchUserName: this.exportForm.name ? this.exportForm.name : "",
        ...this.params
      });
      if (d.code === 0) {
        this.tabData = d.data.data;

        this.total = d.data.total;
      }
    },
    showDiary() {
      this.isShowDiary = !this.isShowDiary;
    },
    nameChange(value) {
      this.getList();
    },
    async listNewsType() {
      const d = await this.post(this.$api.home.listNewsType, {
        strategyId: 7
      });
      if (d.code === 0) {
        this.newsType = d.data;
        this.pageNewsByType();
      }
    },
    async pageNewsByType() {
      const d = await this.post(this.$api.home.pageNewsByType, {
        newType: this.currNews,
        strategyId: 7,
        ...this.newsParams
      });
      if (d.code === 0) {
        this.newsTotal = d.data.total;
        this.newsList = d.data.data;
      }
    },
    tabNewsClick() {
      this.pageNewsByType();
    },
    //点击页码触发
    newsCurrentChange(val) {
      this.newsParams.pageNum = val;
      this.pageNewsByType();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-divider--horizontal {
  margin: 0 0 20px 0;
}
.el-card__body {
  padding: 15px 20px;
}
.head {
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  .task-wrap {
    display: flex;
    height: 76px;
    .task {
      display: flex;
      align-content: center;
      position: relative;
      .tw {
        padding: 14px 0;
        margin: 0 40px;
        text-align: center;
        align-items: center;

        .t1 {
          margin-bottom: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          p {
            font-size: 12px;
            color: #a7a7a7;
          }
        }
        .t2 {
          color: #0f88eb;
          font-size: 24px;
        }
      }
      .linke {
        position: absolute;
        // right: -40px;
        bottom: 15px;
        width: 1px;
        width: 1px;
        height: 20px;
        background: #eeee;
        display: block;
      }
    }
  }
}

.wrap {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .left {
    width: 100%;
    min-width: 750px;
  }
  .main {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 5px 20px;
  }
}
.addBtn {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
  color: #50a8f0;
}
.form-wrap {
  overflow: auto;
  min-width: 248px;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}
.dismissDiary {
  position: absolute;
  right: -460px;
  display: none;
}
.diary {
  margin-left: 10px;
  width: 460px;
  padding: 0px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .diary-head {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .both {
    display: flex;
    justify-content: space-between;
  }
}
.el-tree-node {
  min-height: 40px;
}
.el-form-item {
  margin-bottom: 15px;
}
.tipText {
  white-space: pre-line;
  max-height: 330px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}

.exportBox {
  position: absolute;
  right: 0px;
  top: 4px;
  display: flex;
}
.exportForm_date {
  width: 245px;
}
.exportBtn {
  height: 30px;
  width: 115px;
  padding-left: 40px;
  margin-right: 25px;
}

.subTime {
  display: flex;
  justify-content: space-between;
  font-size: 14px !important;
  color: #999999 !important;
}
.screen {
  position: absolute;
  right: 0;
  bottom: -20px;
  font-size: 18px;
  cursor: pointer;
  color: #999999 !important;
}
.exportIcon {
  background: url("./images/exportIcon.png") no-repeat center center;
  height: 20px;
  width: 30px;
  position: absolute;
  left: -35px;
  top: -4px;
}
/deep/ .el-tabs__nav {
  // height: 53px;
  padding: auto 20px;
}
.showDiary {
  width: 45px;
  height: 59px;
  position: absolute;
  top: 80px;
  right: 0;
  z-index: 1008;
}
.diary-head .dismisIcon {
  width: 18px;
  height: 18px;
  position: relative;
}
.news {
  /deep/ .el-tabs__item {
    color: #303133;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    height: 100%;
    overflow: auto;
  }
  /deep/ .el-tabs--left .el-tabs__header.is-left {
    margin-right: 0;
  }
  .empty {
    display: block;
    text-align: center;
    color: #999;
    margin: 30px auto;
    font-size: 14px;
  }
}
.newList {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 50%;
    padding: 6.5px;
    .wrap {
      display: flex;
      justify-content: space-between;
      height: 75px;
      background: white;
      padding: 12px;
      cursor: pointer;
      border-radius: 3px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
      }
    }

    .bg {
      height: 100%;
      width: 170px;
      border-radius: 3px;
      margin-right: 15px;
    }
    .right {
      min-width: 0;
      flex: 1;
    }
    .right-hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 0;
    }
    .t1 {
      flex: 1;
      color: #000000;
      font-size: 17px;
      margin-bottom: 3px;
    }
    .time {
      width: 75px;
      text-align: right;
      color: #a7a7a7;
      font-size: 12px;
    }
    .t2 {
      color: #7a7a7a;
      font-size: 13px;
      flex: 1;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px;
      min-width: 0;
      .border {
        border: 1px solid #9d9d9d;
        color: #9d9d9d;
        padding: 4px 0;
        width: 70px;
        margin-left: 5px;
        text-align: center;
        color: #409eff;
        border: 1px solid #409eff;
      }
    }
    &:hover {
      .border {
        color: #fff;
        background-color: #409eff;
        border: 1px solid #409eff;
      }
    }
  }
}
</style>