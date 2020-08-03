<template>
  <div class="updatapwd user-container">
    <v-form title="找回密码">
      <div class="form-item-list" slot="main">
        <div class="item" v-show="noe">
          <input
            type="text"
            @blur="validatePhone"
            :maxlength="11"
            placeholder="请输入手机号码"
            v-model="phone"
          />
          <p class="pwd-rule">设置密码请先验证手机号</p>
          <span class="error-msg">{{errorMsg.phone}}</span>
        </div>

        <div class="flex">
          <div class="item" v-show="noe">
            <input type="text" placeholder="请输入验证码" v-model="securityCode" />
          </div>
          <img class="codeImg"  v-show="noe" :src="codeImg" @click="getImageVerifyCode" v-if="codeImg" alt />
        </div>
        <div class="item" v-show="noe">
          <input
            type="text"
            @blur="validateCode"
            class="txt-code"
            placeholder="请输入验证码"
            v-model="code"
          />
          <div class="code-view">
            <span class="error-msg-code">{{errorMsg.code}}</span>
            <span
              :class="['send-code', { disable: isDisable }]"
              @click="sendCodeSms"
              v-html="timerCodeMsg"
            ></span>
          </div>
        </div>
        <div class="item" v-show="tow">
          <input type="password" @blur="passwordBlur" placeholder="请输入密码" v-model="password" />
          <p class="pwd-rule">密码包含大小写字母、数字、特殊字符至少3个组合大于8个字符</p>
          <span class="error-msg">{{errorMsg.password}}</span>
        </div>
        <div class="item" v-show="tow">
          <input
            type="password"
            @blur="validateCheckPass"
            placeholder="请再次输入密码"
            v-model="checkPass"
          />
          <span class="error-msg">{{errorMsg.checkPass}}</span>
        </div>
        <div class="register-success" v-show="three">
          <span class="text">设置密码成功</span>
        </div>
        <p class="submit-btn" @click="submit">{{btnText}}</p>
      </div>
    </v-form>
  </div>
</template>

<script>
import vForm from "./form";
import validateMixin from "./validate";
export default {
  name: "updatapwd",
  data() {
    return {
      codeImg: "",
      randomKey: "",
      securityCode: ""
    };
  },
  mixins: [validateMixin],
  created() {
    this.getImageVerifyCode();
    document.onkeydown = e => {
      if (this.$route.name != "updatapwd") return;
      var theEvent = e || window.event;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        this.submit();
        return false;
      }
      return true;
    };
  },
  components: {
    vForm
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
          verifyCodeType: 3
        },
        false
      );
      if (d.code === 0) {
        this.codeImg = d.data;
      }
    },
    async submit() {
      if (this.noe) {
        if (!this.validatePhone() || !this.validateCode()) {
          return;
        }
        const d = await this.post(this.$api.preliminarySubmitVerifyCode, {
          telephone: this.phone,
          smsVerifyCode: this.code,
          verifyCodeType: 3
        });
        if (d.code === 0) {
          if (d.data === 3 || d.data === 1) {
            this.errorMsg.code = "验证码错误";
          } else if (d.data === 2) {
            this.errorMsg.code = "验证码已过期";
          } else {
            this.noe = false;
            this.tow = true;
            this.errorMsg.code = "";
          }
        }
        return;
      }
      if (this.tow) {
        var status = this.validatePassword();
        // status = this.validatePasswordRule();
        status = this.validateCheckPass();
        if (status) this.updataPwd();
        return;
      }
      if (this.three) {
        const d = await this.post(this.$api.login, {
          pwd: this.password,
          uid: this.phone,
          uniqueCode: ""
        });
        if (d.code === 0) {
          this.$common.setLocalStorage("userInfo", d.data);
          this.$router.push({ path: "/" });
        }
      }
    },
    async updataPwd() {
      const d = await this.post(this.$api.findPwd, {
        smsVerifyCode: this.code,
        uid: this.phone,
        newPwd: this.password
      });
      if (d.code === 0) {
        this.tow = false;
        this.three = true;
        this.btnText = "进入管理后台";
      }
    },
    passwordBlur() {
      this.validatePassword();
      // this.validatePasswordRule();
    },
    getCode() {
      this.isDisable = true;
      let count = 59;
      this.isGetCode = true;
      for (let i = 0; i <= count; i++) {
        setTimeout(() => {
          if (count != 0) {
            this.timerCodeMsg = `<em style="color: #0099ff">${count}s</em>后可重新发送`;
            count--;
          } else {
            this.isDisable = false;
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
      if (!this.validatePhone()) {
        return;
      }
      const d = await this.post(this.$api.sendVerifyCode, {
        telephone: this.phone,
        templateCode: "SMS_VERIFY_CODE",
        verifyCodeType: 3,
        securityCode: this.securityCode,
        key: this.randomKey
      });
      if (d.code === 0) {
        this.getCode();
        this.$message({
          message: "短信发送成功",
          type: "success"
        });
      } else {
        this.getImageVerifyCode();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style";

.submit-btn {
  margin-top: 56px;
}

.code-view {
  position: absolute;
  bottom: 0;
  right: 20px;
  line-height: 54px;
  height: 54px;
  text-align: right;

  .send-code {
    color: #0099ff;
    font-size: 16px;
    cursor: pointer;

    &.disable {
      color: #999;
    }
  }
  .error-msg-code {
    padding-right: 10px;
    color: #ff3333;
    font-size: 16px;
  }
}
.pwd-rule {
  font-size: 14px;
  color: #ccc;
  position: absolute;
  top: -28px;
}
.txt-code {
  padding-right: 250px !important;
}
.register-success {
  .text {
    line-height: 156px;
    font-size: 32px;
    color: #333;
  }
}
.codeImg {
  // width: 110px;
  height: 30px;
  margin-left: 20px;
  margin-bottom: 20px;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
