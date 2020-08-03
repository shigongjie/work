<template>
  <div class="role">
    <div class="wrap">
      <roleMenu @getList="getList"></roleMenu>
      <el-card class="right-page">
        <div class="head">
          <div>
            <span>|</span>
            <span style="margin-left:5px">角色菜单</span>
          </div>
        </div>
        <el-tree
          :data="data"
          ref="tree"
          show-checkbox
          node-key="id"
          default-expand-all
          @check="check"
          :default-checked-keys="menuIdList"
          :props="defaultProps"
        ></el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import roleMenu from "./components/roleMenu";
export default {
  components: { roleMenu },
  data() {
    return {
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: "9",
                  label: "三级 1-1-1"
                },
                {
                  id: "10",
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      roleAppCode: "",
      menuIdList: [],
      roleId: "",
      defaultProps: {
        children: "subMenuDto",
        label: "menuName"
      }
    };
  },
  mounted() {},
  methods: {
    //treeMenuByRole
    async getList(roleId, roleAppCode) {
      this.roleAppCode = roleAppCode;
      if (roleId) {
        this.roleId = roleId + "";
      } else {
        this.data = [];
        this.menuIdList = [];
        return;
      }
      const d = await this.post(this.$api.mail.treeMenuByRole, {
        roleAppCode: this.roleAppCode,
        roleId: this.roleId
      });
      if (d.code === 0) {
        this.data = d.data.treeDictMenuDtoList;
        this.menuIdList = d.data.menuIdList;
      }
    },
    async check(obj1, obj) {
      console.log(obj1,'1');
      console.log(obj,'0');
      const d = await this.post(this.$api.mail.updateRecRoleMenu, {
        childrenMenuIdList: obj.checkedKeys,
        parentMenuIdList: obj.halfCheckedKeys,
        roleId: this.roleId
      });
      if (d.code === 0) {
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.role {
  .wrap {
    display: flex;
    .right-page {
      flex: 1;
      .head {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        justify-content: space-between;
      }
    }
    .clounmTitle {
      color: #409eff;
      border-color: #409eff;
      width: 70px;
    }
  }
}
</style>