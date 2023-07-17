<template>
  <el-dialog v-model="dialogFormVisible" :append-to-body="false" title="注册" width="30%" @closed="closeDialog()"
    style="border-radius: 10px;">
    <el-form ref="register" :rules="rules" :model="form">
      <el-form-item prop="username" label="用户名" :label-width="140">
        <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="password" label="密码" :label-width="140">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="checkPassword" label="重复密码" :label-width="140" @keyup.enter="handleRegister()">
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
    const store = useStore();
    const closeDialog = () => {
      store.commit("closeRegisterDialog");
    };
    const dialogFormVisible = computed(() => store.state.showRegisterDialog);
    const rules = {
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      checkPassword: [{ required: true, message: "请输入校验密码", trigger: "blur" }],
    };
    const form = reactive({
      username: "",
      password: "",
      checkPassword: ""
    });
    const register = ref(null);
    const handleRegister = () => {
      if (form.password != form.checkPassword) {
        ElMessage.error("两次密码输入不一致");
        return;
      }
      if (form.password.length < 6) {
        ElMessage.error("密码长度太短");
        return;
      }
      register.value.validate((valid) => {
        if (valid) {
          request
            .post("/user/register", {
              username: form.username,
              password: form.password
            })
            .then((res) => {
              if (res.code == 20000) {
                ElMessage.success("注册成功！");
                store.commit("closeRegisterDialog");
              } else {
                ElMessage.error({
                  title: "错误",
                  message: '注册失败:' + res.message,
                });
              }
            })
            .catch((err) => {
              ElMessage.error({
                title: "错误",
                message: err.message
              });
            });
        } else {
          ElMessage.error("注册失败");
          return false;
        }
      });
    };
    return {
      dialogFormVisible,
      rules,
      form,
      register,
      handleRegister,
      closeDialog,
    };
  },
};
</script>