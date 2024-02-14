<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="课程名称" prop="name">
			<el-input v-model="form.name" :disabled="edit"></el-input>
		</el-form-item>
		<el-form-item label="课程教师" prop="teacherName">
			<el-input v-model="form.teacherName"></el-input>
		</el-form-item>
		<el-form-item label="课程学年" prop="term">
			<el-input v-model="form.term"></el-input>
		</el-form-item>
		<el-form-item label="课程描述" prop="desc">
			<el-input type="textarea" v-model="form.desc"></el-input>
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
import { ref } from 'vue';
import { createCourse, updateCourse } from '../../api/index';

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
	teacherName: '',
	userId: '',
	term: '',
	desc:'',
	createTime: '',
	updateTime: '',
};

const form = ref({ ...(props.edit ? props.data : defaultData)});

const rules: FormRules = {
	teacherName: [{ required: true, message: '请选择教师', trigger: 'blur' }],
	term: [
	{ required: true, message: '请输入年份', trigger: 'blur' }
	],
	name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();

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
					form.value.userId = form.value.teacherName;
					console.log(form.value);
					response = await createCourse(form.value);
				}
				props.update(response);
				ElMessage.success(props.edit ? '保存成功！' : '创建成功！');
			} catch (error) {
				ElMessage.error(error.message || (props.edit ? '保存失败！' : '创建失败！'));
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
