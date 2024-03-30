<template>
  <div class="search-header">
    <div class="search-box">
      <el-input
        class="handle-input"
        placeholder="输入专业名称"
        v-model="searchValue"
        @keyup.enter="handleSearch"
      ></el-input>
      <el-button type="primary" @click="handleSearch">
        <el-icon> <Search /> </el-icon>搜索</el-button
      >
    </div>
    <el-radio-group v-model="majorClass" size="large">
      <el-radio-button label="本科" value="本科" />
      <el-radio-button label="专科(高职)" value="专科(高职)" />
    </el-radio-group>
  </div>
  <el-radio-group
    v-model="type"
    size="large"
    @change="getSortedMajors"
    style="margin: 0 3vw"
  >
    <el-radio
      v-for="item in majorTypeList"
      :key="item"
      :label="item"
      :value="item"
    />
  </el-radio-group>
  <div class="content">
    <div class="major-list">
      <ul>
        <li v-for="major in majorList" :key="major.id">
          <el-card class="majorCard" shadow="hover">
            <div class="major_list_title">{{ major.majorName }}</div>
            <div class="major_list_tags">
              <span>专业代码：{{ major.majorCode }}</span
              >&nbsp;|&nbsp; <span>类别：{{ major.typeId }}</span
              >&nbsp;|&nbsp; <span>修业年限：{{ major.years }}</span
              >&nbsp;|&nbsp;
              <span>授予学位：{{ major.degree }}</span>
            </div>
          </el-card>
        </li>
      </ul>
    </div>
    <div class="heat-rank">
      <el-card class="rankCard" shadow="hover">
        <template #header>
          <h2 style="text-align: center; margin: 0 auto">专业热度</h2>
        </template>
        <ul>
          <li
            v-for="(item, index) in majorRankList"
            :key="index"
            class="heat-item"
          >
            <span
              v-if="index == 0"
              class="badge"
              style="color: #fff; background: #da1d1d"
              >{{ index + 1 }}</span
            >
            <span
              v-if="index == 1"
              class="badge"
              style="color: #fff; background: #fc6639"
              >{{ index + 1 }}</span
            >
            <span
              v-if="index == 2"
              class="badge"
              style="color: #fff; background: #f6b759"
              >{{ index + 1 }}</span
            >
            <span
              v-if="(index !== 0) & (index !== 1) & (index !== 2)"
              class="badge"
              style="color: #999; background: #eee"
              >{{ index + 1 }}</span
            >
            <span class="major-name">{{ item.major }}</span>
            <span class="heat-value">{{ item.heat }}</span>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
  <el-pagination
    class="pagination"
    background
    v-model:current-page="pageNum"
    :total="total"
    layout="prev, pager, next, jumper"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import request from "@/utils/request.js";
import majorTypeList from "@/assets/majorTypeList.json";
import majorRankList from "@/assets/majorRankList.json";

const searchValue = ref("");
const majorClass = ref("本科");
const type = ref("全部");
const pageNum = ref(1);
const total = ref(0);
const majorList = ref([]);

watch(type, () => {
  pageNum.value = 1;
});

const handleSearch = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  type.value = "全部";
  try {
    const response = await request.get(
      "/majorInfo/searchByName?page=" +
        pageNum.value +
        "&majorName=" +
        searchValue.value
    );
    if (response.code == 200) {
      total.value = response.data.total;
      majorList.value = response.data.majors;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const getSortedMajors = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  searchValue.value = "";
  try {
    const response = await request.get(
      "/majorInfo/getSortedMajors?page=" + pageNum.value + "&type=" + type.value
    );
    if (response.code == 200) {
      total.value = response.data.total;
      majorList.value = response.data.majors;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const handleCurrentChange = (newPage) => {
  pageNum.value = newPage;
  if (searchValue.value) handleSearch();
  else getSortedMajors();
};

onMounted(getSortedMajors);
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

.content {
  display: flex;
}

.major-list {
  flex: 7;
}

.heat-rank {
  flex: 3;
  margin-top: 20px;
  margin-left: 10px;
}

ul {
  justify-content: center;
  padding-inline-start: 0;
}

li {
  list-style-type: none;
}

.majorCard {
  padding: 0;
  margin: 10px auto;
  height: 80px;
  border-radius: 10px;
  text-align: center;
}

.majorCard:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(250, 250, 250);
  cursor: pointer;
}

.majorCard :deep(.el-card__body) {
  padding: 0;
}

.major_list_title {
  font-size: 20px;
  font-weight: bold;
  margin: 10px auto;
  transition: all 0.4s;
}

.major_list_title:hover {
  color: var(--theme--color);
  cursor: pointer;
}

.rankCard {
  border-radius: 10px;
}

.rankCard :deep(.el-card__body) {
  padding: 0 20px;
}

.heat-item {
  display: flex;
  align-items: center;
  margin: 20px 0;
  cursor: pointer;
}

.major-name {
  font-size: 16px;
  font-weight: bold;
  margin-left: 4px;
}

.heat-value {
  font-size: 18px;
  color: rgb(237, 33, 33);
  margin-left: auto;
}

.badge {
  width: 20px;
  height: 20px;
  font-size: 15px;
  text-align: center;
  line-height: 20px;
  overflow: hidden;
  font-weight: normal;
  margin-right: 3px;
}

.pagination {
  justify-content: center;
}
</style>
