<template>
  <div class="right-content">
    <div class="msg" :style="{ maxHeight: height + 'px' }">
      <div class="common" v-for="(item, index) in commonList" :key="index">
        <div class="head">
          <p>
            <!-- 是否头像item.headIcon || -->
            <img :src="require('@/assets/images/avatar.png')" alt />
            <span>{{item.userName}}</span>
          </p>
          <span>{{item.createTime}}</span>
        </div>
        <!-- <div
          class="content"
          v-if="~~item.commentType===1"
          style="color:#409EFF  !important"
        >通过理由:{{item.comment}}</div>
        <div
          class="content"
          v-else-if="~~item.commentType===2"
          style="color:red !important"
        >拒绝理由:{{item.comment}}</div>-->
        <div class="content">{{item.comment}}</div>
        <div v-if="item.attachmentJa.length>0">
          <!-- <el-image
            v-for="(todo, index) in item.attachmentJa"
            :key="index"
            title="点击预览"
            style="width: 60px; height: 60px;margin-right:5px;margin-bottom:5px"
            :src="todo"
            :preview-src-list="[todo]"
          ></el-image>-->
          <div
            class="file oe"
            v-for="(todo, index) in item.attachmentJa"
            @click="down(todo.url)"
            :key="index"
          >
            <i class="el-icon-document"></i>
            <p class="oe" :title="todo.name">{{todo.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="from">
        <!-- <input type="text" v-model="comment" @keyup.enter="send" placeholder="在此输入评语" /> -->
        <el-input
          type="textarea"
          autosize
          placeholder="在此输入评语"
          @keyup.enter="send"
          v-model="comment"
          :autosize="{maxRows: 8}"
        ></el-input>
        <div class="btns" style="height:100%">
          <i class="el-icon-circle-plus-outline" @click="isAdd=!isAdd"></i>
          <el-button size="small" class="btn" type="primary" @click="send">发送</el-button>
        </div>
      </div>
      <div v-show="isAdd">
        <el-upload
          class="commonImg"
          :action="`${$config.host}${$api.common.upload}`"
          list-type="picture-card"
          :on-remove="handleRemove"
          name="multipartFile"
          multiple
          :limit="9"
          :on-exceed="onExceed"
          :file-list="fileList"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog append-to-body :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: Number,
    businessType: Number,
    businessId: String
  },
  data() {
    return {
      comment: "",
      commonList: [],
      attachmentJa: [],
      fileList: [],
      dialogImageUrl: "",
      isAdd: false,
      dialogVisible: false
    };
  },
  created() {
    // console.log(this.$props.businessId, 11111);
    if (this.$props.businessId!=''&&this.$props.businessId!=undefined) {
      this.listComments();
    }
  },
  watch: {
    businessId(val) {
      if (val != "") {
      this.listComments();
      }
    }
  },
  destroy() {
    console.log("销毁");
    this.comment = "";
    this.attachmentJa = [];
    this.fileList = [];
  },
  methods: {
    down(url) {
      window.open(url);
    },
    onExceed(files, fileList) {
      this.$message.error("一次最多只能上传9份附件");
    },
    handleAvatarSuccess(res, file, flieList, type, name) {
      this.attachmentJa.push(res.data);
    },
    handleRemove(file, fileList) {
      let remIndex;
      this.attachmentJa.some((item, index) => {
        if (item.extendId === file.response.data.extendId) {
          remIndex = index;
        }
      });
      this.attachmentJa.splice(remIndex, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async send() {
      if (!this.comment && this.attachmentJa.length === 0) {
        return this.$message.error("评论内容不能为空");
      }
      const d = await this.post(this.$api.common.send, {
        businessType: this.businessType,
        businessId: this.businessId,
        comment: this.comment,
        // images: this.images,
        attachmentJa: this.attachmentJa,
        commentType: 0
      });
      if (d.code === 0) {
        this.comment = "";
        this.attachmentJa = [];
        this.fileList = [];
        this.isAdd = false;
        this.listComments();
      }
    },
    async listComments() {
      const d = await this.post(this.$api.common.listComments, {
        businessType: this.businessType,
        businessId: this.businessId
      });
      if (d.code === 0) {
        this.commonList = d.data;
        // console.log(d.data,5555)
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.right-content {
  width: 100%;
  padding-top: 20px;
  padding-right: 20px;
  border-left: 1px solid #eeeeee;
  // margin-left: 15px;
  // width: 368px;
}
.msg {
  padding-left: 15px;
  margin-bottom: 55px;
  max-height: 540px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
  //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
  .common {
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 15px;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      p {
        display: flex;
        align-items: center;
        img {
          height: 25px;
          width: 25px;
          border-radius: 50%;
          margin-right: 10px;
        }
        span {
          color: #999999;
          font-size: 14px;
        }
      }
      span {
        color: #999999;
        font-size: 12px;
      }
    }
    .content {
      font-size: 14px;
      color: #000;
      margin-bottom: 12px;
    }
  }
}
.footer {
  background-color: #fff;
  border-top: 1px solid #eee;
  border-right: none;
  box-shadow: 1px -2px 4px #e4e4e4;
  padding-left: 15px;
  position: absolute;
  width: 100%;
  bottom: 0;

  .from {
    display: flex;
    padding: 10px 0;
    // border-bottom: 1px solid #eee;
    align-items: flex-end;
    input {
      flex: 1;
      font-size: 14px;
    }
    .btn {
      margin-right: 20px;
    }
  }
}
.btns {
  display: flex;
  align-items: center;
  i {
    font-size: 18px;
    margin: 0 5px;
  }
}
.commonImg {
  margin-bottom: 10px;
}
.file {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
  i {
    font-size: 18px;
    margin-right: 5px;
  }
}
.file:hover {
  color: #0f88eb;
}
</style>