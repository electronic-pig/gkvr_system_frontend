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
          @keyup.enter="getRank()"
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
      <el-radio-group v-model="riskClass">
        <el-radio-button label="全部" value="全部" />
        <el-radio-button label="可冲击" value="可冲击" />
        <el-radio-button label="较稳妥" value="较稳妥" />
        <el-radio-button label="可保底" value="可保底" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="学校省份">
      <el-radio-group v-model="provinceName">
        <el-radio
          style="width: 80px; margin: 5px"
          v-for="item in provinceList"
          :key="item"
          :label="item"
          :value="item"
          border
        />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="学校层次">
      <el-radio-group v-model="schoolClass">
        <el-radio-button label="全部" value="全部" />
        <el-radio-button label="985" value="985" />
        <el-radio-button label="211" value="211" />
        <el-radio-button label="双一流" value="双一流" />
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import provinceList from "@/assets/provinceList";
import request from "../utils/request.js";

let subject = ref("理科");
let userScore = ref(640);
let userRank = ref("");
let riskClass = ref("全部");
let provinceName = ref("全部");
let schoolClass = ref("全部");

const getRecommendList = () => {};

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

onMounted(getRank);
</script>

<style scoped>
.rank-box {
  display: flex;
}
</style>
