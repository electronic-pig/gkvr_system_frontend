<template>
	<el-dialog v-model="dialogFormVisible" :append-to-body="false" title="志愿表" width="50%" @open="handleGetSelect()"
		@closed="closeDialog()">
		<el-table :data="selectList">
			<el-table-column property="name" label="学校名称" width="150" />
			<el-table-column property="possible" label="录取概率" width="200" />
			<el-table-column label="操作">
				<template #default="scope">
					<el-button link type="primary" size="small" @click="handleDelSelect(scope.$index)">删除</el-button>
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
				.get("/getselect" + localStorage.getItem("ms_username")
				)
				.then((res) => {
					if (res.code == 20000) {
						selectList.value = res.data;
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
		const handleDelSelect = (index) => {
			request
				.post("/delselect", {
					username: localStorage.getItem("ms_username"),
					id: selectList.value[index].id
				})
				.then((res) => {
					if (res.code == 200) {
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