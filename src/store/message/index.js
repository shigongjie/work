const state = {
  data: {},
};
export default {
  state,
  mutations: {
    setMessage(state, obj) {
      state.data = { ...obj };
    },
  },
  actions: {
    setMessage({ commit }, obj) {
      commit('setMessage', obj)
    },
  },
}
