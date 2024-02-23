<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="课程名称" prop="name">
			<el-input v-model="form.name" :disabled="edit" placeholder="课程名称"></el-input>
		</el-form-item>
		<el-form-item label="课程教师" prop="userId">
			<el-select v-model="form.userId" filterable placeholder="请选择教师">
				<el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name"
					:value="teacher.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="课程学年" prop="year">
			<el-input v-model="form.year" placeholder="格式:2021-2022"></el-input>
		</el-form-item>
		<el-form-item label="课程学期" prop="term">
			<el-input v-model="form.term" placeholder="1或2"></el-input>
		</el-form-item>
		<el-form-item label="课程描述" prop="desc">
			<el-input type="textarea" v-model="form.desc" placeholder="课程描述"></el-input>
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
import { createCourse, updateCourse, getUserPage } from '../../api/index';

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
	userName: '',
	userId: '',
	year: '',
	term: '',
	desc: '',
	createTime: '',
	updateTime: '',
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	userId: [{ required: true, message: '请选择教师', trigger: 'blur' }],
	term: [
		{ required: true, message: '请输入学期', trigger: 'blur' }
	],
	name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
	year: [{ required: true, message: '请输入学年', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const teacherList = ref([]);

onMounted(async () => {
	try {
		const queryList = {
			page: 1,
			rows: 200
		}
		const response = await getUserPage(queryList);
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
					response = await updateCourse(props.data.id, form.value);
				} else {
					// 如果是创建模式
					form.value.userId = form.value.userName;
					console.log(form.value);
					response = await createCourse(form.value);
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
