import { createStore } from 'vuex'

export default createStore({
  state: {
    showRegisterDialog: false,
    showSelectDialog: false,
    showMajorSelect: false,
    schoolId: '',
    isLogin: '',
  },
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
    },
    showMajorSelect(state, schoolId) {
      state.schoolId = schoolId;
      state.showMajorSelect = true;
    },
    closeMajorSelect(state) {
      state.showMajorSelect = false;
    }
  },
  getters: {},
  actions: {},
  modules: {}
})