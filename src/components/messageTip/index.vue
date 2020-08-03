<template>
  <div class="wrap">
    <el-popover placement="bottom" trigger="click" @show="showList">
      <el-tabs v-model="activeName" stretch style="width:360px;" @tab-click="handleClick">
        <el-tab-pane name="first">
          <span slot="label">待办({{todoCount}})</span>
          <div v-if="msgList &&msgList.length>0" class="infinite-list-wrapper">
            <ul>
              <li
                v-for="(item,index) in msgList"
                @click="toMenu(item)"
                :key="index"
                class="list-item"
              >
                <div>
                  <div class="msgItem">
                    <!-- <p v-if="~~item.readFlag===0" class="tipType">[未读]</p>
                    <p v-else class="locks">[已读]</p>-->
                    <p class="lis-text first" :title="item.content">{{item.content}}</p>
                  </div>
                  <p class="time">{{item.time}}</p>
                </div>
                <el-tag size="small" type="info">{{item.title}}</el-tag>
              </li>
            </ul>
            <!-- <p class="loadtip" v-if="DnoMore" @click="DloadMore">加载更多</p> -->
          </div>
          <div v-else class="empty">
            <div>
              <img src="@/assets/images/icon_emt.png" alt width="140" height="140" />
              <p>页面空空的，暂时没有消息！</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="third">
          <span slot="label">通知({{systemCount}})</span>
          <div v-if="systemList &&systemList.length>0" class="infinite-list-wrapper">
            <ul>
              <li v-for="(item,index) in systemList" :key="index" class="list-item">
                <div>
                  <div class="msgItem">
                    <p v-if="~~item.readFlag===0" class="tipType">[未读]</p>
                    <p v-else class="locks">[已读]</p>
                    <p class="lis-text" :title="item.content">{{item.content}}</p>
                  </div>
                  <p class="time">{{item.createTime}}</p>
                </div>
                <el-tag size="small" type="info">系统消息</el-tag>
              </li>
            </ul>
            <p class="loadtip" v-if="SnoMore" @click="SloadMore">加载更多</p>
          </div>
          <div v-else class="empty">
            <div>
              <img src="@/assets/images/icon_emt.png" alt width="140" height="140" />
              <p>页面空空的，暂时没有消息！</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <upDemand
        :value.sync="showDemand"
        @getList="getList"
        :businessType="'需求'"
        :params="params"
        :demandId="id"
        @setDemandId="setId"
      ></upDemand>
      <upTask
        :value.sync="showUpTask"
        @getList="getList"
        :params="params"
        :businessType="'任务'"
        :taskId="id"
        @setTaskId="setId"
      ></upTask>
      <div slot="reference" class="badge">
        <span v-if="allCount">{{allCount}}</span>
      </div>
    </el-popover>
  </div>
</template>

