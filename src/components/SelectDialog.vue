<template>
	<el-dialog v-model="dialogFormVisible" :append-to-body="false" title="志愿表" width="1025px" @open="handleGetSelect()"
		@closed="closeDialog()">
		<el-table :data="selectList" :stripe="true" >
			<el-table-column property="schoolName" label="学校名称" width="150" header-align="center" align="center"/>
			<el-table-column label="专业名称" width="750" header-align="center">
				<template #default="scope">
					<div v-for="item in ['A','B','C','D','E','F']" :key="item">
						<div v-if="scope.row[`majorId${item}`]">
							专业{{item}}：{{ scope.row[`majorId${item}`] }}
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" header-align="center">
				<template #default="scope">
					<el-button  type="danger" size="default" center @click="handleDelSelect(scope.row.schoolId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog()">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import request from "../utils/request.js";
const selectList = ref([]);
export default {
	name: "SelectDialog",
	setup() {
		const handleGetSelect = () => {
			request
				.get("/userVoluntary/getVoluntary?userId=" + localStorage.getItem("ms_userid")
				)
				.then((res) => {
					if (res.code == 20000) {
						selectList.value = res.data.userVoluntary;
					} else {
						ElMessage.error({
							message: '获取失败:' + res.message,
						});
					}
				})
				.catch((err) => {
					ElMessage.error({
						message: err.message
					});
				});
		};
		const handleDelSelect = (schoolId) => {
			request
				.post("/userVoluntary/deleteVoluntary", {
					userId: localStorage.getItem("ms_userid"),
					schoolId: schoolId
				})
				.then((res) => {
					if (res.code == 20000) {
						ElMessage.success("删除成功！");
						handleGetSelect();
					} else {
						ElMessage.error({
							message: '删除失败:' + res.message,
						});
					}
				})
				.catch((err) => {
					ElMessage.error({
						title: "错误",
						message: err.message
					});
				});
				handleGetSelect();
		};
		const store = useStore();
		const dialogFormVisible = computed(() => store.state.showSelectDialog);
		const closeDialog = () => {
			store.commit("closeSelectDialog");
		};
		return {
			selectList,
			dialogFormVisible,
			handleGetSelect,
			handleDelSelect,
			closeDialog,
		};
	},
};
</script>