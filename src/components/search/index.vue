<template>
  <el-card style="border:none;" :class="[ showValue ? 'show' : 'hide' ]" :style="{ height: height + 'px' }">
    <div class="search-wrap">
      <div class="left-content">
        <div>
          <div class="wrap-page">
            <div class="wrap">
              <div class="search-left">
                <div class="content" v-for="(item, index) in 4" :key="index">
                  <span class="spanTitle item" v-if="index===0">检索条件</span>
                  <el-select
                    size="small"
                    v-if="index !==0"
                    style="width:80px;"
                    class="item"
                    v-model="selectFormList[index].andOrEnums"
                  >
                    <el-option
                      v-for="(item,index) in relationship"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>

                  <el-select
                    size="small"
                    filterable
                    class="item"
                    style="width:100px"
                    @change="setInputType($event, item)"
                    v-model="selectFormList[index].fieldName"
                  >
                    <el-option
                      v-for="(item,index) in searchList"
                      :key="index"
                      :label="item.fieldLabel"
                      :value="item.fieldName"
                    ></el-option>
                  </el-select>
                  <el-select
                    size="small"
                    class="symbol item"
                    v-model="selectFormList[index].formulaEnums"
                  >
                    <el-option
                      v-for="(item,index) in symbolList"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                  <el-input
                    class="hideDom item"
                    size="small"
                    v-if="selectFormList[index].fieldType === '1'"
                    v-model="selectFormList[index].fieldValue"
                    placeholder="输入查询关键字"
                  ></el-input>
                  <el-date-picker
                    v-else-if="selectFormList[index].fieldType === '2'"
                    class="hideDom item"
                    size="small"
                    @change="formatTime($event,index)"
                    v-model="selectFormList[index].fieldValue"
                    type="datetime"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                  <el-select
                    size="small"
                    class="hideDom item"
                    v-else-if="selectFormList[index].fieldType === '3'"
                    v-model="selectFormList[index].fieldValue"
                  >
                    <el-option
                      v-for="(item,index) in selectFormList[index].dictDtoList"
                      :key="index"
                      :label="item.fieldValue"
                      :value="item.fieldKey"
                    ></el-option>
                  </el-select>
                  <el-input class="hideDom item" size="small" v-else placeholder="输入查询关键字"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="strongForm">
            <el-form
              v-if="height===220||isBoth"
              ref="strongForm"
              :model="strongForm"
              inline
              label-width="100px"
            >
              <el-form-item label="导师类型">
                <el-select size="small" class="strongItem" v-model="strongForm.tutorType">
                  <el-option
                    v-for="(item,index) in teacherList"
                    :key="index"
                    :label="item.tutorType"
                    :value="item.tutorName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="初评星级">
                <el-select size="small" class="strongItem" v-model="strongForm.star">
                  <el-option
                    v-for="(item,index) in starList"
                    :key="index"
                    :label="item.starType"
                    :value="item.starName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="基准课酬">
                <el-input-number
                  v-model="strongForm.money"
                  size="small"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span style="margin:0px 5px;">—</span>
                <el-input-number
                  v-model="strongForm.money1"
                  size="small"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
              </el-form-item>
            </el-form>
            <div class="use-class" v-if="height===270">
              <div style="margin-right:20px;">
                <span class="demonstration">服务时间</span>
                <el-cascader size="small" :props=" { multiple: true }" v-model='serviceTime' style="width:270px" :options="serviceTimeList" collapse-tags clearable></el-cascader>
              </div>

              <div>
                <span class="demonstration">可授课程</span>
                <el-cascader size="small" :props=" { multiple: true }" v-model="course" style="width:270px" :show-all-levels="false" :options="courseList" collapse-tags clearable></el-cascader>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <el-button size="small" @click="clearSearch">重置</el-button>
          <el-button size="small" type="primary" @click="isShowSaveSearch=true;historyName=''">保存</el-button>
          <el-button size="small" type="primary" @click="searchData">查询</el-button>
        </div>
      </div>
      <div class="right-select">
        <p class="right-title">已保存的检索历史</p>
        <ul class="list-wrap">
          <li v-for="(item,index) in allSearchObj" :key="index">
            <span class="list-item" @click="getHistory(item)">
              {{item.historyName}}
              <i class="el-icon-close rem" @click.stop="delHistory(item)"></i>
            </span>
          </li>
        </ul>
      </div>
      <el-dialog
        title="保存"
        :visible.sync="isShowSaveSearch"
        width="500px"
        height="400px"
        append-to-body
        class="saveDat"
      >
        <div class="saveBtn-wrap">
          <el-input size="small" style="width:400px" v-model="historyName"></el-input>
          <el-button size="small" style="margin-left:20px;" type="primary" @click="addHistory">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  name: "search",
  props: {
    searchList: Array,
    height: {
      type: Number,
      default: 170
    },
    isBoth: {
      type: Boolean,
      default: false
    },
    searchParams: Object
  },
  mixins: [modalMixin],
  data() {
    var checkMoney = (rule, value, callback) => {
      var reg = new RegExp(/^100$|^(\d|[1-9]\d)*$/);
      if (!value) {
        callback();
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          if (value < 0) {
            callback(new Error("薪酬不能小于0"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      brandFold: false,
      isShowSaveSearch: false,
      historyName: "",
      allSearchObj: [],
      teacherList: [
        { tutorType: "教学型", tutorName: "教学型" },
        { tutorType: "实战型", tutorName: "实战型" },
        { tutorType: "评审型", tutorName: "评审型" },
        { tutorType: "培训型", tutorName: "培训型" },
        { tutorType: "研发型", tutorName: "研发型" },
        { tutorType: "网师型", tutorName: "网师型" }
      ],
      starList: [
        { starType: "一星", starName: "一星" },
        { starType: "二星", starName: "二星" },
        { starType: "三星", starName: "三星" },
        { starType: "四星", starName: "四星" },
        { starType: "五星", starName: "五星" }
      ],
      strongForm: {
        tutorType: "",
        star: "",
        money: "",
        money1: ""
      },
      selectFormList: [
        {
          andOrEnums: "AND",
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          formulaEnums: "like",
          dictDtoList: []
        },
        {
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          andOrEnums: "AND",
          formulaEnums: "like",
          dictDtoList: []
        },
        {
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          andOrEnums: "AND",
          formulaEnums: "like",
          dictDtoList: []
        },
        {
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          andOrEnums: "AND",
          formulaEnums: "like",
          dictDtoList: []
        }
        // {
        //   fieldType: "",
        //   fieldName: "",
        //   fieldValue: "",
        //   andOrEnums: "AND",
        //   formulaEnums: "=",
        //   dictDtoList: []
        // },
        // {
        //   fieldType: "",
        //   fieldName: "",
        //   fieldValue: "",
        //   andOrEnums: "AND",
        //   formulaEnums: "=",
        //   dictDtoList: []
        // }
      ],
      relationship: [
        { name: "并且", code: "AND" },
        { name: "或者", code: "OR" }
      ],
      symbolList: [
        { name: "包含", code: "like" },
        { name: "不包含", code: "not like" },
        { name: "等于", code: "=" },
        { name: "不等于", code: "!=" },
        { name: "大于", code: ">" },
        { name: "大于等于", code: ">=" },
        { name: "小于", code: "<" },
        { name: "小于等于", code: "<=" }
      ],
      rules: {
        money: [{ validator: checkMoney, trigger: "blur" }],
        money1: [{ validator: checkMoney, trigger: "blur" }]
      },
      historyValue: {},
      serviceTimeList: [],
      serviceTime:[],
      courseList: [],
      course: []
    };
  },
  created() {},
  watch: {
    searchList(val) {
      return val;
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.height === 220) {
        if (document.querySelector(".list-wrap")) {
          document.querySelector(".list-wrap").style = "max-height: 170px;";
        }
      }
    });
    if (this.height === 270) {
      this.LeisureTeacherEnums("serviceTime");
      this.LeisureTeacherEnums("course");
    }
    this.listHistory();
  },
  components: {},
  methods: {
    async addHistory() {
      if (this.historyName === "") {
        return this.$message.error("保存名称不能为空");
      }
      this.historyValue.specifiedConditions = this.strongForm;
      this.historyValue.generalConditions = this.selectFormList;
      this.historyValue.serviceTime = this.serviceTime;
      this.historyValue.course = this.course;
      const d = await this.post(this.$api.common.addHistory, {
        moduleName: this.searchParams.moduleName,
        tableName: this.searchParams.tableName,
        dbName: this.searchParams.dbName || "d_teachers",
        businessId: this.businessId,
        historyName: this.historyName,
        historyValue: this.historyValue
      });
      if (d.code === 0) {
        this.historyValue = {};
        this.isShowSaveSearch = false;
        this.listHistory();
      }
    },
    async LeisureTeacherEnums(type) {
      const d = await this.post(this.$api.demand.LeisureTeacherEnums, {
        type: type
      });
      if (d.code === 0) {
        if(type==='serviceTime'){
          this.serviceTimeList=d.data.options;
        }else{
            this.courseList=d.data.options;
        }
      }
    },
    async listHistory() {
      const d = await this.post(this.$api.common.listHistory, {
        moduleName: this.searchParams.moduleName,
        tableName: this.searchParams.tableName,
        dbName: this.searchParams.dbName || "d_teachers",
        businessId: this.businessId
      });
      if (d.code === 0) {
        this.allSearchObj = d.data;
      }
    },
    async delHistory(item) {
      const d = await this.post(this.$api.common.delHistory, {
        id: item.id
      });
      if (d.code === 0) {
        this.listHistory();
      }
    },
    async getHistory(item) {
      const d = await this.post(this.$api.common.getHistory, {
        id: item.id
      });
      if (d.code === 0) {
        this.selectFormList = d.data.historyValue.generalConditions;
        this.strongForm = d.data.historyValue.specifiedConditions;
        this.serviceTime = d.data.historyValue.serviceTime;
        this.course = d.data.historyValue.course;
        this.searchData();
      }
    },
    changeFoldState() {
      this.brandFold = !this.brandFold;
    },
    // 切换判断类型
    setInputType(item, num) {
      this.searchList.forEach(todo => {
        if (todo.fieldName === item) {
          this.selectFormList[num - 1].fieldValue = "";
          this.selectFormList[num - 1].fieldType = todo.fieldType;
          this.selectFormList[num - 1].dictDtoList = todo.dictDtoList;
        }
      });
    },
    formatTime(item, index) {
      this.selectFormList[index].fieldValue = new Date(
        +new Date(item) + 8 * 3600 * 1000
      )
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    // 点击查询获取数据
    searchData() {
      let isYes = true;
      let arr = [];
      let searchArr = this.selectFormList.map(item => ({
        andOrEnums: item.andOrEnums,
        fieldName: item.fieldName,
        fieldValue: item.fieldValue,
        formulaEnums: item.formulaEnums
      }));
      if (this.height === 220||this.isBoth) {
        isYes = false;
        this.$refs.strongForm.validate(valid => {
          if (valid) {
            if (this.strongForm.tutorType) {
              let obj = {
                andOrEnums: "AND",
                fieldName: "tutorType",
                fieldValue: this.strongForm.tutorType,
                formulaEnums: "="
              };
              arr.push(obj);
            }
            if (this.strongForm.star) {
              let obj1 = {
                andOrEnums: "AND",
                fieldName: "star",
                fieldValue: this.strongForm.star,
                formulaEnums: "="
              };
              arr.push(obj1);
            }
            if (this.strongForm.money !== "") {
              let obj2 = {
                andOrEnums: "AND",
                fieldName: "money",
                fieldValue: this.strongForm.money,
                formulaEnums: ">="
              };
              arr.push(obj2);
            }
            if (this.strongForm.money1 !== "") {
              let obj3 = {
                andOrEnums: "AND",
                fieldName: "money",
                fieldValue: this.strongForm.money1,
                formulaEnums: "<="
              };
              arr.push(obj3);
            }
            isYes = true;
          } else {
            return false;
          }
        });
      }
      if (isYes) {
        this.$emit("generalSearch", searchArr, arr,this.course,this.serviceTime);
      }
    },
    // 清空查询
    clearSearch() {
      this.selectFormList.forEach((item, index) => {
        item.fieldName = "";
        item.fieldType = "";
        item.formulaEnums = "like";
        item.fieldValue = "";
      });
      this.strongForm.star = "";
      this.strongForm.tutorType = "";
      this.strongForm.money = "";
      this.strongForm.money1 = "";
      this.course = []
      this.serviceTime = []
      this.$emit("generalSearch", this.selectFormList, true,[],[]);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}
.el-form-item {
  margin-bottom: 10px;
}
.demonstration {
  font-size: 14px;
  margin-right: 10px;
  color: #999999;
}
.search-wrap {
  display: flex;
}
.search-left {
  display: flex;
  text-align: center;
  flex-flow: row wrap;
  width: 100%;
}
.spanTitle {
  width: 80px;
  display: inline-block;
  text-align: right;
}

.content {
  flex: 0 0 50%;
}
.item {
  margin: 5px;
}
.search-center {
  display: flex;
  align-items: center;
}
.symbol {
  width: 100px;
}
.hideDom {
  width: 130px !important;
}
.strongItem {
  width: 100px;
}
.strongForm {
  text-align: center;
}
.line-link {
  margin-top: 7px;
  margin-right: 11px;
  display: inline-block;
}
.btn-wrap {
  text-align: center;
  .el-button {
    margin: 5px;
  }
}
.right-select {
  padding-left: 10px;
  box-sizing: border-box;
  width: 185px;
  border-left: 1px solid #e2e2e2;
  margin-left: 5px;
}
.left-content {
  flex: 1;
}
.search-wrap {
  display: flex;
}
.right-title {
  font-weight: bold;
  font-size: 14px;
}
.list-wrap {
  list-style: none;
  padding-left: 0;
  margin: 0;
  max-height: 120px;
  overflow: auto;
}
.saveBtn-wrap {
  display: flex;
  padding: 20px 0;
}
.list-item {
  line-height: 24px;
  padding: 0 20px 0 8px;
  font-size: 12px;
  display: inline-block;
  background-color: #eeeeee;
  color: #a6aab8;
  border-radius: 12px;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  position: relative;
}
.use-class {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.saveDat {
  padding: 30px 20px;
}
.list-item:hover {
  background-color: #999;
  color: #fff;
  cursor: pointer;
}
.rem {
  position: absolute;
  top: 3px;
  right: 3px;
  border-radius: 9px;
  font-size: 12px;
  line-height: 18px;
  width: 18px;
  display: inline-block;
}
.rem::before {
  display: inline-block;
  min-width: 18px;
  text-align: center;
}
.rem:hover {
  background-color: #ff5d5d;
  color: #fff;
}
.show {
  margin-bottom: 10px;
}
.hide {
  height: 0px !important;
  margin-bottom: 0px !important;
}
</style>
