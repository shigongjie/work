

export default {
  data() {
    return {
      tableData: [], // 拖拽表头数据
      isHide: false, // 打开或关闭
      tabData: [], // 表数据
      dragTabShow: false, // 显示拖拽
      tabClounm: [],
      checkArr: [],
      exportData: [], //导出数组
      exportShow: false, // 显示导出页面
    };
  },
  watch: {
  },
  created() {

  },
  computed: {
  },
  methods: {
    // 远程排序
    sortChange(scope) {
      let isSort = "";
      if (!scope.order) {
        this.params.queryEntityDto.orderByStr = "";
      } else {
        if (scope.order === "ascending") {
          isSort = "asc";
        } else {
          isSort = "desc";
        }
        this.tabClounm.forEach(item => {
          if (item.fieldName === scope.prop) {
            this.params.queryEntityDto.orderByStr =
              item.orderByName + " " + isSort;
          }
        });
      }
      this.getList();
    },
    // 获取选中的
    handleSelectionChange(arr) {
      this.checkArr = arr;
    },
    // 退出拖拽
    exitDialog() {
      this.dragTabShow = false;
      this.listColumn(0);
    },
    // 退出导出
    exitExport() {
      this.exportShow = false;
      this.listColumn(1);
    },
  },
};
