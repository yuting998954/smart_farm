<!--
 * new page
 * @author: wuyuting
 * @since: 2024-12-27
 * PenManage.VUE
-->
<template>
  <!-- <div class="container">圈舍管理</div> -->
  <Form
    ref="formRef"
    :model="formData"
    class="user-form"
    layout="inline"
    style="display: flex; justify-content: space-between"
  >
    <Form.Item label="牧场名称" name="farmName">
      <Input v-model:value="formData.farmName" class="inputBox"></Input>
    </Form.Item>
    <Form.Item label="圈舍名称" name="penName">
      <Input v-model:value="formData.penName" class="inputBox"></Input>
    </Form.Item>
    <Form.Item label="状态" name="status" style="width: 200px">
      <Select
        v-model:value="formData.status"
        :options="[
          { label: '全部', value: '-1' },
          { label: '禁用', value: '1' },
          { label: '启用', value: '0' },
        ]"
      >
      </Select>
    </Form.Item>
    <Form.Item layout="inline" style="margin-left: 45px">
      <Button type="primary" @click="search">查询</Button>
      <Button style="margin-left: 10px" @click="reset">重置</Button>
    </Form.Item>
  </Form>
  <Divider style="height: 2px; background-color: #7cb305; margin-bottom: 10px" />
  <Button type="primary" style="margin-bottom: 10px" @click="doOpen">新增圈舍</Button>
  <add :open="open" :editData="editData" @close="close"></add>
  <Table :columns="columns" :dataSource="dataSource" :pagination="pagination" @change="change">
    <template v-slot:bodyCell="{ record, column }">
      <div v-if="column.dataIndex == 'actions'">
        <Button type="primary" @click="updatePen(record)">修改</Button>
        <UpdateStatus
          :open="record.openStatus"
          :action="record.status === '启用' ? '启用' : '禁用'"
          :record="record"
          @handleCancel="closePop(record)"
        ></UpdateStatus>
        <Button v-if="record.status === '启用'" @click="changeStatus(record)">禁用</Button>
        <Button v-else @click="changeStatus(record)">启用</Button>
      </div>
    </template>
  </Table>
</template>

<script setup>
import { Form, Select, Button, Divider, Table, Input } from 'ant-design-vue';
import { ref } from 'vue';
import Pen from '@/api/penApi';
import add from './add.vue';
import UpdateStatus from '../UpdateStatus.vue';
const formRef = ref(null);
const formData = ref({
  farmName: '',
  penName: '',
  status: '-1',
  openStatus: 'false',
});
const open = ref(false);
const doOpen = () => {
  open.value = true;
};
const close = () => {
  //关闭弹窗
  open.value = false;
  //重置修改数据
  editData.value = {};
  //刷新表格
  gePenList();
};
const dataSource = ref([]);
const columns = [
  {
    title: '牧场名称',
    dataIndex: 'farmName',
  },
  {
    title: '圈舍名称',
    dataIndex: 'penName',
  },
  {
    title: '存栏量',
    dataIndex: 'stock',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'actions',
  },
];
// 分页数据
const pagination = ref({
  pageSize: 5,
  pageNumber: 1, //当前页码
  showSizeChanger: true,
  total: 0,
  pageSizeOptions: ['2', '5', '10', '15'],
});
// 获取数据
const gePenList = async () => {
  const searchParams = {
    pageSize: pagination.value.pageSize,
    pageNumber: pagination.value.pageNumber,
    ...formData.value,
  };
  console.log(searchParams);
  const res = await Pen.getPens(searchParams);
  console.log(res);
  // 数据赋值
  dataSource.value = res.data.data.records;
  console.log('dataSource', dataSource);
  // 分页总数赋值
  pagination.value.total = res.data.data.total;
};
gePenList();
// 搜索
const search = async () => {
  pagination.value.pageNumber = 1;
  gePenList();
  formData.value.farmName = '';
  formData.value.penName = '';
  // formData.value.status = '-1';
};
// 分页事件
const change = ({ current, pageSize, total }) => {
  pagination.value.pageNumber = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
  gePenList();
};
// 重置
const reset = () => {
  // formData.value.name = '';
  //当前页面置为1
  pagination.value.pageNumber = 1;
  formRef.value.resetFields();
  gePenList();
  // console.log(formRef.value);
};
// updatePen
// 编辑数据
const editData = ref({});
// 修改
const updatePen = (record) => {
  console.log('record', record);
  editData.value = { ...record, status: record.status === '启用' ? '0' : '1' };
  console.log(editData);
  open.value = true;
};
// 关闭气泡框
const closePop = (record) => {
  console.log(record);
  record.openStatus = !record.openStatus;
  gePenList();
};

const changeStatus = (record) => {
  console.log(record);
  // 打开气泡框
  record.openStatus = !record.openStatus;
};
</script>

<style scoped>
.user-form {
  padding-top: 20px;
  padding-left: 20px;
}
/* 设置表单内字体大小 */
.user-form /deep/ .ant-form-item-label > label {
  font-size: 15px; /* 你可以根据需要调整这个值 */
}

/* 设置输入框大小 */
.inputBox {
  font-size: 14px; /* 输入框内的字体大小 */
  height: 30px; /* 输入框的高度 */
}

/* 设置选择框大小 */
.user-form /deep/ .ant-select-selection {
  font-size: 14px; /* 选择框内的字体大小 */
  height: 40px; /* 选择框的高度 */
  line-height: 40px; /* 选择框的行高 */
}
</style>
