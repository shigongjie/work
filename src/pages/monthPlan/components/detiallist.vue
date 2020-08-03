<template>
  <div>
    <el-tree
      :data="data"
      :show-checkbox="false"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :props="defaultProps"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => append(data)">新增任务</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">删除任务</el-button>
        </span>
      </span>
    </el-tree>
      <uptask
        :value.sync="showUpTask"
        @getList="getList"
        :businessType="'任务'"
        :taskId="id"
        @setTaskId="setId"
      />
  </div>
</template>

<script>
import uptask from "../../projectProgress/compontents/upTask";
export default {
  props: { editData: "" },
  components: { uptask },
  data() {
    return {
      id: "",
      showUpTask: false,
      data: [],
      defaultProps: {
        label: "name",
        children: "childrenNode"
      },
      params: ""
    };
  },
  mounted() {
    this.data = this.$props.editData;
  },
  watch: {
    editData(val) {
      this.data = val;
    //   console.log(val);
    }
  },
  methods: {
    getList() {},
    setId() {},
    remove() {},
    append() {
        this.showUpTask = true;
    },
    handleNodeClick() {}
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node__content {
  padding: 25px 5px;
}
.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  span:nth-child(1) {
    display: flex;
    align-items: center;
  }
}
</style>