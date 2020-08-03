<template>
  <div>
    <div class="dialog">
      <div class="left-main">
        <el-form
          :disabled="canEdit=='查看'"
          ref="form"
          size="small"
          :rules="rules"
          :model="form"
          label-width="100px"
        >
          <el-row>
            <el-col :span="16">
              <el-form-item label="政策名称" prop="name">
                <el-input type="text" v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政策类别" prop>
                <el-select
                  style="width:100%"
                  v-model="form.typeCode"
                  :filterable="false"
                  :clearable="false"
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in typeList"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                  <!-- <el-option label="政策咨询" value="0"></el-option>
                  <el-option label="政策类别" value="1"></el-option>-->
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="文件字号" prop="fontSize">
                <el-input type="text" v-model="form.fontSize"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来源" prop>
                <el-select
                  style="width:100%"
                  v-model="form.sourceCode"
                  :filterable="false"
                  :clearable="false"
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in sourceList"
                    :key="index"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="相关领域" prop>
                <el-select
                  style="width:100%"
                  v-model="form.domainCode"
                  :filterable="false"
                  :clearable="false"
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in directionList"
                    :key="index"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="级别" prop>
                <el-select
                  style="width:100%"
                  v-model="form.level"
                  :filterable="false"
                  :clearable="false"
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in areaLevelList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.level==1||form.level==2">
              <el-form-item label="省份" prop>
                <el-select
                  style="width:100%"
                  v-model="form.provinceAreaCode"
                  :filterable="false"
                  :clearable="false"
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in provinceAreaList"
                    :key="index"
                    :label="item.name"
                    :value="item.shortCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.level==2">
              <el-form-item label="市级" prop>
                <el-select
                  style="width:100%"
                  v-model="form.cityAreaCode"
                  :filterable="false"
                  :clearable="false"
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in cityAreaList"
                    :key="index"
                    :label="item.name"
                    :value="item.shortCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="附件上传" prop="attachmentJa">
            <div class="upWrap">
              <el-button size="small" class="btn">上传文件</el-button>
              <div class="name-wrap">
                <span class="tip"></span>
              </div>
            </div>
            <!-- </el-upload> -->
          </el-form-item>
          <el-form-item label prop v-for="(item,index) in FileList" :key="index">
            <div class="check-file">
              <div class="zz">
                <img src alt />
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.fileName"
                  placement="top-start"
                >
                  <span class="oe">{{item.fileName}}</span>
                </el-tooltip>
              </div>
              <div class="i-con-wrap">
                <img style="margin-right:20px" src="~@/assets/images/del2.png" alt />
                <a :href="item.videoUrl" target="_blank">
                  <img src="~@/assets/images/check.png" alt />
                </a>
              </div>
            </div>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item label="发布时间" prop="publishTime">
                <el-date-picker
                  v-model="form.publishTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采集时间" prop="collectTime">
                <el-date-picker
                  v-model="form.collectTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="截止时间" prop="dueTime">
                <el-date-picker
                  v-model="form.dueTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="关键词" prop="keyword">
            <el-input type="text" placeholder="多个关键词，请用英文逗号隔开" v-model="form.keyword"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="重点内容" prop="keyContent">
                <el-input type="textarea" :rows="2" placeholder="" v-model="form.keyContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拟办意见" prop="opinion">
                <el-input type="textarea" :rows="2" placeholder="" v-model="form.opinion"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.typeCode=='政策应用'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="责任部门" prop>
                  <el-cascader v-model="form.responsibleDepartManager" :props="{ expandTrigger: 'hover' }" :options="options"></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-for="(item,index) in form.coopDepartArr" :key="index">
              <el-col :span="12">
                <el-form-item :label="'协同部门'" prop>
                  <el-cascader v-model="item.userId" :props="{ expandTrigger: 'hover' }" :options="options"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="协同任务" prop>
                  <el-input type="text" :rows="2" placeholder="" v-model="item.coopTask"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

      <div v-if="form.typeCode=='政策应用'" class="rightComment">
        <approved
          :formValue="approvalPeopleList"
          :isDemand="canEdit"
          :copier="form.copyPersonList"
        />
        <!-- <comments
            ref="comments"
            :height="540"
            :businessType="businessType"
            :businessId="policyId+''"
        ></comments>-->
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "@/axios/bus";
import returnPolicy from "./returnPolicy";
import yesPolicy from "./yesPolicy";
import addPolicy from "./addPolicy";
import comments from "@/components/comment";
import modalMixin from "@/mixins/modal";
import approved from "./seeapproved";
export default {
  mixins: [modalMixin],
  components: {
    comments,
    addPolicy,
    returnPolicy,
    yesPolicy,
    approved
  },
  props: {
    policyId: String,
    businessType: String,
    formData: {}
  },
  data() {
    return {
      // 历史审批弹窗
      historyDialog: false,
      canEdit: "查看",
      // 审批通过和拒绝弹出
      nothighestApproveLevelFlag: false,
      highestApproveLevelFlag: false,
      highestApproveLevelFlagForm: {
        resource: "",
        desc: "",
        responsibleDepartManager: []
      },
      // 历史审批
      historyValue: "",
      historyList: [],
      //
      // add组件
      // 地区显示
      areaShow: false,
      cityShow: false,
      // 级别地区
      areaLevelList: [
        { name: "国家级", value: 0 },
        { name: "省级", value: 1 },
        { name: "市级", value: 2 }
      ],
      cityAreaList: [],
      options: [],
      showYes: false,
      showReturn: false,
      approvalPersonList: false,
      assignPersonList: false,
      showCreateTask: false,
      copyPersonList: false,
      returnedItem: {},
      form: {
        pName: "",
        sourceCodeArr: [],
        typeCodeArr: [],
        directionCodeArr: [],
        documentNumber: "",
        attachmentJa: [],
        publishTime: "",
        collectTime: "",
        pOpinion: "",
        pKeyword: "",
        typeCode: "",
        approvalPersonList: [], // 审批人
        copyPersonList: [] // 抄送,
      },
      copyData: {},
      fileList: [],
      sourceList: [],
      typeList: [],
      provinceAreaList: [],
      FileList: [],
      directionList: [],
      approvalPeopleList: [],
      rules: {
        pName: [
          { required: true, message: "政策名称不能为空", trigger: "blur" }
        ],
        // attachmentJa: [
        //   { required: true, message: "附件不能为空", trigger: "change" }
        // ],
        approvalPersonList: [
          { required: true, message: "审批人不能为空", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.listDepartmentAndUser()
    console.log(this.$props.formData,999)
    this.form = this.$props.formData;
    this.FileList = this.form.attachmentJa;
    this.approvalPeopleList = this.form.approvalPersonList;
  },
  methods: {
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.options = d.data;
      }
    },
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  display: flex;
  .left-main {
    flex: 1;
    margin-bottom: 60px;
    max-height: 540px;
    padding: 10px;
    display: flex;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    } //滚动条的滑块
    &::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 3px;
    }
  }
  .footerBtns {
    position: absolute;
    bottom: 10px;
    right: 398px;
  }
}

.del {
  color: red;
  border: 1px solid red;
}

.upWrap {
  display: flex;
  align-items: center;
  .name-wrap {
    display: flex;
    margin-left: 10px;
    align-items: center;
  }
}

.head {
  display: flex;
}

.addBtn {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
  color: #50a8f0;
}

.wrap {
  display: flex;
  height: 32px;
  align-items: center;
}

.el-tag {
  margin-right: 10px;
}

.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}

