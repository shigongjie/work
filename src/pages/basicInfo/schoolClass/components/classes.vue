<template>
  <div class="v-classes">
    <!-- 班级 -->
    <div class="header class-header">
      <el-input v-model="className" size="small" placeholder="请输入班级名称"></el-input>
      <el-button type="primary" class="search-btn" size="small" @click="getList">搜索</el-button>
      <el-button type="primary" class="add-btn" size="small" @click="dialogVisible = true, isEdit = false">新建班级</el-button>
    </div>

    <div class="table">
      <div class="table-head">
        <div class="tr">
          <div class="td" style="width: 35%"><span>班级名称</span></div>
          <div class="td" style="width: 35%;"><span>班级人数</span></div>
          <div class="td" style="width: 30%;"><span>操作</span></div>
        </div>
      </div>
      <div class="table-body">
        <div class="tr" v-for="(item, index) in tableData" :key="index">
          <div class="td center oe" style="width: 35%;" :title="item.className">{{item.className}}</div>
          <div class="td center oe" style="width: 35%;">{{item.studentCount}}</div>
          <div class="td center" style="width: 30%;">
            <el-button type="text" @click="edit(item)">编辑</el-button>
            <el-button type="text" @click="del(item, index)">删除</el-button>
          </div>
        </div>
        <p class="no-data" v-if="isTableData">暂无数据</p>
      </div>
    </div>

    <div class="pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog
      :title="(isEdit ? '编辑' : '新建') + '班级'"
      append-to-body
      :visible.sync="dialogVisible"
      @close="resetFields"
      width="600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="ruleForm.className" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="班级人数" prop="studentCount">
          <el-input v-model="ruleForm.studentCount" placeholder="请输入班级人数"></el-input>
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
  import tableMixin from "@/mixins/table";
  export default {
    name: 'v-classes',
    data(){
      return{
        //搜索条件
        className: '',
        schoolId: '',

        dialogVisible: false,
        //是否编辑
        isEdit: false,

        ruleForm: {
          className: '',
          studentCount: ''
        },
        rules: {
          className: [
            { required: true, message: '请输入班级名称', trigger: 'blur' },
          ],
          studentCount: [
            { required: true, message: '请输入班级人数', trigger: 'blur' },
          ],
        },

        checkData: {}
      }
    },
    mixins: [tableMixin],
    components: {
    },
    created(){
      this.$root.app.$on('getClassList', schoolId =>{
        this.schoolId = schoolId;
        if(schoolId == -1){
          this.isTableData = true;
          this.tableData = [];
        }else
          this.getList()
      })
    },
    beforeDestroy(){
      this.$root.app.$off('getClassList');
    },
    methods: {
      del(item, index){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const d = await this.post(this.$api.basicInfo.deleteClass, {
            id: item.id
          });
          if(d.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList();
          }
        })
      },
      edit(item){
        this.dialogVisible = true;
        this.isEdit = true;
        this.ruleForm.className = item.className;
        this.ruleForm.studentCount = item.studentCount;
        this.checkData = item;
      },
      resetFields(){
        this.$refs['ruleForm'].resetFields();
        this.ruleForm.className = '';
        this.ruleForm.studentCount = '';
      },
      async getList(){
        const d = await this.post(this.$api.basicInfo.pageClass, {
          fuzzySearch: this.className,
          schoolId: this.schoolId,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        });
        if(d.code === 0){
          this.tableData = d.data.data;
          this.total = d.data.total;
          this.isTableData = !d.data.data.length;
        }
  		},
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var json = { ...this.ruleForm };
            json.schoolId = this.schoolId;
            this.isEdit && ( json.id = this.checkData.id );
            const d = await this.post(this.$api.basicInfo.addOrUpdateClass, json);
            if(d.code === 0){
              this.$message({
                message: this.isEdit ? '编辑成功' : '新建成功',
                type: 'success'
              });
              this.dialogVisible = false;
              if(this.isEdit){
                this.checkData.className = this.ruleForm.className;
                this.checkData.studentCount = this.ruleForm.studentCount;
              }else{
                this.getList()
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

  .v-classes{
    width: 100%;
    height: 100%;
    padding-left: 420px;
  }
  .table{
    min-height: 600px;
    max-height: 600px;
    overflow-y: scroll;
  }
</style>
