<!--
 * new page
 * @author: wuyuting
 * @since: 2025-01-03
 * add.vue
-->
<template>
  <div class="container">
    <Modal :open="open" :title="title" ok-text="确认" cancel-text="取消" @ok="ok" @cancel="cancel">
      <!-- 表单 -->
      <Form ref="formRef" :model="formData">
        <Form.Item label="dictId" name="dictId">
          <Input v-model:value="formData.dictId" disabled></Input>
        </Form.Item>
        <Form.Item
          label="畜牧品种"
          name="dictName"
          :rules="[
            {
              required: true,
              message: '请输入畜牧品种',
            },
          ]"
        >
          <Input v-model:value="formData.dictName"></Input>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { Modal, Form, Input, message } from 'ant-design-vue';
import { defineProps, defineEmits, ref } from 'vue';
import Dict from '@/api/dictApi';

const title = ref('新增');

const formRef = ref(null);
const props = defineProps({
  open: {
    type: Boolean,
  },
  dictId: {
    type: String,
  },
});
const formData = ref({
  dictName: '',
  dictId: props.dictId, // 接收并存储 dictId
});
console.log(formData.value.dictId);

const emit = defineEmits('close');
const cancel = () => {
  emit('close');
  formData.value.dictName = '';
  formData.value.dictId = props.dictId;
  console.log('formData.value.dictId', formData.value.dictId);
};

const ok = async () => {
  const value = await formRef.value.validateFields();
  console.log('value', value);
  //调用接口
  const res = await Dict.addDict(value);
  console.log(res);
  if (res.data.msg === '数据字典值已存在') {
    message.error('该数据字典值已存在！！');
  }
  emit('close');
  formData.value.dictName = '';
  formData.value.dictId = props.dictId;
  console.log('formData.value.dictId', formData.value.dictId);
};

watchEffect(() => {
  console.log(props.dictId);
  formData.value.dictId = props.dictId;
});
</script>

<style scoped></style>
