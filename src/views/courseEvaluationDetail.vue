<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.courseId" placeholder="课程名" class="search-input mr10" clearable></el-input>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
				<el-button type="success" :icon="CirclePlusFilled" @click="generateComprehensiveEvaluation">生成课程综合评价指标</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="300" align="center"></el-table-column>
				<el-table-column prop="courseName" label="课程名" align="center"></el-table-column>
				<el-table-column prop="department" label="所属院系" align="center"></el-table-column>
				<el-table-column prop="userName" label="教师名称" align="center"></el-table-column>
				<el-table-column prop="year" label="学年" align="center"></el-table-column>
				<el-table-column prop="term" width="40" label="学期" align="center"></el-table-column>
				<el-table-column prop="comment" width="80" label="学生评论" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="handleDelete(scope.$index)"
							v-permiss="16"
						>
							删除
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
			<CommentEdit :data="rowData" :edit="idEdit" :update="updateData" :courseId="route.params.id" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, CirclePlusFilled } from '@element-plus/icons-vue';
import { getCourseCommentPage,deleteCourseComment } from '../api/index';
import CommentEdit from '../components/comment/comment-edit.vue';
import CommentDetail from '../components/comment/comment-detail.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface CommentDetail {
	id: string;
	courseName: string;
	department: string;
	userId: string;
	userName: string;
	year: string;
	term: string;
	comment: string;
	createTime: string;
	updateTime: string;
}

const query = reactive({
	courseId: route.params.id,
	page: 1,
	rows: 10
});
const tableData = ref<CommentDetail[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
	const res = await getCourseCommentPage(query);
	tableData.value = res.records;
	pageTotal.value = res.total || 50;
};
getData();

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
		const commentId = tableData.value[index].id;
		await deleteCourseComment(commentId.toString());
		tableData.value.splice(index, 1);
		ElMessage.success('删除成功');
	} catch (error) {
		if (error !== 'cancel') {
			ElMessage.error('删除失败');
		}
	}
};

const generateComprehensiveEvaluation = () => {
	ElMessage.success('生成成功');
};


const visible = ref(false);
let idx: number = -1;
const idEdit = ref(false);
const rowData = ref({});

const updateData = (row: CommentDetail) => {
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
