<template>
  <el-dialog fullscreen :visible.sync="showValue" :show-close="false" class="wpsFile" append-to-body>
    <span class="btns" slot="title">
      <a
        class="el-button el-button--small el-button--success"
        target="_blank"
        :href="currFile[aciveTab].url"
        style="color: #fff;"
        v-if="currFile[aciveTab]"
      >下载</a>
      <a
        class="el-button el-button--primary el-button--small"
        style="color: #fff;"
        href="javascript:;"
        @click="closeFile"
      >关闭</a>
    </span>
    <div class="view">
      <div class="left" v-if="currFile.length >1">
        <el-tabs
          type="border-card"
          v-model="aciveTab"
          tab-position="left"
          @tab-click="preview"
          style="height: 100%;width: 100%"
        >
          <el-tab-pane
            v-for="(item, index) in currFile"
            :name="`${index}`"
            :key="index"
            :label="item.name"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="right" v-if="currFile[aciveTab]">
        <div class="wrap">
          <template v-if="currFile[aciveTab].url">
            <el-image
              class="pic"
              fit="contain"
              :preview-src-list="[currFile[aciveTab].url]"
              v-if="isYes==='image'"
              :src="currFile[aciveTab].url"
            ></el-image>
            <iframe
              v-else-if="isYes === 'wps'"
              class="aaa"
              :src="`https://weboffice.91ready.com/preview/?fileId=${currFile[aciveTab].fileId}&token=${token}`"
              width="100%"
              height="100%"
              frameborder="0"
            ></iframe>
            <video-player
              v-else-if="isYes === 'video'"
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="opts"
            ></video-player>
          </template>
          <div class="empty" v-else>
            <img src="./icon_emt.png" alt />暂无数据
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
import VideoPlayer from "vue-video-player";
import hls from "videojs-contrib-hls";
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import Vue from "vue";
Vue.use(VideoPlayer);
Vue.use(hls);
export default {
  props: {
    currFile: Array
  },
  mixins: [modalMixin],
  data() {
    return {
      isYes: "",
      token: "",
      aciveTab: "0",
      activeItem: {},
      opts: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        loop: false,
        preload: "auto",
        language: "zh-CN",
        aspectRatio: "16:9",
        fluid: true,
        sources: [{ src: "" }],
        //你的封面地址
        poster: "",
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      }
    };
  },
  watch: {
    showValue(val) {
      if (this.currFile.length) {
        this.preview();
      }
    }
  },
  mounted() {
    this.token = this.$store.state.token.data.token;
  },
  methods: {
    down() {
      window.location = this.currFile[this.aciveTab].url;
    },
    closeFile() {
      this.showValue = false;
    },
    preview() {
      this.isYes = this.currFile[this.aciveTab].preview;
      if (this.isYes === "video") {
        this.opts.sources[0].src = this.currFile[this.aciveTab].url;
      }
    }
  }
};
</script>

<style lang='less' scoped>
/deep/ .el-dialog__header {
  display: flex;
  justify-content: flex-end;
}

.view {
  width: 100%;
  display: flex;
  flex-direction: row;
  border: 1px solid #dcdfe6;
  height: calc(100vh - 100px);
  .left {
    width: 200px;
    /deep/.el-tabs--left .el-tabs__header.is-left {
      width: 100%;
    }
    /deep/.el-tabs--border-card {
      border: none;
      box-shadow: none;
    }
    /deep/ .el-tabs__item {
      height: 60px;
      line-height: 60px;
      font-size: 16px;
    }
  }
  .right {
    position: relative;
    flex: 1;
    padding: 0;
    // padding-top: 50px;
    height: calc(100vh - 100px);
    .wrap {
      width: 100%;
      height: 100%;
      .video-player {
        max-width: 1300px;
        margin: 0 auto;
      }
    }
  }
  .pic {
    max-width: 100%;
    max-height: 100%;
  }
  .empty {
    width: 100%;
    height: 100%;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
/deep/ .vjs-custom-skin > .video-js .vjs-big-play-button {
  line-height: 1em !important;
  span {
    margin-left: -35px;
  }
}
.wpsFile {
  /deep/ .el-dialog__body {
    padding: 0 30px;
    margin-top: 20px;
  }
  /deep/ .el-dialog__headerbtn .el-dialog__close {
    font-size: 30px;
  }
}
</style>
