<template>
  <div class="common-menu">
    <div class="menu-wrap">
      <el-menu :default-active="onRoutes" class="el-menu" mode="horizontal" :ellipsis="false" background-color="#FFFFFF"
        @select="handleSelect">
        <el-menu-item v-for="item in menu" :key="item.path" :index="item.path" >
          <template v-slot:title>
            <span style="font-size: 15px;">{{ item.lable }}</span>
          </template>
        </el-menu-item>
        <div class="menu-right">
          <el-button @click="clickSelect">志愿表</el-button>
          <div class="user-avator">
            <el-icon>
              <Avatar />
            </el-icon>
          </div>
          <el-dropdown class="user-name" trigger="click" @command="handleCommand">
            <div class="el-dropdown-link">
              <span><b>{{ userData.name }}</b>
                <el-icon>
                  <CaretBottom />
                </el-icon>
              </span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
import router from '@/router'
export default {
  setup() {
    const menu = [
      {
        path: "/home/school",
        name: "school",
        lable: "高校信息查询",
        url: "/home/school",
      },
      {
        path: "/home/special",
        name: "special",
        lable: "专业信息查询",
        url: "/home/special",
      },
      {
        path: "/home/recommend",
        name: "recommend",
        lable: "个性化志愿推荐",
        url: "/home/recommend",
      },
    ];
    const route = useRoute();
    const onRoutes = computed(() => {
      return route.path;
    });
    const store = useStore();
    const userData = {
      name: localStorage.getItem("ms_username"),
      balance: 20,
    };
    const handleSelect = (index) => {
      router.push(index);
    };
    const handleCommand = (command) => {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        router.push("/login");
      }
    };
    const clickSelect = () => {
      store.commit("showSelectDialog");
    };
    return {
      userData,
      onRoutes,
      menu,
      handleSelect,
      handleCommand,
      clickSelect,
    };
  },
};
</script>
<style scoped>
b {
  color: #f5940c;
}

.common-menu {
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-wrap {
  flex-grow: 3;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-name {
  margin-left: 10px;
}

.el-dropdown-link {
  color: #000;
  cursor: pointer;
  vertical-align: middle;
}

.menu-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  margin-left: auto;
  padding-right: 20px;
}
</style>

