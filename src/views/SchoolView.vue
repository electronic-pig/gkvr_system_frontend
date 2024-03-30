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
    <el-radio-group
      v-model="schoolClass"
      size="large"
      @change="getSortedSchools"
    >
      <el-radio-button label="全部" value="全部" />
      <el-radio-button label="985" value="985" />
      <el-radio-button label="211" value="211" />
      <el-radio-button label="双一流" value="双一流" />
    </el-radio-group>
  </div>
  <div class="province-group">
    <el-radio-group v-model="provinceName" @change="getByProvince">
      <el-radio
        v-for="item in provinceList"
        :key="item"
        :label="item"
        :value="item"
        border
      />
    </el-radio-group>
  </div>
  <div class="content">
    <div class="school-list">
      <ul>
        <li v-for="school in schoolList" :key="school.schoolId">
          <el-card
            class="schoolCard"
            shadow="hover"
            @click="goToDetail(school.schoolId)"
          >
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
          <li
            v-for="(item, index) in schoolRankList"
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
    layout="prev, pager, next, jumper"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import request from "@/utils/request.js";
import schoolRankList from "@/assets/schoolRankList.json";
import provinceList from "@//assets/provinceList.json";

const searchValue = ref("");
const schoolClass = ref("全部");
const provinceName = ref("全部");
const schoolList = ref([]);
const pageNum = ref(1);
const total = ref(0);
const router = useRouter();

watch([schoolClass, provinceName], () => {
  pageNum.value = 1;
});

const goToDetail = (id) => {
  router.push({ name: "schoolDetail", params: { id: id } });
};

const handleSearch = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  schoolClass.value = "全部";
  provinceName.value = "全部";
  try {
    const response = await request.get(
      "/schoolInfo/searchByName?page=" +
        pageNum.value +
        "&schoolName=" +
        searchValue.value
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

const getSortedSchools = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  searchValue.value = "";
  provinceName.value = "全部";
  let url = "";
  switch (schoolClass.value) {
    case "985":
      url = "/schoolInfo/985";
      break;
    case "211":
      url = "/schoolInfo/211";
      break;
    case "双一流":
      url = "/schoolInfo/doublehigh";
      break;
    default:
      url = "/schoolInfo/all";
  }
  try {
    const response = await request.get(url + "?page=" + pageNum.value);
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

const getByProvince = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  searchValue.value = "";
  schoolClass.value = "全部";
  try {
    const response = await request.get(
      "/schoolInfo/getByProvince?page=" +
        pageNum.value +
        "&provinceName=" +
        provinceName.value
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

const handleCurrentChange = (newPage) => {
  pageNum.value = newPage;
  if (searchValue.value) handleSearch();
  else if (schoolClass.value !== "全部") getSortedSchools();
  else getByProvince();
};

onMounted(getSortedSchools);
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-evenly;
  margin: 2vh auto;
  height: 40px;
}

.province-group {
  display: flex;
  margin: 0 auto;
}

.el-radio {
  margin: 2px 10px;
  width: 80px;
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

.pagination {
  justify-content: center;
}
</style>
