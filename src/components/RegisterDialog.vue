<template>
  <el-dialog v-model="dialogFormVisible" :append-to-body="false" title="注册" width="30%" @closed="closeDialog()">
    <el-form ref="register" :rules="rules" :model="form">
      <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="checkPassword" label="重复密码" :label-width="formLabelWidth" @keyup.enter="handleRegister()">
        <el-input type="password" v-model="form.checkPassword" placeholder="请再次输入密码" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog()">取消</el-button>
        <el-button type="primary" @click="handleRegister()">注册</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import request from "../utils/request.js";
export default {
  name: "RegisterDialog",
  setup() {
    const formLabelWidth = "140px";
    const rules = {
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      checkPassword: [
        { required: true, message: "请输入校验密码", trigger: "blur" },
      ],
    };
    const form = reactive({
      username: "",
      password: "",
      checkPassword: ""
    });
    const register = ref(null);
    const handleRegister = () => {
      register.value.validate((valid) => {
        if (valid) {
          request
            .post("/register", {
              username: form.username,
              password: form.password
            })
            .then((res) => {
              // console.log(res);
              // 存token setItem(key,value)
              if (res.code == 200) {
                //sessionStorage.setItem(token, res.data.token);
                ElMessage.success("注册成功！");
                store.commit("closeRegisterDialog");
              } else {

                ElMessage.error({
                  // title: "错误",
                  message: '注册失败:' + res.message,
                });
              }
            })
            .catch((err) => {
              ElMessage.error({
                title: "错误",
                //message: "服务器内部错误",
                message: err.message
              });
            });
        } else {
          ElMessage.error("登录失败");
          return false;
        }
      });
    };
    const store = useStore();
    const dialogFormVisible = computed(() => store.state.showRegisterDialog);
    const closeDialog = () => {
      store.commit("closeRegisterDialog");
    };
    return {
      dialogFormVisible,
      formLabelWidth,
      rules,
      form,
      register,
      handleRegister,
      closeDialog,
    };
  },
};
</script>