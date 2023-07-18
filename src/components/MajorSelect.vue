<template>
	<el-dialog v-model="dialogFormVisible" :append-to-body="false" title="志愿表" width="50%" @open="handleOpen()"
		@closed="closeDialog()">
		<el-table :data="majorScoreList" height="1100" style="width: 100%" :default-sort="{ prop: 'score', order: 'descending' }">
			<el-table-column prop="spname" label="专业名称" />
			<el-table-column prop="localBatchName" label="录取批次" />
			<el-table-column prop="min" label="最低分" />
			<el-table-column prop="minSection" label="最低位次" />
			<el-table-column label="选择">
			  <template slot-scope="scope">
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
const selectList = ref([]);
export default {
	name: "SelectDialog",
	setup() {
		const handleOpen = () => {
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