.tip {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #999999;
}

.check {
  position: absolute;
  top: 0;
  left: -90px;
}

.el-dialog__footer {
  margin-right: 260px;
}

.rightComment {
  width: 369px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  } //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
}
.check-file {
  width: 240px;
  height: 36px;
  margin-bottom: 8px;
  background: #f8f8f8;
  color: #939393;
  font-size: 14px;
  border-radius: 3px;
  display: flex;
  cursor: pointer;
  padding: 10px;
  align-items: center;
  &:hover {
    .i-con-wrap {
      display: block;
    }
    .zz {
      opacity: 0.3;
    }
  }
}
.zz {
  display: flex;
  align-items: center;
  background: #f8f8f8;
  opacity: 1;
}
.oe {
  width: 140px;
  margin-right: 10px;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history {
  width: 260px;
  position: absolute;
  right: 16px;
  font-size: 12px;
  z-index: 20;
}

.display {
  display: flex;
}
.red {
  /deep/ .el-form-item__label {
    color: red !important;
  }
  /deep/ .el-form-item__content {
    /deep/ .el-input {
      input {
        color: red !important;
      }
    }
  }
  input {
    color: red !important;
  }
}
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: white!important;
  border-color: #e4e7ed!important;
  color: black!important;
  cursor: not-allowed!important;
}
</style>