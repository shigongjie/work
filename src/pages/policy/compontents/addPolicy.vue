<template>
  <div>
    <el-dialog
      title="添加"
      top="10vh"
      :visible.sync="showValue"
      append-to-body
      :close-on-click-modal="false"
      width="1221px"
      :before-close="clearData"
    >
      <div class="dialog">
        <el-form ref="form" size="small" :rules="rules" :model="form" label-width="100px">
          <el-row>
            <el-col :span="16">
              <el-form-item label="政策名称" prop="name">
                <el-input type="text" v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政策类别" prop="typeCode">
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
                    :value="item.code"
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
              <el-form-item label="来源" prop="sourceCode">
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
              <el-form-item label="相关领域" prop="domainCode">
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
              <el-form-item label="级别" prop="level">
                <el-select
                  style="width:100%"
                  v-model="form.level"
                  :filterable="false"
                  :clearable="false"
                  :multiple="false"
                  placeholder="请选择"
                  @change="changelevel"
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
                  @change="changeProvince"
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
          <el-form-item label="附件上传" prop>
            <div class="upWrap">
              <el-button size="small" class="btn" @click="globalUpload">上传文件</el-button>
              <div class="name-wrap">
                <span class="tip"></span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label prop="attachmentJa" v-for="(item,index) in FileList" :key="index">
            <div class="check-file">
              <div class="zz">
                <img src alt />
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                  <span class="oe">{{item.name}}</span>
                </el-tooltip>
              </div>
              <div class="iconWarp">
                <div @click="showFilePop(item)">
                  <a target="_blank"></a>
                  预览
                </div>
                <div @click="del(index,item)">删除</div>

                <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
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
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.keyContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拟办意见" prop="opinion">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.opinion"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.typeCode=='政策应用'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="责任部门" prop="responsibleDepartManager">
                  <el-cascader
                    :emitPath="false"
                    :props="{ expandTrigger: 'hover' }"
                    v-model="form.responsibleDepartManager"
                    :options="options"
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-for="(item,index) in form.coopDepartArr" :key="index">
              <el-col :span="12">
                <el-form-item :label="'协同部门'">
                  <el-cascader
                    v-model="item.userId"
                    :props="{ expandTrigger: 'hover' }"
                    :options="options"
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="协同任务">
                  <el-input type="text" :rows="2" placeholder="请输入内容" v-model="item.coopTask"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <i class="el-icon-circle-plus-outline addDomain" @click="addDomain"></i>
          </div>
        </el-form>
        <div class="footerStyle">
          <span slot="footer">
            <el-button size="small" :disabled="IsCompete" @click="createClone(true)">创建并克隆</el-button>
            <el-button
              type="primary"
              :disabled="IsCompete"
              size="small"
              @click="createClone(false)"
            >创 建</el-button>
          </span>
        </div>
      </div>

      <approved
        v-if="showValue&&form.typeCode =='政策应用'"
        @approvedGroup="getApprovedGroup"
        @copierList="copierList"
        :businessType="4"
      ></approved>

      <!-- <copier
        v-if="showValue&&form.typeCode =='政策资讯'"
        @approvedGroup="getApprovedGroup"
        @copierList="copierList"
        :businessType="4"
      />-->
    </el-dialog>
  </div>
</template>

