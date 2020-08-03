<template>
  <el-dialog
    :title="form.userName+'的日志'+ hebdomad"
    :visible.sync="showValue"
    :before-close="clearData"
    width="90%"
    top="10vh"
  >
    <div class="main">
      <div class="left-content">
        <div>
          <span
            v-for="(item,index) in weekDates"
            :key="index"
            :class="weeksIndex==index?'weeksItem active':'weeksItem'"
            @click="clickWeekItem(index)"
          >{{item.day}}</span>
        </div>

        <el-form ref="form" :model="form" label-width="82px">
          <el-form-item label="今日成果" prop="todayResults">
            <el-input
              type="textarea"
              :rows="10"
              placeholder="这里是今日成果内容。"
              v-model="form.autoTodayResult+form.todayResults"
              disabled
            ></el-input>
            <i @click="todayShow=true" class="screen el-icon-full-screen"></i>
          </el-form-item>
          <el-form-item label="明日任务" prop="tomorrowTask">
            <el-input
              type="textarea"
              :rows="3"
              disabled
              placeholder="这里是明日任务的内容"
              v-model="form.autoTomorrowTask+form.tomorrowTask"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="待协调">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="这里是待协调的内容"
              disabled
              v-model="form.autoToCoordinate+form.toCoordinate"
              autosize
            ></el-input>
          </el-form-item>

          <div class="both">
            <el-form-item label="截止时间">
              <el-date-picker
                disabled
                v-model="form.deadlineTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                style="width:200px;"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="用时" style="width:100%">
              <el-input-number
                style="width:100%"
                disabled
                v-model="form.totalTime"
                :controls="false"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="自评分" style="width:100%">
              <el-input-number
                style="width:100%"
                disabled
                v-model="form.selfRating"
                :controls="false"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="上级评分" style="width:100%">
              <el-input-number
                style="width:100%"
                :disabled="!receiverFlag"
                @change="updateHigherRating"
                v-model="form.higherRating"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </div>
          <el-form-item label="日志接收人">
            <el-tabs v-model="activeName" class="tab-container">
              <el-tab-pane label="已读" name="yesRead">
                <el-tag
                  class="tag"
                  size="small"
                  :key="tag"
                  disabled
                  v-for="tag in readUserName"
                >{{tag}}</el-tag>
              </el-tab-pane>
              <el-tab-pane label="未读" name="noRead">
                <el-tag
                  class="tag"
                  size="small"
                  :key="tag"
                  disabled
                  v-for="tag in unReadUserName"
                >{{tag}}</el-tag>
              </el-tab-pane>
            </el-tabs>
            <!-- <span v-else>暂无</span> -->
          </el-form-item>
        </el-form>
        <div style="text-align:right;margin-bottom:10px">
          <el-button
            type="primary"
            size="small"
            v-if="previousId!=='-1'"
            @click="previousOrNext(0)"
          >上一页</el-button>
          <el-button type="primary" size="small" v-if="nextId!=='-1'" @click="previousOrNext(1)">下一页</el-button>
        </div>
      </div>
      <comments ref="comments" :height="515" :businessType="'日志'" :businessId="id+''"></comments>
    </div>
    <el-dialog title="今日成果" :visible.sync="todayShow" width="500px" append-to-body>
      <div style="padding:20px">
        <el-input
          type="textarea"
          :rows="20"
          placeholder="这里是今日成果"
          v-model="form.autoTodayResult+form.todayResults"
          disabled
        ></el-input>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import comments from "@/components/comment";
