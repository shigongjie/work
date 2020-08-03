import tableMixin from "@/mixins/table";
import dragTableMixin from "@/mixins/dragTable";
import exportPage from "@/components/exportPage";
import search from "@/components/search";
import dragTable from "@/components/dragTable";

export default {
    mixins: [tableMixin, dragTableMixin],
    components: {
        search,
        exportPage,
        dragTable,
    },
    data() {
        return {
            changeHeight: document.documentElement.clientHeight - 195,
            searchList: [],
            tabClounm: [],
            tabData: [],
            dragColumn: [],
            dragTabShow: false,
            isShowSearch: false,
            params: {
                pageNum: 1,
                pageSize: 10,
                queryEntityDto: {
                    baseQueryDtoList: [],
                    orderByStr: ""
                }
            },
            exportParams: {}
        }
    },
    mounted() {
        window.onresize = () => {
            this.changeHeight = document.documentElement.clientHeight - 195;
          };
        this.listColumn(0);
        this.listColumn(1);
        this.listColumn(2);
    },
    computed: {
        // filterTabCloumn() {
        //     return this.tabClounm.filter((item) => {
        //         return item.selectFlag === '1'
        //     })
        // }
    },
    methods: {
        //移除
        removeGroupMember() {
            this.$confirm("确定移除吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(this.removeByType);
        },
        async removeByType() {
            const d = await this.post(this.$api.schoolInfo.removeByType, this.removeParams)
            if (d && d.code === 0) {
                this.$message.success("操作成功");
                this.getList()
            }
        },
        // 查询
        searchData(search) {
            this.currentPage = 1;
            this.params.queryEntityDto.baseQueryDtoList = search;
            this.getList();
        },
        async listColumn(columnFlag) {
            const d = await this.post(this.$api.common.listColumn, {
              columnFlag: columnFlag,
              ...this.searchParams
            });
            if (d.code === 0) {
              if (columnFlag === 0) {
                this.tabClounm = d.data;
                this.dragColumn = JSON.parse(JSON.stringify(d.data));
              }
              if (columnFlag === 1) {
                this.exportData = JSON.parse(JSON.stringify(d.data));
              }
              if (columnFlag === 2) {
                this.searchList = JSON.parse(JSON.stringify(d.data));
              }
            }
          },
        // 保存拖拽
        async saveClounm(val) {
            // console.log(val,this.searchParams);

            const d = await this.post(this.$api.common.saveColumn, {
                ...this.searchParams,
                columnJa: val
            });
            if (d.code === 0) {
                this.exitDialog();
                this.$refs.dragTab.isShowTab();
            }
        },
        // 退出拖拽
        exitDialog(val) {
            this.dragTabShow = false;
            this.listColumn(0);
        },
        // 最后导出调用下载
        saveExport(data) {
            let fieldStringArray = data.map(item => {
                return item.fieldName;
            });
            this.cacheExportField(fieldStringArray);
        },
        async cacheExportField(fieldStringArray) {
            const d = await this.post(this.$api.common.cacheExportField, {
                fieldStringArray: fieldStringArray.join(",")
            });
            if (d.code === 0) {
                var query = {
                    pageNum: 1,
                    pageSize: 1000,
                    queryDto: JSON.stringify(this.params.queryEntityDto),
                    fieldStringArray: d.data,
                    uuid: d.data,
                    ...this.searchParams,
                    memberType: 0,
                    groupId: this.$route.params.id,
                    userId: this.$store.state.userInfo.data.userId + "",
                    ...this.exportParams
                };
                let url = "/classroom-boot/export/commonExport";
                this.$refs.exportTab.isShowTab();
                this.exportShow = false;
                this.$common.exportXls(query, url);
            }
        },
        async listTableColumn() {
            const d = await this.post(this.$api.common.resetTableColumn, {
                businessId: "",
                ...this.searchParams,
                fieldModuleEnum: ""
            });
            if (d.code === 0) {
                this.exitDialog();
                this.$refs.dragTab.isShowTab();
            }
        },
        // 退出导出
        exitExport() {
            this.exportShow = false;
            this.listColumn(1);
        }
    },
}