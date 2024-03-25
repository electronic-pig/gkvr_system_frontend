<template>
  <div class="search-header">
    <div class="search-box">
      <el-input
        class="handle-input"
        placeholder="输入学校名称"
        v-model="schoolName"
        @keyup.enter="handleSearch"
      ></el-input>
      <el-button type="primary" @click="handleSearch">
        <el-icon> <Search /> </el-icon>搜索</el-button
      >
    </div>
    <el-radio-group v-model="schoolClass" size="large" @change="getSchoolList">
      <el-radio-button label="全部" value="全部" />
      <el-radio-button label="985" value="985" />
      <el-radio-button label="211" value="211" />
      <el-radio-button label="双一流" value="双一流" />
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElLoading } from "element-plus";

let schoolName = ref("");
let schoolClass = ref("全部");

const handleSearch = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });

  loadingInstance.close();
};
const getSchoolList = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });

  loadingInstance.close();
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-evenly;
  margin: 2vh auto;
  height: 40px;
}

.search-box {
  display: flex;
  width: 50%;
}

.handle-input {
  width: 40%;
}

.handle-input :deep(.el-input__wrapper) {
  border-radius: 4px 0 0 4px;
}

.el-button {
  height: 40px;
  border-radius: 0 4px 4px 0;
}
</style>
