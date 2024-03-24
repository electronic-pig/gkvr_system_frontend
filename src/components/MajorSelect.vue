<template>
  <el-dialog v-model="dialogFormVisible" :append-to-body="false" title="志愿表" width="70%" @open="handleOpen()"
    @closed="handleClose()">
    <el-table :data="majorScoreList" height="1100" style="width: 100%"
      :default-sort="{ prop: 'score', order: 'descending' }">
      <el-table-column prop="spname" label="专业名称" width="550"/>
      <el-table-column prop="localBatchName" label="录取批次" />
      <el-table-column prop="min" label="最低分" />
      <el-table-column prop="minSection" label="最低位次" />
      <el-table-column label="选择" width="100">
        <template v-slot="scope">
          <el-checkbox v-model="scope.row.selected"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="commit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import request from "../utils/request.js";
const majorScoreList = ref([]);
export default {
  name: "SelectDialog",
  setup() {
    const store = useStore();
    const schoolId = computed(() => store.state.schoolId);
    const handleOpen = () => {
      request
        .get("/schoolInfo/schoolDetail?schoolId=" + schoolId.value)
        .then((res) => {
          if (res.code == 20000) {
            majorScoreList.value = res.data.SchoolDetail[0].majorScoreList;
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
    const commit = () => {
      const schoolId = computed(() => store.state.schoolId);
      const selectedMajors = majorScoreList.value.filter((item) => item.selected).map((item) => item.spname);
      if (selectedMajors.length > 6) {
        ElMessage.warning("最多选择6个专业！");
        return;
      }
      if (selectedMajors.length == 0) {
        ElMessage.warning("至少选择1个专业！");
        return;
      }
      const form = {
        "userId": localStorage.getItem("ms_userid"),
        "schoolId": schoolId.value,
        "majorIdA": selectedMajors.length >= 1 ? selectedMajors[0] : "",
        "majorIdB": selectedMajors.length >= 2 ? selectedMajors[1] : "",
        "majorIdC": selectedMajors.length >= 3 ? selectedMajors[2] : "",
        "majorIdD": selectedMajors.length >= 4 ? selectedMajors[3] : "",
        "majorIdE": selectedMajors.length >= 5 ? selectedMajors[4] : "",
        "majorIdF": selectedMajors.length >= 6 ? selectedMajors[5] : "",
        "count": selectedMajors.length
      }
      request
        .post("/userVoluntary/addVoluntary", form)
        .then((res) => {
          if (res.code == 20000) {
            ElMessage.success("添加成功！");
          } else {
            ElMessage.error({
              message: '添加失败:' + res.message,
            });
          }
        })
        .catch((err) => {
          ElMessage.error({
            title: "错误",
            message: err.message
          });
        });
      handleClose();
    };
    const handleClose = () => {
      store.commit("closeMajorSelect");
    };
    const dialogFormVisible = computed(() => store.state.showMajorSelect);
    return {
      majorScoreList,
      dialogFormVisible,
      handleOpen,
      handleClose,
      commit,
    };
  },
};
</script>