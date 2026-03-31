<!--
 * new page
 * @author: wuyuting
 * @since: 2024-12-31
 * add.vue
-->
<template>
  <div class="container">
    <Modal :open="open" :title="title" ok-text="确认" cancel-text="取消" @ok="ok" @cancel="cancel">
      <!-- 表单 -->
      <Form ref="formRef" :model="formData">
        <Form.Item
          label="牧场"
          name="farmId"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <Select v-model:value="formData.farmId" :options="farmOptions" :disabled="isDisabled"> </Select>
        </Form.Item>
        <Form.Item
          label="圈舍名称"
          name="penName"
          :rules="[
            {
              required: true,
              message: '请输入圈舍名称',
            },
          ]"
        >
          <Input v-model:value="formData.penName"></Input>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { Modal, Form, Input, Select, message } from 'ant-design-vue';
import { defineProps, defineEmits, ref, watchEffect } from 'vue';
import Farm from '@/api/farmApi';
import Pen from '@/api/penApi';
const title = ref('');
const formRef = ref(null);
const props = defineProps({
  open: {
    type: Boolean,
  },
  editData: {
    type: Object,
  },
});
const formData = ref({
  penName: '',
  farmId: '',
});
const isDisabled = ref(false); // 存储 disabled 属性的布尔值
const farmOptions = ref([]); // 存储农场数据的响应式变量
const getFarms = async () => {
  try {
    const farms = await Farm.getFarmsInfo();
    console.log(farms.data.data);
    // 将获取到的农场数据存储到 farmOptions 中
    farmOptions.value = farms.data.data
      .filter((farm) => farm.status !== '1')
      .map((farm) => ({ label: farm.farmName, value: farm.farmId }));
  } catch (error) {
    console.error('获取农场信息失败:', error);
    message.error('获取农场信息失败，请重试');
  }
};
const emit = defineEmits('close');
const cancel = () => {
  emit('close');
  formData.value = {};
};
const ok = async () => {
  try {
    const value = await formRef.value.validateFields();
    console.log('value', value);
    if (props.editData && props.editData.pensId) value.pensId = props.editData.pensId;
    // 判断请求函数
    const request = props.editData && props.editData.pensId ? Pen.updatePens : Pen.addPen;
    //调用接口
    const res = await request(value);
    console.log(res);
    //发送给新增接口
    emit('close');
    formData.value = {};
  } catch (error) {
    console.error('执行操作时出错:', error);
    message.error('操作失败，请重试');
  }
};
// 监听编辑
watchEffect(() => {
  if (props.editData && props.editData.pensId) {
    //填充数据
    console.log(props.editData);
    formData.value = { ...props.editData };
    console.log(formData.value);
    isDisabled.value = true;
    title.value = '修改圈舍';
  } else {
    title.value = '新增圈舍';
  }
});
// 调用 getFarms 函数获取农场数据
onMounted(() => {
  getFarms();
});
</script>
<style scoped></style>
