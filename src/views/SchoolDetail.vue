<template>
  <div class="page">
    <div id="tag-card" class="common-card">
      <div class="logo-wrap">
        <el-image
          class="logo"
          :src="
            'https://static-data.gaokao.cn/upload/logo/' + schoolId + '.jpg'
          "
          alt="school-logo"
        />
      </div>
      <div class="right-content">
        <div class="school-name">
          {{ schoolInfoDetail.schoolName }}
        </div>
        <div class="school-info">
          <p>官方网址：{{ schoolInfoDetail.schoolSite }}</p>
          <p>官方电话：{{ schoolInfoDetail.phone }}</p>
          <p>电子邮箱：{{ schoolInfoDetail.email }}</p>
        </div>
        <div class="tag-line">
          <div class="tag">{{ schoolInfo.owner }}</div>
          <div class="tag">{{ schoolInfo.degree }}</div>
          <div class="tag">{{ schoolInfo.schoolType }}</div>
          <div v-if="schoolInfo.is985 == '985'" class="tag">985工程</div>
          <div v-if="schoolInfo.is211 == '211'" class="tag">211工程</div>
          <div v-if="schoolInfo.doublehigh == '双一流'" class="tag">双一流</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import request from "../utils/request.js";

const route = useRoute();
const schoolId = useRoute().params.id;
let schoolInfoDetail = reactive({});
let schoolInfo = reactive({});
let scLiScore = reactive({});
let majorScore = ref([]);

const year = ref("2022");
const type = ref("理科");

const getSchoolDetail = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.get(
      "/schoolInfoDetail?schoolId=" + schoolId
    );
    if (response.code == 200) {
      Object.assign(schoolInfoDetail, response.data.schoolInfoDetail);
      Object.assign(schoolInfo, response.data.schoolInfo);
      Object.assign(scLiScore, response.data.scLiScore);
      majorScore.value = response.data.majorScore;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

onMounted(getSchoolDetail);
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 70%;
}

.common-card {
  border-radius: 10px;
  box-shadow: 0 0 13px #e6e6e6;
  margin: 10px;
  padding: 10px;
}

#tag-card {
  width: 100%;
  height: 200px;
  background-image: linear-gradient(135deg, #f5940c 10%, #fae52a 100%);
  display: flex;
}

.logo-wrap {
  float: left;
  background: #fff;
  padding: 20px;
  margin: 20px;
  border-radius: 30px;
}

.logo {
  height: 100%;
}

.right-content {
  padding: 10px;
}

.school-name {
  font-size: xx-large;
  color: #fff;
}

p {
  margin: 10px 0;
  color: #fff;
}

.tag {
  border-radius: 40px;
  color: var(--theme--color);
  padding: 10px 15px;
  margin: 0 5px;
  border: 2px solid var(--theme--color);
  display: inline-block;
  font-weight: bold;
  background-color: #fff;
}
</style>
