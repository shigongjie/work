<template>
  <div class="updatapwd user-container">
    <v-form title="注册">
      <el-form
        slot="main"
        ref="registerForm"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
            :maxlength="11"
            name="phone"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <div class="from-code code-wrap">
          <el-form-item prop="securityCode" class="el-form-item-code">
            <el-input
              v-model="securityCode"
              placeholder="请输入验证码"
              name="code"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
          <img class="codeImg" :src="codeImg" @click="getImageVerifyCode" v-if="codeImg" alt />
        </div>

        <div class="from-code">
          <el-form-item prop="code" class="el-form-item-code">
            <el-input
              v-model="registerForm.code"
              placeholder="请输入验证码"
              name="code"
              type="text"
              auto-complete="on"
            />
          </el-form-item>
          <el-button class="send-code" @click="sendCodeSms" type="warning">{{timerCodeMsg}}</el-button>
        </div>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            name="password"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="checkPass">
          <el-input
            v-model="registerForm.checkPass"
            type="password"
            placeholder="请再次输入密码"
            name="checkPass"
            auto-complete="on"
          />
        </el-form-item>

        <el-button
          type="primary"
          style="width:100%;margin-bottom:10px;"
          @click.native.prevent="handleRegister"
        >注册并登录</el-button>
        <p class="to-login">
          <router-link :to="{ name: 'login' }">已有账号？立即登录</router-link>
        </p>
      </el-form>
    </v-form>
  </div>
</template>

<script>
import vForm from "./form";
import validateMixin from "./validate";
export default {
  name: "updatapwd",
  components: {
    vForm
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else {
        if (!/^1[23456789]\d{9}$/.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      var reg = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/;
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (!reg.test(value)) {
          callback(
            new Error(
              "密码包含大小写字母、数字、特殊字符至少3个组合大于8个字符"
            )
          );
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      codeImg: "",
      randomKey: "",
      securityCode: "",
      timerCodeMsg: "发送验证码",
      registerForm: {
        phone: "",
        code: "",
        password: "",
        checkPass: ""
      },
      registerRules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
          { min: 6, message: "密码长度不能少于6个字符", trigger: "blur" }
        ],
        checkPass: [
          { required: true, trigger: "blur", validator: validatePass2 },
          { min: 6, message: "密码长度不能少于6个字符", trigger: "blur" }
        ]
      }
    };
  },
  mixins: [validateMixin],
  created() {
    this.getImageVerifyCode();
  },
  methods: {
    getRandomCode(length) {
      if (length > 0) {
        let data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let nums = "";
        for (let i = 0; i < length; i++) {
          let r = parseInt(Math.random() * 10);
          nums += data[r];
        }
        return nums;
      } else {
        return false;
      }
    },
    async getImageVerifyCode() {
      this.randomKey = this.getRandomCode(12);
      const d = await this.post(
        this.$api.getImageVerifyCode,
        {
          key: this.randomKey,
          verifyCodeType: 1
        },
        false
      );
      if (d.code === 0) {
        this.codeImg = d.data;
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          const d = await this.post(this.$api.register, {
            pwd: this.registerForm.password,
            uid: this.registerForm.phone,
            smsVerifyCode: this.registerForm.code,
            verifyCodeType: 1
          });
          if (d.code === 0) {
            this.$message({
              message: "注册成功",
              type: "success"
            });
            this.$router.push({ path: "/login" });
          }
        }
      });
    },
    getCode() {
      let count = 59;
      this.isGetCode = true;
      for (let i = 0; i <= count; i++) {
        setTimeout(() => {
          if (count != 0) {
            this.timerCodeMsg = count + "秒后重发";
            count--;
          } else {
            this.timerCodeMsg = "发送验证码";
          }
        }, i * 1000);
      }
    },
    async sendCodeSms() {
      if (this.securityCode === "") {
        return this.$message.error("请输入图形验证码");
      }
      if (this.timerCodeMsg != "发送验证码") {
        return;
      }
      if (
        this.registerForm.phone === "" ||
        !/^1[23456789]\d{9}$/.test(this.registerForm.phone)
      ) {
        this.$refs.registerForm.validateField("phone");
        return;
      }

      const d = await this.post(this.$api.sendVerifyCode, {
        telephone: this.registerForm.phone,
        templateCode: "SMS_YSS_VERIFY_CODE",
        securityCode: this.securityCode,
        key: this.randomKey,
        verifyCodeType: 1
      });
      if (d.code === 0) {
        this.getCode();
        this.$message({
          message: "短信发生成功",
          type: "success"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style";
.from-code {
  display: flex;
  align-items: flex-start;
  .el-form-item-code {
    flex: 1;
  }
  .send-code {
    width: 150px;
    margin-left: 10px;
  }
}
.to-login {
  text-align: center;
  color: #0f88eb;
}
.codeImg {
  // width: 110px;
  height: 30px;
  margin-left: 20px;
  margin-bottom: 20px;
}
.code-wrap {
  display: flex;
  align-items: center;
}
</style>
