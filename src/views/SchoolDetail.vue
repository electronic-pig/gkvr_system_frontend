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

    <div class="intro-wrap">
      <div class="pic-wrap">
        <img
          class="pic"
          :src="
            'https://static-data.eol.cn//upload/svideo/piliang_' +
            schoolId +
            '_thumb.jpg'
          "
          alt="school-pic"
        />
      </div>
      <div class="intro common-card">
        <div class="rank-wrap">
          <div class="school_rank">
            <div class="school_rank_text">
              <span class="school_rank_num">{{
                schoolInfoDetail.ruankeRank
              }}</span
              >名
            </div>
            软科综合
          </div>
          <div class="school_rank">
            <div class="school_rank_text">
              <span class="school_rank_num">{{ schoolInfoDetail.xyhRank }}</span
              >名
            </div>
            校友会综合
          </div>
          <div class="school_rank">
            <div class="school_rank_text">
              <span class="school_rank_num">{{ schoolInfoDetail.usRank }}</span
              >名
            </div>
            US世界
          </div>
        </div>
        <div class="content-wrap">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
            schoolInfoDetail.content
          }}...
        </div>
      </div>
    </div>

    <div class="info">
      <div class="table common-card">
        <!-- 2022年四川省理科录取分数线 -->
        <el-table height="1070px" :data="majorScore">
          <el-table-column prop="majorName" label="专业名称" />
          <el-table-column prop="batch" label="录取批次" width="80px" />
          <el-table-column prop="min" label="最低分" width="66px" />
          <el-table-column prop="minSection" label="最低位次" width="80px" />
        </el-table>
      </div>
      <div class="charts">
        <div
          id="score-chart"
          class="common-card"
          style="height: 300px; width: 100%"
        ></div>
        <div
          id="level-chart"
          class="common-card"
          style="height: 300px; width: 100%"
        ></div>
        <div
          id="rate-bar"
          class="common-card"
          style="height: 250px; width: 100%"
        ></div>
        <div class="gender common-card">
          <el-icon :size="50" color="#22B6ED"> <Male /> </el-icon
          >{{ schoolInfoDetail.menRate }}%
          <div id="gender-bar" style="height: 150px; width: 140px"></div>
          {{ schoolInfoDetail.femaleRate }}%
          <el-icon :size="50" color="#FFB6C1">
            <Female />
          </el-icon>
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
import * as echarts from "echarts";

const schoolId = useRoute().params.id;
const schoolInfoDetail = reactive({});
const schoolInfo = reactive({});
const scLiScore = reactive({});
const majorScore = ref([]);

let scoreChart;
let levelChart;
let rateBar;
let genderBar;

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
      const scores = [
        parseInt(response.data.scLiScore.score2020),
        parseInt(response.data.scLiScore.score2021),
        parseInt(response.data.scLiScore.score2022),
      ];
      initScoreChart(scores);
      const academic = [
        response.data.schoolInfoDetail.numAcademician,
        response.data.schoolInfoDetail.numSubject,
        response.data.schoolInfoDetail.numMaster,
        response.data.schoolInfoDetail.numDoctor,
      ];
      initLevelChart(academic);
      const rate = [
        response.data.schoolInfoDetail.job,
        response.data.schoolInfoDetail.postgraduate,
        response.data.schoolInfoDetail.abroad,
      ];
      initRateBar(rate);
      initgenderBar(response.data.schoolInfoDetail.menRate);
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const initScoreChart = (scores) => {
  scoreChart = echarts.init(document.getElementById("score-chart"));
  scoreChart.setOption({
    title: {
      text: "四川省分数线",
      left: "center",
    },
    color: "#f5460c",
    legend: {
      data: ["理科"],
      top: "8%",
    },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "0",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["2020", "2021", "2022"],
      },
    ],
    yAxis: [
      {
        type: "value",
        min: function (value) {
          return value.min - 10;
        },
        max: function (value) {
          return value.max + 10;
        },
      },
    ],
    series: [
      {
        name: "理科",
        type: "line",
        emphasis: {
          focus: "series",
        },
        data: scores,
      },
    ],
  });
};

