<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="用户名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="300" align="center"></el-table-column>
				<el-table-column prop="code" label="工号" align="center"></el-table-column>
				<el-table-column prop="department" label="所属院系" align="center"></el-table-column>
				<el-table-column prop="name" label="用户名" align="center"></el-table-column>
				<el-table-column prop="desc" label="描述" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
				<el-table-column label="账号状态" width="100" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.state ? 'success' : 'danger'">
							{{ scope.row.state ? '正常' : '异常' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button type="warning" size="small" :icon="View" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button type="primary" size="small" :icon="Edit" @click="handleEdit(scope.$index, scope.row)"
							v-permiss="15">
							编辑
						</el-button>
						<el-button type="danger" size="small" :icon="Delete" @click="handleDelete(scope.$index)"
							v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.page"
					:page-size="query.rows" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>
		<el-dialog :title="idEdit ? '编辑用户' : '新增用户'" v-model="visible" width="500px" destroy-on-close
			:close-on-click-modal="false" @close="closeDialog">
			<UserEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="查看用户详情" v-model="visible1" width="700px" destroy-on-close>
			<UserDetail :data="rowData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import { getUserPage, deleteUser } from '../api/index';
import UserEdit from '../components/user/user-edit.vue';
import UserDetail from '../components/user/user-detail.vue';

interface UserDetail {
	id: string;
	code: string;
	name: string;
	department: string;
	password: string;
	desc: string;
	createTime: string;
	updateTime: string;
	state: string;
}

const query = reactive({
	name: '',
	page: 1,
	rows: 10
});
const tableData = ref<UserDetail[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
	const res = await getUserPage(query);
	tableData.value = res.records;
	pageTotal.value = res.total || 50;
};
getData();

// 查询操作
const handleSearch = () => {
	query.page = 1;
	getData();
};
// 分页导航
const handlePageChange = (val: number) => {
	query.page = val;
	getData();
};

// 删除操作
const handleDelete = async (index: number) => {
	// 二次确认删除
	try {
		await ElMessageBox.confirm('确定要删除吗？', '提示', {
			type: 'warning'
		});
		const userId = tableData.value[index].id;
		await deleteUser(userId.toString()); // 调用后端接口删除用户
		tableData.value.splice(index, 1); // 从表格数据中移除
		ElMessage.success('删除成功');
	} catch (error) {
		if (error !== 'cancel') {
			ElMessage.error(error.message);
		}
	}
};

const visible = ref(false);
let idx: number = -1;
const idEdit = ref(false);
const rowData = ref({});
const handleEdit = (index: number, row: UserDetail) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = (row: UserDetail) => {
	if (idEdit.value) {
		tableData.value[idx] = row;
	} else {
		query.page = 1;
		getData();
	}
	closeDialog();
};


const closeDialog = () => {
	visible.value = false;
	idEdit.value = false;
};

const visible1 = ref(false);
const handleView = (row: UserDetail) => {
	rowData.value = row;
	visible1.value = true;
};
</script>

<style scoped>
.search-box {
	margin-bottom: 20px;
}

.search-input {
	width: 200px;
}

.mr10 {
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
