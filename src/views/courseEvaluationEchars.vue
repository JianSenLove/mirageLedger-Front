<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="500px">
        <el-table :data="indicatorData" style="width: 100%">
          <el-table-column prop="name" label="评价类别" width="180"></el-table-column>
          <el-table-column prop="value" label="分值"></el-table-column>
        </el-table>
      </el-aside>
      <el-main>
        <div class="schart-box">
          <div class="content-title">正负柱状图</div>
          <div class="schart" id="echart_bar"></div>
        </div>
        <div class="schart-box">
          <div class="content-title">饼状图</div>
          <div class="schart" id="echart_pie"></div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts" name="basecharts">
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { getCourseEvaluation } from '../api/index';
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';

const route = useRoute();

const evaluationId = route.params.evaluationId;

const default_data = {
  teachingContent: 0.28,
  teachingMethod: 0.28,
  curriculumManagement: 0.28,
  courseAssessment: 0.28,
  teachingAttitude: 0.28,
  learningHarvest: 0.28
}
const indicatorData = ref([]);

onMounted(async () => {
  // 请求评价接口，获取数据
  try {
    const res = await getCourseEvaluation(evaluationId.toString());
    if (res) {
      default_data.teachingContent = res.teachingContent;
      default_data.teachingMethod = res.teachingMethod;
      default_data.curriculumManagement = res.curriculumManagement;
      default_data.courseAssessment = res.courseAssessment;
      default_data.teachingAttitude = res.teachingAttitude;
      default_data.learningHarvest = res.learningHarvest;
      indicatorData.value = [
        { name: '教学内容评价分', value: res.teachingContent },
        { name: '教学方法评价分', value: res.teachingMethod },
        { name: '课程管理评价分', value: res.curriculumManagement },
        { name: '课程考核评价分', value: res.courseAssessment },
        { name: '教学态度评价分', value: res.teachingAttitude },
        { name: '学习收获评价分', value: res.learningHarvest },
      ];
    }
  } catch (error) {
    ElMessage.error('数据获取失败');
  }

  var chartDom = document.getElementById('echart_bar');
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    title: {
      text: '课程评价柱状图'
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
        '教学内容评价分',
        '教学方法评价分',
        '课程管理评价分',
        '课程考核评价分',
        '教学态度评价分',
        '学习收获评价分'
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
          default_data.teachingContent,
          default_data.teachingMethod,
          default_data.curriculumManagement,
          default_data.courseAssessment,
          default_data.teachingAttitude,
          default_data.learningHarvest
        ]
      }
    ]
  };

  option && myChart.setOption(option);

  //饼状图
  var chartDom_pie = document.getElementById('echart_pie');
  var myChart_pie = echarts.init(chartDom_pie);
  var option_pie;

  option_pie = {
    title: {
      text: '课程评价饼图',
      // subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: default_data.teachingContent, name: '教学内容评价分' },
          { value: default_data.teachingMethod, name: '教学方法评价分' },
          { value: default_data.curriculumManagement, name: '课程管理评价分' },
          { value: default_data.courseAssessment, name: '课程考核评价分' },
          { value: default_data.teachingAttitude, name: '教学态度评价分' },
          { value: default_data.learningHarvest, name: '学习收获评价分' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  option_pie && myChart_pie.setOption(option_pie);
})


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