import modalMixin from "@/mixins/modal";
export default {
  mixins: [modalMixin],
  components: { comments },
  props: {
    params: Object,
    tabData: Array,
    diaryId: String,
    userId: String,
    createDate: String
  },
  data() {
    return {
      todayShow: false,
      activeName: "yesRead",
      receiverFlag: false, //当前登录人是不否是该日志接收人 true 则可修改上级评分
      dynamicTags: [],
      form: {
        todayResults: "",
        tomorrowTask: "",
        toCoordinate: "",
        deadlineTime: "",
        totalTime: "",
        higherRating: "",
        selfRating: "",
        receiveList: []
      },
      previousId: null,
      nextId: null,
      unReadUserName: [],
      readUserName: [],
      weekDates: [],
      hebdomad: "",
      weeksIndex: "",
      id: ""
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        this.getDiary();
      }
    },
    createDate(val) {
      if (val) {
      }
    },
    diaryId(val) {
      if (val) {
        console.log(22222, val);
        this.id = val;
      }
    }
  },
  methods: {
    async previousOrNext(num) {
      if (num === 0) {
        // await this.$emit("setDiaryId", this.form.id);
        await this.$emit("setDiaryDate", this.form.previousDate);
        await this.$emit("setDiaryUserId", this.form.previousId);
        this.getDiary(this.form.previousId);
      } else {
        // await this.$emit("setDiaryId", this.form.id);
        await this.$emit("setDiaryDate", this.form.nextDate);
        await this.$emit("setDiaryUserId", this.form.nextId);
        this.getDiary(this.form.nextId);
      }
    },
    async updateHigherRating() {
      const d = await this.post(
        this.$api.home.updateHigherRating,
        {
          diaryId: this.id,
          higherRating: this.form.higherRating,
          receiverFlag: this.receiverFlag
        },
        false
      );
      if (d.code === 0) {
        this.$refs.comments.listComments();
      }
    },
    clearData() {
      this.$emit("getList");
      this.showValue = false;
    },
    async getDiary(id) {
      const d = await this.post(this.$api.home.getDiary, {
        // diaryId: id || this.diaryId,
        userId: id || this.userId,
        date: this.createDate,
        ...this.params
      });
      if (d.code === 0) {
        this.form = d.data;
        this.previousId = d.data.previousId;
        this.nextId = d.data.nextId;
        this.readUserName = d.data.readUserName;
        this.unReadUserName = d.data.unReadUserName;
        this.receiverFlag = d.data.receiverFlag;
        this.id = d.data.id;
        // this.$refs.comments.listComments();
        this.getWeekDay(d.data.createDate);
      }
    },
    getWeekDay(dateStr) {
      //获取当前一周的周一到周日的日期
      var currentDate = new Date(dateStr);
      var timesStamp = currentDate.getTime();
      var currenDay = currentDate.getDay();
      var dates = [];
      for (var i = 0; i < 7; i++) {
        let weekItem = {};
        weekItem.str = this.formarDateStr(
          timesStamp + 24 * 60 * 60 * 1000 * (i - ((currenDay + 6) % 7))
        );
        // weekItem.str =  new Date(
        //   timesStamp + 24 * 60 * 60 * 1000 * (i - ((currenDay + 6) % 7))
        // )
        //   .toLocaleDateString()
        //   .replace(/\//g, "-");
        let day = new Date(
          timesStamp + 24 * 60 * 60 * 1000 * (i - ((currenDay + 6) % 7))
        ).getDay();
        switch (day) {
          case 0:
            day = "周日";
            break;
          case 1:
            day = "周一";
            break;
          case 2:
            day = "周二";
            break;
          case 3:
            day = "周三";
            break;
          case 4:
            day = "周四";
            break;
          case 5:
            day = "周五";
            break;
          case 6:
            day = "周六";
            break;
          default:
            break;
        }
        weekItem.day = day;
        dates.push(weekItem);
      }

      let temArr = [];
      dates.forEach(item => {
        temArr.push(item.str);
      });
      for (let index = 0; index < temArr.length; index++) {
        temArr[index] = temArr[index].replace(/-/g, ".");
      }
      this.weekDates = dates;
      this.weeksIndex = currenDay > 0 ? currenDay - 1 : dates.length - 1;
      this.hebdomad = "(" + temArr[0] + "-" + temArr[temArr.length - 1] + ")";
    },
    formarDateStr(timeStamp) {
      let yy = new Date(timeStamp).getFullYear();
      let mm = new Date(timeStamp).getMonth() + 1;
      mm = mm < 10 ? "0" + mm : mm;
      let dd = new Date(timeStamp).getDate();
      dd = dd < 10 ? "0" + dd : dd;
      return yy + "-" + mm + "-" + dd;
    },
    async clickWeekItem(index) {
      console.log(index);
      this.weeksIndex = index;
      const d = await this.post(this.$api.home.getDiary, {
        userId: this.userId,
        date: this.weekDates[index].str,
        ...this.params
      });
      if (d.code === 0) {
        this.form = d.data;
        this.readUserName = d.data.readUserName;
        this.unReadUserName = d.data.unReadUserName;
        this.receiverFlag = d.data.receiverFlag;
        this.$refs.comments.listComments();
        this.getWeekDay(d.data.createDate);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.main {
  display: flex;
  .left-content {
    padding-right: 20px;
    width: 250%;
    .both {
      display: flex;
    }
  }
  .left-content {
    .tag {
      margin-right: 10px;
      text-align: center;
      cursor: pointer;
    }
    .tab-container /deep/ .el-tabs__nav-wrap::after {
      background: #fff;
    }
    .btn-wrap {
      span {
        color: #0f88eb;
        font-size: 12px;
        cursor: pointer;
      }
      .line {
        margin: 0 10px;
      }
    }
  }
}
/deep/ .is-disabled {
  input,
  textarea {
    color: black !important;
  }
}

.weeksItem {
  border-color: #e7e7e7;
  background: #e4e4e4;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  color: #333333;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
  margin: 0px 6px 20px 0px;
}
.weeksItem.active {
  background: #0f88eb;
  color: white;
}
/deep/ .el-tabs__header {
  margin: 0;
}
.screen {
  position: absolute;
  right: 0;
  bottom: -20px;
  font-size: 18px;
  cursor: pointer;
  color: #999999 !important;
}
</style>