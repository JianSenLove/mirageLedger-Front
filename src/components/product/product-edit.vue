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
    <el-form-item label="商品图片" prop="image">
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
import { ref, onMounted } from 'vue';
import { createProduct, updateProduct, getCategoryPage,uploadImage } from '../../api/index';
import { Plus } from '@element-plus/icons-vue'

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
  image:''
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	price: [
		{ required: true, message: '请输入商品单价', trigger: 'blur' }
	],
	name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
	stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
  image: [
    {
      validator: (rule, value, callback) => {
        if (!form.value.image && !form.value.imageFile) {
          callback(new Error('请上传商品图片'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
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
  console.log(form.value);
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        let response;
        if (props.edit) {
          // 如果是编辑模式
          response = await updateProduct(props.data.id, form.value);
          if (form.value.imageFile) {
            const formData = new FormData();
            formData.append('image', form.value.imageFile);
            formData.append('id', response.id);
            await uploadImage(formData); // 调用图片上传接口
          }
        } else {
          // 如果是创建模式
          response = await createProduct(form.value);
          if (form.value.imageFile) {
            const formData = new FormData();
            formData.append('image', form.value.imageFile);
            formData.append('id', response.id); // 假设你在创建时已经有了商品ID
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

