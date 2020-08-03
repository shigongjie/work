<template>
  <el-dialog
    title="新增"
    :visible.sync="showValue"
    width="750px"
    top="20px"
    class="addOrUpCustomer"
    :close-on-click-modal="false"
    :before-close="clearForm"
    append-to-body
  >
    <div class="dialog">
      <el-form ref="form" size="small" :rules="rules" :model="form" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务完成者" prop="userId">
              <el-select v-model="form.userId" filterable clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in personList"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成顺序级别" prop="operateLevel">
              <el-input type="number" v-model.number="form.operateLevel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="item.indexType">
          <el-col :span="12">
            <el-form-item label="指标类型" prop="indexType">
              <el-input type="text" disabled v-model="form.indexType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指标值" prop="indexValue">
              <el-input type="number" v-model="form.indexValue" @blur="handleValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务分值" prop="systemScore">
              <el-input
                type="number"
                v-model="form.systemScore"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="开始时间" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
          </el-col>-->

          <!-- <el-col :span="12">
            
            <el-form-item label="预计天数" prop="predictDayCount">
              <el-input type="text" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model.number="form.predictDayCount"></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-form-item label="预计时间" prop="predictTimeArr">
          <el-date-picker
            v-model="form.predictTimeArr"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="评分标准" prop="standard">
          <el-input v-model="form.standard" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
        </el-form-item>
        <el-form-item label="任务描述" prop="taskDescribe">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            v-model="form.taskDescribe"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" size="small" @click="addOrEditRelation">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import modalMixin from "@/mixins/modal";
export default {
  props: {
    item: Object,
    finisher: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [modalMixin],
  data() {
    return {
      personList: [],
      form: {
        businessType: 0,
        operateType: 1,
        operateStatus: 0,
        id: "",
        userId: "",
        beginTime: "",
        deadlineTime: "",
        taskDescribe: "",
        operateLevel: 0,
        indexType: "",
        systemScore: 0,
        standard: "",
        predictTimeArr: []
      },
      rules: {
        userId: [
          { required: true, message: "任务完成者不能为空", trigger: "change" }
        ],
        predictTimeArr: [
          { required: true, message: "预计时间不能为空", trigger: "change" }
        ],

        systemScore: [
          { required: true, message: "任务分值不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.listPrincipal();
  },
  watch: {
    showValue(val) {
      if (val) {
        this.form.indexType = this.item.indexType;
        if (this.finisher.id) {
          this.form = JSON.parse(JSON.stringify(this.finisher));
          if (this.form.beginTime) {
            this.$set(this.form, "predictTimeArr", [
              this.form.beginTime,
              this.form.deadlineTime
            ]);
          }
          // this.listRelation();
        }
      }
    }
  },
  methods: {
    handleValue() {
      this.form.indexValue = parseFloat(this.form.indexValue).toFixed(2);
    },
    async listPrincipal() {
      const d = await this.post(this.$api.projectManage.listPrincipal);
      if (d.code === 0) {
        this.personList = d.data;
      }
    },
    // 关闭清除增加
    clearForm() {
      this.form = {
        businessType: 0,
        operateType: 1,
        operateStatus: 0,
        id: "",
        userId: "",
        beginTime: "",
        deadlineTime: "",
        predictTimeArr: [],
        taskDescribe: "",
        operateLevel: 0,
        indexType: "",
        systemScore: 0,
        standard: ""
      };
      this.$refs.form.resetFields();
      this.showValue = false;
    },
    // 提交
    addOrEditRelation() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          [
            this.form.beginTime,
            this.form.deadlineTime
          ] = this.form.predictTimeArr;
          const d = await this.post(this.$api.task.addOrEditRelation, {
            businessId: this.item.id,
            indexType: this.item.indexType,
            ...this.form
          });
          if (d.code === 0) {
            this.$emit("getList");
            this.clearForm();
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  width: 100%;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
</style>