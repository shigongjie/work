<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="showValue"
      top="10vh"
      :close-on-click-modal="false"
      width="1221px"
      append-to-body
      :before-close="clearData"
    >
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
            <el-form-item label="附件上传" prop="attachmentJa">
              <div class="upWrap">
                <el-button size="small" class="btn" @click="globalUpload">上传文件</el-button>
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
                <div class="iconWarp">
                  <div @click="showFilePop(item)">
                    <a target="_blank"></a>
                    预览
                  </div>
                  <div @click="del(index,item)">删除</div>
                  <div @click="downLoad(index,item)">下载</div>
                  <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
                </div>
              </div>
            </el-form-item>

            <el-row>
              <el-col :span="8">
                <el-form-item label="发布时间" prop="publishTime">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="form.publishTime"
                    placement="top-start"
                  >
                    <el-date-picker
                      v-model="form.publishTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      style="width:100%"
                    ></el-date-picker>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采集时间" prop="collectTime">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="form.collectTime"
                    placement="top-start"
                  >
                    <el-date-picker
                      v-model="form.collectTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      style="width:100%"
                    ></el-date-picker>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="截止时间" prop="dueTime">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="form.dueTime"
                    placement="top-start"
                  >
                    <el-date-picker
                      v-model="form.dueTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      style="width:100%"
                    ></el-date-picker>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="关键词" prop="keyword">
              <el-input type="text" placeholder="多个关键词，请用英文逗号隔开" v-model="form.keyword"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="重点内容" prop="keyContent">
                  <el-input type="textarea" :rows="2" placeholder v-model="form.keyContent"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拟办意见" prop="opinion">
                  <el-input type="textarea" :rows="2" placeholder v-model="form.opinion"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="form.typeCode=='政策应用'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="责任部门" prop>
                    <el-cascader
                      v-model="form.responsibleDepartManager"
                      :props="{ expandTrigger: 'hover' }"
                      :options="options"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row v-for="(item,index) in form.coopDepartArr" :key="index">
                <el-col :span="12">
                  <el-form-item :label="'协同部门'" prop>
                    <el-cascader
                      v-model="item.userId"
                      :props="{ expandTrigger: 'hover' }"
                      :options="options"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="协同任务" prop>
                    <el-input type="text" :rows="2" placeholder v-model="item.coopTask"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <i
                class="el-icon-circle-plus-outline addDomain"
                v-if="canEdit=='编辑'"
                @click="addDomain"
              ></i>
            </div>
          </el-form>
        </div>
        <div class="footerBtns">
          <el-button
            type="primary"
            size="small"
            @click="agreePolicy(form.highestApproveLevelFlag)"
            v-if="form.myOperateType==0&&form.approveFlag==true"
          >审批</el-button>
          <el-button
            type="primary"
            size="small"
            v-if="form.myOperateType==5&&form.passFlag || form.myOperateType==6&&form.passFlag"
            @click="assign()"
          >指派</el-button>
          <el-button type="primary" size="small" v-if="form.myOperateType==1" @click="finsh()">完成</el-button>
          <el-button
            type="primary"
            v-if="form.republish==0&&form.myOperateType==3"
            size="small"
            @click="recall()"
          >撤回修改</el-button>

          <el-button
            type="primary"
            v-if="form.republish==1&&form.myOperateType==3"
            size="small"
            @click="republic()"
          >重新发起</el-button>
          <!-- <el-button type="text" size="small" @click="cloneData">克隆任务</el-button> -->
        </div>

        <div class="rightComment">
          <el-form v-if="form.typeCode=='政策应用'" ref="historyform" class="demo-form-inline">
            <el-form-item class="display" label="历史审批" style="margin-bottom:0;margin-left: 13px;">
              <el-select
                @change="getHistoryDetail"
                v-model="historyValue"
                placeholder="查看历史审批"
                size="mini"
                :clearable="true"
              >
                <el-option
                  v-for="(item,index) in historyList"
                  :key="index"
                  :label="'第'+(index+1)+'次审批'"
                  :value="item.historyId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <approved
            v-if="showValue&&form.typeCode=='政策应用'"
            @approvedGroup="getApprovedGroup"
            @copierList="copierList"
            :formValue="approvalPeopleList"
            :isDemand="canEdit"
            :copier="form.copyPersonList"
            :typeCode="'政策应用'"
            :creatName="form.createUserName"
            :creatTime="form.collectTime"
            :businessType="4"
          />
          <copier
            v-if="showValue&&form.typeCode =='政策资讯'"
            @approvedGroup="getApprovedGroup"
            @copierList="copierList"
            :businessType="4"
            :isDemand="canEdit"
            :copier="form.copyPersonList"
          />
          <comments
            ref="comments"
            :height="540"
            :businessType="businessType"
            :businessId="policyId+''"
          ></comments>
        </div>
      </div>
    </el-dialog>
    <addPolicy :value.sync="showCreateTask" :isClone="true" :policyId="policyId" @getList="refData"></addPolicy>
    <returnPolicy :value.sync="showReturn" :policyId="policyId" @getList="clearData"></returnPolicy>
    <!-- <yesPolicy :value.sync="showYes" :policyId="policyId" @getList="clearData"></yesPolicy> -->
    <!-- 最高审批人 -->
    <el-dialog :visible.sync="highestApproveLevelFlag" width="400px">
      <div style="padding:5px 20px">
        <el-form :model="highestApproveLevelFlagForm">
          <el-form-item label="审批意见" style="width:80%">
            <el-radio-group v-model="highestApproveLevelFlagForm.resource">
              <el-radio label="1" value="1">同意</el-radio>
              <el-radio label="2" value="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="理由" prop="desc">
            <el-input type="textarea" v-model="highestApproveLevelFlagForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="责任部门" prop>
            <el-cascader
              v-model="highestApproveLevelFlagForm.responsibleDepartManager"
              :props="{ expandTrigger: 'hover' }"
              :options="options"
            ></el-cascader>
          </el-form-item>
          <el-row v-for="(item,index) in highestApproveLevelFlagForm.coopDepartArr" :key="index">
            <el-col :span="24">
              <el-form-item :label="'协同部门'">
                <el-cascader
                  v-model="item.userId"
                  :options="options"
                  :props="{ expandTrigger: 'hover' }"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <i class="el-icon-circle-plus-outline addDomain" @click="addDomains"></i>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="highestApproveLevelFlag = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="yes(1)" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 非最高审批人 -->
    <el-dialog :visible.sync="nothighestApproveLevelFlag" width="400px">
      <div style="padding:5px 20px">
        <el-form :model="highestApproveLevelFlagForm">
          <el-form-item label="审批意见">
            <el-radio-group v-model="highestApproveLevelFlagForm.resource">
              <el-radio label="1" value="1">同意</el-radio>
              <el-radio label="2" value="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="理由" prop="desc">
            <el-input type="textarea" v-model="highestApproveLevelFlagForm.desc"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="nothighestApproveLevelFlag = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="yes(2)" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 指派弹框 -->
    <el-dialog :visible.sync="assignDialog" width="400px">
      <div style="padding:0 20px;">
        <el-form :model="assignForm">
          <el-form-item label="指派给" prop>
            <el-cascader
              v-model="assignForm.responsibleDepartManager"
              :props="{ expandTrigger: 'hover' }"
              :options="options"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="assignyes" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 历史审批弹窗 -->
    <el-dialog
      title
      :visible.sync="historyDialog"
      top="10vh"
      :close-on-click-modal="false"
      width="1221px"
      append-to-body
    >
      <historyDialog v-if="historyDialog" :formData="historyForm" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="historyDialog = false">取 消</el-button>
        <el-button type="primary" @click="historyDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import copier from "./copiers";
