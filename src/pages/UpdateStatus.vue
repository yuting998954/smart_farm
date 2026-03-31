<!--
 * new page
 * @author: wuyuting
 * @since: 2025-01-02
 * UpdateStatus.vue
-->
<template>
  <!-- <div class="container">修改状态组件</div> -->

  <Popconfirm
    :open="props.open"
    ok-text="确认"
    cancel-text="取消"
    :title="`确定要${action === '启用' ? '禁用' : '启用'}吗？`"
    @confirm="handleConfirm"
    @cancel="close"
  >
  </Popconfirm>
</template>

<script setup>
import { Popconfirm } from 'ant-design-vue';
import { defineProps, defineEmits } from 'vue';
import User from '@/api/userApi';
import Dict from '@/api/dictApi';
import Pen from '@/api/penApi';
import Farm from '@/api/farmApi';
const props = defineProps({
  action: {
    type: String,
    required: true,
    validator: (value) => ['启用', '禁用'].includes(value),
  },
  open: Boolean,

  record: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['handleCancel']);
const handleConfirm = async () => {
  console.log(props.record);
  if (props.record.loginAccount != null) await User.updateUserStatus(props.record.loginAccount);
  if ((props.record.dictId && props.record.dictInfoId) != null)
    await Dict.updateDicInfoStatus(props.record.dictId, props.record.dictInfoId);

  if (props.record.pensId != null) {
    await Pen.updatePensStatus(props.record.pensId);
    console.log(props.record.pensId);
  }

  if (props.record.farmName != null) await Farm.updateFarmStatus(props.record.farmName);
  emit('handleCancel');
};

const close = () => {
  // 关闭气泡框
  emit('handleCancel');
};
</script>

<style scoped></style>
