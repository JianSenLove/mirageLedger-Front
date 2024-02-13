<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="工号" prop="code">
			<el-input v-model="form.code" :disabled="edit"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input type="password" v-model="form.password"></el-input>
		</el-form-item>
		<el-form-item label="确认密码" prop="confirmPassword">
			<el-input type="password" v-model="form.confirmPassword"></el-input>
		</el-form-item>
		<el-form-item label="教师名称" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="教师描述" prop="desc">
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
import { ref, watch } from 'vue';
import { updateUser, register } from '../../api/index';

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
	code: '',  // 用户登录账号
	password: '',  // 账号密码
	confirmPassword: '',  // 确认密码
	name: '',  // 用户名称
	desc: '',  // 用户描述
};

const form = ref({ ...(props.edit ? props.data : defaultData), passwordEdited: false });

// 监听密码字段的变化来更新 passwordEdited 标记
watch(
	() => form.value.password,
	(newVal, oldVal) => {
		if (newVal !== oldVal && (!props.data.password || newVal !== props.data.password)) {
			form.value.passwordEdited = true;
		} else {
			form.value.passwordEdited = false;
		}
	}
);

const validateConfirmPassword = (rule, value, callback) => {
	// 当处于编辑模式并且没有填写密码时，不需要验证确认密码
	if (props.edit && !form.value.passwordEdited) {
		callback();
	} else {
		// 如果密码和确认密码不一致，则报错
		if (value === '') {
			callback(new Error('请再次输入密码'));
		} else if (value !== form.value.password) {
			callback(new Error('两次输入密码不一致'));
		} else {
			callback();
		}
	}
};

const rules: FormRules = {
	code: [{ required: true, message: '请输入工号', trigger: 'blur' }],
	password: [
		{ required: true, message: '请输入账号密码', trigger: 'blur' },
		{ min: 1, message: '密码长度不能少于1位', trigger: 'blur' }
	],
	confirmPassword: [
		{ required: props.edit ? form.value.passwordEdited : true, message: '请确认密码', trigger: 'blur' },
		{ validator: validateConfirmPassword, trigger: 'blur' }
	],
	name: [{ required: true, message: '请输入教师名称', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();

const saveEdit = async () => {
	await formRef.value?.validate(async (valid) => {
		if (valid) {
			try {
				let response;
				if (props.edit) {
					// 如果是编辑模式
					response = await updateUser(props.data.id, form.value);
				} else {
					// 如果是创建模式
					response = await register(form.value);
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
