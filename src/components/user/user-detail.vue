<template>
	<el-descriptions title="" :column="2" border>
		<el-descriptions-item>
			<template #label> ID </template>
			{{ data.id }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 工号 </template>
			{{ data.code }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 用户名 </template>
			{{ data.name }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 密码 </template>
			{{ data.password }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 创建时间 </template>
			{{ data.createTime }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 更新时间 </template>
			{{ data.updateTime }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 账户状态 </template>
			{{ data.state ? '正常' : '异常' }}
		</el-descriptions-item>
	</el-descriptions>
</template>

<script lang="ts" setup>
const props = defineProps({
	data: {
		type: Object,
		required: true
	}
});
</script>
