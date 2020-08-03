<template>
  <div class="school-class absolute">
    <div class="main-view">
      <!-- 学校 -->
      <v-school></v-school>
      <!-- 班级 -->
      <v-classes></v-classes>
    </div>

  </div>
</template>

<script>
  import vSchool from './components/school';
  import vClasses from './components/classes';

  export default {
    name: 'school-class',
    data(){
      return{
      }
    },
    components: {
      vSchool,
      vClasses
    },
    created(){
    },
    methods: {
    },
  }
</script>

<style lang="scss" scoped>
  @import './style';

  .main-view{
    height: 100%;
    overflow: hidden;
  }
</style>
