<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="课程名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="300" align="center"></el-table-column>
				<el-table-column prop="name" label="课程名" align="center"></el-table-column>
				<el-table-column prop="userName" label="课程教师" align="center"></el-table-column>
				<el-table-column prop="term" label="课程学年" align="center"></el-table-column>
				<el-table-column prop="desc" label="课程描述" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
				<el-table-column label="课程开设状态" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.state ? 'success' : 'danger'">
							{{ scope.row.state ? '开设中' : '已关闭' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button type="warning" size="small" :icon="View" @click="handleView(scope.row)">
							查看
						</el-button>
						<el-button
							type="primary"
							size="small"
							:icon="Edit"
							@click="handleEdit(scope.$index, scope.row)"
							v-permiss="15"
						>
							编辑
						</el-button>
						<el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="handleDelete(scope.$index)"
							v-permiss="16"
						>
							删除
						</el-button>
						<el-button type="success" size="small" :icon="View" @click="turnToEvaluation(scope.row)">
							查看课程评价
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.page"
					:page-size="query.rows"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
		<el-dialog
			:title="idEdit ? '编辑课程' : '新增课程'"
			v-model="visible"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<CourseEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="查看课程详情" v-model="visible1" width="700px" destroy-on-close>
			<CourseDetail :data="rowData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import { getCoursePage,deleteCourse,updateCourse } from '../api/index';
import CourseEdit from '../components/course/course-edit.vue';
import CourseDetail from '../components/course/course-detail.vue';

interface CourseDetail {
	id: string;
	name: string;
	teacherName: string;
	userId: string;
	term: string;
	desc: string;
	state: string;
	createTime: string;
	updateTime: string;
}

const query = reactive({
	name: '',
	page: 1,
	rows: 10
});
const tableData = ref<CourseDetail[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
	const res = await getCoursePage(query);
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
		const courseId = tableData.value[index].id;
		await deleteCourse(courseId.toString());
		tableData.value.splice(index, 1);
		ElMessage.success('删除成功');
	} catch (error) {
		if (error !== 'cancel') {
			console.error('删除失败:', error);
			ElMessage.error('删除失败');
		}
	}
};

const visible = ref(false);
let idx: number = -1;
const idEdit = ref(false);
const rowData = ref({});
const handleEdit = (index: number, row: CourseDetail) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = (row: CourseDetail) => {
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
const handleView = (row: CourseDetail) => {
	rowData.value = row;
	visible1.value = true;
};

// 跳转到课程评价
const router = useRouter();
const turnToEvaluation = (row: CourseDetail) => {
  // 假设 row.id 是课程的唯一标识
  router.push({ name: 'courseEvaluationDetail', params: { id: row.id } });
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
