const state = {
    data:{}
};
export default {
    state,
    mutations: {
        setSearch(state, obj) {
            state.data = { ...obj };
        },
    },
    actions: {
        setSearch({ commit }, obj) {
            commit('setSearch', obj)
        },
    },
}
