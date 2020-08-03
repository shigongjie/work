<template>
  <div style="height:612px">
    <div style="text-align:center">
      <el-button
        type="primary"
        size="small"
        class="addBtn"
        v-if="treeData.length>0"
        @click="$emit('getList',{ id:-1,departmentName:'全部成员'})"
      >全部成员</el-button>
    </div>
    <div v-if="treeData.length>0">
      <el-tree
        ref="tree"
        :props="defaultProps"
        :data="treeData"
        accordion
        :current-node-key="1"
        node-key="id"
        :highlight-current="true"
        @node-contextmenu="rightClick"
        @node-click="nodeClick"
        :render-content="renderContent"
      ></el-tree>
    </div>
    <el-button
      type="primary"
      size="small"
      v-if="isEmtry&&treeData.length===0"
      @click="showList = true;treeType=0;"
      class="addBtn"
    >添加部门</el-button>
    <div v-show="menuVisible">
      <ul id="menu" class="menu">
        <li class="menu__item" @click="showList = true;treeType=0">
          <i class="el-icon-circle-plus-outline"></i>
          <span>平级添加</span>
        </li>
        <li class="menu__item" @click="upDepartment">
          <i class="el-icon-edit-outline"></i>
          <span>编辑</span>
        </li>
        <li class="menu__item" @click="showList = true;treeType=1">
          <i class="el-icon-circle-plus-outline"></i>
          <span>添加子部门</span>
        </li>
        <li class="menu__item red" @click="remSpatial">
          <i class="el-icon-delete"></i>
          <span>删除</span>
        </li>
      </ul>
    </div>
    <el-dialog
      :title="treeType===1||treeType===0?'添加部门':'编辑部门'"
      :visible.sync="showList"
      :before-close="()=>{name='',showList=false}"
      width="420px"
    >
      <div style="margin-bottom:20px;">
        <p class="title">请输入部门名称</p>
        <el-input v-model="name"></el-input>
      </div>
      <div slot="footer">
        <el-button class="btns" @click="name='',showList=false" size="small">取消</el-button>
        <el-button class="btns" @click="addOrEditDepartment" type="primary" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      name: "",
      showList: false,
      menuVisible: false,
      currNode: "",
      treeType: "",
      treeData: [],
      isEmtry: false,
      defaultProps: {
        children: "childrenDList",
        label: "departmentName"
      }
    };
  },
  created() {
    this.listDepartment();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span style="font-size:14px">
            {node.label}({data.memberCount})
          </span>
        </span>
      );
    },
    upDepartment() {
      this.showList = true;
      this.treeType = 2;
      this.name = this.currNode.departmentName;
    },
    nodeClick(obj, Node, el) {
      this.$emit("getList", obj);
    },
    async listDepartment() {
      const d = await this.post(this.$api.mail.listDepartment);
      if (d.code === 0) {
        this.treeData = d.data;
        if (this.treeData && this.treeData.length > 0) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.treeData[0]);
          });
          this.$emit("getList", this.treeData[0]);
        }
        this.isEmtry = true;
      }
    },
    rightClick(MouseEvent, object, Node, element) {
      // 鼠标右击触发事件
      this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
      var menu = document.querySelector("#menu");
      menu.style.left = MouseEvent.clientX + "px";
      menu.style.top = MouseEvent.clientY + "px";
      document.addEventListener("click", this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
      this.currNode = object;
      this.Node = Node;
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false;
      document.removeEventListener("click", this.foo); // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
    },
    async addOrEditDepartment() {
      const d = await this.post(this.$api.mail.addOrEditDepartment, {
        departmentName: this.name,
        departmentId:
          this.treeType === 1 || this.treeType === 0
            ? ""
            : this.currNode.id + "",
        departmentParentId: this.treeType === 0 ? "0" : this.currNode.id + ""
      });
      if (d.code === 0) {
        this.listDepartment();
        this.showList = false;
        this.name = "";
      }
    },
    remSpatial() {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delDepartment();
      });
    },
    async delDepartment() {
      const d = await this.post(this.$api.mail.delDepartment, {
        departmentId: this.currNode.id + ""
      });
      if (d.code === 0) {
        this.listDepartment();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.menu__item {
  display: block;
  text-align: center;
}
.title {
  font-size: 14px;
  color: #999999;
  margin-bottom: 15px;
}
.menu {
  width: 130px;
  height: 160px;
  cursor: pointer;
  position: fixed;
  font-size: 14px;
  z-index: 3;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0px 2px 22px #cecece;
  li {
    height: 40px;
    display: flex;
    align-items: center;
    i {
      font-size: 18px;
      margin: 17px;
    }
  }
  .red {
    color: #d12020;
  }
}
li:hover {
  background-color: #e7f3fd;
  color: #0f88eb;
}

.el-tree-node {
  height: 40px !important;
  background: red;
}
.el-tree {
  div {
    height: 40px !important;
    background: red;
  }
}
.addBtn {
  width: 160px;
  color: #0f88eb;
  height: 36px;
  background: #e6f1fc;
  margin-bottom: 15px;
}
</style>
