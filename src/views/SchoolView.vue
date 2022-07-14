<template>
  <div class="school-wrap">
    <div class="search-header">
    <div class="search-box">
      <el-input
        v-model="schoolName"
        placeholder="输入学校名称"
        class="handle-input mr10"
        @keyup.enter="handleSearch"
      ></el-input>
      <el-button type="primary" class="search-button" @click="handleSearch"
        ><el-icon><Search /></el-icon>搜索</el-button
      >
    </div>
    <el-radio-group v-model="schoolClass" size="large" @change="handleSearch">
        <el-radio-button label="全部" />
        <el-radio-button label="985" />
        <el-radio-button label="211" />
        <el-radio-button label="双一流" />
        <el-radio-button label="其它" />
      </el-radio-group>
    </div>
    <div class="school-list-wrap">
      <ul>
        <li v-for="school in pageSchoolList" :key="school.id">
          <el-card shadow="hover">
            <div class="school-image">
              <img
                :src="
                  'https://static-data.gaokao.cn/upload/logo/' +
                  school.id +
                  '.jpg'
                "
                width="100px"
                height="100px"
                alt
              />
            </div>
            <div class="school-detail">
              <router-link :to="{path: '/detail', query:{id: school.id}}" target="_blank">
                <p>{{ school.name }}</p>
              </router-link>
              <span>&nbsp;&nbsp;{{ school.province }}</span>
              <span>&nbsp;&nbsp;{{ school.city }}&nbsp;&nbsp;</span>
              <span v-if="school.wen_score&&school.li_score">文科：{{ school.wen_score }}/理科：{{ school.li_score }}</span>
              <span v-else-if="school.wen_score">文科：{{ school.wen_score }}</span>
              <span v-else-if="school.li_score">理科：{{ school.li_score }}</span>
              
              <span></span>
            </div>
          </el-card>
        </li>
      </ul>
      <el-pagination
        layout="prev, pager, next, jumper"
        @current-change="currentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import request from "../utils/request.js";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const schoolName = ref("");
    const schoolClass = ref("全部");
    //构造post请求Body
    const query = computed(() => {
      const classMap = {
        "": -1,
        全部: -1,
        985: 3,
        211: 2,
        双一流: 1,
        其它: 0,
      };
      return {
        province: "",
        school_name: schoolName.value,
        school_class: classMap[schoolClass.value],
        page_size: pageSize,
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
    const pageSchoolList = ref([]);

    //学校列表
    // const schoolList = ref([]);
    const getSchoolList = () => {
      request
        .post("/getSchoolList", query.value)
        .then((res) => {
          if (res.code == 200) {
            pageSchoolList.value = res.data;
            total.value = res.page_total;
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
      schoolName,
      schoolClass,
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
  justify-content: start;
  width: 50%;
}
.el-input {
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
  height: 140px;
  border-radius: 20px;
}
/* .el-card__body {
  margin: 40px auto;
} */
.school-image {
  float: left;
  /* size: auto; */
}
img {
  float: left;
  width: 100px;
  height: 100px;
}
.school-detial {
  float: left;
}
p {
  font-size: large;
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
  color: #409eff;
}
.el-pagination {
  justify-content: center;
}
</style>
