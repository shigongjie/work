<template>
  <div class="course-theme">
    <search @generalSearch="searchData" :value.sync="isShowSearch" :searchParams="searchParams" :searchList="searchList"></search>
    <div class="main-view mt">
      <v-view-header title="课程主题">
        <div class="btn-list" slot="main">
          <el-button size="small" @click="isShowSearch = !isShowSearch">搜索</el-button>
          <el-button type="primary" size="small" @click="$router.push({ name: 'course-theme-add' })">新建模板</el-button>
        </div>
      </v-view-header>
      <el-table size="medium" ref="scoreTable" max-height="600" :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange">
        <el-table-column
          v-for="(item, index) in tabClounm"
          :key="index"
          :prop="item.fieldName"
          :width="item.width"
          align="center"
          :label="item.fieldLabel"
          :sortable="(item.orderByName ==='' || item.orderByName == null)?false:'custom'"
          v-if="~~item.selectFlag"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="150px" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$router.push({ name: 'course-theme-edit', params: { id: scope.row.id } })">编辑</el-button>
            <el-button type="text" size="small" @click="deleteCourseTheme(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <transition name="slide-fade-right" mode="out-in">
      <router-view class="right-router"></router-view>
    </transition>
  </div>
</template>

<script>
  import vViewHeader from 'components/viewHeader';
  import tableMixin from "@/mixins/table";
  import dragTableMixin from "@/mixins/dragTable";
  import search from "@/components/search";
  export default {
    name: 'course-theme',
    data(){
      return{
        searchParams: {
          moduleName: "COURSE_LIST",
          tableName: "rec_course",
        },
        // 通用查询获取参数
        params: {
          queryDtoList: {
            baseQueryDtoList: [],
            orderByStr: ''
          }
        },
        searchList: [], // 通用搜索
        isShowSearch: false
      }
    },
    mixins: [tableMixin, dragTableMixin],
    components: {
      vViewHeader,
      search
    },
    beforeDestroy(){
      this.$root.app.$off('skidSave');
    },
    created(){
      this.$root.app.$on('skidSave', this.getList)
      this.listColumn(0, 'tabClounm');
      this.listColumn(2, 'searchList');
      this.getList();
    },
    methods: {
      //删除课程
      deleteCourseTheme(id){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const d = await this.post(this.$api.basicInfo.deleteCourseTheme, {
            id
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
      async listColumn(type, dataName) {
        const d = await this.post(this.$api.common.listColumn, {
          columnFlag: type,
          dbName: 'd_teachers',
          ...this.searchParams
        });
        if(d.code === 0) {
          this[dataName] = d.data;
        }
      },
      searchData(search){
        this.currentPage = 1;
        this.params.queryDtoList.baseQueryDtoList = search;
        this.getList();
      },
      async getList(){
        const d = await this.post(this.$api.basicInfo.pageCourse, {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          ...this.params
        });
        if(d.code === 0){
          this.tableData = d.data.data;
          this.total = d.data.total;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
