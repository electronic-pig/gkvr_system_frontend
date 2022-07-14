import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    showRegisterDialog: false,
    showSelectDialog: false,
    isLogin: '',
  },
  getters: {},
  mutations: {
    showRegisterDialog(state) {
      state.showRegisterDialog = true;
    },
    closeRegisterDialog(state) {
      state.showRegisterDialog = false;
    },
    showSelectDialog(state) {
      state.showSelectDialog = true;
    },
    closeSelectDialog(state) {
      state.showSelectDialog = false;
    }
  },
  actions: {},
  modules: {}
})