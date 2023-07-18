<template>
  <div class="school-wrap">
    <div class="search-header">
      <div class="search-box">
        <el-input class="handle-input" v-model="schoolName" placeholder="输入学校名称" 
          @keyup.enter="handleSearch"></el-input>
        <el-button type="primary" class="search-button" @click="handleSearch">
          <el-icon>
            <Search />
          </el-icon>搜索</el-button>
      </div>
      <el-radio-group v-model="schoolClass" size="large" @change="getSchoolList">
        <el-radio-button label="全部" />
        <el-radio-button label="985" />
        <el-radio-button label="211" />
        <el-radio-button label="双一流" />
      </el-radio-group>
    </div>
    <div class="school-list-container">
      <div class="school-list-wrap">
        <ul>
          <li v-for="school in pageSchoolList" :key="school.schoolId">
            <el-card shadow="hover">
              <div class="school-image">
                <img :src="'https://static-data.gaokao.cn/upload/logo/' + school.schoolId + '.jpg'" width="100px"
                  height="100px" alt />
              </div>
              <div class="school-detail">
                <router-link :to="{ path: '/schoolDetail', query: { schoolId: school.schoolId } }" target="_blank">
                  <p>{{ school.schoolName }}</p>
                </router-link>
                <span v-if="school.degree">{{ school.degree }}</span>
                <span v-if="school.schoolType">&nbsp;|&nbsp;{{ school.schoolType }}</span>
                <span v-if="school.owner">&nbsp;|&nbsp;{{ school.owner }}</span>
                <span v-if="school.provinceName">&nbsp;|&nbsp;{{ school.provinceName }}</span>
                <span v-if="school.cityName">&nbsp;|&nbsp;{{ school.cityName }}</span>
                <span v-if="school.countyName">&nbsp;|&nbsp;{{ school.countyName }}</span>
                <span v-if="school.doublehigh">&nbsp;|&nbsp;{{ school.doublehigh }}</span>
                <span v-if="school.is985 !== '0'">&nbsp;|&nbsp;{{ school.is985 }}</span>
                <span v-if="school.is211 !== '0'">&nbsp;|&nbsp;{{ school.is211 }}</span>
              </div>
            </el-card>
          </li>
        </ul>
        <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
          layout="prev, pager, next, jumper" @current-page="currentChange" @page-size="sizeChange" />
      </div>
      <el-card class="heat-rank" style="height: max-content;" shadow="hover">
        <template #header>
          <h1>院校热度</h1>
        </template>
        <ul>
          <li v-for="(item, index) in RankList" :key="index" class="heat-item">
            <span v-if="index == 0" class="badge1">{{ index + 1 }}</span>
            <span v-if="index == 1" class="badge2">{{ index + 1 }}</span>
            <span v-if="index == 2" class="badge3">{{ index + 1 }}</span>
            <span v-if="index !== 0 & index !== 1 & index !== 2" class="badgeElse">{{ index + 1 }}</span>
            <div class="school-info">
              <span class="school-name" style="font-size: 21px;">{{ item.school }}</span>
            </div>
            <div class="heat-info">
              <span class="heat-value">{{ item.heat }}</span>
            </div>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import request from "../utils/request.js";

