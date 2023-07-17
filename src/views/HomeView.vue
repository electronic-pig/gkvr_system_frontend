<template>
  <div>
    <br />
  </div>
  <el-container>
    <el-header>
      <common-menu></common-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
  <select-dialog></select-dialog>
</template>

<script>
import CommonMenu from "../components/CommonMenu.vue";
import SelectDialog from "../components/SelectDialog.vue"
export default {
  components: {
    CommonMenu,
    SelectDialog,
  },
}
</script>

<style scoped>
.el-container {
  width: 70%;
  margin: auto;
  height: 100%;
}

.el-header {
  padding: 0 !important;
  text-align: center;
}

.el-main {
  padding: 0 !important;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  flex-grow: 1;
}
</style>