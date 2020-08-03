<template>
  <div>
    <el-form ref="form" size="small" :rules="rules" :model="form" class="form" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="月份" prop="month">
            <el-select v-model="form.month">
              <el-option
                v-for="(item,index) in mounthData"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务/项目/模块" prop="itemCodeArr">
            <el-cascader
              ref="itemCode"
              v-model="form.itemCodeArr"
              :options="menuList"
              @change="changeItem"
              :props="{ checkStrictly: true, value: 'itemCode', label: 'itemName', expandTrigger: 'hover' }"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="集团重点" prop="characteristics">
            <el-input type="text" v-model="form.characteristics"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="部门" prop="departmentId">
            <el-select v-model="form.departmentId" @change="changeDepartment" placeholder="请选择部门">
              <el-option
                v-for="(item,index) in DepartmentList"
                :key="index"
                :label="item.departmentName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人" prop="principleId">
            <el-select @change="test" v-model="form.principleId">
              <el-option
                v-for="(item,index) in userByDepartmentIdList"
                :key="index"
                :label="item.userName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="预计天数" prop="estimatedDays">
            <el-input type="text" v-model="form.estimatedDays"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="标题" prop="title">
            <el-input type="text" v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="描述" prop="describe">
            <el-input type="textarea" v-model="form.describe"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="指标类型" prop="indexType">
            <el-select v-model="form.indexType" placeholder="请选择">
              <el-option
                v-for="(item,index) in typeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标指标值" prop="targetValue">
            <el-input type="text" v-model="form.targetValue"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="unit">
            <el-select v-model="form.unit" placeholder="请选择">
              <el-option v-for="(item,index) in unitList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btnWarp">
      <el-button type="primary" size="small" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: { masterId: "", id: "" },
  data() {
    return {
      unitList: ["%", "万元", "人", "个", "元", "套", "台", "本"],
      typeList: [
        { label: "百分比", value: "百分比" },
        { label: "数值", value: "数值" }
      ],
      DepartmentList: [],
      userByDepartmentIdList: [],
      checkedArr: [],
      form: {
        characteristics: ""
      },
      mounthData: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      menuList: [],
      rules: {
        month: [{ required: true, message: "月份不能为空", trigger: "change" }],
        itemCodeArr: [
          {
            required: true,
            message: "业务/项目/模块不能为空",
            trigger: "change"
          }
        ],
        characteristics: [
          { required: true, message: "集团重点不能为空", trigger: "change" }
        ],
        departmentId: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        principleId: [
          { required: true, message: "负责人不能为空", trigger: "change" }
        ],
        estimatedDays: [
          { required: true, message: "预计天数不能为空", trigger: "change" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "change" }
        ],
        describe: [
          { required: true, message: "描述不能为空", trigger: "blur" }
        ],
        indexType: [
          { required: true, message: "指标类型不能为空", trigger: "change" }
        ],
        targetValue: [
          { required: true, message: "目标指标值不能为空", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "单位不能为空", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.treeItem();
    this.getDepartment();
    this.getYearPlanDetail();
  },
  methods: {
    //   获取年计划细项详情
    async getYearPlanDetail() {
      if (this.$props.id != undefined && this.$props.id != "") {
        const d = await this.post(this.$api.yearplan.getYearPlanDetail, {
          id: this.$props.id
        });
        if (d.code === 0) {
          this.form = d.data;
        }
      }
    },
    // 获取部门
    async getDepartment() {
      const d = await this.post(this.$api.projectManage.listAllDepartment);
      if (d.code === 0) {
        this.DepartmentList = d.data;
        // 有部门ID时请求该部门下的人员
        if (this.form.departmentId && this.form.departmentId != "") {
          const c = await this.post(
            this.$api.projectManage.listUserByDepartmentId,
            { departmentId: this.form.departmentId }
          );
          if (c.code === 0) {
            this.userByDepartmentIdList = c.data;
          }
        }
      }
    },
    // 改变部门时清空负责人
    test(val) {
      let obj = { ...this.form };
      obj.principleId = val;
      this.form = obj;
    },
    // 获取部门下的用户
    async changeDepartment(id) {
      //   this.form.principleId = "";
      const d = await this.post(
        this.$api.projectManage.listUserByDepartmentId,
        { departmentId: id }
      );
      if (d.code === 0) {
        this.form.principleId = "";
        this.userByDepartmentIdList = d.data;
      }
    },
    async treeItem() {
      const d = await this.post(this.$api.task.treeItem);
      if (d.code === 0) {
        this.menuList = d.data;
      }
    },
    async listProject() {
      const d = await this.post(this.$api.projectCreat.listProject, {
        itemCode: this.form.itemCode
      });
      if (d.code === 0) {
        this.projectList = d.data;
      }
    },
    async listYearPlanDetail() {
      const d = await this.post(this.$api.projectCreat.listYearPlanDetail, {
        itemCode: this.form.itemCode
      });
      if (d.code === 0) {
        this.scheduleList = d.data;
      }
    },
    //阶段
    async listPhase() {
      const d = await this.post(this.$api.task.listPhase, {
        itemCode: this.form.itemCodeArr[this.form.itemCodeArr.length - 1]
      });
      if (d.code === 0) {
        this.phaseList = d.data.phaseList;
      }
    },
    changeItem(val) {
      this.form.phaseName = "";
      if (this.form.itemCodeArr.length) {
        this.listPhase();
        this.listProject();
        this.listYearPlanDetail();
      }
      this.form.characteristics = "";
      let checkedArr = this.$refs.itemCode.getCheckedNodes();
      if (checkedArr[0].data.characteristics) {
        this.form.characteristics = checkedArr[0].data.characteristics;
      }
    },
    async save() {
      this.form.masterId = this.$props.masterId;
      const d = await this.post(this.$api.yearplan.addOrEditYearPlanDetail, {
        ...this.form
      });
      if (d.code === 0) {
        this.$emit("clear");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-select,
.el-cascader {
  width: 100%;
}
.btnWarp {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}
</style>