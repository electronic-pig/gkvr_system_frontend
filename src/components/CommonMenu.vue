<template>
  <el-menu
    :default-active="onRoutes"
    :ellipsis="false"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item v-for="item in menu" :key="item.path" :index="item.path">
      <template v-slot:title>
        <span style="font-size: 16px">{{ item.lable }}</span>
      </template>
    </el-menu-item>

    <div class="menu-right">
      <el-button @click="showDialog">志愿表</el-button>
      <div class="user-avator">
        <el-icon>
          <Avatar />
        </el-icon>
      </div>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-menu>
  <el-dialog
    title="志愿表"
    v-model="showTableDialog"
    align-center
    center
    width="90%"
    style="height: 70%"
    ><el-table :data="userTable" height="60vh">
      <el-table-column prop="schoolName" label="学校名称" width="100px" />
      <el-table-column prop="majorA" label="专业A" />
      <el-table-column prop="majorB" label="专业B" />
      <el-table-column prop="majorC" label="专业C" />
      <el-table-column prop="majorD" label="专业D" />
      <el-table-column prop="majorE" label="专业E" />
      <el-table-column prop="majorF" label="专业F" />
      <el-table-column label="操作" width="84px">
        <template #default="scope">
          <el-button type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column></el-table
    ></el-dialog
  >
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import request from "@/utils/request";

const menu = [
  {
    path: "/home/school",
    name: "school",
    lable: "高校信息查询",
    url: "/home/school",
  },
  {
    path: "/home/major",
    name: "major",
    lable: "专业信息查询",
    url: "/home/major",
  },
  {
    path: "/home/recommend",
    name: "recommend",
    lable: "个性化志愿推荐",
    url: "/home/recommend",
  },
];
const router = useRouter();
const route = useRoute();
const username = ref(localStorage.getItem("username"));
const showTableDialog = ref(false);
const userTable = ref([]);
const VoluntaryForm = reactive({
  userName: username,
  schoolName: "",
});

const onRoutes = computed(() => {
  return route.path;
});

const handleSelect = (index) => {
  router.push(index);
};

const handleCommand = (command) => {
  if (command === "loginout") {
    localStorage.removeItem("username");
    router.push("/");
  }
};

const showDialog = async () => {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.get(
      "/userVoluntary/getVoluntary?username=" + username.value
    );
    if (response.code == 200) {
      userTable.value = response.data.userVoluntary;
      showTableDialog.value = true;
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

const handleDelete = async (row) => {
  VoluntaryForm.schoolName = row.schoolName;
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "正在加载中...",
  });
  try {
    const response = await request.post(
      "/userVoluntary/deleteVoluntary",
      VoluntaryForm
    );
    if (response.code == 200) {
      ElMessage.success("删除成功！");
      VoluntaryForm.schoolName = "";
      showDialog();
    } else {
      ElMessage.error(response.message);
    }
  } catch (error) {
    ElMessage.error(error);
  }
  loadingInstance.close();
};

</script>

<style scoped>
.menu-right {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 1%;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.user-avator {
  margin-left: 2vw;
  margin-right: 10px;
}
</style>
