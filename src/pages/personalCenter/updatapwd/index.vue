<template>
  <div class="personal-updatapwd">
    <div class="main-view mt">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="ruleForm.oldPwd" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="ruleForm.newPwd" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('ruleForm')" style="width: 100%">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
  	name: "personal-updatapwd",
  	data(){
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if(value.length < 6){
            callback(new Error('密码长度至少6位数'))
          }else if(this.ruleForm.checkPass !== ''){
            this.$refs.ruleForm.validateField('checkPass');
            callback();
          }else
            callback();
        }
      };
      var validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
  		return {
        ruleForm: {
          oldPwd: '',
          newPwd: '',
          checkPass: '',
        },
        rules: {
          oldPwd: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
          ],
          newPwd: [{ required: true, trigger: 'blur', validator: validatePass }],
          checkPass: [{ required: true, trigger: 'blur', validator: validateCheckPass }],
        }
  		}
  	},

    created(){

  	},
  	methods: {
      submit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const d = await this.post(this.$api.user.modifyPwd, {
              oldPwd: this.ruleForm.oldPwd,
              newPwd: this.ruleForm.newPwd,
            })
            if(d.code === 0){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.$fetch.loginOut()
              this.$router.push({ path: '/login' })
            }
          }
        });
      },
  	}
  }
</script>
<style lang="scss" scoped>
  .main-view{
    padding: 100px;
  }
  .demo-ruleForm{
    width: 460px;
  }
</style>
