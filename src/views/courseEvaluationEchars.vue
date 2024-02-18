<template>
	<div class="container">
		<div class="schart-box">
			<div class="content-title">表格</div>
		</div>
		<div class="schart-box">
			<div class="content-title">正负柱状图</div>
			<div class="schart" id="echart_bar"></div>
		</div>
		<div class="schart-box">
			<div class="content-title">饼状图</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="basecharts">
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { getCourseEvaluation } from '../api/index';

const route = useRoute();

const evaluationId = route.params.evaluationId;

var chartDom = document.getElementById('echart_bar');
var myChart = echarts.init(chartDom);
var option;

const labelRight = {
  position: 'top'
};
option = {
  title: {
    text: 'Bar Chart with Negative Value'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    top: 80,
    bottom: 30
  },
  xAxis: {
	type: 'category',
    axisLine: { show: false },
    axisLabel: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    data: [
      'ten',
      'nine',
      'eight',
      'seven',
      'six'
    ]
  },
  yAxis: {
    type: 'value',
    position: 'top',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: 'Cost',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        formatter: '{b}'
      },
      data: [
        { value: -0.07, label: labelRight },
        { value: -0.09, label: labelRight },
        0.2,
        0.44,
        { value: -0.23, label: labelRight },
        0.08
      ]
    }
  ]
};

option && myChart.setOption(option);


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
