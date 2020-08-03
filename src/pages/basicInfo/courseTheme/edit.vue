<template>
  <div class="course-theme-add">
    <v-skid>
      <div slot="header">
        <span class="text">编辑模板</span>
        <div class="btn-list">
          <el-button size="small" type="primary" @click="$refs.addEditCourseTheme.submitForm('ruleForm')">保存</el-button>
          <el-button size="small" @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
      <div slot="main">
        <add-edit-course-theme ref="addEditCourseTheme" :id="$route.params.id"></add-edit-course-theme>
      </div>
    </v-skid>
  </div>
</template>

<script>
  import vSkid from 'components/skid';
  import addEditCourseTheme from './components/addEditCourseTheme';
  export default {
    name: 'course-theme-add',
    data(){
      return{
      }
    },
    components: {
      vSkid,
      addEditCourseTheme
    },
  }
</script>

<style lang="scss" scoped>
</style>
