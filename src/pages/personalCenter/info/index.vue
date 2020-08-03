<template>
  <el-card>
    <div class="userInfo-title">
      <p>个人中心</p>
      <div>
        <el-button size="small" @click="saveUserInfo('userInfo')" type="primary">保存</el-button>
        <el-button size="small" @click="getUserInfo">取消</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <el-form
      :model="userInfo"
      :rules="rules"
      ref="userInfo"
      label-width="150px"
      class="demo-userInfo"
      size="small"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input class="items" v-model="userInfo.userName"></el-input>
      </el-form-item>
      <el-form-item label="工作电话" prop="workPhone">
        <el-input class="items" v-model="userInfo.workPhone"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="headIcon">
        <el-upload
          class="avatar-uploader"
          :action="`${$config.host}${$api.common.upload}`"
          name="multipartFile"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="userInfo.headIcon" :src="userInfo.headIcon" class="avatar" />
          <i v-else style="font-size:30px" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="学历" prop="education">
        <el-input class="items" v-model="userInfo.education"></el-input>
      </el-form-item>
      <el-form-item label="学位" prop="degree">
        <el-input class="items" v-model="userInfo.degree"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input class="items" v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="qq" prop="qq">
        <el-input class="items" v-model="userInfo.qq"></el-input>
      </el-form-item>
      <el-form-item label="微信" prop="weixin">
        <el-input class="items" v-model="userInfo.weixin"></el-input>
      </el-form-item>
      <el-form-item label="学校名称" prop="universityName">
        <el-input class="items" v-model="userInfo.universityName"></el-input>
      </el-form-item>
      <el-form-item label="院系名称" prop="college">
        <el-input class="items" v-model="userInfo.college"></el-input>
      </el-form-item>
      <el-form-item label="专业名称" prop="major">
        <el-input class="items" v-model="userInfo.major"></el-input>
      </el-form-item>
      <el-form-item label="实践经历" prop="practice">
        <el-input class="items" v-model="userInfo.practice"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input class="items" v-model="userInfo.address"></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import modalMixin from "@/mixins/modal";
import dragTableMixin from "@/mixins/dragTable";
import tableMixin from "@/mixins/table";
export default {
  name: "personalCenter-info",
  mixins: [modalMixin, tableMixin, dragTableMixin],
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      }
      if (!/^1[345789]\d{9}$/.test(value)) {
        callback(new Error("手机格式错误"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      let reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
      if (value && value.length > 0) {
        if (!reg.test(value)) {
          callback([new Error("姓名输入不合法")]);
        } else {
          callback();
        }
      } else if (value.length == 0) {
        callback();
      } else {
        callback(new Error("姓名输入不合法"));
      }
    };
    return {
      userInfo: {
        userName: "",
        workPhone: "",
        headIcon: "",
        education: "",
        degree: "",
        email: "",
        qq: "",
        weixin: "",
        universityName: "",
        college: "",
        major: "",
        practice: "",
        address: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: validateName, trigger: "blur" }
        ],
        headIcon: [{ required: true, message: "请上传照片", trigger: "blur" }],
        workPhone: [
          { required: true, validator: validatePhone, trigger: "blur" }
        ]
      }
    };
  },
  watch: {},
  mounted() {
    this.getUserInfo();
  },
  methods: {
    handleAvatarSuccess(res, file, flieList, type, name) {
      console.log(res, "4");
      this.userInfo.headIcon = res.data.url;
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isjpg = file.type === "image/jpg";
      const isjpeg = file.type === "image/jpeg";
      const ispng = file.type === "image/png";
      const isgif = file.type === "image/gif";
      const isGif = file.type === "image/GIF";
      const isJPG = file.type === "image/JPG";
      const isPNG = file.type === "image/PNG";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isjpg && !isjpeg && !ispng && !isgif && !isGif && !isJPG && !isPNG) {
        this.$message.error("请上传图片!");
      }
      if (!isLt10M) {
        this.$message.error("图片大小不能超过 10MB!");
      }
      return (
        (isjpg || isjpeg || ispng || isgif || isGif || isJPG || isPNG) &&
        isLt10M
      );
    },
    saveUserInfo(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const d = await this.post(
            this.$api.user.updatePersonInfo,
            this.userInfo
          );
          if (d.code === 0) {
            this.$store.dispatch("setUserInfo", this.userInfo);
            this.$message.success("保存成功");
            this.$router.push({ name: "home" });
          }
        }
      });
    },
    async getUserInfo(name) {
      const d = await this.post(this.$api.home.getLoginUserInfo);
      if (d.code === 0) {
        this.userInfo = d.data;
      }
    }
  }
};
</script>

<style lang="scss">
.items {
  width: 400px;
}
.userInfo-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
.avatar-uploader {
  height: 50px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.scene-head-title {
  margin-right: 10px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>
