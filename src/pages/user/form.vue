<template>
  <div class="form">
    <div class="view">
      <div class="login-hd">
        <img src="./images/logo.png" alt />
        <h1>未来办公</h1>
      </div>
      <div class="from-view">
        <h2>{{title}}</h2>
        <slot name="main"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-form",
  props: {
    title: {
      type: String,
      default: "这里是一个标题"
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  width: 500px;
  height: 700px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -250px;
  margin-top: -350px;
  // background: url('./images/img.png') no-repeat 0 center;

  .view {
    height: 730px;
    overflow: hidden;
    width: 500px;
    position: absolute;
    right: 0;
    margin-top: -335px;
    top: 50%;
    .login-hd {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    h1 {
      display: block;
      text-align: center;
      // line-height: 130px;
      color: #fff;
      font-size: 40px;
      margin-left: 10px;
      margin-top: -5px;
    }
    .from-view {
      padding: 0 40px;
      border: 10px solid #80c5f8;
      background: #fff;
      height: 600px;

      h2 {
        line-height: 174px;
        font-size: 30px;
        color: #0f88eb;
        text-align: center;
      }
    }
  }
}
.form-item-list {
  .item {
    height: 56px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 20px;

    input {
      float: left;
      width: 100%;
      height: 54px;
      padding: 0 20px;
      font-size: 16px;
      padding-right: 120px;
      background: none;
    }
    .pwd-rule {
      font-size: 14px;
      color: #ccc;
    }
    .error-msg {
      position: absolute;
      right: 20px;
      bottom: 0;
      line-height: 47px;
      height: 47px;
      color: #ff3333;
      font-size: 16px;
    }
  }
  .register-success {
    height: 156px;
    background: url("./images/success.png") no-repeat 0 center;
    padding-left: 68px;
    width: 325px;
    margin: 0 auto;

    .text {
      line-height: 156px;
      font-size: 32px;
      color: #333;
    }
  }
  .no-user-pwd {
    height: 20px;
    line-height: 20px;
    font-size: 16px;

    .no-user {
      color: #0099ff;
      float: left;
    }
    .no-pwd {
      color: #999;
      float: right;
    }
    a:hover {
      text-decoration: underline;
    }
  }

  .submit-btn {
    width: 100%;
    height: 55px;
    text-align: center;
    line-height: 55px;
    border-radius: 4px;
    background: #0099ff;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
    margin-top: 20px;
  }
}
</style>
