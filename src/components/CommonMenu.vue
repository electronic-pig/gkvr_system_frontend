<template>
  <div class="common-menu">
    <div class="menu-wrap">
      <el-menu :default-active="onRoutes" class="el-menu" mode="horizontal" :ellipsis="false" background-color="#FFFFFF"
        router>
        <!--:default-active="activeIndex"-->
        <el-menu-item v-for="item in menu" :index="item.path" :key="item.path">
          <template v-slot:title>
            <span>{{ item.lable }}</span>
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const menu = [
      {
        path: "/home/school",
        name: "school",
        lable: "高校信息查询",
        icon: "s-home",
        url: "/home/school",
      },
      {
        path: "/home/special",
        name: "special",
        lable: "专业信息查询",
        icon: "video-play",
        url: "/home/special",
      },
      {
        path: "/home/recommend",
        name: "recommend",
        lable: "个性化志愿推荐",
        icon: "user",
        url: "/home/recommend",
      },
    ];
    //const router = useRouter();
    const clickMenu = () => {
      // router.push({
      //   path: '/home/' + item.name,
      // });
    };
    const route = useRoute();
    const onRoutes = computed(() => {
      return route.path;
    });
    //const store = useStore();
    const userData = {
      name: localStorage.getItem("ms_username"),
      balance: 20,
    };
    const router = useRouter();
    const handleCommand = (command) => {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        router.push("/login");
      }
    };
    const store = useStore();
    const clickSelect = () => {
      store.commit("showSelectDialog");
    };
    return {
      menu,
      clickMenu,
      userData,
      onRoutes,
      handleCommand,
      clickSelect
    };
  },
};
</script>
<style scoped>
b {
  color: #409EFF;
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

.button-wrap {
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  margin-left: auto;
  padding-right: 20px;
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
  /*vertical-align: middle;*/
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

