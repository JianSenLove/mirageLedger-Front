<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="课程名称" prop="name">
			<el-input v-model="form.courseName" :disabled="edit"></el-input>
		</el-form-item>
		<el-form-item label="课程教师" prop="teacherName">
			<el-input v-model="form.userName"></el-input>
		</el-form-item>
		<el-form-item label="课程学年" prop="term">
			<el-input v-model="form.year"></el-input>
		</el-form-item>
		<el-form-item label="课程学期" prop="term">
			<el-input v-model="form.term"></el-input>
		</el-form-item>
		<el-form-item label="教学内容评价分" prop="desc">
			<el-input v-model="form.teachingContent"></el-input>
		</el-form-item>
		<el-form-item label="教学方法评价分" prop="desc">
			<el-input v-model="form.teachingMethod"></el-input>
		</el-form-item>
		<el-form-item label="课程管理评价分" prop="desc">
			<el-input v-model="form.curriculumManagement"></el-input>
		</el-form-item>
		<el-form-item label="课程考核评价分" prop="desc">
			<el-input v-model="form.courseAssessment"></el-input>
		</el-form-item>
		<el-form-item label="教学态度评价分" prop="desc">
			<el-input v-model="form.teachingAttitude"></el-input>
		</el-form-item>
		<el-form-item label="学习收获评价分" prop="desc">
			<el-input v-model="form.learningHarvest"></el-input>
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
import { createCourseEvaluation,updateCourseEvaluation } from '../../api/index';

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
	courseName: '',
	department: '',
	userId: '',
	userName: '',
	year: '',
	term: '',
	teachingContent: '',
	teachingMethod: '',
	curriculumManagement: '',
	courseAssessment: '',
	teachingAttitude: '',
	learningHarvest: '',
	createTime: '',
	updateTime: '',
};

const form = ref({ ...(props.edit ? props.data : defaultData)});

const rules: FormRules = {

};
const formRef = ref<FormInstance>();

const saveEdit = async () => {
	await formRef.value?.validate(async (valid) => {
		if (valid) {
			try {
				let response;
				if (props.edit) {
					// 如果是编辑模式
					response = await updateCourseEvaluation(props.data.id, form.value);
				} else {
					// 如果是创建模式
					form.value.userId = form.value.userName;
					console.log(form.value);
					response = await createCourseEvaluation(form.value);
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
