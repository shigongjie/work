<template>
  <div class="all">
    <p
      v-if="masterId!=''"
      class="title"
    >{{editOrSee=="查看"?'查看客户基本信息':(editOrSee=='编辑'?'编辑客户信息':'添加客户信息')}}</p>
    <div class="seeDetail">
      基本信息
      <!-- <p class="TableTitle">客户基本信息</p> -->
      <el-button
        @click="seeOrHideDetail"
        style="height: 27px;margin: 6px 8px;"
        size="mini"
        type
        v-if="masterId!=''"
      >
        {{seeOrHideDetailValue?'收起内容':'展开内容'}}
        <i
          v-if="seeOrHideDetailValue"
          class="el-icon-arrow-down el-icon--right"
        ></i>
        <i v-if="!seeOrHideDetailValue" class="el-icon-arrow-up el-icon--right"></i>
      </el-button>

      <div class="sveCustomBaseInfoBtn">
        <el-button
          v-if="editOrSee=='编辑'"
          type="primary"
          size="mini"
          @click="sveCustomBaseInfo"
        >保存客户基本信息</el-button>
        <el-button type="primary" size="mini" @click="close">关闭</el-button>
      </div>
    </div>

    <el-form
      :model="customBaseInfoForm"
      :rules="rules"
      label-width="90px"
      v-if="!seeOrHideDetailValue"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="客户类型" prop="customerType">
            <el-select v-model="customBaseInfoForm.customerType" placeholder="请选择客户类型" clearable>
              <el-option
                v-for="(item,index) in customerTypeList"
                :key="index"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户名称" prop="customerName">
            <el-autocomplete
              label="customerName"
              v-model="customBaseInfoForm.customerName"
              :fetch-suggestions="((queryString, cb)=>{querySearchAsync(queryString, cb,'customerName')})"
              placeholder="请输入内容"
              @select="handleSelect"
              clearable
            >
              <!-- <template slot-scope="{ item }">
                <div class="name">{{ item.customerName }}</div>
              </template>-->
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      ref="form"
      :model="customBaseInfoForm"
      :rules="rules"
      label-width="90px"
      v-if="seeOrHideDetailValue"
    >
      <el-row>
        <el-col :span="5.4">
          <el-form-item label="客户类型" prop="customerType">
            <el-select v-model="customBaseInfoForm.customerType" placeholder="请选择客户类型" clearable>
              <el-option
                v-for="(item,index) in customerTypeList"
                :key="index"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5.4">
          <el-form-item label="客户名称" prop="customerName">
            <el-autocomplete
              label="customerName"
              v-model="customBaseInfoForm.customerName"
              :fetch-suggestions="((queryString, cb)=>{querySearchAsync(queryString, cb,'customerName')})"
              placeholder="请输入内容"
              @select="handleSelect"
              clearable
            >
              <!-- <template slot-scope="{ item }">
                <div class="name">{{ item.customerName }}</div>
              </template>-->
            </el-autocomplete>
          </el-form-item>
        </el-col>

        <el-col :span="5.4">
          <el-form-item label="客户来源" prop="customerSource">
            <el-select v-model="customBaseInfoForm.customerSource" placeholder="请选择客户来源" clearable>
              <el-option
                v-for="(item,index) in customerSource"
                :key="index"
                :label="item.code"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col class="ssq" :span="8" style="display:flex;">
          <p
            style="width: 90px;line-height: 40px;text-align: right; padding-right: 12px;font-size:13px;"
          >省&nbsp;|&nbsp;市&nbsp;|&nbsp;区</p>

          <el-select
            style="width:115px"
            @change="changeProvince"
            v-model="customBaseInfoForm.provinceAreaCode"
            placeholder="请选择省"
            clearable
          >
            <el-option
              v-for="(item,index) in provinceAreaList"
              :key="index"
              :label="item.name"
              :value="item.shortCode"
            ></el-option>
          </el-select>

          <el-select
            style="width:115px"
            v-model="customBaseInfoForm.cityAreaCode"
            placeholder="请选择市"
            @change="changeCity"
            clearable
          >
            <el-option
              v-for="(item,index) in cityAreaList"
              :key="index"
              :label="item.name"
              :value="item.shortCode"
            ></el-option>
          </el-select>

          <el-select
            style="width:115px"
            v-model="customBaseInfoForm.districtAreaCode"
            placeholder="请选择区"
            clearable
          >
            <el-option
              v-for="(item,index) in districtAreaList"
              :key="index"
              :label="item.name"
              :value="item.shortCode"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col v-if="customBaseInfoForm.customerType==1" :span="5.4">
          <el-form-item label="办学层次" prop="schoolLevel">
            <el-select v-model="customBaseInfoForm.schoolLevel" placeholder="请选择办学层次" clearable>
              <el-option
                v-for="(item,index) in universityCradation"
                :key="index"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-if="customBaseInfoForm.customerType==1" :span="5.4">
          <el-form-item label="单位性质" prop="schoolNature">
            <el-select v-model="customBaseInfoForm.schoolNature" placeholder="请选择单位性质" clearable>
              <el-option
                v-for="(item,index) in schoolNature"
                :key="index"
                :label="item.value"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5.4">
          <el-form-item label="客户状态" prop="status">
            <el-select v-model="customBaseInfoForm.status" placeholder="请选择客户状态" clearable>
              <el-option
                v-for="(item,index) in customerStatus"
                :key="index"
                :label="item.code"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5.4">
          <el-form-item label="合作状态" prop="status">
            <el-select
              disabled
              v-model="customBaseInfoForm.customerStar"
              placeholder="请选择客户状态"
              clearable
            >
              <el-option
                v-for="(item,index) in customerStatus"
                :key="index"
                :label="item.code"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col style="width:725px">
          <el-form-item label="单位地址" prop="address">
            <el-input v-model="customBaseInfoForm.address" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="单位属性" prop="schoolAttributes">
            <el-checkbox-group v-model="customBaseInfoForm.schoolAttributes" style="margin-top:0">
              <el-checkbox
                v-for="(item,index) in schoolAttributes"
                :key="index"
                :label="item.value"
                :value="item.code"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5.4">
          <el-form-item label="官网" prop="schoolWebsite">
            <el-input v-model="customBaseInfoForm.schoolWebsite" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5.4">
          <el-form-item label="官微" prop="shcoolWeixin">
            <el-input v-model="customBaseInfoForm.shcoolWeixin" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5.4">
          <el-form-item label="成立时间" prop="customerEstablishDate">
            <el-date-picker
              v-model="customBaseInfoForm.customerEstablishDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              style="width:200px"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5.4">
          <el-form-item label="数据年份" prop="annual">
            <el-select
              @change="changeYear"
              v-model="customBaseInfoForm.annual"
              placeholder="请选择数据年份"
              clearable
            >
              <el-option
                v-for="(item,index) in yearList"
                :key="index"
                :label="item.code"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <!-- <el-col :span="5.4">
          <el-form-item label="成立时间" prop="customerEstablishDate">
            <el-date-picker
              v-model="customBaseInfoForm.customerEstablishDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5.4">
          <el-form-item label="数据年份" prop="annual">
            <el-select
              @change="changeYear"
              v-model="customBaseInfoForm.annual"
              placeholder="请选择数据年份"
              clearable
            >
              <el-option
                v-for="(item,index) in yearList"
                :key="index"
                :label="item.code"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="5.4">
          <el-form-item label="专业总量" prop="majorNum">
            <el-input v-model="customBaseInfoForm.majorNum" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5.4">
          <el-form-item label="学生总数" prop="stuNum">
            <el-input v-model="customBaseInfoForm.stuNum" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="客户描述" prop="customerDesc">
          <el-input type="textarea" v-model="customBaseInfoForm.customerDesc"></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <el-checkbox-group
      v-if="masterId!=''&&editOrSee=='编辑'"
      v-model="checkedCities"
      @change="seeDetailTable"
    >
      <el-checkbox v-if="isManagerTableVisibleFlag" label="合作进展">合作进展</el-checkbox>
      <el-checkbox
        v-for="(item,index) in tableList"
        :label="item.itemName"
        :key="index"
      >{{item.itemName}}</el-checkbox>

      <el-checkbox v-if="isManagerTableVisibleFlag" label="信息分配">信息分配</el-checkbox>
      <el-checkbox v-if="isManagerTableVisibleFlag" label="信息共享">信息共享</el-checkbox>
    </el-checkbox-group>
    <div v-if="masterId">
      <div class="eachTable" v-if="checkedCities.includes('合作进展')">
        <p class="TableTitle">
          合作进展 &nbsp; &nbsp; &nbsp;
          <el-button v-if="editOrSee=='编辑'" type="primary" size="mini" @click="seehezuojinzhan()">添加</el-button>
        </p>
        <el-table ref="scoreTable" max-height="550" :data="taskList" size="small" border>
          <el-table-column type="index" label="序号">
            <template scope="scope">{{scope.$index+(params.pageNum-1)*params.pageSize+1}}</template>
          </el-table-column>
          <!--          <el-table-column label="业务" prop="projectName"></el-table-column>-->
          <el-table-column
            label="项目"
            prop="engineeringName"
            :filters="filterData"
            :filter-method="filterHandler"
          ></el-table-column>
          <el-table-column label="模块" prop="moduleName"></el-table-column>
          <el-table-column label="任务名称" prop="name"></el-table-column>
          <el-table-column label="内容" prop="content">
            <template slot-scope="scope">
              <el-link
                type="primary"
                v-if="scope.column.property ==='content'"
                @click="showContent(scope.row)"
              >查看详情</el-link>
            </template>
          </el-table-column>
          <el-table-column label="目标值" prop="targetValue"></el-table-column>
          <el-table-column label="已完成" prop="nowValue"></el-table-column>
          <el-table-column label="完成占比">
            <template slot-scope="scope">{{(scope.row.nowValue/scope.row.targetValue).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column
            v-if="editOrSee=='编辑'"
            width="150px"
            fixed="right"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="seehezuojinzhan(scope.row.id)">编辑</el-button>
              <!-- <el-button type="text" @click="del(scope.row.id)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-for="(item,index) in tableList"
        :key="index"
        class="eachTable"
        v-if="checkedCities.includes(item.itemName+'')"
      >
        <div class="TableTitle">
          <span style="display: flex;align-items: center;">{{item.itemName}} &nbsp; &nbsp; &nbsp;</span>
          <div>
            <el-button
              v-if="editOrSee=='编辑'"
              type="primary"
              size="mini"
              @click="addTableData(item.itemFieldId,item.itemId)"
            >添加</el-button>
            <el-button size="mini" @click="seeMore(item)">查看更多</el-button>
          </div>
        </div>
        <el-table ref="scoreTable" max-height="550" :data="item.list" size="small" border>
          <el-table-column align="left" type="index" label="序号">
            <template scope="scope">{{scope.$index+(params.pageNum-1)*params.pageSize+1}}</template>
          </el-table-column>
          <el-table-column
            v-for="(items, indexs) in item.columnList"
            :key="indexs"
            :prop="items.fieldName"
            :width="items.width"
            align="left"
            :label="items.fieldLabel"
            :sortable="(items.orderByName ==='' || items.orderByName==null)?false:'custom'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="items.fieldName ==='name'">
                <el-button type="text" @click="downLoad(scope.row)">{{scope.row[items.fieldName]}}</el-button>
              </div>
              <span v-else>{{scope.row[items.fieldName]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="editOrSee=='编辑'"
            width="150px"
            fixed="right"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="editTableData(item.itemFieldId,item.itemId,scope.row)"
              >编辑</el-button>
              <el-button type="text" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="eachTable" v-if="checkedCities.includes('信息分配')&&isManagerTableVisibleFlag">
        <p class="TableTitle">
          信息分配 &nbsp; &nbsp; &nbsp;
          <el-button v-if="editOrSee=='编辑'" type="primary" size="mini" @click="addInfomation(1)">添加</el-button>
        </p>
        <el-table ref="scoreTable" max-height="550" :data="shareTable" size="small" border>
          <el-table-column type="index" label="序号">
            <template scope="scope">{{scope.$index+(params.pageNum-1)*params.pageSize+1}}</template>
          </el-table-column>
          <el-table-column
            v-for="(items, indexs) in tabClounm"
            :key="indexs"
            :prop="items.fieldName"
            :width="items.width"
            align="left"
            :label="items.fieldLabel"
            :sortable="(items.orderByName ==='' || items.orderByName==null)?false:'custom'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="editOrSee=='编辑'"
            width="150px"
            fixed="right"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="ShareInfomationEdit('1',scope.row.id)">编辑</el-button>
              <el-button type="text" @click="del(scope.row.id,'infomation')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="eachTable" v-if="checkedCities.includes('信息共享')&&isManagerTableVisibleFlag">
        <p class="TableTitle">
          信息共享 &nbsp; &nbsp; &nbsp;
          <el-button v-if="editOrSee=='编辑'" type="primary" size="mini" @click="addInfomation(2)">添加</el-button>
        </p>
        <el-table ref="scoreTable" max-height="550" :data="ShareTabDate" size="small" border>
          <el-table-column type="index" label="序号">
            <template scope="scope">{{scope.$index+(params.pageNum-1)*params.pageSize+1}}</template>
          </el-table-column>
          <el-table-column
            v-for="(items, indexs) in ShareTabClounm"
            :key="indexs"
            :prop="items.fieldName"
            :width="items.width"
            align="left"
            :label="items.fieldLabel"
            :sortable="(items.orderByName ==='' || items.orderByName==null)?false:'custom'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="editOrSee=='编辑'"
            width="150px"
            fixed="right"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="ShareInfomationEdit('2',scope.row.id)">编辑</el-button>
              <el-button type="text" @click="del(scope.row.id,'infomation')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 动态表单窗口 -->
    <el-dialog
      append-to-body
      v-if="TableJsonShow"
      title
      :visible.sync="TableJsonShow"
      width="900px"
    >
      <jsonparseform
        @isCloseDialog="getChildren"
        :listId="listId"
        :Json="TableJson"
        :masterId="masterId"
        :itemId="itemId"
        :FileTableJson="FileTableJson"
      />
    </el-dialog>
    <!-- 查看更多 -->
    <el-dialog append-to-body v-if="seeMoreList" title :visible.sync="seeMoreList" width="1500px">
      <Customer :seeMoreListData="seeMoreListData" />
    </el-dialog>
    <!-- 信息分配/共享 -->
    <el-dialog
      append-to-body
      v-if="infomationShareDialog"
      title
      :visible.sync="infomationShareDialog"
      width="900px"
    >
      <el-form>
        <el-form-item
          :label="shareOrDistribution ==1?'分配给':'共享给'"
          style="width: 50%;margin-bottom: 26px;margin-left:10%"
        >
          <el-cascader
            :disabled="isDisabled"
            v-model="jurisdictionForm.departIdArr"
            :options="options"
            @change="test"
            :props="{ expandTrigger: 'hover' }"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>

        <el-table
          :data="shareInfomationData"
          style="width: 80%;margin:auto;margin-bottom:20px"
          border
        >
          <el-table-column prop="customerContact" label="客户联系人" width="144"></el-table-column>
          <el-table-column prop="department" label="部门" width="144"></el-table-column>
          <el-table-column prop="jobTitle" label="职务" width="144"></el-table-column>
          <el-table-column prop="telephonePriv" label="联系电话权限" width="144">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.telephonePriv"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="addressPriv" label="家庭住址权限" width="143">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.addressPriv"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div style="padding:10px 10px;text-align:right;">
        <el-button size="small" type="primary" @click="save()">保存</el-button>
      </div>
    </el-dialog>
    <contentDetail :bigImg="content" :title="title" :value.sync="isShowContent"></contentDetail>
    <!-- 任务情况 -->
    <!-- <unTask :value.sync="isAddTask" @getList="listTaskByCustomer" :defaultMaster="masterId" /> -->
    <wpsFile :value.sync="showFile" :currFile="currFile"></wpsFile>
    <uptask
      :defaultMaster="masterId"
      :read="read"
      :value.sync="showUpTask"
      @getList="listTaskByCustomer"
      :params="{...params, ...paramsOther}"
      :taskId="taskId"
    ></uptask>
  </div>
</template>

<script>
const Customer = resolve => require(["pages/customer"], resolve);
const uptask = resolve =>
  require(["../../projectProgress/compontents/upTask"], resolve);
// const unTask = resolve =>
//   require(["../../projectProgress/compontents/upTask"], resolve);
import contentDetail from "@/components/contentDetail";
import jsonparseform from "../compontents/JsonPraseForm/index";
import wpsFile from "@/components/wpsFile";
export default {
  components: { jsonparseform, Customer, contentDetail, uptask, wpsFile },
  props: { parentmasterId: "", activeName: "", editOrSee: "" },
  data() {
    return {
      filterData: [],
      taskId: "",
      showUpTask: false,
      read: false,
      currFile: [],
      showFile: false,
      // 客户经理是否可见
      isManagerTableVisibleFlag: false,
      isAddTask: false,
      isDisabled: false,
      seeOrHideDetailValue: true,
      // 查看哪些表单
      checkedCities: [],
      content: "",
      title: "",
      isShowContent: false,
      // 客户类型
      customerTypeList: [],
      // b保存用户权限
      jurisdictionForm: {
        customerId: "",
        privType: "",
        departId: "",
        departIdArr: "",
        userName: "",
        userId: "",
        detailList: []
      },
      //分配还是共享
      shareOrDistribution: "",
      shareInfomationData: [],
      shareOrDistributionId: "",
      // 部门
      options: [],
      // 信息分配/共享弹窗
      infomationShareDialog: false,
      // 信息分配表头
      tabClounm: [],
      shareTable: [],
      //   信息共享
      ShareTabClounm: [],
      ShareTabDate: [],
      // 任务情况
      taskList: [],
      // 查看更多
      seeMoreList: false,
      seeMoreListData: {},
      // 省级市级地区列表
      provinceAreaList: [],
      cityAreaList: [],
      districtAreaList: [],
      // 客服ID
      showDetailTable: true,
      masterId: "",
      itemId: "",
      // 动态表单JSON
      TableJson: "111",
      TableJsonShow: false,
      FileTableJson: "",
      // 细表ID
      listId: "",
      // 单位属性
      UnitProperties: [],
      customBaseInfoForm: {
        customerType: "",
        customerName: "",
        customerSource: "",
        areaCode: "",
        provinceAreaCode: "",
        cityAreaCode: "",
        districtAreaCode: "",
        schoolLevel: "",
        schoolNature: "",
        schoolAttributes: [],
        schoolWebsite: "",
        shcoolWeixin: "",
        customerEstablishDate: "",
        annual: "",
        stuNum: "",
        majorNum: "",
        customerDesc: "",
        status: "",
        address: ""
      },
      //   字典列表
      customerSource: [],
      schoolNature: [],
      schoolAttributes: [],
      customerStatus: [],
      universityCradation: [],
      //   年份
      yearList: [],
      params: {
        pageNum: 1,
        pageSize: 10,
        queryEntityDto: {
          baseQueryDtoList: [],
          orderByStr: ""
        }
      },
      paramsOther: {
        columnValue: "0"
      },
      pageSizeList: [],
      restaurants: [],
      state: "",
      timeout: null,
      tableList: [],
      rules: {
        customerType: [
          { required: true, message: "客户类型不能为空", trigger: "change" }
        ],
        customerName: [
          { required: true, message: "客户名称不能为空", trigger: "change" }
        ],
        customerSource: [
          { required: true, message: "客户来源不能为空", trigger: "change" }
        ],
        schoolLevel: [
          { required: true, message: "办学层次不能为空", trigger: "change" }
        ],
        schoolNature: [
          { required: true, message: "单位性质不能为空", trigger: "change" }
        ],
        category: [
          { required: true, message: "审批类别不能为空", trigger: "change" }
        ],
        approveType: [
          { required: true, message: "审批类型为空", trigger: "change" }
        ],
        subject: [
          { required: true, message: "审批主题不能为空", trigger: "change" }
        ],
        deadlineTime: [
          { required: true, message: "截止时间不能为空", trigger: "change" }
        ],
        assignPersonList: [
          { required: true, message: "指派对象不能为空", trigger: "change" }
        ],
        category: [
          { required: true, message: "审批类别不能为空", trigger: "change" }
        ],
        approveType: [
          { required: true, message: "审批类型为空", trigger: "change" }
        ],
        subject: [
          { required: true, message: "审批主题不能为空", trigger: "change" }
        ],
        deadlineTime: [
          { required: true, message: "截止时间不能为空", trigger: "change" }
        ],
        assignPersonList: [
          { required: true, message: "指派对象不能为空", trigger: "change" }
        ]
      }
    };
  },
  beforeDestroy() {
    this.masterId = "";
  },
  mounted() {
    this.isManagerTableVisible();
    // 获取客户列表
    this.getCustomerList();
    // this.getCustomerList();
    this.listColumn(
      "d_oa",
      "rec_customer_detail",
      "information_distribution",
      "信息分配"
    );
    this.listColumn(
      "d_oa",
      "rec_customer_detail",
      "information_share",
      "信息共享"
    );
    this.getProvince();
    this.listDictBasicObjByName("CUSTOMER_SOURCE");
    this.listDictBasicObjByName("SCHOOL_NATURE");
    this.listDictBasicObjByName("SCHOOL_ATTRIBUTES");
    this.listDictBasicObjByName("CUSTOMER_STATUS");
    this.listDictBasicObjByName("UNIVERSITY_GRADATION");
    this.listDictBasicObjByName("CUSTOMER_DATA_ANNUAL");
    this.listDictBasicObjByName("CUSTOMER_TYPE");
    if (this.$props.parentmasterId != "") {
      this.masterId = this.$props.parentmasterId;
      this.listWithLabel();
      // 获取任务列表
      this.listTaskByCustomer();
      this.getInfomationShare(1);
      this.getInfomationShare(2);
    }
  },
  methods: {
    // 合作进展编辑
    async seehezuojinzhan(id) {
      this.taskId = id;
      this.showUpTask = true;
    },
    // 细表文件预览下载
    downLoad(ob) {
      let params = {
        name: ob.name,
        url: ob.url,
        fileId: ob.fileId,
        preview: ob.preview,
        extendId: ob.extendId,
        fileName: ob.name,
        fileType: ob.fileType
      };
      this.currFile = [params];
      this.showFile = true;
    },
    // 判断当前用户是否可见客户经理列表
    async isManagerTableVisible() {
      const d = await this.post(this.$api.customer.isManagerTableVisible);
      if (d.code === 0) {
        this.isManagerTableVisibleFlag = d.data.managerTableVisibleFlag;
      }
    },
    // 关闭按钮
    close() {
      this.$emit("close");
    },
    // 删除细表
    async delAjax(id, type) {
      if (type == "infomation") {
        const d = await this.post(this.$api.customer.deleteDetailInfomation, {
          id: id
        });
        if (d.code === 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getInfomationShare(1);
          this.getInfomationShare(2);
        }
      } else {
        const d = await this.post(this.$api.customer.deleteDetail, {
          id: id
        });
        if (d.code === 0) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.listWithLabel();
        }
      }
    },
    del(id, type) {
      this.$confirm("删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delAjax(id, type);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    seeOrHideDetail() {
      this.seeOrHideDetailValue = !this.seeOrHideDetailValue;
    },
    // 查看或隐藏细表
    seeDetailTable(val) {},
    // 查看任务内容详情
    showContent(row) {
      this.content = row.content;
      this.title = row.name;
      this.isShowContent = true;
    },
    //   选择年份返回总量
    async changeYear() {
      if (this.masterId != "" && this.customBaseInfoForm.annual != "") {
        const d = await this.post(this.$api.customer.changeYear, {
          customerId: this.masterId,
          annual: this.customBaseInfoForm.annual
        });
        if (d.code === 0) {
          this.customBaseInfoForm.stuNum = d.data.stuNum;
          this.customBaseInfoForm.majorNum = d.data.majorNum;
        }
      }
    },
    //   信息共享编辑
    ShareInfomationEdit(type, id) {
      this.shareOrDistributionId = id;
      this.shareOrDistribution = type;
      this.getInfomationDetail(id);
      this.listDepartmentAndUser();
      this.isDisabled = true;
      this.infomationShareDialog = true;
    },
    test(data) {
      this.jurisdictionForm.departIdArr = data;
      this.jurisdictionForm.departId = data.slice(-2)[0];
      this.jurisdictionForm.userId = data.slice(-1)[0];
    },
    async save() {
      let data = this.jurisdictionForm.departIdArr;
      this.jurisdictionForm.privType = this.shareOrDistribution;
      this.jurisdictionForm.customerId = this.masterId;
      this.jurisdictionForm.departId = data.slice(-2)[0];
      this.jurisdictionForm.userId = data.slice(-1)[0];
      this.shareInfomationData.forEach(item => {
        this.jurisdictionForm.detailList.push({
          customDetailId: item.id,
          telephonePriv: item.telephonePriv,
          addressPriv: item.addressPriv
        });
      });
      const d = await this.post(this.$api.customer.addOrEditUserInfomation, {
        ...this.jurisdictionForm
      });
      if (d.code === 0) {
        this.isDisabled = false;
        this.infomationShareDialog = false;
        this.jurisdictionForm.detailList = [];
        this.getInfomationShare(this.shareOrDistribution);
      }
    },
    //   查看更多
    async seeMore(ob) {
      const d = await this.post("/oa-boot/customerItem/list", {
        columnFlag: "1"
      });
      if (d.code === 0) {
        d.data.forEach(item => {
          if (ob.itemName == item.name) {
            this.seeMoreListData.params = item;
          }
        });
      }
      this.seeMoreListData.masterId = this.masterId;
      this.seeMoreList = true;
    },
    // 获取部门
    async listDepartmentAndUser() {
      const d = await this.post(this.$api.home.listDepartmentAndUser);
      if (d.code === 0) {
        this.options = d.data;
      }
    },
    //   获取省份
    async getProvince() {
      const d = await this.post(this.$api.policy.getArea, {
        parentShortCode: "0"
      });
      if (d.code === 0) {
        this.provinceAreaList = d.data;
      }
    },
    // 改变省份
    async changeProvince() {
      const d = await this.post(this.$api.policy.getArea, {
        parentShortCode: this.customBaseInfoForm.provinceAreaCode
      });
      if (d.code === 0) {
        this.cityAreaList = d.data;
        this.customBaseInfoForm.cityAreaCode = "";
        this.customBaseInfoForm.districtAreaCode = "";
      }
    },
    // 改变市区
    async changeCity() {
      const d = await this.post(this.$api.policy.getArea, {
        parentShortCode: this.customBaseInfoForm.cityAreaCode
      });
      if (d.code === 0) {
        this.districtAreaList = d.data;
      }
    },
    async listDictBasicObjByName(dictName) {
      const d = await this.post(this.$api.policy.listDictBasicObjByName, {
        dictName: dictName
      });
      if (d.code === 0) {
        if (dictName === "CUSTOMER_SOURCE") {
          this.customerSource = d.data;
        } else if (dictName === "SCHOOL_NATURE") {
          this.schoolNature = d.data;
        } else if (dictName === "SCHOOL_ATTRIBUTES") {
          this.schoolAttributes = d.data;
        } else if (dictName === "CUSTOMER_STATUS") {
          this.customerStatus = d.data;
        } else if (dictName === "UNIVERSITY_GRADATION") {
          this.universityCradation = d.data;
        } else if (dictName === "CUSTOMER_DATA_ANNUAL") {
          this.yearList = d.data;
        } else if (dictName === "CUSTOMER_TYPE") {
          this.customerTypeList = d.data;
        }
      }
    },
    getChildren(params) {
      this.TableJsonShow = params;
      this.listId = "";
      this.listWithLabel();
    },
    // 编辑列表数据
    async editTableData(data, id, list) {
      this.listId = list.id;
      const d = await this.post(this.$api.customer.GetiJson, {
        filedMasterId: data
      });
      if (d.code === 0) {
        if (id == 5) {
          this.FileTableJson = d.data;
          this.TableJson = d.data2;
        } else {
          this.TableJson = d.data2;
        }
        this.itemId = id;
        this.TableJsonShow = true;
      }
    },
    //   添加列表数据
    async addTableData(data, id) {
      this.listId = "";
      const d = await this.post(this.$api.customer.GetiJson, {
        filedMasterId: data
      });
      if (d.code === 0) {
        if (id == 5) {
          this.FileTableJson = d.data;
          this.TableJson = d.data2;
        } else {
          this.TableJson = d.data2;
        }
        this.itemId = id;
        this.TableJsonShow = true;
      }
    },
    //   获取列表级表头
    async listWithLabel() {
      const d = await this.post(this.$api.customer.getcustomerv2, {
        id: this.masterId
      });
      if (d.code === 0) {
        this.tableList = d.data.list;
        if (this.$route.name == "manager") {
          this.checkedCities.push("合作进展");
          this.checkedCities.push("合作状态");
          this.checkedCities.push("合作意向");
          this.checkedCities.push("沟通日报");
          this.checkedCities.push("往来文件");
          this.checkedCities.push("款项明细");
        } else if (
          this.$route.name != "manager" &&
          this.$props.activeName != "客户档案"
        ) {
          this.checkedCities.push(this.$props.activeName);
        } else {
          this.tableList.forEach(item => {
            this.checkedCities.push(item.itemName);
          });
          this.checkedCities.push("合作进展");
          this.checkedCities.push("信息分配");
          this.checkedCities.push("信息共享");
        }
        if (d.data.id) {
          this.customBaseInfoForm = d.data;
          // console.log(this.customBaseInfoForm.schoolAttributes)
          if (this.customBaseInfoForm.schoolAttributes == null) {
            this.customBaseInfoForm.schoolAttributes = [];
          }
          // 获取市区
          const c = await this.post(this.$api.policy.getArea, {
            parentShortCode: this.customBaseInfoForm.provinceAreaCode
          });
          if (c.code === 0) {
            this.cityAreaList = c.data;
            const e = await this.post(this.$api.policy.getArea, {
              parentShortCode: this.customBaseInfoForm.cityAreaCode
            });
            if (e.code === 0) {
              this.districtAreaList = e.data;
            }
          }
        }
      }
    },
    // 获取客户列表
    async getCustomerList() {
      const d = await this.post(
        "/basics-boot//university/listNameByUniversityName",
        {
          // universityName: "大学"
        }
      );
      if (d.code === 0) {
        this.restaurants = d.data;
      }
    },
    //   客户名称搜索
    querySearchAsync(queryString, cb) {
      if (this.customBaseInfoForm.customerType != 1) {
        cb([]);
        return;
      } else {
        var restaurants = this.restaurants;
        restaurants.forEach(item => {
          item.value = item.universityName;
        });
        var results = queryString
          ? restaurants.filter(this.createStateFilter(queryString))
          : restaurants;
        cb(results);
      }
    },
    createStateFilter(queryString) {
      return state => {
        // console.log(state, "11124");
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {},
    //保存客户基本信息
    async sveCustomBaseInfo() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const d = await this.post(this.$api.customer.addOrEditCustomer, {
            ...this.customBaseInfoForm
          });
          if (d.code === 0) {
            if (this.masterId != "") {
              this.$message({
                message: "保存成功",
                type: "success"
              });
            } else {
              this.masterId = d.data.id;
              this.listWithLabel();
              this.getInfomationShare();
            }
          }
        }
      });
    },
    // 获取信息分配表头
    async listColumn(a, b, c, cloumnName) {
      const d = await this.post(this.$api.common.listColumn, {
        columnFlag: 0,
        dbName: a,
        tableName: b,
        moduleName: c
      });
      if (d.code === 0) {
        if (cloumnName == "信息分配") {
          this.tabClounm = d.data;
        } else if (cloumnName == "信息共享") {
          this.ShareTabClounm = d.data;
        }
      }
    },
    async getInfomationTable() {},
    // 获取信息分配，信息共享
    async getInfomationShare(type) {
      const d = await this.post(this.$api.customer.getInfomationShare, {
        customerId: this.masterId,
        privType: type
      });
      if (d.code === 0) {
        if (type == 1) {
          this.shareTable = d.data;
        } else if (type == 2) {
          this.ShareTabDate = d.data;
        }
      }
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    uniqueobj(arr) {
      let obj = {};
      let peon = arr.reduce((cur, next) => {
        obj[next.value] ? "" : (obj[next.value] = true && cur.push(next));
        return cur;
      }, []);
      return peon;
    },
    filterHandler(text, row, column) {
      const property = column["property"];
      return row[property] === text;
    },
    // 获取任务列表
    async listTaskByCustomer() {
      const d = await this.post(this.$api.customer.listTaskByCustomer, {
        customerId: this.masterId
      });
      if (d.code === 0) {
        this.taskList = d.data;
        this.taskList.forEach(item => {
          this.filterData.push({
            text: item.engineeringName,
            value: item.engineeringName
          });
        });
        this.filterData = this.uniqueobj(this.filterData);
      }
    },
    // 获取联系人权限详情
    async getInfomationDetail(id) {
      const d = await this.post(this.$api.customer.getInfomationDetail, {
        id: id,
        customerId: this.masterId
      });
      if (d.code === 0) {
        this.shareInfomationData = d.data.list;
        this.jurisdictionForm.departIdArr = d.data.departIdArr;
      }
    },
    // 修改用户信息权限
    async addInfomation(type) {
      this.isDisabled = false;
      this.shareOrDistribution = type;
      this.getInfomationDetail();
      this.listDepartmentAndUser();
      this.infomationShareDialog = true;
    },
    // 添加任务
    addtask() {
      this.isAddTask = true;
    }
  }
};
</script>

<style lang='scss' scoped>
.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: -10px;
  top: -32px;
}
.all {
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.ssq {
  display: flex;
  .el-select {
    margin-right: 3px;
  }
}
.sveCustomBaseInfoBtn {
  text-align: right;
  position: absolute;
  right: 6px;
  top: 0px;
}
.eachTable {
  margin-top: 40px;
  // border: 1px solid #cccccc;
}
.TableTitle {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-left: 3px solid #409eff;
  background: #fafafa;
  // border-bottom: 3px solid #409eff;
}
/deep/ .el-dialog__body {
  padding: 0 !important;
  margin-top: 20px;
}
.btnWarp {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
/deep/ .el-checkbox-group {
  font-size: 0;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.seeDetail {
  padding: 0 10px;
  height: 38px;
  line-height: 38px;
  background: #f2f2f2;
  border-left: 3px solid #409eff;
  display: flex;
  margin-bottom: 20px;
}
/deep/ .el-select {
  width: 100%;
}
.el-form-item__label {
  font-size: 13px !important;
}
</style>