import Bus from "@/axios/bus";
import returnPolicy from "./returnPolicy";
import yesPolicy from "./yesPolicy";
import addPolicy from "./addPolicy";
import comments from "@/components/comment";
import modalMixin from "@/mixins/modal";
import approved from "./seeapproved";
import historyDialog from "./historyDialog";
import wpsFile from "@/components/wpsFile";
export default {
  mixins: [modalMixin],
  components: {
    comments,
    addPolicy,
    returnPolicy,
    yesPolicy,
    approved,
    historyDialog,
    wpsFile,
    copier
  },
  props: {
    policyId: String,
    businessType: String
  },
  data() {
    return {
      currFile: [],
      showFile: false,
      // 指派弹窗
      assignDialog: false,
      assignForm: {},
      // 历史审批弹窗
      historyDialog: false,
      canEdit: "查看",
      // 审批通过和拒绝弹出
      nothighestApproveLevelFlag: false,
      highestApproveLevelFlag: false,
      highestApproveLevelFlagForm: {
        resource: "",
        desc: "",
        responsibleDepartManager: [],
        coopDepartArr: []
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
      historyForm: {},
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
      }
    };
  },
  watch: {
    showValue(val) {
      if (val) {
        this.listDictBasicObjByName("POLICY_SOURCE");
        this.listDictBasicObjByName("POLICY_TYPE");
        this.listDictBasicObjByName("POLICY_DIRECTION");
        if (this.policyId) {
          this.getPolicy();
          this.getHistoryList();
        }
      }
    }
  },
  created() {
    this.listDepartmentAndUser();
  },
  mounted() {
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
      // this.form.attachmentJa.push({
      //   extendId: data.extendId
      // });
    });
  },
  methods: {
    // 下载
    downLoad(index, item) {
      window.open(item.url);
    },
    addDomains() {
      this.highestApproveLevelFlagForm.coopDepartArr.push({
        userId: "",
        coopTask: ""
      });
    },
    showFilePop(val) {
      this.currFile = [val];
      this.showFile = true;
    },
    del(item, index) {
      this.FileList.splice(index, 1);
    },
    // 指派完成
    async assignyes() {
      if (this.assignForm.responsibleDepartManager) {
        const d = await this.post(this.$api.policy.assign, {
          id: this.policyId,
          userId: this.assignForm.responsibleDepartManager.pop()
        });
        if (d.code === 0) {
          this.clearData();
          this.$message.success("操作成功");
          this.assignDialog = false;
        }
      }
    },
    assign() {
      this.assignDialog = true;
    },
    // 指派人完成
    async finsh() {
      const d = await this.post(this.$api.policy.complete, {
        id: this.policyId
      });
      if (d.code === 0) {
        this.clearData();
        this.$message.success("操作成功");
      }
    },
    // 撤回修改
    async recall() {
      const d = await this.post(this.$api.policy.returnBack, {
        id: this.policyId
      });
      if (d.code === 0) {
        this.getPolicy();
        // this.showValue = false;
      }
    },
    // 重新发起
    republic() {
      // this.form.republish = "1";
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.policy.addOrEditPolicy, {
            ...this.form
          });
          if (d.code === 0) {
            this.$message.success("重新发布成功");
            this.$emit("getList");
            this.showValue = false;
          }
        }
      });
    },
    // 发送理由
    async sendReson(type, value) {
      const d = await this.post(this.$api.common.send, {
        businessType: "政策",
        businessId: this.policyId,
        comment: value,
        commentType: type
      });
      if (d.code === 0) {
        (this.highestApproveLevelFlagForm.resource = ""),
          (this.highestApproveLevelFlagForm.desc = "");
      }
    },
    // 审批是否通过
    agreePolicy(highestApproveLevelFlag) {
      if (highestApproveLevelFlag == 1) {
        this.highestApproveLevelFlag = true;
      } else {
        this.nothighestApproveLevelFlag = true;
      }
    },
    async yes(type) {
      let params = {};
      if (type == 1) {
        params.departId = this.highestApproveLevelFlagForm.responsibleDepartManager[0];
        params.userId = this.highestApproveLevelFlagForm.responsibleDepartManager[1];
      }
      // params.reason = this.highestApproveLevelFlagForm.desc;
      params.id = this.policyId;
      params.status = this.highestApproveLevelFlagForm.resource;
      params.coopDepartArr = this.highestApproveLevelFlagForm.coopDepartArr;
      const d = await this.post(this.$api.policy.isapprove, {
        ...params
      });
      if (d.code === 0) {
        this.clearData();
        this.$message.success("操作成功");
        this.highestApproveLevelFlag = false;
        this.nothighestApproveLevelFlag = false;
      }
      this.sendReson(
        this.highestApproveLevelFlagForm.resource,
        this.highestApproveLevelFlagForm.desc
      );
    },
    globalUpload() {
      let fieldFormat = [];
      // 打开文件选择框
      Bus.$emit("openUploader", { fieldFormat });
    },
    getApprovedGroup(params) {
      this.form.approveListParam = params;
    },
    copierList(params) {
      this.form.copyPersonList = params;
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
    async delMember(status) {
      let tip;
      switch (status) {
        case 0:
          tip = "确定激活吗?";
          break;
        case 1:
          tip = "确定开始吗?";
          break;
      }
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const d = await this.post(this.$api.projectProgress.updateTaskStatus, {
          businessId: this.policyId + "",
          status: status,
          businessType: 1
        });
        if (d.code === 0) {
          this.getPolicy();
        }
      });
    },
    // 获取历史列表
    async getHistoryList(id) {
      const c = await this.post(this.$api.approve.listHistory, {
        businessId: this.policyId,
        businessType: "4"
      });
      if (c.code === 0) {
        this.historyList = c.data;
        this.historyValue = "";
      }
    },
    // 获取指定历史记录详情
    async getHistoryDetail() {
      if (this.historyValue == "") {
        return;
      } else {
        let _index = "";
        this.historyList.forEach((item, index) => {
          if (item.historyId == this.historyValue) {
            _index = index - 1;
          }
        });
        const c = await this.post(this.$api.approve.getHistoryDetail, {
          businessType: "4",
          historyId: this.historyValue,
          preHistoryId:
            this.historyList[_index] === undefined
              ? ""
              : this.historyList[_index].historyId
        });
        if (c.code === 0) {
          this.editField = c.data.editField;
          this.historyForm = c.data;
          this.historyDialog = true;
        }
      }
    },
    async updateOperateStatus(operateType, operateStatus) {
      const d = await this.post(this.$api.projectProgress.updateOperateStatus, {
        businessType: 1,
        businessId: this.policyId,
        operateType: operateType,
        operateStatus: operateStatus
      });
      if (d.code === 0) {
        this.$message.success("操作成功");
        this.getPolicy();
      }
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
    preview(file) {
      window.open(file.url);
    },
    refData() {
      this.$emit("getList");
    },
    cloneData() {
      this.clearData();
      this.showCreateTask = true;
    },
    async getPolicy(id) {
      const d = await this.post(this.$api.policy.getPolicy, {
        id: this.policyId
      });
      if (d.code === 0) {
        this.form = d.data;
        this.FileList = d.data.attachmentJa;
        this.approvalPeopleList = d.data.approvalPersonList;
        this.form.copyPersonList = d.data.copyPersonList;
        this.highestApproveLevelFlagForm.responsibleDepartManager =
          d.data.responsibleDepartManager;
        this.fileList = this.form.attachmentJa;
        if (this.form.republish == 1) {
          this.canEdit = "编辑";
        } else {
          this.canEdit = "查看";
        }
        this.$refs.comments.listComments();
        if (this.form.level == 1 || this.form.level == 2) {
          const e = await this.post(this.$api.policy.getArea, {
            parentShortCode: "0"
          });
          if (e.code === 0) {
            this.areaShow = true;
            this.provinceAreaList = e.data;
            if (this.form.level == 2) {
              const f = await this.post(this.$api.policy.getArea, {
                parentShortCode: this.form.provinceAreaCode
              });
              if (f.code === 0) {
                this.cityAreaList = f.data;
              }
            }
          }
        }
        // const c = await this.post(this.$api.approve.listHistory, {
        //   businessId: id || this.policyId,
        //   businessType: "4"
        // });
        // if (c.code === 0) {
        //   this.historyList = c.data;
        //   this.historyValue = "";
        // }
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
      }
    },
    // //选择人员后
    // handleInputConfirm(val, name, operateType) {
    //   let isReturn = true;
    //   this.form[name].some(item => {
    //     if (item.userId + "" === val[val.length - 1] + "") {
    //       isReturn = false;
    //       this.form[name] = JSON.parse(JSON.stringify(this.copyData));
    //       return this.$message.error("用户已添加");
    //     }
    //   });
    //   if (isReturn) {
    //     let arr = this.find(this.options, val[val.length - 1]);
    //     if (this.returnedItem) {
    //       let obj = {
    //         userId: this.returnedItem.value,
    //         userName: this.returnedItem.label,
    //         operateStatus: 0,
    //         businessType: 4,
    //         operateType: operateType
    //       };
    //       this.form[name].push(obj);
    //       this[name] = false;
    //       this.returnedItem = {};
    //     }
    //   }
    // },
    // handleAvatarSuccess(res, file, flieList, type, name) {
    //   let obj = {
    //     fileName: res.data.name,
    //     url: res.data.url,
    //     name: res.data.name,
    //     extendId: res.data.extendId,
    //     fileSize: "",
    //     fileType: res.data.name.substring(file.name.lastIndexOf(".") + 1)
    //   };
    //   this.form.attachmentJa.push(obj);
    //   this.$refs.form.validate(async valid => {
    //     if (valid) {
    //     }
    //   });
    // },
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
      this.$refs["form"].resetFields();
      // this.$refs.upload.clearFiles();
      this.$emit("getList");
      this.showValue = false;
    },
    addDomain() {
      this.form.coopDepartArr.push({
        userId: "",
        coopTask: ""
      });
    },
    async createClone() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.policy.addOrEditPolicy, {
            id: this.policyId,
            ...this.form
          });
          if (d.code === 0) {
            this.clearData();
            this.$refs.comments.listComments();
            this.$message.success("保存成功");
          }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-dialog__body {
  padding: 0 0 !important;
}
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
    div:nth-child(3) {
      background: url("~@/assets/images/download.png") no-repeat left center;
    }
    div:nth-child(1):hover {
      color: #0f88eb;
      background: url("~@/assets/images/preViewhover.png") no-repeat left center;
    }
    div:nth-child(2):hover {
      color: #0f88eb;
      background: url("~@/assets/images/deletehover.png") no-repeat left center;
    }
    div:nth-child(3):hover {
      color: #0f88eb;
      background: url("~@/assets/images/downloadhover.jpg") no-repeat left center;
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
.addDomain {
  font-size: 18px;
  cursor: pointer;
  margin-right: 5px;
  color: #50a8f0;
  margin-left: 50px;
  margin-bottom: 8px;
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