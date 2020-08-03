<template>
  <div class="rightComponent">
    <p class="copier">抄送人</p>
    <div class="copiers userInfos">
      <div class="haedAndName" v-for="(items,indexs) in copierList" :key="indexs">
        <div>
          <div class="headSculpture">{{items.userName |filterName }}</div>
          <div v-if="isDemand!='查看'" class="deleteCurrent" @click="deleteCurrent('',indexs,'抄送')">
            <i class="el-icon-close"></i>
          </div>

          <div class="name">{{items.userName}}</div>
        </div>
      </div>
      <div class="haedAndName" v-if="isDemand!='查看'">
        <i class="el-icon-circle-plus-outline" @click="openConnectPeople('',copierList,'抄送')"></i>
      </div>
    </div>
    <el-dialog
      title="选择审批人"
      :visible.sync="isShowConnectPeopleDialog"
      width="684px"
      height="540px"
      append-to-body
    >
      <addconnectpeople
        v-if="isShowConnectPeopleDialog"
        @listenValue="ChildrenValue"
        @listenValueCopy="ChildrenValueCopy"
        :isShowConnectPeople="whichApprovedGroup"
        :businessType="this.$props.businessType"
      />
    </el-dialog>
  </div>
</template>

<script>
import addconnectpeople from "./addconnectpeople";
export default {
  props: {
    formValue: "",
    isDemand: "",
    copier: "",
    businessType: "",
    typeCode: ""
  },
  components: {
    addconnectpeople
  },
  name: "approved",
  data() {
    return {
      isShowConnectPeopleDialog: false,
      whichApprovedGroup: { index: "", group: [], type: "" },
      approvedGroup: [],
      copierList: [],
      options: [],
      copyPersonList: [],
      form: { copyPersonList: [] },
      copyData: "",
      returnedItem: ""
    };
  },
  watch: {
    approvedGroup() {
      this.$emit("approvedGroup", this.approvedGroup);
    },
    copierList() {
      this.$emit("copierList", this.copierList);
    },
    formValue() {
      this.approvedGroup = this.$props.formValue;
    },
    copier() {
      this.copierList = this.$props.copier;
    }
  },
  filters: {
    filterName(value) {
      if (value.toString().length >= 3) {
        return value.toString().substr(1);
      } else {
        return value;
      }
    }
  },
  mounted() {
      console.log(this.$props.copier)
    this.listDepartmentAndUser();
    if (this.$props.formValue) {
      this.approvedGroup = this.$props.formValue;
    }
    if (this.$props.copier) {
      this.copierList = this.$props.copier;
    }
  },
  methods: {
    showInput(name) {
      this[name] = true;
    },
    openConnectPeople(index, items, type) {
      this.whichApprovedGroup.index = index;
      this.whichApprovedGroup.group = items;
      this.whichApprovedGroup.Allgroup = this.approvedGroup;
      this.whichApprovedGroup.type = type;
      this.isShowConnectPeopleDialog = true;
    },
    addNewApprovedGroup() {
      this.approvedGroup.push({ members: [] });
    },
    ChildrenValueCopy(params) {
      this.isShowConnectPeopleDialog = params.isShowConnectPeopleDialog;
      this.copierList = params.copierList;
    },
    ChildrenValue(params) {
      this.isShowConnectPeopleDialog = params.isShowConnectPeopleDialog;
      this.approvedGroup[params.indexs] = { members: params.members };
    },
    removeAaary(_arr, _obj) {
      var length = _arr.length;
      for (var i = 0; i < length; i++) {
        if (_arr[i] == _obj) {
          if (i == 0) {
            _arr.shift(); //删除并返回数组的第一个元素
            return _arr;
          } else if (i == length - 1) {
            _arr.pop(); //删除并返回数组的最后一个元素
            return _arr;
          } else {
            _arr.splice(i, 1); //删除下标为i的元素
            return _arr;
          }
        }
      }
    },
    deleteCurrent(index, indexs, type) {
      if (type === "审批") {
        let Arr = [...this.approvedGroup];
        Arr[index].members.splice(indexs, 1);
        this.approvedGroup = Arr;
      } else if (type === "抄送") {
        let Arr = [...this.copierList];
        Arr.splice(indexs, 1);
        this.copierList = Arr;
      }
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
    find(arr, id) {
      arr.some(item => {
        if (item.value === id) {
          this.returnedItem = item;
          return item;
        } else if (item.children && item.children.length > 0) {
          this.find(item.children, id);
        }
      });
    }
  }
};
</script>

<style  lang="scss" scoped>
.approvedTitle {
  height: 30px;
  font-size: 14px;
  line-height: 30px;
  margin-top: 7px;
  margin-bottom: 20px;
}
.rightComponent {
  // border-left: 1px solid #ccc;
  flex: 1;
  padding-left: 10px;
  position: relative;
  max-height: 400px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  //滚动条的滑块
  &::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }
  .userInfos {
    display: flex;
    flex-wrap: wrap;
    .haedAndName {
      width: 50px;
      height: 60px;
      margin-right: 10px;
      margin-top: 25px;
      font-size: 13px;
      text-align: center;
      i {
        line-height: 40px;
        color: #0f88eb;
        font-size: 20px;
        margin-left: 3px;
      }
      .headSculpture {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: #0f88eb;
        margin: auto;
        line-height: 35px;
        color: white;
        text-align: center;
        font-size: 12px;
        position: relative;
      }
      .deleteCurrent:hover {
        opacity: 0.8;
        cursor: pointer;
      }
      .deleteCurrent {
        opacity: 0;
        position: absolute;
        background: #000000;
        width: 37px;
        height: 37px;
        border-radius: 50%;
        margin: auto;
        // line-height: 35px;
        // color: white;
        // text-align: center;
        // font-size: 13px;
        top: 0;
        left: 7px;
        i {
          color: white;
          margin-left: 0 !important;
        }
      }
      .agree {
        position: absolute;
        background: red;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        bottom: 0px;
        left: 26px;
      }
      .agrees {
        background: url("../../../assets/images/agree.png") no-repeat center;
      }
      .refuse {
        background: url("../../../assets/images/refuse.png") no-repeat center;
      }
    }
  }
  .addGroup {
    span {
      position: absolute;
      top: 10px;
      left: 28px;
    }
    i {
      line-height: 40px;
      color: #333333;
      font-size: 20px;
      margin-left: -4px;
    }
  }
  .copier {
    margin-top: 20px;
    font-size: 14px;
  }
  .copiers {
    padding-left: 28px;
  }
}
</style>