<template>
  <div class="recommend-wrap">
    <div class="form-box">
      <el-form :model="form" :rules="rules" label-width="80px" class="ms-content" label-position="left"
        hide-required-asterisk>
        <div class="type-box">
          <el-form-item label="科类" class="kelei-item">
            <el-radio-group v-model="form.kelei" class="kelei-group" @change="handleSearch">
              <el-radio label="0">理科</el-radio>
              <el-radio label="1">文科</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分数" prop="userScore" style="margin-left:75px;">
            <el-input v-model="userScore" placeholder="您的分数" class="score-input" type="number"
              @blur="handleGetRank"></el-input>
          </el-form-item>
          <el-form-item label="排名" prop="userRank">
            <el-input v-model="userRank" disabled placeholder="您的排名" class="rank-input"></el-input>
          </el-form-item>
          <el-button type="primary" class="serch-button" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            推荐
          </el-button>
        </div>
        <el-form-item label="风险">
          <el-radio-group v-model="form.schoolRisk" @change="handleSearch">
            <el-radio-button label="高风险" />
            <el-radio-button label="中风险" />
            <el-radio-button label="低风险" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学校省份">
          <el-radio-group v-model="province_name" @change="getSchoolList">
            <el-radio class="province-radio" v-for="p in provinceList" width="90px" :key="p" :label="p" border />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学校特色">
          <el-radio-group v-model="schoolClass" size="large" @change="getSchoolList">
            <el-radio-button label="全部" />
            <el-radio-button label="985" />
            <el-radio-button label="211" />
            <el-radio-button label="双一流" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="school-list-wrap">
      <ul>
        <li v-for="school in pageSchoolList" :key="school.schoolId">
          <el-card shadow="hover" body-style="">
            <div class="school-image">
              <img :src="'https://static-data.gaokao.cn/upload/logo/' +
                school.schoolId +
                '.jpg'
                " width="100px" height="100px" alt />
            </div>
            <div class="school-detail">
              <router-link :to="{ path: '/schoolDetail', query: { schoolId: school.schoolId } }" target="_blank">
                <p>{{ school.schoolName }}</p>
              </router-link>
              <span>{{ school.level }}</span>
              <span>&nbsp;&nbsp;最低分：{{ school.score2022 }}</span>
              <span>&nbsp;&nbsp;预测投档线：{{ school.avgScore }}</span>
              <span>&nbsp;&nbsp;上线率：&nbsp;&nbsp;<el-icon size="20px"
                  :color="school.possible < 25 ? '#FF0000' : school.possible > 60 ? '#409eff' : '#21c133'">{{
                    school.possible == 0 ?
                    '<25' : school.possible }}%</el-icon></span>
            </div>
            <el-button class="add-button" @click="handleAddSelect(school.schoolId, school.possible)">
              +志愿表
            </el-button>
          </el-card>
        </li>
      </ul>
      <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
        layout="prev, pager, next, jumper" @current-page="currentChange" @page-size="sizeChange" />
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import request from "../utils/request.js";
import { ElMessage } from "element-plus";
const pageNum = ref(1);
const pageSize = 10;
const total = ref(0);
const pageSchoolList = ref([]);
const schoolClass = ref("全部");
const province_name = ref("全部");
const school_type_mark = ref("");
const owner_mark = ref("");
const is985 = ref("");
const is211 = ref("");
const doublehigh_mark = ref("");
const userScore = ref(500);
const userRank = ref(150000)
export default {
  watch: {
    pageNum() {
      this.getSchoolList();
    },
    province_name() {
      this.getSchoolList();
    },
    userScore() {
      if (!userScore.value) {
        ElMessage.warning("请输入分数");
      }
      if (userScore.value > 750 || userScore.value < 0) {
        ElMessage.warning("分数范围为0~750，请输入正确的分数！");
      }
      this.handleGetRank();
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
    const provinceList = ['全部', '北京', '天津', '河北', '山西', '内蒙古',
      '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西',
      '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川',
      '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'];
    const form = reactive({
      userScore: 350,
      userRank: 243965,
      schoolRisk: '高风险',
      province: '全部',
      schoolClass: '全部',
    });
    const rules = {
      userScore: [{ required: true, trigger: "blur" }],
      userRank: [{ required: true, trigger: "blur" }],
    };
    const handleGetRank = () => {
      var score = userScore.value;
      var mean = 500; // 平均分数
      var stdDev = 100; // 标准差
      var minRank = 1; // 最小位次
      var maxRank = 300000; // 最大位次
      // 计算 z 分数
      var zScore = (score - mean) / stdDev;
      // 使用标准正态分布的累积分布函数计算位次
      var rank = Math.round(maxRank - ((maxRank - minRank) * (0.5 * (1 + erf(zScore / Math.sqrt(2))))));
      userRank.value = Math.round(rank);
    };
    // 辅助函数，用于计算误差函数
    function erf(x) {
      // 常数
      var a1 = 0.254829592;
      var a2 = -0.284496736;
      var a3 = 1.421413741;
      var a4 = -1.453152027;
      var a5 = 1.061405429;
      var p = 0.3275911;
      // 保存 x 的符号
      var sign = (x >= 0) ? 1 : -1;
      x = Math.abs(x);
      // A&S 公式 7.1.26
      var t = 1.0 / (1.0 + p * x);
      var y = (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t;
      return sign * (1 - y * Math.exp(-x * x));
    }
    const handleAddSelect = (schoolId, possible) => {
      request
        .post('/addselect', {
          username: localStorage.getItem("ms_username"),
          schoolId: schoolId,
          possible: possible
        })
        .then((res) => {
          if (res.code == 20000) {
            ElMessage.success({
              message: res.message,
            });
          } else {
            ElMessage.error({
              message: res.message,
            });
          }
        })
        .catch((err) => {
          ElMessage.error({
            message: "服务器错误：" + err,
          });
        });
    };
    const getSchoolList = () => {
      let provinceName = province_name.value;
      if (province_name.value == "全部") provinceName = "";
      request
        .get("/schoolInfo/searchAndScore?page=" + pageNum.value + "&province_name=" + provinceName
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
    getSchoolList();
    const currentChange = () => { };
    const sizeChange = () => { };
    return {
      form,
      rules,
      provinceList,
      pageNum,
      pageSize,
      total,
      pageSchoolList,
      province_name,
      school_type_mark,
      owner_mark,
      is985,
      is211,
      doublehigh_mark,
      schoolClass,
      userScore,
      userRank,
      erf,
      getSchoolList,
      handleGetRank,
      handleAddSelect,
      currentChange,
      sizeChange,
    };
  },
};
</script>

<style scoped>
.recommend-wrap {
  margin: auto;
  text-align: center;
  height: 100%;
}

.form-box {
  margin: 40px auto;
}

.type-box {
  display: flex;
  align-items: center;
}

.type-box>* {
  margin-right: 20px
}

.el-form {
  display: flex;
  flex-direction: column;
}

.el-form>* {
  margin: 10px;
}

.el-form-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 0;
}

.el-form-item .kelei {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0;
}


.search-button {
  margin: auto 20px;
}

.el-radio-group {
  display: flex;
  flex-direction: row;
  margin-top: 0;
}

.kelei-group {
  margin: 0;
}

.province-radio {
  width: 80px;
  margin: 5px;
}

.school-list-wrap {
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
  align-items: center;
  margin: 20px auto;
  height: 140px;
  border-radius: 20px;
}

.school-image {
  float: left;
}

img {
  float: left;
  width: 100px;
  height: 100px;
}

.school-detial {
  float: left;
}

.add-button {
  float: right;
}

a {
  text-decoration: none;
}

a:link {
  /*默认状态*/
  color: black;
}

a:visited {
  /*浏览过的*/
  color: black;
}

a:hover {
  /*悬浮状态*/
  color: #f5940c;
  ;
}

p {
  font-size: large;
}

.el-pagination {
  justify-content: center;
}
</style>