<script>
import copier from "./copiers";
import modalMixin from "@/mixins/modal";
import approved from "./approved";
import Bus from "@/axios/bus";
import wpsFile from "@/components/wpsFile";
export default {
  mixins: [modalMixin],
  components: { approved, copier, wpsFile },
  props: {
    policyId: String
  },
  data() {
    return {
      currFile: [],
      showFile: false,
      // 是否完成
      IsCompete: false,
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
      approvalPersonList: false,
      assignPersonList: false,
      copyPersonList: false,
      returnedItem: {},
      form: {
        name: "",
        typeCode: "",
        fontSize: "",
        sourceCode: "",
        domainCode: "",
        level: "",
        provinceAreaCode: "",
        cityAreaCode: "",
        attachmentJa: [],
        publishTime: "",
        collectTime: "",
        dueTime: "",
        keyContent: "",
        opinion: "",
        keyword: "",
        responsibleDepartManager: [],
        coopDepartArr: [
          {
            userId: [],
            coopTask: ""
          }
        ],
        approvalPersonList: [], // 审批人
        copyPersonList: [] // 抄送
      },
      copyData: {},
      // fileList: [],
      provinceAreaList: [],
      cityAreaList: [],
      sourceList: [],
      typeList: [],
      directionList: [],
      rules: {
        name: [
          { required: true, message: "政策名称不能为空", trigger: "blur" }
        ],
        typeCode: [
          { required: true, message: "政策类别不能为空", trigger: "change" }
        ],
        fontSize: [
          { required: true, message: "字号不能为空", trigger: "blur" }
        ],
        sourceCode: [
          { required: true, message: "来源不能为空", trigger: "change" }
        ],
        domainCode: [
          { required: true, message: "相关领域不能为空", trigger: "change" }
        ],
        level: [{ required: true, message: "级别不能为空", trigger: "change" }],
        publishTime: [
          { required: true, message: "发布时间不能为空", trigger: "blur" }
        ],
        collectTime: [
          { required: true, message: "采集时间不能为空", trigger: "blur" }
        ],
        dueTime: [
          { required: true, message: "截止不能为空", trigger: "change" }
        ],
        keyword: [
          { required: true, message: "关键词不能为空", trigger: "change" }
        ]
      },
      FileList: [],
      videoUrl: "",
      videoFileName: ""
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        this.listDictBasicObjByName("POLICY_SOURCE");
        this.listDictBasicObjByName("POLICY_TYPE");
        this.listDictBasicObjByName("POLICY_DIRECTION");
        this.listDepartmentAndUser();
        if (this.policyId) {
          this.getPolicy();
        }
      }
    }
  },
  mounted() {
    // 文件上传成功的回调
    Bus.$on("fileSuccess", data => {
      this.FileList.push({
        extendId: data.extendId,
        fileId: data.fileId,
        fileSize: data.fileSize,
        fileType: data.fileType,
        name: data.name,
        preview: data.preview,
        url: data.url,
        fileName: data.name
      });
      this.form.attachmentJa.push({
        extendId: data.extendId
      });
    });
  },
  methods: {
    // 下载
    downLoad(index, item) {
      window.open(item.url);
    },
    showFilePop(val) {
      this.currFile = [val];
      this.showFile = true;
    },
    async changelevel() {
      if (this.form.level == 1 || this.form.level == 2) {
        const d = await this.post(this.$api.policy.getArea, {
          parentShortCode: "0"
        });
        if (d.code === 0) {
          this.areaShow = true;
          this.provinceAreaList = d.data;
        }
      }
    },
    async changeProvince() {
      const d = await this.post(this.$api.policy.getArea, {
        parentShortCode: this.form.provinceAreaCode
      });
      if (d.code === 0) {
        this.cityShow = true;
        this.cityAreaList = d.data;
        this.form.cityAreaCode = "";
      }
    },
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
    },
    handleChange(label) {},
    getApprovedGroup(params) {
      this.form.approvalPersonList = params;
    },
    globalUpload() {
      let fieldFormat = [];
      // 打开文件选择框
      Bus.$emit("openUploader", { fieldFormat });
    },
    del(index, ob) {
      this.FileList.splice(index, 1);
    },
    addDomain() {
      this.form.coopDepartArr.push({
        userId: "",
        coopTask: ""
      });
    },
    async listDictBasicObjByName(dictName) {
      const d = await this.post(this.$api.policy.listDictBasicObjByName, {
        dictName: dictName
      });
      if (d.code === 0) {
        if (dictName === "POLICY_SOURCE") {
          this.sourceList = d.data;
        } else if (dictName === "POLICY_TYPE") {
          this.typeList = d.data;
        } else {
          this.directionList = d.data;
        }
      }
    },
    preview(file) {
      window.open(file.response.data.url);
    },
    async getPolicy() {
      const d = await this.post(this.$api.policy.getPolicy, {
        id: this.policyId
      });
      if (d.code === 0) {
        this.form = d.data;
        this.form.id = "";
        this.fileList = this.form.attachmentJa;
      }
    },
    // 删除人员
    handleClose(name, index) {
      this.form[name].splice(index, 1);
    },
    // 显示级联人员
    showInput(name) {
      this[name] = true;
    },
    // 递归找name
    find(arr, id) {
      arr.some(item => {
        if (item.value === id) {
          this.returnedItem = item;
          return item;
        } else if (item.children && item.children.length > 0) {
          this.find(item.children, id);
        }
      });
    },
    visibleChange(isTrue, name) {
      if (!isTrue) {
        setTimeout(() => {
          this[name] = false;
        }, 10);
      } else {
        this.copyData = JSON.parse(JSON.stringify(this.form[name]));
      }
    },
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.options = d.data;
        this.isLoad = true;
      }
    },
    async getArea(code) {
      if (this.form.level != "0") {
        const d = await this.post(this.$api.policy.getArea, {
          parentShortCode: code
        });
        if (d.code === 0) {
          this.provinceAreaList = d.data;
        }
      }
    },
    //选择人员后
    handleInputConfirm(val, name, operateType) {
      console.log(val, name, operateType);
      let isReturn = true;
      this.form[name].some(item => {
        if (item.userId + "" === val[val.length - 1] + "") {
          isReturn = false;
          this.form[name] = JSON.parse(JSON.stringify(this.copyData));
          return this.$message.error("用户已添加");
        }
      });
      if (isReturn) {
        let arr = this.find(this.options, val[val.length - 1]);
        if (this.returnedItem) {
          let obj = {
            userId: this.returnedItem.value,
            userName: this.returnedItem.label,
            operateStatus: 0,
            businessType: 4,
            operateType: operateType
          };
          this.form[name].push(obj);
          this[name] = false;
          this.returnedItem = {};
        }
      }
    },
    handleAvatarSuccess(res, file, flieList, type, name) {
      let obj = {
        fileName: res.data.name,
        url: res.data.url,
        extendId: res.data.extendId,
        fileSize: "",
        fileType: res.data.name.substring(file.name.lastIndexOf(".") + 1)
      };
      this.form.attachmentJa.push(obj);
      this.$refs.form.validate(async valid => {
        if (valid) {
        }
      });
    },
    handleRemove(file, fileList) {
      let remIndex;
      this.form.attachmentJa.some((item, index) => {
        if (item.fileName === file.name) {
          remIndex = index;
        }
      });
      this.form.attachmentJa.splice(remIndex, 1);
    },
    clearData() {
      this.IsCompete = false;
      this.$refs["form"].resetFields();
      this.FileList = [];
      this.form.attachmentJa = [];
      this.form.coopDepartArr = [
        {
          userId: [],
          coopTask: ""
        }
      ];
      this.$emit("getList");
      this.showValue = false;
    },
    async createClone(isClone) {
      this.IsCompete = true;
      setTimeout(() => {
        this.IsCompete = false;
      }, 2000);
      this.form.approvalPersonList.forEach((item, index) => {
        if (item.members.length == 0) {
          this.form.approvalPersonList.splice(index, 1);
        }
      });
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (
            this.form.approvalPersonList.length === 0 &&
            this.form.typeCode == "政策应用"
          ) {
            this.$message.error("审批人不能为空");
          } else {
            const d = await this.post(this.$api.policy.addOrEditPolicy, {
              ...this.form,
              id: ""
            });
            if (d.code === 0) {
              this.IsCompete = false;
              if (!isClone) {
                this.clearData();
                this.$message.success("创建成功");
              } else {
                this.$emit("getList");
                this.$message.success("创建并克隆成功");
              }
            }
          }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-dialog__body {
  display: flex;
  padding: 0 !important;
}

.dialog {
  width: 900px;
  margin-bottom: 15px;
  max-height: 600px;
  padding: 10px;
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

.footerStyle {
  display: flex;
  justify-content: flex-end;
}

.addDomain {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
  color: #50a8f0;
  margin-left: 50px;
  margin-bottom: 8px;
}

.check-file {
  background: url("~@/assets/images/file.png") no-repeat left center;
  width: 230px;
  height: 36px;
  // margin-bottom: 8px;
  // background: #f8f8f8;
  // color: #939393;
  font-size: 14px;
  border-radius: 3px;
  display: flex;
  cursor: pointer;
  padding: 10px;
  align-items: center;
  .iconWarp {
    div {
      width: 50px;
      padding-left: 16px;
      font-size: 12px;
    }
    div:nth-child(1) {
      background: url("~@/assets/images/preview.png") no-repeat left center;
    }
    div:nth-child(2) {
      background: url("~@/assets/images/delete.png") no-repeat left center;
    }
    div:nth-child(1):hover {
      color: #0f88eb;
      background: url("~@/assets/images/preViewhover.png") no-repeat left center;
    }
    div:nth-child(2):hover {
      color: #0f88eb;
      background: url("~@/assets/images/deletehover.png") no-repeat left center;
    }
    display: flex;
    margin-left: 5px;
  }
  &:hover {
    .i-con-wrap {
      // display: block;
    }
    .zz {
      opacity: 0.8;
    }
  }
}
.zz {
  display: flex;
  align-items: center;
  opacity: 1;
}
.oe {
  margin-right: 10px;
  font-size: 12px;
  white-space: nowrap;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: white !important;
  border-color: #e4e7ed !important;
  color: black !important;
  cursor: not-allowed !important;
}
/deep/ .el-cascader--small {
  width: 100%;
}
/deep/ .el-textarea.is-disabled .el-textarea__inner {
  background-color: white !important;
  border-color: #e4e7ed !important;
  color: black !important;
  cursor: not-allowed !important;
}
</style>
