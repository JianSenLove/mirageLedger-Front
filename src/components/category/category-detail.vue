<template>
	<el-descriptions title="" :column="2" border>
		<el-descriptions-item v-for="(detail, index) in descriptionData" :key="index">
			<template #label> {{ detail.label }} </template>
			{{ detail.value }}
		</el-descriptions-item>
	</el-descriptions>
</template>


<script lang="ts" setup>
import { computed } from 'vue';

const fieldLabelMap = {
  id: 'ID',
  name: '类别名称',
  desc: '描述',
  createTime: '创建时间',
  updateTime: '更新时间',
  image: '图片地址',
};

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const descriptionData = computed(() => {
  return Object.entries(props.data).map(([key, value]) => {
    const label = fieldLabelMap[key] || key;
    return { label, value };
  });
});


</script>
