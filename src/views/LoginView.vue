<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">高考志愿推荐平台</div>
      <el-form class="ms-content" :model="form" :rules="rules" ref="login" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名">
            <template #prepend>
              <el-icon>
                <Avatar />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="form.password" @keyup.enter="clickLogin()">
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="clickLogin()">登录</el-button>
          <el-button type="primary" @click="clickRegister()">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
  <register-dialog></register-dialog>
</template>

<script>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex"
import router from '@/router'
import request from "../utils/request.js";
import RegisterDialog from "../components/RegisterDialog.vue"
export default {
  components: {
    RegisterDialog
  },
  setup() {
    //测试用
    const handleLogin = () => {
      router.push('/home');
      localStorage.setItem("ms_username", "admin");
      localStorage.setItem("ms_userid", "1");
    };
    const form = reactive({
      username: "",
      password: "",
    });
    const rules = {
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };
    const login = ref(null);
    const clickLogin = () => {
      login.value.validate((valid) => {
        if (valid) {
          request
            .post("/user/login", form)
            .then((res) => {
              if (res.code == 20000) {
                ElMessage.success("登录成功");
                router.push("/home");
                localStorage.setItem("ms_username", res.data.user.username);
                localStorage.setItem("ms_userid", res.data.user.id);
              } else {
                ElMessage.error({
                  message: '登录失败:' + res.message,
                });
              }
            })
            .catch((err) => {
              ElMessage.error({
                message: '服务器错误：' + err.statusText
              });
            });
        } else {
          ElMessage.error("登录失败！");
          return false;
        }
      });
    };
    const store = useStore();
    const clickRegister = () => {
      store.commit("showRegisterDialog");
    }
    return {
      form,
      rules,
      login,
      clickLogin,
      handleLogin,
      clickRegister
    };
  },
};
</script>

<style scoped>
.login-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../assets/background.png);
  background-size: 100%;
  animation: slide-bottom 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #000;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 60%;
  width: 380px;
  height: 250px;
  margin: -190px 0 0 -175px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  animation: slide-bottom-up 0.5s cubic-bezier(.64, 1.4, .49, .96) both;
  animation-delay: 200ms;
}

.ms-content {
  padding: 30px 30px;
}

.el-input {
  width: 100%;
}

.login-btn {
  text-align: center;
  display: flex;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

@keyframes slide-bottom {
  0% {
    transform: translateY(-500px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes slide-bottom-up {
  0% {
    transform: translateY(-500px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>