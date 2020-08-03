<template>
  <div class="all">
    <div class="left">
      <el-form
        ref="form"
        size="small"
        :rules="rules"
        :model="form"
        class="form"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="协同事项名称" prop="coopTask">
              <el-input type="textarea" rows="1" v-model="form.coopTask"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期" prop="date">
              <el-date-picker v-model="form.date" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提报部门" prop="applyDepartId">
              <el-select v-model="form.applyDepartId" placeholder="请选择部门">
                <el-option
                  v-for="(item,index) in DepartmentList"
                  :key="index"
                  :label="item.departmentName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" prop="period">
              <el-time-picker
                is-range
                v-model="form.period"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm:ss"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="事项性质" prop="coopNature">
              <el-select v-model="form.coopNature" placeholder="请选择">
                <el-option
                  v-for="(item,index) in coopNature"
                  :key="index"
                  :label="item.code"
                  :value="item.code"
                ></el-option>
              </el-select>
              <!-- <el-input type="text" v-model="form.coopNature"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事项目标" prop="coopTarget">
              <el-input type="text" v-model="form.coopTarget"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="记录人" prop="recordUserIdArr">
              <el-cascader
                :show-all-levels="false"
                :props="{ expandTrigger: 'hover' }"
                v-model="form.recordUserIdArr"
                :options="DepartmentAndUserList"
              ></el-cascader>
              <!-- <el-select v-model="form.recordUserId">
                <el-option
                  v-for="(item,index) in userByDepartmentIdList"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="协同事项详情" prop="coopDetails">
              <el-input rows="6" type="textarea" v-model="form.coopDetails"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="btnWarp">
        <el-button
          type="primary"
          v-if="form.createFlag&&form.republish==0&&form.status<3"
          size="small"
          @click="returnBackCoop()"
        >撤回</el-button>
        <el-button
          type="primary"
          v-if="form.createFlag&&form.republish==1&&form.status<3"
          size="small"
          @click="republic()"
        >重新发起</el-button>
        <el-button
          type="primary"
          v-if="form.integratedOfficeDirectorFlag&&form.integratedOfficeDirectorStatus==1&&form.status<3"
          size="small"
          @click="cancelCoop()"
        >终止协同</el-button>
        <el-button
          type="primary"
          v-if="form.integratedOfficeDirectorFlag&&form.integratedOfficeDirectorStatus==0"
          size="small"
          @click="sureLast()"
        >最终确认</el-button>
        <el-button
          type="primary"
          v-if="form.coopPersonFlag&&form.coopOperateStatus==0"
          size="small"
          @click="agreeCoop()"
        >同意</el-button>
        <el-button
          type="primary"
          v-if="form.coopPersonFlag&&form.coopOperateStatus==0"
          size="small"
          @click="refuse()"
        >拒绝</el-button>
        <el-button
          type="primary"
          size="small"
          v-if="form.createFlag&&form.status==0||form.integratedOfficeDirectorFlag&&(form.status==0||form.status==1||form.status==2)"
          @click="save"
        >保存</el-button>
      </div>
    </div>
    <div class="CommentAndApprove">
      <seeapprove
        @coopList="coopLists"
        :businessType="7"
        :creatName="form.createUserName"
        :creatTime="form.createTime"
        :copier="form.copyPersonList"
        :cooper="form.coopPersonList"
        :formValue="form.approvalPersonList"
        :isDemand="form.republish==0?'查看':'编辑'"
        :integratedOfficeDirector="form.integratedOfficeDirector"
        :checkedParams="form.acceptancePersonList"
        :isChecked="'协同'"
      />
      <comments
        v-if="form.id!=''"
        ref="comments"
        :height="200"
        :businessType="7"
        :businessId="form.id"
      ></comments>
    </div>
  </div>
</template>

