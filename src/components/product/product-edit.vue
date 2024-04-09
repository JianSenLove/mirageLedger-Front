<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="商品名称" prop="name">
			<el-input v-model="form.name"  placeholder="商品名称"></el-input>
		</el-form-item>
		<el-form-item label="商品类别" prop="categoryId">
			<el-select v-model="form.categoryId" filterable placeholder="请选择商品类别">
				<el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name"
					:value="teacher.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="商品单价" prop="price">
			<el-input v-model="form.price" placeholder="商品单价"></el-input>
		</el-form-item>
		<el-form-item label="商品库存" prop="stock">
			<el-input v-model="form.stock" placeholder="商品库存"></el-input>
		</el-form-item>
		<el-form-item label="商品描述" prop="desc">
			<el-input type="textarea" v-model="form.desc" placeholder="商品描述"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="saveEdit(formRef)">
				{{ edit ? '保 存' : '创 建' }}
			</el-button>

		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ref, onMounted } from 'vue';
import { createProduct, updateProduct, getCategoryPage } from '../../api/index';

const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	edit: {
		type: Boolean,
		required: false
	},
	update: {
		type: Function,
		required: true
	}
});

const defaultData = {
	id: '',
	name: '',
	categoryId: '',
	stock: '',
	price: '',
	desc: '',
	createTime: '',
	updateTime: '',
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	price: [
		{ required: true, message: '请输入商品单价', trigger: 'blur' }
	],
	name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
	stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const teacherList = ref([]);

onMounted(async () => {
	try {
		const queryList = {
			page: 1,
			rows: 200
		}
		const response = await getCategoryPage(queryList);
		teacherList.value = response.records;
	} catch (error) {
		ElMessage.error(error.message);
	}
});

const saveEdit = async () => {
	await formRef.value?.validate(async (valid) => {
		if (valid) {
			try {
				let response;
				if (props.edit) {
					// 如果是编辑模式
					response = await updateProduct(props.data.id, form.value);
				} else {
					// 如果是创建模式
					response = await createProduct(form.value);
				}
				props.update(response);
				ElMessage.success(props.edit ? '保存成功！' : '创建成功！');
			} catch (error) {
				ElMessage.error(error.message);
			}
		}
	});
};
</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
