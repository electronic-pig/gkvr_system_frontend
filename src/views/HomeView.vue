<template>
  <div class="tabs">
    <!-- Active tab -->
    <div class="tabs__tab--active">
      <br />
    </div>
    <!-- Inactive tab -->
    <div class="tabs__tab--inactive">
      <br />
    </div>
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
  setup() {
  }
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
  /* display:inline-block; */
  text-align: center;
}

.el-main {
  padding: 0 !important;
  /* height: calc(100%-50px); */
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  flex-grow: 1;
}
</style>