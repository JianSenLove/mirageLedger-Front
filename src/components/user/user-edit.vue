<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="登录账号" prop="code">
			<el-input v-model="form.code"></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input type="password" v-model="form.password"></el-input>
		</el-form-item>
		<el-form-item label="确认密码" prop="confirmPassword">
			<el-input type="password" v-model="form.confirmPassword"></el-input>
		</el-form-item>
		<el-form-item label="用户名" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="描述" prop="desc">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
    <el-form-item label="用户头像" prop="image">
      <el-upload
          class="avatar-uploader"
          action="//jsonplaceholder.typicode.com/posts/"
          show-file-list="false"
          :on-change="handleAvatarChange"
          :before-upload="beforeAvatarUpload">
        <img v-if="form.image" :src="form.image" class="avatar">
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
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
import {updateUser, register, uploadImage} from '../../api/index';
import {Plus} from "@element-plus/icons-vue";

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
  image:''
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
	code: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
	password: [
		{ required: true, message: '请输入账号密码', trigger: 'blur' },
		{ min: 1, message: '密码长度不能少于1位', trigger: 'blur' }
	],
	confirmPassword: [
		{ required: props.edit ? form.value.passwordEdited : true, message: '请确认密码', trigger: 'blur' },
		{ validator: validateConfirmPassword, trigger: 'blur' }
	],
	name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  image: [
    {
      validator: (rule, value, callback) => {
        if (!form.value.image && !form.value.imageFile) {
          callback(new Error('请上传用户头像'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
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
          if (form.value.imageFile) {
            const formData = new FormData();
            formData.append('image', form.value.imageFile);
            formData.append('id', response.id);
            await uploadImage(formData); // 调用图片上传接口
          }
				} else {
					// 如果是创建模式
					response = await register(form.value);
          if (form.value.imageFile) {
            const formData = new FormData();
            formData.append('image', form.value.imageFile);
            formData.append('id', response.id);
            await uploadImage(formData); // 调用图片上传接口
          }
				}
				props.update(response);
				ElMessage.success(props.edit ? '保存成功！' : '创建成功！');
			} catch (error) {
				ElMessage.error(error.message);
			}
		}
	});
};

const handleAvatarChange = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.image = e.target.result; // 显示预览图
  };
  reader.readAsDataURL(file.raw); // 将文件读取为DataURL
  form.value.imageFile = file.raw; // 存储文件对象，稍后上传
};



const beforeAvatarUpload = (file: File) => {
  // 你可以在这里添加一些文件验证逻辑，比如文件大小、类型等
  return false; // 阻止自动上传
};
</script>

<style>
.avatar-uploader .el-upload {
  width: 100px; /* 调整宽度 */
  height: 100px; /* 调整高度 */
  line-height: 100px; /* 调整行高来垂直居中 */
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader-icon {
  font-size: 32px;
}

.avatar {
  max-width: 100%; /* 使图片最大宽度不超过容器宽度 */
  max-height: 200px; /* 设置图片的最大高度 */
  border-radius: 4px; /* 如果需要，可以添加圆角效果 */
}
</style>
