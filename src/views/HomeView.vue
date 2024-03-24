<template>
  <el-container>
    <el-header>
      <CommonMenu />
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script>
import CommonMenu from "@/components/CommonMenu.vue";
export default {
  components: {
    CommonMenu,
  },
};
</script>
  
<style scoped>
.el-container {
  width: 70%;
  margin: auto;
  height: 100%;
}
</style>
