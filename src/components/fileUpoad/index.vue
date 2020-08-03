<template>
  <div>
    <div class="upWrap">
      <el-button size="small" class="btn" @click="globalUpload">上传文件</el-button>
      <div class="name-wrap">
        <span class="tip"></span>
      </div>
    </div>
    <div v-for="(item,index) in FileList" :key="index" class="test">
      <div class="check-file">
        <div class="zz">
          <img src alt />
          <el-tooltip class="item" effect="dark" :content="item.fileName" placement="top-start">
            <span class="oe">{{item.fileName}}</span>
          </el-tooltip>
        </div>
        <div class="iconWarp">
          <div @click="showFilePop(item)">
            <a target="_blank"></a>
            预览
          </div>
          <div @click="del(index,item)">删除</div>
          <div @click="downLoad(index,item)">下载</div>
          <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "@/axios/bus";
import wpsFile from "@/components/wpsFile";
export default {
  props:{fileList:Array},
  components: {
    wpsFile
  },
  data() {
    return {
      currFile: [],
      showFile: false,
      editField: [],
      FileList: [],
      form: {}
    };
  },
  mounted() {
    this.FileList = this.$props.fileList
    // 文件上传成功的回调
    Bus.$on("fileSuccess", data => {
      this.FileList.push({
        extendId: data.extendId,
        fileId: data.fileId,
        fileSize: data.fileSize,
        fileType: data.fileType,
        name: data.name,
        preview: data.preview,
        url: data.url,
        fileName: data.name
      });
    });
  },
  watch: {
    fileList(val){
      this.FileList = val
    },
    FileList(val) {
      this.$emit("getChildren", val);
    }
  },
  methods: {
    // 下载
    downLoad(index, item) {
      window.open(item.url);
    },
    del(item, index) {
      this.FileList.splice(index, 1);
    },
    showFilePop(val) {
      this.currFile = [val];
      this.showFile = true;
    },
    globalUpload() {
      let fieldFormat = [];
      // 打开文件选择框
      Bus.$emit("openUploader", { fieldFormat });
    }
  }
};
</script>

<style lang='scss' scoped>
.check-file {
  background: url("~@/assets/images/file.png") no-repeat left center;
  width: 230px;
  height: 36px;
  // margin-bottom: 8px;
  // background: #f8f8f8;
  // color: #939393;
  font-size: 14px;
  border-radius: 3px;
  display: flex;
  cursor: pointer;
  padding: 10px;
  align-items: center;
  .iconWarp {
    div {
      width: 50px;
      padding-left: 16px;
      font-size: 12px;
    }
    div:nth-child(1) {
      background: url("~@/assets/images/preview.png") no-repeat left center;
    }
    div:nth-child(2) {
      background: url("~@/assets/images/delete.png") no-repeat left center;
    }
    div:nth-child(3) {
      background: url("~@/assets/images/download.png") no-repeat left center;
    }
    div:nth-child(1):hover {
      color: #0f88eb;
      background: url("~@/assets/images/preViewhover.png") no-repeat left center;
    }
    div:nth-child(2):hover {
      color: #0f88eb;
      background: url("~@/assets/images/deletehover.png") no-repeat left center;
    }
    div:nth-child(3):hover {
      color: #0f88eb;
      background: url("~@/assets/images/downloadhover.jpg") no-repeat left center;
    }
    display: flex;
    margin-left: 5px;
  }
  &:hover {
    // .i-con-wrap {
    //   display: block;
    // }
    .zz {
      opacity: 0.8;
    }
  }
}
.zz {
  display: flex;
  align-items: center;
  opacity: 1;
}
.oe {
  margin-right: 10px;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>