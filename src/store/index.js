import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import menu from './menu'
import userInfo from './userInfo'
import error from './error'
import history from './history'
import search from './search'
import token from './token'
import message from './message'
import btns from './btns'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    menu,
    userInfo,
    error,
    history,
    search,
    message,
    token,
    btns
  }
})