const initLevelChart = (academic) => {
  levelChart = echarts.init(document.getElementById("level-chart"));
  levelChart.setOption({
    title: {
      text: "学术水平",
      top: "4%",
      left: "center",
    },
    grid: {
      top: "14%",
      left: "16%",
      right: "2%",
      bottom: "3%",
    },
    color: "#f5940c",
    xAxis: {
      type: "value",
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: "category",
      data: ["院士数", "重点学科", "硕士点", "博士点"],
    },
    series: [
      {
        label: {
          show: true,
          formatter: "{c}",
          fontSize: 16,
          color: "white",
        },
        data: academic,
        type: "bar",
      },
    ],
  });
};

const initRateBar = (rate) => {
  rateBar = echarts.init(document.getElementById("rate-bar"));
  rateBar.setOption({
    title: {
      text: "指标比率",
      left: "center",
    },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "0",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      axisTick: { show: false },
      axisLine: { show: false },
      data: ["就业率", "深造率", "出国率"],
    },
    series: [
      {
        type: "bar",
        barWidth: 15,
        data: rate,
        label: {
          show: true,
          position: "right",
          offset: [-40, -20],
          formatter: "{c}%",
        },
        itemStyle: {
          borderRadius: [0, 7, 7, 0],
          color: function (params) {
            var colorList = [
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#52E5E7", //柱图渐变色起点颜色
                },
                {
                  offset: 1,
                  color: "#130CB7", //柱图渐变色终点颜色
                },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#FFE985", //柱图渐变色起点颜色
                },
                {
                  offset: 1,
                  color: "#FA742B", //柱图渐变色终点颜色
                },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#81FBB8", //柱图渐变色起点颜色
                },
                {
                  offset: 1,
                  color: "#28C76F", //柱图渐变色终点颜色
                },
              ]),
            ];
            return colorList[params.dataIndex];
          },
        },
      },
    ],
  });
};

const initgenderBar = (menRate) => {
  genderBar = echarts.init(document.getElementById("gender-bar"));
  genderBar.setOption({
    title: {
      text: "男女比例",
      left: "center",
      top: "20%",
    },
    grid: {
      left: "2",
      right: "2",
      top: "0",
      bottom: "0",
    },
    xAxis: {
      type: "value", //坐标轴类型,分别有：
      splitLine: { show: false }, //坐标轴在 grid 区域中的分隔线
      axisLabel: { show: false }, //坐标轴刻度标签
      axisTick: { show: false }, //坐标轴刻度
      axisLine: { show: false }, //坐标轴轴线
    },
    yAxis: {
      type: "category",
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        name: "进度条背景",
        type: "bar",
        barGap: "-100%",
        barWidth: 10,
        data: [100],
        color: "#FFB6C1",
        itemStyle: {
          borderRadius: 10,
        },
      },
      {
        name: "男性比例",
        type: "bar",
        barWidth: 10,
        data: [menRate],
        color: "#22B6ED",
        itemStyle: {
          borderRadius: [10, 0, 0, 10],
        },
      },
    ],
  });
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

.intro-wrap {
  display: flex;
}

.pic-wrap {
  background: #fff;
  margin: 10px 0;
  border-radius: 30px;
}

.pic {
  width: 25vw;
  border-radius: 30px;
}

.intro {
  display: flex;
  flex-direction: column;
}

.rank-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.content-wrap {
  padding: 5px 10px 0 10px;
}

.school_rank {
  height: 100px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.school_rank_text {
  color: #f60;
  margin-bottom: 8px;
  line-height: 20px;
}

.school_rank_num {
  font-size: 30px;
  color: #f60;
  margin-right: 1px;
}

.info {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.table {
  width: 60%;
}

.charts {
  display: flex;
  flex-direction: column;
  width: 33%;
}

.gender {
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
