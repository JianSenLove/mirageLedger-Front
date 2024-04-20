<template>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="商品名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button v-if="isAdmin" type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<!-- <el-table-column prop="id" label="ID" width="300" align="center"></el-table-column> -->
				<el-table-column prop="name" label="商品名称" align="center"></el-table-column>
				<el-table-column label="商品图片" align="center">
					<template #default="scope">
<!--						<img :src="scope.row.image" alt="商品图片" style="width: 100px; height: auto;">-->
						<img :src="`${scope.row.image}?time=${new Date().getTime()}`" alt="商品图片" style="width: 100px; height: auto;">
					</template>
				</el-table-column>
				<el-table-column prop="categoryName" label="商品类别" align="center"></el-table-column>
				<el-table-column prop="desc" label="商品描述" align="center"></el-table-column>
				<el-table-column prop="price" label="商品单价" align="center"></el-table-column>
				<el-table-column prop="stock" label="商品库存" align="center"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
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
		<el-dialog :title="idEdit ? '编辑商品' : '新增商品'" v-model="visible" width="500px" destroy-on-close
			:close-on-click-modal="false" @close="closeDialog">
			<ProductEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
			<ProductDetail :data="rowData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import { getProductPage, deleteProduct } from '../api/index';
import ProductEdit from '../components/product/product-edit.vue';
import ProductDetail from '../components/product/product-detail.vue';

const isAdmin = ref(false);

onMounted(() => {
	isAdmin.value = localStorage.getItem('ms_username') === 'admin';
});


interface ProductDetail {
	id: string;
	name: string;
	image: string; // 产品图片
	categoryName: string; // 产品类别
	price: number; // 产品单价
	stock: number; // 库存量
	createTime: string; // 创建时间
	updateTime: string; // 更新时间
}


const query = reactive({
	name: '',
	page: 1,
	rows: 10
});
const tableData = ref<ProductDetail[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = async () => {
	const res = await getProductPage(query);
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
		await deleteProduct(courseId.toString());
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
const handleEdit = (index: number, row: ProductDetail) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = (row: ProductDetail) => {
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

const visible1 = ref(false);
const handleView = (row: ProductDetail) => {
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
