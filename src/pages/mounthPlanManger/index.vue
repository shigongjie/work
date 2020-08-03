<template>
  <div>
    <el-card>
      <el-tabs v-model="currentTab" class="tab-container">
        <el-tab-pane v-for="(item,index) in tabList" :key="index" :name="item.name">
          <span slot="label">
            <el-badge :hidden="item.count ===0 " :value="item.count" class="item">
              <span>{{item.label}}</span>
            </el-badge>
          </span>
          <component :is="item.name"></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// import list from "./components/list";
// import record from "./components/record";
export default {
  components: {
    list,
    record
  },
  data() {
    return {
      currentTab: "list",
      tabList: [
        { label: "月计划列表", name: "list" },
        { label: "报送记录", name: "record" }
      ]
    };
  },
  mounted() {},
  methods: {
    async getList() {}
  }
};
</script>

<style lang="scss" scoped>
</style>