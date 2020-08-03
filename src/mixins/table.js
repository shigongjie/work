//获取数据方法名: getList

export default {
  data () {
    return {
      //当前页
      currentPage: 1,
      //每页大小
      pageSize: 10,
      //总页数
      total: 0,
      //每页页码条数列表
      pageSizeList: [10, 20, 30, 40, 50, 100],
      //表格数据
      tableData: [],
      //表格是否有数据
      isTableData: false,
      //表格选中数据
      selectTbaleData: [],
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    //存储表格选中数据
    selectionChange(selection){
      this.selectTbaleData = selection;
    },
    //选择每页显示条数触发
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },
    //点击页码触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
  }
}
