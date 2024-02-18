<template>
	<div class="container">
		<div class="schart-box">
			<div class="content-title">表格</div>
		</div>
		<div class="schart-box">
			<div class="content-title">正负柱状图</div>
		</div>
		<div class="schart-box">
			<div class="content-title">饼状图</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="basecharts">
import * as echarts from 'echarts';

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
