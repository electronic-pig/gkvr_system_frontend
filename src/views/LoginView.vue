<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">高考志愿推荐平台</div>
      <el-form :model="form" :rules="rules" ref="login" label-width="0px" class="ms-content">
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
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
  <register-dialog></register-dialog>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex"
import request from "../utils/request.js";
import RegisterDialog from "../components/RegisterDialog.vue"
export default {
  components: {
    RegisterDialog
  },
  setup() {
    const router = useRouter();
    const handleLogin = () => {
      router.push({
        name: "home",
      });
    };
    const form = reactive({
      username: "",
      password: "",
    });
    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
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
                localStorage.setItem("ms_username", form.username);
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
      handleLogin,
      form,
      rules,
      login,
      clickLogin,
      clickRegister
    };
  },
};
</script>

<style scoped>
.login-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(../assets/login-bg.jpg);
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
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
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

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
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
}</style>