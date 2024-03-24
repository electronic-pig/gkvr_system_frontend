<template>
  <div class="special-wrap">
    <div class="search-header">
      <div class="search-box">
        <el-input class="handle-input" v-model="specialName" placeholder="输入专业名称" @keyup.enter="handleSearch"></el-input>
        <el-button class="search-button" type="primary" @click="handleSearch"><el-icon>
            <Search />
          </el-icon>搜索</el-button>
      </div>
      <el-radio-group v-model="specialLevel" size="large" @change="handleSearch">
        <el-radio-button label="本科" />
        <el-radio-button label="专科（高职）" />
      </el-radio-group>
    </div>
    <el-radio-group v-model="type_id" size="large" @change="getSpecialList">
      <el-radio label="全部" />
      <el-radio v-for="item in classList" :key="item" :label="item" />
    </el-radio-group>
    <div class="school-list-container">
      <div class="special-list-wrap">
        <ul>
          <li v-for="special in pageSpecialList" :key="special.id">
            <el-card shadow="hover">
              <div class="major_list_title">{{ special.majorName }}</div>
              <div class="major_list_tags">
                <span>专业代码：{{ special.majorCode }}</span>&nbsp;|&nbsp;
                <span>类别：{{ special.typeId }}</span>&nbsp;|&nbsp;
                <span>修业年限：{{ special.years }}</span>&nbsp;|&nbsp;
                <span>授予学位：{{ special.degree }}</span>
              </div>
            </el-card>
          </li>
        </ul>
        <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
          layout="prev, pager, next, jumper" @current-page="currentChange" @page-size="sizeChange" />
      </div>
      <el-card class="heat-rank" style="height: max-content;" shadow="hover">
        <template #header>
          <h1>专业热度</h1>
        </template>
        <ul>
          <li v-for="(item, index) in RankList" :key="index" class="heat-item">
            <span v-if="index == 0" class="badge1">{{ index + 1 }}</span>
            <span v-if="index == 1" class="badge2">{{ index + 1 }}</span>
            <span v-if="index == 2" class="badge3">{{ index + 1 }}</span>
            <span v-if="index !== 0 & index !== 1 & index !== 2" class="badgeElse">{{ index + 1 }}</span>
            <div class="major-info">
              <span class="major-name">{{ item.major }}</span>
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
const pageSize = 10;
const total = ref(0);
const specialName = ref("");
const specialLevel = ref("本科");
const specialClass = ref("全部");
const type_id = ref("全部");
const pageSpecialList = ref([]);
const classList = ref(["哲学类", "经济学类", "财政学类", "金融学类", "经济与贸易类", "法学类", "政治学类",
  "社会学类", "民族学类", "马克思主义理论类", "公安学类", "教育学类", "体育学类", "中国语言文学类",
  "外国语言文学类", "新闻传播学类", "历史学类", "数学类", "物理学类", "化学类", "天文学类", "地理科学类",
  "大气科学类", "海洋科学类", "地球物理学类", "地质学类", "生物科学类", "心理学类", "统计学类", "力学类",
  "机械类", "材料类", "能源动力类", "电气类", "电子信息类", "自动化类", "计算机类", "土木类", "水利类", "测绘类",
  "化工与制药类", "地质类", "矿业类", "纺织类", "轻工类", "交通运输类", "海洋工程类", "航空航天类", "兵器类",
  "核工程类", "农业工程类"]);
const RankList = ref([
  { major: '电气工程及其自动化', heat: 124570 },
  { major: '电子商务', heat: 117031 },
  { major: '机械设计制造及其自动化', heat: 96055 },
  { major: '电子信息工程', heat: 92405 },
  { major: '汉语国际教育', heat: 85288 },
  { major: '工程造价', heat: 83462 },
  { major: '计算机科学与技术', heat: 81151 },
  { major: '人工智能', heat: 74127 },
  { major: '财务管理', heat: 65901 },
  { major: '数据科学与大数据技术', heat: 64745 },
  { major: '市场营销', heat: 64514 },
  { major: '秘书学', heat: 63844 },
  { major: '工程管理', heat: 58946 },
  { major: '人力资源管理', heat: 58391 },
  { major: '通信工程', heat: 58252 },
  { major: '临床医学', heat: 57397 },
  { major: '食品科学与工程', heat: 57351 },
  { major: '数字媒体技术', heat: 55295 },
  { major: '药学', heat: 55064 },
  { major: '国际经济与贸易', heat: 54948 }
]);
export default {
  watch: {
    pageNum() {
      this.getSpecialList();
    },
    type_id() {
      this.getSpecialList();
    }
  },
  setup() {
    const getSpecialList = () => {
      let typeId = type_id.value;
      if (type_id.value == "全部") typeId = "";
      request
        .get("/majorInfo?page=" + pageNum.value + "&typeId=" + typeId)
        .then((res) => {
          if (res.code == 20000) {
            pageSpecialList.value = res.data.majors;
            total.value = res.data.totalPage;
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
    getSpecialList();

    const handleSearch = () => {
      request
        .get("/majorInfo/searchByName?majorName=" + specialName.value)
        .then((res) => {
          if (res.code == 20000) {
            pageSpecialList.value = res.data.majorInfo;
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
    const currentChange = () => { };
    const sizeChange = () => { };
    return {
      specialName,
      specialLevel,
      specialClass,
      classList,
      pageNum,
      pageSize,
      total,
      pageSpecialList,
      type_id,
      RankList,
      getSpecialList,
      currentChange,
      sizeChange,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.pagination {
  justify-content: center;
}

.special-wrap {
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

.search-box>.el-radio-group {
  margin: 0 40px;
}

.special-list-wrap {
  height: 100%;
}

ul {
  justify-content: center;
  padding-inline-start: 0;
}

li {
  list-style-type: none;
}

.el-card {
  margin: 20px auto;
  height: 100px;
  border-radius: 20px;
}

.el-card:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(250, 250, 250);
}

.special-detial {
  float: left;
}

p {
  font-size: large;
}

.el-pagination {
  justify-content: center;
}

.major_list_title {
  font-size: 20px;
  color: #000;
  margin-bottom: 10px;
  font-weight: 600;
  transition: all .4s;
}

.major_list_title:hover {
  color: #f5940c;
  cursor: pointer;
}

.major_list_tags {
  margin-top: 3px;
}

.school-list-container {
  display: flex;
}

.heat-rank {
  flex: 0 0 300px;
  margin-left: 20px;
  padding: 10px;
}

.heat-item {
  display: flex;
  font-size: 15px;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
  margin-bottom: 22px;
  cursor: pointer;
}

.heat-info {
  margin-left: 20px;
}

.heat-value {
  color: rgb(237, 33, 33);
}

.major-info {
  flex-grow: 1;
  text-align: left;
  margin-left: 5px;
}

.major-info:hover {
  color: #f5940c;
  cursor: pointer;
}

.major-name {
  font-weight: bold;
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
}</style>