const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const pageSchoolList = ref([]);
const schoolName = ref("");
const schoolClass = ref("全部");
const province_name = ref("");
const school_type_mark = ref("");
const owner_mark = ref("");
const is985 = ref("");
const is211 = ref("");
const doublehigh_mark = ref("");
const RankList = ref([
  { school: '四川大学', heat: 185637 },
  { school: '清华大学', heat: 170105 },
  { school: '中山大学', heat: 147029 },
  { school: '厦门大学', heat: 146616 },
  { school: '中南大学', heat: 145881 },
  { school: '深圳大学', heat: 140280 },
  { school: '浙江大学', heat: 139583 },
  { school: '武汉大学', heat: 130105 },
  { school: '西南大学', heat: 124058 },
  { school: '电子科技大学', heat: 120231 },
  { school: '重庆大学', heat: 116788 },
  { school: '华中科技大学', heat: 112344 },
  { school: '天津大学', heat: 109780 },
  { school: '青岛大学', heat: 103452 },
  { school: '华南理工大学', heat: 96872 },
  { school: '上海交通大学', heat: 94567 },
  { school: '同济大学', heat: 90231 },
  { school: '西南交通大学', heat: 87456 },
  { school: '中国海洋大学', heat: 82308 },
  { school: '苏州大学', heat: 79990 },
]);
export default {
  watch: {
    pageNum() {
      this.getSchoolList();
    },
    schoolClass() {
      switch (schoolClass.value) {
        case "全部":
          pageNum.value = 1;
          is985.value = "";
          is211.value = "";
          doublehigh_mark.value = "";
          this.getSchoolList();
          break;
        case "985":
          pageNum.value = 1;
          is985.value = "985";
          is211.value = "";
          doublehigh_mark.value = "";
          this.getSchoolList();
          break;
        case "211":
          pageNum.value = 1;
          is985.value = "";
          is211.value = "211";
          doublehigh_mark.value = "";
          this.getSchoolList();
          break;
        case "双一流":
          pageNum.value = 1;
          is985.value = "";
          is211.value = "";
          doublehigh_mark.value = "38000";
          this.getSchoolList();
          break;
      }
    },
  },
  setup() {
    const getSchoolList = () => {
      request
        .get("/schoolInfo/search?page=" + pageNum.value + "&province_name=" + province_name.value
          + "&school_type_mark=" + school_type_mark.value + "&owner_mark=" + owner_mark.value
          + "&is985=" + is985.value + "&is211=" + is211.value + "&doublehigh_mark=" + doublehigh_mark.value)
        .then((res) => {
          if (res.code == 20000) {
            pageSchoolList.value = res.data.schools;
            total.value = res.data.total;
          } else {
            ElMessage.error({
              message: "获取失败:" + res.message,
            });
          }
        })
        .catch((err) => {
          ElMessage.error({
            message: "服务器错误：" + err,
          });
        });
    };
    const handleSearch = () => {
      request
        .get("/schoolInfo/searchByName?schoolName=" + schoolName.value)
        .then((res) => {
          if (res.code == 20000) {
            pageSchoolList.value = res.data.schoolInfo;
            total.value = res.data.total;
          } else {
            ElMessage.error({
              message: "获取失败:" + res.message,
            });
          }
        })
        .catch((err) => {
          ElMessage.error({
            message: "服务器错误：" + err,
          });
        });
    };
    getSchoolList();
    //空方法
    const currentChange = () => { };
    const sizeChange = () => { };
    return {
      pageNum,
      pageSize,
      total,
      pageSchoolList,
      schoolName,
      schoolClass,
      province_name,
      school_type_mark,
      owner_mark,
      is985,
      is211,
      doublehigh_mark,
      RankList,
      getSchoolList,
      handleSearch,
      currentChange,
      sizeChange,
    };
  },
};
</script>

<style scoped>
.school-wrap {
  margin: auto;
  text-align: center;
  height: 100%;
}

.search-header {
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  margin: 40px auto;
  height: 40px;
}

.search-box {
  display: flex;
  justify-content: flex-start;
  width: 50%;
}

.handle-input {
  width: auto;
}

.search-button {
  margin: 0;
  height: 40px;
}

.el-radio-group {
  margin: 0 40px;
}

.school-list-wrap {
  height: 100%;
  flex: 1;
}

.school-list-container {
  display: flex;
}

ul {
  justify-content: center;
  padding-inline-start: 0;
}

li {
  list-style-type: none;
}
a {
  text-decoration: none;
}
a:link {
  color: black;
}
a:visited {
  color: black;
}
a:hover {
  color: #f5940c;
}
.el-card {
  margin: 20px auto;
  height: 140px;
  border-radius: 20px;
}

.el-card:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(250, 250, 250);
}

.school-image {
  float: left;
}

img {
  float: left;
  width: 100px;
  height: 100px;
}

h1 {
  font-size: 30px;
}

p {
  font-size: large;
}
.school-detial {
  float: left;
}
.pagination {
  justify-content: center;
}

.heat-rank {
  flex: 0 0 300px;
  margin-left: 20px;
  padding: 10px;
}

.heat-item {
  display: flex;
  font-size: 25px;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
  margin-bottom: 22px;
  cursor: pointer;
}

.school-info {
  flex-grow: 1;
  text-align: left;
  margin-left: 3px;
}

.school-name {
  font-weight: bold;
}

.heat-info {
  margin-left: 20px;
}

.school-name {
  font-weight: bold;
}

.heat-value {
  color: rgb(237, 33, 33);
}

.school-info:hover {
  color: #f5940c;
  cursor: pointer;
}

.badge1 {
  width: 20px;
  height: 20px;
  font-size: 15px;
  color: #fff;
  background: #da1d1d;
  text-align: center;
  line-height: 20px;
  overflow: hidden;
  font-weight: normal;
  margin-top: 1px;
  margin-right: 3px;
}

.badge2 {
  width: 20px;
  height: 20px;
  font-size: 15px;
  color: #fff;
  background: #fc6639;
  text-align: center;
  line-height: 20px;
  overflow: hidden;
  font-weight: normal;
  margin-right: 3px;
}

.badge3 {
  width: 20px;
  height: 20px;
  font-size: 15px;
  color: #fff;
  background: #f6b759;
  text-align: center;
  line-height: 20px;
  overflow: hidden;
  font-weight: normal;
  margin-right: 3px;
}

.badgeElse {
  width: 20px;
  height: 20px;
  font-size: 15px;
  color: #999999;
  background: #eeeeee;
  text-align: center;
  line-height: 20px;
  overflow: hidden;
  font-weight: normal;
  margin-right: 3px;
}
</style>