<script>
import comments from "@/components/comment";
import seeapprove from "../../policy/compontents/seeapproved";
export default {
  props: { coopId: "" },
  components: {
    seeapprove,
    comments
  },
  data() {
    return {
      userByDepartmentIdList: [],
      DepartmentList: [],
      DepartmentAndUserList: [],
      form: {
        createFlag: true,
        status: 0,
        applyDepartId: "",
        integratedOfficeDirector: [
          {
            userId: "503970066052681728",
            userName: "项目经理x",
            operateStatus: "0",
            businessType: 7,
            operateType: "7"
          }
        ]
      },
      coopNature: [],
      rules: {
        coopTask: [
          { required: true, message: "协同事项名称不能为空", trigger: "blur" }
        ],
        date: [{ required: true, message: "日期不能为空", trigger: "change" }],
        applyDepartId: [
          { required: true, message: "提报部门不能为空", trigger: "blur" }
        ],
        period: [
          { required: true, message: "时间不能为空", trigger: "change" }
        ],
        coopNature: [
          { required: true, message: "事项性质不能为空", trigger: "change" }
        ],
        coopTarget: [
          { required: true, message: "事项目标不能为空", trigger: "change" }
        ],
        recordUserIdArr: [
          { required: true, message: "记录人不能为空", trigger: "change" }
        ],
        coopDetails: [
          { required: true, message: "协同事项详情不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    // "form.applyDepartId"(val) {
    //   this.changeDepartment(val);
    // }
  },
  mounted() {
    this.listDictBasicObjByName("COOP_NATURE");
    if (this.$props.coopId != "") {
      this.getCoop(this.$props.coopId);
      this.getDepartment();
      this.listDepartmentAndUser();
      // this.getUserListByConfigKey();
    } else {
      this.getDepartment();
      this.listDepartmentAndUser();
      this.getUserListByConfigKey();
    }
  },
  methods: {
    async listDictBasicObjByName(dictName) {
      const d = await this.post(this.$api.policy.listDictBasicObjByName, {
        dictName: dictName
      });
      if (d.code === 0) {
        if (dictName === "COOP_NATURE") {
          this.coopNature = d.data;
        } else if (dictName === "POLICY_TYPE") {
          this.typeList = d.data;
        } else {
          this.directionList = d.data;
        }
      }
    },
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.DepartmentAndUserList = d.data;
      }
    },
    // 终止协同
    async cancelCoopAjax() {
      const d = await this.post(this.$api.coop.cancelCoop, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.getCoop(this.$props.coopId);
      }
    },
    cancelCoop() {
      this.$confirm("确认取消协同？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.cancelCoopAjax();
        })
        .catch(e => e);
    },
    // 最终确认
    async finalConfirmationAjax() {
      const d = await this.post(this.$api.coop.finalConfirmation, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.getCoop(this.$props.coopId);
      }
    },
    sureLast() {
      this.form.coopPersonList.forEach(item => {
        if (item.operateStatus == 2) {
          this.$confirm("有协同人员已拒绝协同安排是否最终确认？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$confirm(
                "最终确认后通知所有协同人员，且不可修改协同安排只能取消协同是否最终确认？",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  this.finalConfirmationAjax();
                })
                .catch(e => e);
            })
            .catch(e => e);
        } else {
          this.$confirm(
            "最终确认后通知所有协同人员，且不可修改协同安排只能取消协同是否最终确认？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              // return;
              this.finalConfirmationAjax();
            })
            .catch(e => e);
        }
      });
    },
    // 重新发起
    republic() {
      this.$confirm("确认重新发起协同？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.save();
        })
        .catch(e => e);
    },
    // 撤回协同
    async surereturnBackCoop() {
      const d = await this.post(this.$api.coop.returnBackCoop, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.getCoop(this.$props.coopId);
      }
    },
    returnBackCoop() {
      this.$confirm("确认撤回协同？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.surereturnBackCoop();
        })
        .catch(e => e);
    },
    // 拒绝协同安排
    async sureRefuse(value) {
      const d = await this.post(this.$api.coop.disagree, {
        id: this.form.id,
        comment: value
      });
      if (d.code === 0) {
        this.$emit("clear", "我已确认");
      }
    },
    refuse() {
      this.$prompt("请输入拒绝理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.sureRefuse(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 同意协同安排
    async sureAgree() {
      const d = await this.post(this.$api.coop.agreeCoop, {
        id: this.form.id
      });
      if (d.code === 0) {
        this.$emit("clear", "我已确认");
      }
    },
    agreeCoop() {
      this.$confirm("确认同意协同安排", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sureAgree();
        })
        .catch(e => e);
    },
    // 获取协同详情
    async getCoop(id) {
      const d = await this.post(this.$api.coop.getCoop, {
        id: id
      });
      if (d.code === 0) {
        this.form = d.data;
      }
    },
    // 获取综合办主任
    async getUserListByConfigKey() {
      const d = await this.post(this.$api.coop.getUserListByConfigKey, {
        configKey: "INTEGRATED_OFFICE_DIRECTOR"
      });
      if (d.code === 0) {
        this.form.integratedOfficeDirector = d.data;
      }
    },
    // 获取个人信息
    getLocalStorage(key) {
      var value = localStorage.getItem(key);
      if (value) {
        value = JSON.parse(value);
        this.locaByUser = value.userId;
      } else {
        return false;
      }
    },
    // 获取部门
    async getDepartment() {
      const d = await this.post(this.$api.projectManage.listAllDepartment);
      if (d.code === 0) {
        this.DepartmentList = d.data;
        this.form.applyDepartId =
          this.$store.state.userInfo.data.departmentIds[0] + "";
        // 有部门ID时请求该部门下的人员
        // if (this.form.applyDepartId && this.form.applyDepartId != "") {
        //   this.changeDepartment(this.form.applyDepartId);
        // }
      }
    },
    coopLists(params) {
      this.form.coopPersonList = params;
    },
    // 保存
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.coop.addOrEdit, { ...this.form });
          if (d.code === 0) {
            this.$emit("clear");
          }
        }
      });
    },
    // 获取部门下的用户
    async changeDepartment(id) {
      const d = await this.post(
        this.$api.projectManage.listUserByDepartmentId,
        { departmentId: id }
      );
      if (d.code === 0) {
        this.userByDepartmentIdList = d.data;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.all {
  display: flex;
  .left {
    flex: 1;
  }
}
/deep/ .el-cascader {
  width: 100%;
}
/deep/ .el-date-editor {
  width: 100%;
}
/deep/ .el-select {
  width: 100%;
}
.btnWarp {
  padding-bottom: 10px;
}
</style>