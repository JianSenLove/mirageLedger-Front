<template>
	<div class="container">
		<div class="plugins-tips">
            课程ID:{{ courseId }}
		</div>
		<div class="schart-box">
			<div class="content-title">教学质量评价</div>
			<schart class="schart" canvasId="bar" :options="options1"></schart>
		</div>
		<div class="schart-box">
			<div class="content-title">教学内容评价</div>
			<schart class="schart" canvasId="line" :options="options2"></schart>
		</div>
		<div class="schart-box">
			<div class="content-title">**评价</div>
			<schart class="schart" canvasId="pie" :options="options3"></schart>
		</div>
		<div class="schart-box">
			<div class="content-title">不知道是什么评价</div>
			<schart class="schart" canvasId="ring" :options="options4"></schart>
		</div>
	</div>
</template>

<script setup lang="ts" name="basecharts">
import Schart from 'vue-schart';
import { useRoute } from 'vue-router';

const route = useRoute();
const courseId = route.params.id;


const options1 = {
	type: 'bar',
	title: {
		text: '最近一周各教学质量评分图'
	},
	bgColor: '#fbfbfb',
	labels: ['周一', '周二', '周三', '周四', '周五'],
	datasets: [
		{
			label: '低的吓人',
			fillColor: 'rgba(241, 49, 74, 0.5)',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '还可以',
			data: [164, 178, 190, 135, 160]
		},
		{
			label: '这么高?',
			data: [144, 198, 150, 235, 120]
		}
	]
};
const options2 = {
	type: 'line',
	title: {
		text: '最近几个月教学内容趋势图'
	},
	bgColor: '#fbfbfb',
	labels: ['6月', '7月', '8月', '9月', '10月'],
	datasets: [
		{
			label: '照着PPT念',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '摆烂',
			data: [164, 178, 150, 135, 160]
		},
		{
			label: '认真授课',
			data: [114, 138, 200, 235, 190]
		}
	]
};
const options3 = {
	type: 'pie',
	title: {
		text: '***评价'
	},
	legend: {
		position: 'left'
	},
	bgColor: '#fbfbfb',
	labels: ['动漫', 'c语言', '二次元', '三次元', '国防', '穿搭', '大学体育'],
	datasets: [
		{
			data: [334, 278, 190, 235, 260, 200, 141]
		}
	]
};
const options4 = {
	type: 'ring',
	title: {
		text: '不知道干嘛的'
	},
	showValue: false,
	legend: {
		position: 'bottom',
		bottom: 40
	},
	bgColor: '#fbfbfb',
	labels: ['vue', 'react', 'angular'],
	datasets: [
		{
			data: [500, 500, 500]
		}
	]
};
</script>

<style scoped>
.schart-box {
	display: inline-block;
	margin: 20px;
}
.schart {
	width: 600px;
	height: 400px;
}
.content-title {
	clear: both;
	font-weight: 400;
	line-height: 50px;
	margin: 10px 0;
	font-size: 22px;
	color: #1f2f3d;
}
</style>
