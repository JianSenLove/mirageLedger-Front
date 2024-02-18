<template>
	<el-descriptions title="" :column="2" border>
		<el-descriptions-item>
			<template #label> ID </template>
			{{ data.id }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程名称 </template>
			{{ data.courseName }}
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
			<template #label> 教学内容评价分 </template>
			{{ data.teachingContent }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 教学方法评价分 </template>
			{{ data.teachingMethod }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程管理评价分 </template>
			{{ data.curriculumManagement }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 课程考核评价分 </template>
			{{ data.courseAssessment }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 教学态度评价分 </template>
			{{ data.teachingAttitude }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 学习收获评价分 </template>
			{{ data.learningHarvest }}
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
			<template #label> 课程状态 </template>
			{{ data.state ? '开设中' : '已关闭' }}
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
