<template>
  <div class="v-school">
    <!-- 学校 -->
    <div class="header school-header">
      <el-input v-model="schoolName" size="small"  placeholder="请输入学校名称"></el-input>
      <el-button type="primary" class="add-btn" size="small" @click="dialogVisible = true, isEdit = false">新建学校</el-button>
    </div>

    <div class="table">
      <div class="table-head">
        <div class="tr">
          <div class="td" style="width: 100%;"><span>学校列表</span></div>
        </div>
      </div>
      <div class="table-body">
        <div class="tr" v-for="(item, index) in schoolData" :key="index">
          <div :class="['td left oe', { active: item.active }]" @click="schoolSelect(item)" style="width: 75%;" :title="item.schoolName">
            {{item.schoolName}}
          </div>
          <div class="td center" style="width: 25%;">
            <el-button type="text" @click="dialogVisible = true, isEdit = true, ruleForm.name = item.schoolName, checkData = item">编辑</el-button>
            <el-button type="text" @click="del(item, index)">删除</el-button>
          </div>
        </div>
        <p class="no-data" v-if="isTableData">暂无数据</p>
      </div>
    </div>

    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '学校'"
      append-to-body
      :visible.sync="dialogVisible"
      @close="resetFields"
      width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入学校名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'v-school',
    data(){
      return{
        //表格数据
        schoolData: [],

        //搜索条件
        schoolName: '',
        //搜索数据集
        searchData: [],

        isTableData: false,
        dialogVisible: false,
        //是否编辑
        isEdit: false,

        ruleForm: {
          name: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入学校名称', trigger: 'blur' },
          ],
        },

        classId: '',
        checkData: {}
      }
    },
    watch: {
      schoolName(val, oldVal) {
        var data = [];
        for(let d of this.searchData){
          if(d.schoolName.indexOf(val) != -1){
            data.push(d)
          }
        }
        this.schoolData = data;
        this.isTableData = !data.length;
      },
    },
    created(){
      this.getSchoolList();
    },
    methods: {
      resetFields(){
        this.$refs['ruleForm'].resetFields();
        this.ruleForm.name = '';
      },
      schoolSelect(item){
        if(item.active)
          return;
        this.schoolData.map((d, index) =>{
          d.active = d.id == item.id;
        })
        this.classId = item.id;
        this.$root.app.$emit('getClassList', item.id);
      },
      del(item, index){
        this.$confirm('若删除学校, 则该学校里的班级也会被删除, 是否确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const d = await this.post(this.$api.basicInfo.deleteSchool, {
            id: item.id
          });
          if(d.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.schoolData.splice(index, 1)
            if(item.active){
              if(this.schoolData.length){
                this.classId = this.schoolData[0].id;
                this.schoolData[0].active = true;
              }else{
                this.classId = -1;
              }
              this.$root.app.$emit('getClassList', this.classId);
            }
          }
        })
      },
      async getSchoolList(status = true){
        const d = await this.post(this.$api.basicInfo.listSchool);
        if(d.code === 0){
          d.data.map((d, index) =>{
            if(status){
              d.active = !index;
            }else{
              d.active = this.classId == d.id;
            }
          })
          this.searchData = [ ...d.data ];
          this.schoolData = d.data;
          this.isTableData = !d.data.length;
          if(status){
            this.classId = this.isTableData ? -1 : d.data[0].id;
          }
          this.$root.app.$emit('getClassList', this.classId);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var json = { schoolName: this.ruleForm.name };
            this.isEdit && ( json.id = this.checkData.id );
            const d = await this.post(this.$api.basicInfo.addOrUpdateSchool, json);
            if(d.code === 0){
              this.$message({
                message: this.isEdit ? '编辑成功' : '新建成功',
                type: 'success'
              });
              this.dialogVisible = false;
              if(this.isEdit){
                this.checkData.schoolName = this.ruleForm.name;
              }else{
                this.getSchoolList(false)
              }
            }
          }
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../style';

  .v-school{
    width: 440px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: 0 2px 12px 5px rgba(0, 0, 0, 0.1);
    z-index: 10;
    padding-left: 20px;

  }
  .demo-ruleForm{
    padding-top: 20px;
  }
  .table{
    position: absolute;
    right: 0;
    top: 56px;
    left: 20px;
    bottom: 0;

    .table-body{
      position: absolute;
      right: 0;
      top: 40px;
      left: 0;
      bottom: 0;

      overflow-y: scroll;

      &::-webkit-scrollbar{
        width:0px;
        height:0px;
      }
    }
  }
</style>
