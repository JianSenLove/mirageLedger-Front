<template>
	<el-descriptions title="" :column="2" border>
		<el-descriptions-item>
			<template #label> ID </template>
			{{ data.id }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程名称 </template>
			{{ data.courseame }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程院系 </template>
			{{ data.department }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程教师 </template>
			{{ data.userName }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程学年 </template>
			{{ data.year }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程学期 </template>
			{{ data.term }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 学生评价 </template>
			{{ data.comment }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 创建时间 </template>
			{{ data.createTime }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 更新时间 </template>
			{{ data.updateTime }}
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
