const state = {
  data: {
    token:''
  },
};
export default{
  state,
  mutations:{
    setToken(state, obj) {
      state.data = { ...obj };
    },
  },
  actions:{
    setToken({ commit }, obj) {
      commit('setToken', obj)
    },
  },
}
