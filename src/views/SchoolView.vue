<template>
  <div class="search-header">
    <div class="search-box">
      <el-input
        class="handle-input"
        placeholder="输入学校名称"
        v-model="searchValue"
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
  <div class="content">
    <div class="school-list">
      <ul>
        <li v-for="school in schoolList" :key="school.schoolId">
          <el-card class="schoolCard" shadow="hover">
            <div class="school-info">
              <div class="school-image">
                <el-image
                  :src="
                    'https://static-data.gaokao.cn/upload/logo/' +
                    school.schoolId +
                    '.jpg'
                  "
                  style="width: 100px; height: 100px"
                  alt="school-logo"
                />
              </div>
              <div class="school-detail">
                <p>{{ school.schoolName }}</p>
                <span v-if="school.degree">{{ school.degree }}</span>
                <span v-if="school.schoolType"
                  >&nbsp;|&nbsp;{{ school.schoolType }}</span
                >
                <span v-if="school.owner">&nbsp;|&nbsp;{{ school.owner }}</span>
                <span v-if="school.provinceName"
                  >&nbsp;|&nbsp;{{ school.provinceName }}</span
                >
                <span v-if="school.cityName"
                  >&nbsp;|&nbsp;{{ school.cityName }}</span
                >
                <span v-if="school.countyName"
                  >&nbsp;|&nbsp;{{ school.countyName }}</span
                >
                <span v-if="school.doublehigh"
                  >&nbsp;|&nbsp;{{ school.doublehigh }}</span
                >
                <span v-if="school.is985 !== 0"
                  >&nbsp;|&nbsp;{{ school.is985 }}</span
                >
                <span v-if="school.is211 !== 0"
                  >&nbsp;|&nbsp;{{ school.is211 }}</span
                >
              </div>
            </div>
          </el-card>
        </li>
      </ul>
    </div>
    <div class="heat-rank">
      <el-card class="rankCard" shadow="hover">
        <template #header>
          <h1 style="text-align: center; margin: 0 auto">院校热度</h1>
        </template>
        <ul>
          <li v-for="(item, index) in RankList" :key="index" class="heat-item">
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
            <span class="school-name">{{ item.school }}</span>
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
    :page-size="10"
    layout="prev, pager, next, jumper"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import request from "@/utils/request.js";

let searchValue = ref("");
let schoolClass = ref("全部");
let pageNum = ref(1);
let total = ref(0);
let schoolList = ref([]);
const RankList = ref([
  { school: "厦门大学", heat: "4207.5w" },
  { school: "四川大学", heat: "3392.5w" },
  { school: "武汉大学", heat: "2709.3w" },
  { school: "中山大学", heat: "2616.1w" },
  { school: "清华大学", heat: "2428.9w" },
  { school: "北京大学", heat: "2363.5w" },
  { school: "中南大学", heat: "2337.5w" },
  { school: "南京大学", heat: "2307.9w" },
  { school: "西南大学", heat: "2280.7w" },
  { school: "电子科技大学", heat: "2143w" },
  { school: "山东大学", heat: "1959.9w" },
  { school: "华中科技大学", heat: "1941w" },
  { school: "重庆大学", heat: "1926.2w" },
  { school: "湖南大学", heat: "1902.3w" },
  { school: "浙江大学", heat: "1867.3w" },
  { school: "天津大学", heat: "1843w" },
  { school: "上海交通大学", heat: "1822w" },
  { school: "华南理工大学", heat: "1820w" },
  { school: "郑州大学", heat: "1808.2w" },
  { school: "青岛大学", heat: "1798.1w" },
  { school: "西南交通大学", heat: "1768w" },
  { school: "长安大学", heat: "1709.2w" },
  { school: "中国海洋大学", heat: "1700w" },
  { school: "苏州大学", heat: "1692.2w" },
  { school: "同济大学", heat: "1675.1w" },
  { school: "武汉理工大学", heat: "1664w" },
  { school: "深圳大学", heat: "1653.6w" },
  { school: "海南大学", heat: "1635.4w" },
  { school: "大连理工大学", heat: "1628w" },
  { school: "北京邮电大学", heat: "1619w" },
]);

const handleSearch = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.get(
      "/schoolInfo/searchByName?schoolName=" +
        searchValue.value +
        "&page=" +
        pageNum.value
    );
    if (response.code == 200) {
      total.value = response.data.total;
      schoolList.value = response.data.schools;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const getSchoolList = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.get("/schoolInfo?page=" + pageNum.value);
    if (response.code == 200) {
      total.value = response.data.total;
      schoolList.value = response.data.schools;
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
  else getSchoolList();
};

onMounted(getSchoolList);
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

.school-list {
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

.schoolCard {
  margin: 20px auto;
  height: 140px;
  border-radius: 10px;
}

.schoolCard:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(250, 250, 250);
  cursor: pointer;
}

.school-info {
  display: flex;
}

.school-detail {
  text-align: center;
  width: 100%;
}

p {
  font-size: large;
}

.pagination {
  justify-content: center;
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

.school-name {
  font-size: 22px;
  font-weight: bold;
  margin-left: 4px;
}

.heat-value {
  font-size: 26px;
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
</style>
