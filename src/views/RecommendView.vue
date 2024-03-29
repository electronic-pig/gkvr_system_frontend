<template>
  <el-form label-width="80px" label-position="left">
    <div class="rank-box">
      <el-form-item label="科类">
        <!-- 仅作展示，无实际作用 -->
        <el-radio-group v-model="subject">
          <el-radio label="理科" value="理科">理科</el-radio>
          <el-radio label="文科" value="文科">文科</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分数" style="margin-left: 8vw">
        <el-input
          v-model="userScore"
          placeholder="您的分数"
          type="number"
          @keyup.enter="getRank(), getRecommendList()"
        ></el-input>
      </el-form-item>
      <el-form-item label="排名" style="margin-left: 2vw">
        <el-input v-model="userRank" placeholder="您的排名" disabled></el-input>
      </el-form-item>
      <el-button
        type="primary"
        style="margin-left: 4vw"
        @click="getRecommendList"
      >
        <el-icon>
          <Search />
        </el-icon>
        推荐
      </el-button>
    </div>
    <el-form-item label="风险">
      <el-radio-group v-model="risk">
        <el-radio-button label="全部" value="全部" />
        <el-radio-button label="可冲击" value="可冲击" />
        <el-radio-button label="较稳妥" value="较稳妥" />
        <el-radio-button label="可保底" value="可保底" />
      </el-radio-group>
    </el-form-item>
  </el-form>
  <div class="school-list">
    <ul>
      <li v-for="(school, index) in schoolList" :key="school.schoolId">
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
              <span>&nbsp;&nbsp;最低位次：{{ school.rank2022 }}</span>
              <span>&nbsp;&nbsp;预测投档线：{{ averageScores[index] }}</span>
              <span
                >&nbsp;&nbsp;录取概率：&nbsp;&nbsp;<el-icon
                  size="20px"
                  :color="
                    upLineRateList[index] < 60
                      ? '#FF0000'
                      : upLineRateList[index] >= 80
                      ? '#21c33c'
                      : '#409eff'
                  "
                >
                  {{
                    upLineRateList[index] == 0 ? "<25" : upLineRateList[index]
                  }}%</el-icon
                ></span
              >
            </div>
            <el-button
              size="large"
              style="margin: auto 0"
              @click="handleCommit(school.schoolId)"
            >
              +志愿表
            </el-button>
          </div>
        </el-card>
      </li>
    </ul>
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
import { onMounted, ref, watch } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import request from "../utils/request.js";

let subject = ref("理科");
let userScore = ref(600);
let userRank = ref("");
let risk = ref("全部");
let schoolList = ref([]);
let averageScores = ref([]);
let upLineRateList = ref([]);
let pageNum = ref(1);
let total = ref(0);
const router = useRouter();

watch(risk, () => {
  pageNum.value = 1;
  getRecommendList();
});

const goToDetail = (id) => {
  router.push({ name: "schoolDetail", params: { id: id } });
};

const getRecommendList = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.get(
      "/scoreRank/getReco?page=" +
        pageNum.value +
        "&score=" +
        userScore.value +
        "&risk=" +
        risk.value
    );
    if (response.code == 200) {
      schoolList.value = response.data.schools;
      averageScores.value = response.data.averageScores;
      upLineRateList.value = response.data.upLineRateList;
      total.value = response.data.total;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const getRank = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.get(
      "/scoreRank/getRank?score=" + userScore.value
    );
    if (response.code == 200) {
      userRank.value = response.data.scoreRank.rankRange;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const handleCurrentChange = (newPage) => {
  getRecommendList();
};

onMounted(getRank(), getRecommendList());
</script>

<style scoped>
.rank-box {
  display: flex;
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
</style>
