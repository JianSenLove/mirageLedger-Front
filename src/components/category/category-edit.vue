<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="类别名称" prop="name">
			<el-input v-model="form.name"  placeholder="类别名称"></el-input>
		</el-form-item>
		<el-form-item label="描述" prop="desc">
			<el-input type="textarea" v-model="form.desc" placeholder="描述"></el-input>
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
import { createCategory, updateCategoty, getCategoryPage } from '../../api/index';

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
	desc: '',
	createTime: '',
	updateTime: '',
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
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
					response = await updateCategoty(props.data.id, form.value);
				} else {
					// 如果是创建模式
					response = await createCategory(form.value);
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