<script>
import upTask from "../../pages/projectProgress/compontents/upTask";
import upDemand from "../../pages/projectProgress/compontents/upDemand";
export default {
  name: "vheader",
  components: {
    upDemand,
    upTask
  },
  data() {
    return {
      activeName: "first",
      msgList: 5,
      systemCount: "",
      systemList: [],
      SnoMore: true,
      showUpTask: false,
      params: {},
      id: "",
      showDemand: false,
      allCount: "",
      todoCount: "",
      // DnoMore: true,
      isShowOperating: false,
      userInfo: {
        userName: "",
        headIcon: ""
      }
    };
  },
  watch: {
    activeName(val) {
      if (val === "third") {
        this.listNoticeMsg();
      } else {
        this.listTodoMessage();
      }
    },
    "$store.state.message.data": {
      handler: function(newer, older) {
        let that = this;
        if (newer.eventCode && ~~newer.eventCode === 28) {
          console.log("后", newer);
          this.$notify.info({
            title: "消息",
            duration: 0,
            dangerouslyUseHTMLString: true,
            message: `<p class='oe'>${newer.content}</p>`,
            onClick: function() {
              let obj = JSON.parse(newer.paramJo);
              console.log(obj);
              console.log(obj.title === "任务");
              if (obj.title === "需求") {
                that.id = obj.id;
                that.showDemand = true;
              }
              if (obj.title === "任务") {
                that.id = obj.id;
                that.showUpTask = true;
              }
            }
          });
          this.getMessageCount();
        }
      },
      deep: true // 开启深度监听
    }
  },

  mounted() {
    document.onclick = () => {
      this.isShowOperating && (this.isShowOperating = false);
    };
    this.getMessageCount();
  },
  methods: {
    cest() {
      console.log("cesasdasd");
    },
    setId(id) {
      this.id = id;
    },
    getList() {},
    toMenu(item) {
      this.id = item.route;
      if (item.title === "任务") {
        this.showUpTask = true;
      } else {
        this.showDemand = true;
      }
    },
    // DloadMore() {},
    async SloadMore() {
      const d = await this.post(this.$api.common.listNoticeMsg, {
        msgId: this.systemList[this.systemList.length - 1].id,
        row: "20",
        grtFlag: false
      });
      if (d.code === 0) {
        if (d.data.length !== 20) {
          this.SnoMore = false;
        } else {
          this.SnoMore = true;
        }
        d.data.forEach(item => {
          this.systemList.push(item);
        });
      }
    },
    async getMessageCount() {
      const d = await this.post(this.$api.common.getMessageCount, {}, false);
      if (d.code === 0) {
        this.systemCount = d.data.systemCount;
        this.todoCount = d.data.todoCount;
        this.allCount = d.data.allCount;
      }
    },
    showList() {
      this.getMessageCount();
      this.listNoticeMsg();
      this.listTodoMessage();
    },
    async listNoticeMsg() {
      const d = await this.post(this.$api.common.listNoticeMsg, {
        msgId: "0",
        row: "20",
        grtFlag: false
      });
      if (d.code === 0) {
        this.systemList = d.data;
        // this.systemList = [];
        this.SnoMore = this.systemList.length == 20;
      }
    },
    async listTodoMessage() {
      const d = await this.post(this.$api.common.listTodoMessage);
      if (d.code === 0) {
        this.msgList = d.data;
        this.msgList.forEach(item => {
          if (item.route && item.route.rplanId) {
            item.route.rplanId = item.route.rplanId + "";
          }
        });
      }
    },
    handleClick() {
      this.noMore = true;
    }
  }
};
</script>

<style  lang="scss" scoped>
.loadtip {
  text-align: center;
  height: 30px;
  line-height: 20px;
  margin-top: 10px;
  cursor: pointer;
  color: #409eff;
}
.msgItem {
  display: flex;
  margin-bottom: 3px;
  align-items: center;
  .tipType {
    width: 40px;
    margin-right: 5px;
    color: #6cabf0;
  }
  .locks {
    width: 40px;
    margin-right: 5px;
    color: #b6b6b6;
  }
}
.time {
  color: #b6b6b6;
  font-size: 14px;
}
.empty {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    text-align: center;
  }
}
.infinite-list-wrapper {
  height: 400px;
  overflow: auto;
  ul {
    padding: 0 10px;
  }
  .list-item {
    color: rgb(77, 77, 77);
    min-height: 73px;
    max-height: 73px;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    font-size: 14px;
    cursor: pointer;
    border-bottom: 1px solid rgb(240, 240, 240);
    display: flex;
    align-items: center;
    .lis-text {
      max-width: 190px;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .first {
      max-width: 250px;
      width: 250px;
    }
  }
}

.wrap {
  height: 30px;
  position: relative;
  .badge {
    width: 26px;
    height: 100%;
    background: url("./images/1.png") no-repeat center center;
    cursor: pointer;
    span {
      background-color: #f56c6c;
      border-radius: 10px;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      height: 18px;
      line-height: 17px;
      padding: 0px 5px;
      text-align: center;
      white-space: nowrap;
      border: 1px solid #fff;
      position: absolute;
      right: -12px;
      top: -6px;
    }
  }
}
</style>
