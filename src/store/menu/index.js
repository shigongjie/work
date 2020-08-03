const state = {
  //菜单默认选择路由
  isCollapse: false,
  activeMenu: {
    activeIndex: '',
    breadcrumbArr: [],
  },
};
export default {
  state,
  mutations: {
    setActiveRouter(state, obj) {
      state.activeMenu = { ...obj };
    },
    setIsCollapse(state, obj) {
      state.isCollapse = obj;
    },
  },
  actions: {
    setActiveRouter({ commit }, obj) {
      commit('setActiveRouter', obj)
    },
    setIsCollapse({ commit }, obj) {
      commit('setIsCollapse', obj)
    },
  },
}
