const state = {
    data: {
        id: '',
        tableName: '',
        type:'',
        allotStatus:''
    },
};
export default {
    state,
    mutations: {
        setHistory(state, obj) {
            state.data = { ...obj };
        },
    },
    actions: {
        setHistory({ commit }, obj) {
            commit('setHistory', obj)
        },
    },
}
