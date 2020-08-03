const state = {
  errorMsg: '',
  navIndex: -1
};
export default{
  state,
  mutations:{
    setError(state, { msg, index }) {
      state.errorMsg = msg;
      state.navIndex = index;
    },
  },
}
