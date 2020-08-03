<template>
  <div class="course-theme-add">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="课程名称" prop="courseName">
        <el-select filterable v-model="ruleForm.courseName" placeholder="请选择课程名称" style="width: 400px">
          <el-option v-for="(item, index) in courseList" :key="index" :label="item.fieldValue" :value="item.fieldKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型" prop="courseType">
        <el-select v-model="ruleForm.courseType" placeholder="请选择课程类型" style="width: 400px">
          <el-option label="专业课" value="专业课"></el-option>
          <el-option label="公共课" value="公共课"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授课课时" prop="teachingPeriod">
        <el-input @keyup.native="keyup()" v-model="ruleForm.teachingPeriod" placeholder="请填写授课课时" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="是否有实训" prop="trainingFlag">
        <el-select v-model="ruleForm.trainingFlag" placeholder="请选择是否有实训" style="width: 400px">
          <el-option label="否" value="0"></el-option>
          <el-option label="是" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in ruleForm.courseThemes"
          :label="index ? '' : '授课主题'"
          :key="item.key"
          :prop="'courseThemes.' + index + '.value'"
          :rules="{
            required: true, message: '授课主题不能为空', trigger: 'blur'
          }"
        >
        <el-input type="textarea" v-model="item.value" style="width: 400px" placeholder="请输入授课主题"></el-input>
        <i class="i-del" v-if="index" @click.prevent="remove(item)"></i>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="add">添加主题</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'course-theme-add',
    props: {
      id: {
        type: [String, Object],
        default(){
          return ''
        }
      },
    },
    data(){
      return{
        //课程列表
        courseList: [],

        //表单数据
        ruleForm: {
          courseName: '',
          courseType: '',
          teachingPeriod: '',
          trainingFlag: '',
          courseThemes: [{
            value: ''
          }],
        },
        //表单验证
        rules: {
          courseName: [
            { required: true, message: '请选择课程名称', trigger: 'change' }
          ],
          courseType: [
            { required: true, message: '请选择课程类型', trigger: 'change' }
          ],
          teachingPeriod: [
            { required: true, message: '请填写授课课时', trigger: 'blur' },
          ],
          trainingFlag: [
            { required: true, message: '请选择是否有实训', trigger: 'change' }
          ],
        }
      }
    },
    created(){
      this.id != '' && this.getCourseTheme();
      this.getListLabCourse();
    },
    methods: {
      remove(item){
        var index = this.ruleForm.courseThemes.indexOf(item)
        if (index !== -1) {
          this.ruleForm.courseThemes.splice(index, 1)
        }
      },
      add(){
        this.ruleForm.courseThemes.push({
          value: '',
          key: Date.now()
        });
      },
      //获取课程主题详情
      async getCourseTheme(){
        const d = await this.post(this.$api.basicInfo.getCourseTheme, { id: this.id });
        if(d.code === 0){
          let courseInfo = d.data.courseInfo;
          this.ruleForm.courseName = courseInfo.dictCourseName;
          this.ruleForm.courseType = courseInfo.courseType;
          this.ruleForm.teachingPeriod = courseInfo.teachingPeriod;
          this.ruleForm.trainingFlag = courseInfo.trainingFlag;

          let courseThemes = []
          for(let d of d.data.themeList){
            if(d.themeContent != '|'){
              courseThemes.push({ value: d.themeContent })
            }
          }
          this.ruleForm.courseThemes = courseThemes;
        }
      },
      //获取课程列表
      async getListLabCourse(){
        const d = await this.post(this.$api.basicInfo.listLabCourse);
        if(d.code === 0){
          this.courseList = d.data;
        }
      },
      //课时只能输入数字
      keyup(){
        if(!this.ruleForm.teachingPeriod.match(/^[\+\-]?\d*?\d*?$/))
          this.ruleForm.teachingPeriod = this.t_value;
        else
          this.t_value = this.ruleForm.teachingPeriod;
        if (this.ruleForm.teachingPeriod.match(/^(?:[\+\-]?\d+?)?$/))
          this.o_value = this.ruleForm.teachingPeriod;
      },
      //提交表单
      submitForm() {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            var json = { ...this.ruleForm }, courseThemes = '';
            for(let v of json.courseThemes){
              courseThemes += v.value + '|'
            }
            json.courseThemes = courseThemes.substring(0, courseThemes.length - 1);
            this.id != '' && (json.id = this.id)
            const d = await this.post(this.$api.basicInfo.addOrUpdateCourseTheme, json);
            if(d.code === 0){
              this.$message({
                message: this.id != '' ? '编辑成功' : '新建成功',
                type: 'success'
              });
              this.$root.app.$emit('skidSave')
              this.$router.push({ name: 'course-theme' })
            }
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  .demo-ruleForm{
    width: 500px;
  }
  .i-del{
    width: 20px;
    height: 20px;
    background: url('./images/del.png') no-repeat;
    position: absolute;
    right: -30px;
    top: 50%;
    margin-top: -15px;
    cursor: pointer;
  }
</style>
