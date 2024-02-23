<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.courseName" placeholder="课程名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<!-- <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button> -->
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="300" align="center"></el-table-column>
				<el-table-column prop="courseName" label="课程名" align="center"></el-table-column>
				<el-table-column prop="department" label="所属院系" align="center"></el-table-column>
				<el-table-column prop="userName" label="教师名称" align="center"></el-table-column>
				<el-table-column prop="year" label="学年" align="center"></el-table-column>
				<el-table-column prop="term" width="40" label="学期" align="center"></el-table-column>
				<!-- <el-table-column prop="teachingContent" width="80" label="教学内容评价分" align="center"></el-table-column>
				<el-table-column prop="teachingMethod" width="80" label="教学方法评价分" align="center"></el-table-column>
				<el-table-column prop="curriculumManagement" width="80" label="课程管理评价分" align="center"></el-table-column>
				<el-table-column prop="courseAssessment" width="80" label="课程考核评价分" align="center"></el-table-column>
				<el-table-column prop="teachingAttitude" width="80" label="教学态度评价分" align="center"></el-table-column>
				<el-table-column prop="learningHarvest" width="80" label="学习收获评价分" align="center"></el-table-column> -->
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<!-- <el-button
							type="primary"
							size="small"
							:icon="Edit"
							@click="handleEdit(scope.$index, scope.row)"
							v-permiss="15"
						>
							编辑
						</el-button> -->
						<!-- <el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="handleDelete(scope.$index)"
							v-permiss="16"
						>
							删除
						</el-button> -->
						<el-button type="success" size="small" :icon="View" @click="turnToEvaluation(scope.row)">
							查看分析图
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
			:title="idEdit ? '编辑评价' : '新增评价'"
			v-model="visible"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<EvaluationEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="查看课程评价详情" v-model="visible1" width="700px" destroy-on-close>
			<EvaluationDetail :data="rowData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive,  } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import { getCourseEvaluationPage,deleteCourseEvaluation } from '../api/index';
import EvaluationEdit from '../components/evaluation/evaluation-edit.vue';
import EvaluationDetail from '../components/evaluation/evaluation-detail.vue';

interface EvaluationDetail {
	id: string;
	courseName: string;
	department: string;
	userId: string;
	userName: string;
	year: string;
	term: string;
	teachingContent: string;
	teachingMethod: string;
	curriculumManagement: string;
	courseAssessment: string;
	teachingAttitude: string;
	learningHarvest: string;
	state: boolean;
	createTime: string;
	updateTime: string;
}

const query = reactive({
	courseName: '',
	page: 1,
	rows: 10
});

const tableData = ref<EvaluationDetail[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
	const res = await getCourseEvaluationPage(query);
	tableData.value = res.records;
	pageTotal.value = res.total || 0;
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
		const evaluationId = tableData.value[index].id;
		await deleteCourseEvaluation(evaluationId.toString());
		tableData.value.splice(index, 1);
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
const handleEdit = (index: number, row: EvaluationDetail) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = (row: EvaluationDetail) => {
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
const handleView = (row: EvaluationDetail) => {
	rowData.value = row;
	visible1.value = true;
};

// 跳转到课程评价
const router = useRouter();
const turnToEvaluation = (row: EvaluationDetail) => {
  router.push({ name: 'courseEvaluationEchars', params: { evaluationId: row.id } });
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
