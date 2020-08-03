<template>
  <div class="login user-container">
    <v-form title="登录">
      <div class="form-item-list" slot="main">
        <div class="item">
          <!-- <input type="text"  @blur="validatePhone" :maxlength="11"  placeholder="请输入手机号码" v-model="phone"> -->
          <input type="text" placeholder="请输入账号" v-model="phone" />
          <!-- <span class="error-msg">{{errorMsg.phone}}</span> -->
        </div>
        <div class="item">
          <input type="password" @blur="loginPassword" placeholder="请输入密码" v-model="password" />
          <span class="error-msg">{{errorMsg.password}}</span>
        </div>
        <div class="code-item">
          <div class="item">
            <input type="text" placeholder="请输入验证码" v-model="securityCode" />
          </div>
          <img class="codeImg" :src="codeImg" @click="getImageVerifyCode" v-if="codeImg" alt />
        </div>

        <div class="no-user-pwd">
          <router-link class="no-pwd" :to="{ name: 'updatapwd' }">忘记密码?</router-link>
        </div>
        <p class="submit-btn" @click="submit">登录</p>
        <div class="register">
          <router-link :to="{ name: 'register' }">没有账号?立即创建</router-link>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import vForm from "./form";
import validateMixin from "./validate";
export default {
  name: "login",
  data() {
    return {
      codeImg: "",
      randomKey: "",
      securityCode: ""
    };
  },
  components: {
    vForm
  },
  mixins: [validateMixin],
  created() {
    this.getImageVerifyCode();
    document.onkeydown = e => {
      if (this.$route.name != "login") return;
      var theEvent = e || window.event;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        this.submit();
        return false;
      }
      return true;
    };
  },
  methods: {
        loginPassword() {
      if (this.password === "") {
        this.errorMsg.password = "请输入密码";
        return false;
      }
        this.errorMsg.password = '';
      return true;
    },
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
          verifyCodeType: 0
        },
        false
      );
      if (d.code === 0) {
        this.codeImg = d.data;
      }
    },
    async submit() {
      if (this.securityCode === "") {
        return this.$message.error("请输入图形验证码");
      }
      // if(!this.validatePhone() || !this.validatePassword())
      if (!this.loginPassword()) return;
      const d = await this.post(this.$api.login, {
        pwd: this.password,
        uid: this.phone,
        securityCode: this.securityCode,
        key: this.randomKey,
        uniqueCode: ""
      });
      if (d.code === 0) {
        this.$message({
          message: "登录成功",
          type: "success"
        });
        this.$common.setLocalStorage("userInfo", d.data);
        this.$store.dispatch("setToken", d.data);
        this.setMenu();
        this.$router.push({ path: "/" });
      } else {
        this.getImageVerifyCode();
      }
    },
    async setMenu() {
      const d = await this.post(this.$api.listSubMenu);
      if (d.code === 0) {
        let menu = [];
        d.data.map(v => {
          var parent = {
            title: v.menuName,
            icon: v.menuIcon,
            path: v.menuUrl,
            child: [],
            btns: v.btns
          };
          v.subMenuDto.map(d => {
            parent.child.push({ title: d.menuName, path: d.menuUrl });
          });
          menu.push(parent);
        });
        this.$store.dispatch("setBtns", menu[0].btns);
        // setTimeout(() => {
        // }, 5000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./style";
.register {
  text-align: center;
  color: #0f88eb;
}
.code-item {
  display: flex;
  align-items: center;
  img {
    width: 120px;
    height: 30px;
    margin-bottom: 20px;
    margin-left: 10px;
  }
}
</style>
