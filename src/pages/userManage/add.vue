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
          label="用户名"
          name="name"
          :rules="[
            {
              required: true,
              message: '请输入用户名',
            },
            {
              max: 10,
              message: '用户名不能超过10个字符',
            },
          ]"
        >
          <Input v-model:value="formData.name"></Input>
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phoneNumber"
          :rules="[
            {
              required: true,
              message: '请输入手机号',
            },
            {
              len: 11,
              message: '手机号必须为11位',
            },
          ]"
        >
          <Input v-model:value="formData.phoneNumber"></Input>
        </Form.Item>
        <Form.Item
          label="状态"
          name="status"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <Select
            v-model:value="formData.status"
            :options="[
              { label: '禁用', value: '1' },
              { label: '启用', value: '0' },
            ]"
          >
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { Modal, Form, Input, Select, message } from 'ant-design-vue';
import { defineProps, defineEmits, ref, watchEffect } from 'vue';
import User from '@/api/userApi';

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
  name: '',
  phoneNumber: '',
  status: '',
});
const emit = defineEmits('close');
const cancel = () => {
  emit('close');
  formData.value = {};
};
const ok = async () => {
  const value = await formRef.value.validateFields();
  console.log('value', value);
  if (props.editData && props.editData.loginAccount) value.loginAccount = props.editData.loginAccount;
  // 判断请求函数
  const request = props.editData && props.editData.loginAccount ? User.updateUser : User.addUser;
  console.log(value);
  //调用接口
  const res = await request(value);
  console.log(res);

  if (res.data.msg === '该手机号已注册') {
    message.error('该手机号已注册');
  }
  if (res.data.msg === '手机号格式不正确') {
    message.error('手机号格式不正确');
  }
  if (res.data.msg === '用户名只能包含中文或英文字符') {
    message.error('新增失败！！用户名只能包含中文或英文字符');
  }
  //发送给新增接口
  emit('close');
  formData.value = {};
};
// 监听编辑
watchEffect(() => {
  if (props.editData && props.editData.loginAccount) {
    //填充数据
    console.log(props.editData);
    formData.value = { ...props.editData };
    console.log(formData.value);
    title.value = '修改人员';
  } else {
    title.value = '新增人员';
  }
});
</script>

<style scoped></style>
