const state = {
  data: {
  },
};
export default {
  state,
  mutations: {
    setBtns(state, obj) {
      state.data = { ...obj };
    },
  },
  actions: {
    setBtns({ commit }, obj) {
      commit('setBtns', obj)
    },
  },
}
