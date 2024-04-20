<template>
	<div>
		<div class="container">
			<div class="search-box">
        <el-select v-model="query.status" placeholder="订单状态" class="search-input mr10" clearable>
          <el-option
              v-for="option in orderStatusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value">
          </el-option>
        </el-select>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				 <el-table-column prop="id" label="订单编号" width="300" align="center"></el-table-column>
				<el-table-column prop="userId" label="订单所属用户" align="center"></el-table-column>
				<el-table-column prop="orderPrice" label="订单总价" align="center"></el-table-column>
				<el-table-column prop="status" label="订单状态" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
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
			:title="idEdit ? '编辑订单' : '新增订单'"
			v-model="visible"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<OrderEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive,  } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search } from '@element-plus/icons-vue';
import { getOrderPage,deleteOrder } from '../api/index';
import OrderEdit from '../components/order/order-edit.vue';

interface OrderDetail {
	id: string;
	userId: string;
  orderPrice: string;
  status: string;
	createTime: string;
	updateTime: string;
}

const query = reactive({
  status: '',
	page: 1,
	rows: 10
});

const orderStatusOptions = ref([
  { label: '待付款', value: '待付款' },
  { label: '待发货', value: '待发货' },
  { label: '待收货', value: '待收货' },
  { label: '售后', value: '售后' },
  { label: '已完成', value: '已完成' }
]);

const tableData = ref<OrderDetail[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
	const res = await getOrderPage(query);
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
		await deleteOrder(evaluationId.toString());
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
const handleEdit = (index: number, row: OrderDetail) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = (row: OrderDetail) => {
	if (idEdit.value) {
		tableData.value[idx] = row;
	} else {
		query.page = 1;
	}
  getData();
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
