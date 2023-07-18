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
    <el-radio-group v-model="specialClass" size="large" @change="handleSearch">
      <el-radio label="全部" />
      <el-radio v-for="item in classList" :key="item.id" :label="item.name" />
    </el-radio-group>
    <div class="special-list-wrap">
      <ul>
        <li v-for="special in pageSpecialList" :key="special.id">
          <el-card shadow="hover">
            <div class="major_list_title">{{ special.majorName }}</div>
            <div class="major_list_tags">
              <span>专业代码：{{special.majorCode}}</span>&nbsp;|&nbsp;
              <span>类别：{{special.typeId}}</span>&nbsp;|&nbsp;
              <span>修业年限：{{special.years}}</span>&nbsp;|&nbsp;
              <span>授予学位：{{special.degree}}</span>
            </div>
          </el-card>
        </li>
      </ul>
      <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize" :total="total"
        layout="prev, pager, next, jumper" @current-page="currentChange" @page-size="sizeChange" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import request from "../utils/request.js";
const pageNum = ref(1);
const pageSize = 10;
const total = ref(0);
const specialName = ref("");
const specialLevel = ref("本科");
const specialClass = ref("全部")
const pageSpecialList = ref([]);
export default {
  watch: {
    pageNum() {
      this.getSpecialList();
    }
  },
  setup() {
    const classList = computed(() => {
      const benList = [
        {
          id: 3,
          name: '哲学',
        },
        {
          id: 4,
          name: '经济学',
        },
        {
          id: 5,
          name: '法学',
        },
        {
          id: 6,
          name: '教育学',
        },
        {
          id: 7,
          name: '文学',
        },
        {
          id: 8,
          name: '历史学',
        },
        {
          id: 9,
          name: '理学',
        },
        {
          id: 10,
          name: '工学',
        },
        {
          id: 11,
          name: '农学',
        },
        {
          id: 12,
          name: '医学',
        },
        {
          id: 13,
          name: '管理学',
        },
        {
          id: 14,
          name: '艺术学',
        },
      ];
      const zhuanList = [
        {
          id: 15,
          name: '农林牧渔大类',
        },
        {
          id: 16,
          name: '资源环境与安全大类',
        },
        {
          id: 17,
          name: '能源动力与材料大类',
        },
        {
          id: 18,
          name: '土木建筑大类',
        },
        {
          id: 19,
          name: '水利大类',
        },
        {
          id: 20,
          name: '装备制造大类',
        },
        {
          id: 21,
          name: '生物与化工大类',
        },
        {
          id: 22,
          name: '轻工纺织大类',
        },
        {
          id: 23,
          name: '食品药品与粮食大类',
        },
        {
          id: 24,
          name: '交通运输大类',
        },
        {
          id: 25,
          name: '电子与信息大类',
        },
        {
          id: 26,
          name: '医药卫生大类',
        },
        {
          id: 27,
          name: '财经商贸大类',
        },
        {
          id: 28,
          name: '旅游大类',
        },
        {
          id: 29,
          name: '文化艺术大类',
        },
        {
          id: 30,
          name: '新闻传播大类',
        },
        {
          id: 31,
          name: '教育与体育大类',
        },
        {
          id: 32,
          name: '公安与司法大类',
        },
        {
          id: 33,
          name: '公共管理与服务大类',
        },
      ];
      if (specialLevel.value == "专科（高职）") {
        return zhuanList;
      } else {
        return benList;
      }
    });
    //构造post请求Body
    const form = computed(() => {
      return {
        name: specialName.value,
        level: specialLevel.value,
        class: specialClass.value == '全部' ? '' : specialClass.value,
        page_size: pageSize,
        page_index: pageNum.value - 1,
      };
    });
    const getSpecialList = () => {
      request
        .get("/majorInfo?page=" + pageNum.value)
        .then((res) => {
          if (res.code == 20000) {
            pageSpecialList.value = res.data.majors;
            total.value = res.data.totalpage;
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
      form,
      pageNum,
      pageSize,
      total,
      pageSpecialList,
      getSpecialList,
      currentChange,
      sizeChange,
      handleSearch,
    };
  },
};
</script>

<style>
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

.special-detial {
  float: left;
}

p {
  font-size: large;
}

.el-pagination {
  justify-content: center;
}
.major_list_title{
  font-size: 20px;
  color: #000;
  margin-bottom: 10px;
  font-weight: 600;
  transition: all .4s;
}
.major_list_title:hover{
  color: #f5940c;
  cursor: pointer;;
}
.major_list_tags{
  margin-top: 3px;
}
</style>