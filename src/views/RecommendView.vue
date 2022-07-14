<template>
  <div class="recommend-wrap">
    <div class="form-box">
      <el-form :model="form" :rules="rules" label-width="80px" class="ms-content" label-position="left" hide-required-asterisk>
        <div class="type-box">
          <el-form-item label="科类" class="kelei-item">
            <el-radio-group v-model="form.kelei" class="kelei-group" @change="handleSearch">
              <el-radio label="0">理科</el-radio>
              <el-radio label="1">文科</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分数" prop="userScore">
            <el-input v-model="form.userScore" placeholder="您的分数" class="score-input" type="number"
              @blur="handleGetRank"></el-input>
          </el-form-item>
          <el-form-item label="排名" prop="userRank">
            <el-input v-model="form.userRank" disabled placeholder="您的排名" class="rank-input"></el-input>
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
          <el-radio-group v-model="form.province" @change="handleSearch">
            <el-radio class="province-radio" v-for="p in provinceList" width="90px" :key="p" :label="p" border />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学校特色">
          <el-radio-group v-model="form.schoolClass" @change="handleSearch">
            <el-radio-button label="全部" />
            <el-radio-button label="985" />
            <el-radio-button label="211" />
            <el-radio-button label="双一流" />
            <el-radio-button label="其它" />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="school-list-wrap">
      <ul>
        <li v-for="school in pageSchoolList" :key="school.id">
          <el-card shadow="hover" body-style="">
            <div class="school-image">
              <img :src="
                'https://static-data.gaokao.cn/upload/logo/' +
                school.id +
                '.jpg'
              " width="100px" height="100px" alt />
            </div>
            <div class="school-detail">
              <router-link :to="{path: '/detail', query:{id: school.id}}" target="_blank">
              <p>{{ school.name }}</p>
              </router-link>
              <span>{{ school.level }}</span>
              <span>&nbsp;&nbsp;最低分：{{ school.score }}</span>
              <span>&nbsp;&nbsp;预测投档线：{{ school.predict }}</span>
              <span>&nbsp;&nbsp;上线率：&nbsp;&nbsp;<el-icon size="20px" :color="school.possible < 25 ?'#FF0000':school.possible>60?'#409eff':'#21c133'">{{ school.possible == 0? '<25' : school.possible }}%</el-icon></span>
            </div>
            <el-button class="add-button" @click="handleAddSelect(school.id, school.possible)">
              +志愿表
            </el-button>
          </el-card>
        </li>
      </ul>
      <el-pagination layout="prev, pager, next, jumper" @current-change="currentChange" :current-page="pageNum"
        :page-size="pageSize" :total="total" />
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from "vue";
import request from "../utils/request.js";
import { ElMessage } from "element-plus";
export default {
  setup() {
    //表单数据
    const form = reactive({
      kelei: '0',
      userScore: 350,
      userRank: 243965,
      schoolRisk: '高风险',
      province: '全部',
      schoolClass: '全部',
    });
    const checkScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入分数！'));
      }
      if (value > 750 || value < 0) {
        return callback(new Error('分数范围为0~750，请输入正确的分数！'));
      }
    };
    const checkRank = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入排名！'));
      }
      if (value < 1) {
        return callback(new Error('排名应为正数！'));
      }
    };
    const rules = {
      userScore: [
        { required: true, validator: checkScore, trigger: "blur" },
      ],
      userRank: [{ required: true, validator: checkRank, trigger: "blur" },],
    };
    const handleGetRank = () => {
      request
        .post('/getRank', { type: Number(form.kelei), score: form.userScore })
        .then((res) => {
          if (res.code == 200) {
            form.userRank = res.rank;
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
    const handleAddSelect = (id, possible) => {
      request
        .post('/addselect', {
          username: localStorage.getItem("ms_username"), 
          id: id,
          possible: possible
        })
        .then((res) => {
          if (res.code == 200) {
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
    const provinceList = ['全部', '北京', '天津', '河北', '山西', '内蒙古',
      '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西',
      '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川',
      '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'];
    //构造post请求Body
    const query = computed(() => {
      const classMap = {
        "": -1,
        '全部': -1,
        '985': 3,
        '211': 2,
        '双一流': 1,
        '其它': 0,
      };
      const riskMap = {
        '高风险': 2,
        '中风险': 1,
        '低风险': 0,
      }
      return {
        type: Number(form.kelei),
        score: form.userScore,
        // rank: form.userRank,
        risk: riskMap[form.schoolRisk],
        province: form.province == '全部' ? '' : form.province,
        class: classMap[form.schoolClass],
        page_size: 10,
        page_index: pageNum.value - 1,
      };
    });

    //前端完成分页
    // const pageNum = ref(1);
    // const pageSize = ref(10);
    // const total = computed(() => {
    //   return schoolList.value.length;
    // });
    // const pageSchoolList = computed(() => {
    //   return schoolList.value.slice(
    //     (pageNum.value - 1) * pageSize.value,
    //     pageNum.value * pageSize.value
    //   );
    // });
    // const currentChange = (val) => {
    //   pageNum.value = val;
    // };

    //配合后端进行分页
    const pageNum = ref(1);
    const pageSize = 10;
    const total = ref(0);
    const currentChange = (val) => {
      pageNum.value = val;
      getSchoolList();
    };

    //学校列表
    const pageSchoolList = ref([]);
    const getSchoolList = () => {
      request
        .post("/recommend", query.value)
        .then((res) => {
          if (res.code == 200) {
            pageSchoolList.value = res.data;
            total.value = res.page_total;
            form.userRank = res.rank;
            //ElMessage.success("获取学校列表成功");
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

    const handleSearch = () => getSchoolList();

    return {
      form,
      rules,
      handleGetRank,
      handleAddSelect,
      provinceList,
      query,
      // schoolList,
      getSchoolList,
      pageNum,
      pageSize,
      total,
      pageSchoolList,
      currentChange,
      handleSearch,
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
.type-box > *{
  margin-right: 20px
}
.el-form {
  display: flex;
  flex-direction: column;
}
.el-form>*{
  margin: 10px;
}

.el-form-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 0;
}

.el-form-item .kelei{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0;
}



/* .el-input {
  width: 30%; 
} */

.search-button {
  margin: auto 20px;
}

.el-radio-group {
  display: flex;
  flex-direction: row;
  margin-top: 0;
}
.kelei-group {
  /* width: 70%; */
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
  /* display: flex; */
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
  text-decoration:none;
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
  color: #409eff;;
}

p {
  font-size: large;
}

.el-pagination {
  justify-content: center;
}
</style>
