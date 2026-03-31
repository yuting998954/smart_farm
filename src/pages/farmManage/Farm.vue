<template>
  <Form ref="formRef" :model="formData" class="user-form" layout="inline">
    <Form.Item label="牧场名称" name="farmName">
      <Input v-model:value="formData.farmName" class="inputBox"></Input>
    </Form.Item>

    <Form.Item label="状态" name="status" style="width: 200px; margin-right: 300px">
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

  <Button type="primary" style="margin-bottom: 10px" @click="doOpen">新增</Button>
  <add :open="open" :editData="editData" @close="close"></add>
  <!-- 表格 -->
  <Table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="change">
    <!-- 自定义单元格 -->
    <template v-slot:bodyCell="{ record, column }">
      <div v-if="column.dataIndex == 'actions'">
        <Button type="primary" @click="lookFarm(record)">查看</Button>
        <Button type="primary" @click="updateFarm(record)">修改</Button>
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
  <!-- 抽屉用于查看数据 -->
  <a-drawer v-model:open="openLook" title="查看牧场" width="700" @close="onClose">
    <a-descriptions bordered :column="{ xxl: 1, xl: 1, lg: 1, md: 3, sm: 2, xs: 1 }">
      <a-descriptions-item label="牧场名称">{{ recordToShow.farmName }}</a-descriptions-item>
      <a-descriptions-item label="存栏量">{{ recordToShow.breedingScale }}</a-descriptions-item>
      <a-descriptions-item label="状态">{{ recordToShow.status }}</a-descriptions-item>
      <a-descriptions-item label="场地规模">{{ recordToShow.areaSize }}</a-descriptions-item>
      <a-descriptions-item label="地址">{{ recordToShow.detailedAddress }}</a-descriptions-item>
      <a-descriptions-item label="养殖品种">{{ recordToShow.dictName }}</a-descriptions-item>
      <a-descriptions-item label="纬度">{{ recordToShow.latitude }}</a-descriptions-item>
      <a-descriptions-item label="经度">{{ recordToShow.longitude }}</a-descriptions-item>
    </a-descriptions>
    <a-button type="primary" @click="showChildrenDrawer()">查看地图</a-button>
    <a-drawer v-model:open="childrenDrawer" title="地图" width="700">
      <FarmMap v-if="childrenDrawer" :location="getFullAddress"></FarmMap>
    </a-drawer>
  </a-drawer>
</template>
<script setup>
import { Form, Select, Button, Divider, Table, Input, Popconfirm } from 'ant-design-vue';
import { ref } from 'vue';
import Farm from '@/api/farmApi';
import UpdateStatus from '../UpdateStatus.vue';
import add from './add.vue';
import FarmMap from '../farmMap.vue';
const formRef = ref(null);
const formData = ref({
  farmName: '',
  status: '-1',
  openStatus: 'false',
});
const dataSource = ref([]);
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
  getFarmList();
};
const columns = [
  {
    title: '牧场名称',
    dataIndex: 'farmName',
  },
  {
    title: '存栏量',
    dataIndex: 'breedingScale',
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
const getFarmList = async () => {
  const searchParams = {
    pageSize: pagination.value.pageSize,
    pageNumber: pagination.value.pageNumber,
    ...formData.value,
  };
  console.log(formData.value);

  console.log(searchParams);
  const res = await Farm.getFarms(searchParams);
  console.log(res);
  // 数据赋值
  dataSource.value = res.data.data.records;
  console.log('dataSource', dataSource);
  // 分页总数赋值
  pagination.value.total = res.data.data.total;
};
getFarmList();
// 搜索
const search = async () => {
  pagination.value.pageNumber = 1;
  getFarmList();
  formData.value.farmName = '';
  // formData.value.status = '-1';
};
// 分页事件
const change = ({ current, pageSize, total }) => {
  pagination.value.pageNumber = current;
  pagination.value.pageSize = pageSize;
  pagination.value.total = total;
  getFarmList();
};
// 重置
const reset = () => {
  // formData.value.name = '';
  //当前页面置为1
  pagination.value.pageNumber = 1;
  formRef.value.resetFields();
  getFarmList();
  // console.log(formRef.value);
};
// 编辑数据
const editData = ref({});
// 修改
const updateFarm = (record) => {
  console.log('record', record);
  editData.value = {
    ...record,
  };
  console.log(editData);
  open.value = true;
};
// const openStatus = ref(false);
// 关闭气泡框
const closePop = (record) => {
  console.log(record);
  record.openStatus = !record.openStatus;
  getFarmList();
};
const changeStatus = (record) => {
  console.log(record);
  // 打开气泡框
  record.openStatus = !record.openStatus;
};
//用于返回经度和纬度给地图，地图根据经度和纬度显示
//父传子
const getFullAddress = ref({});
//查看牧场
const openLook = ref(false);
const childrenDrawer = ref(false);
const lookFarm = (record) => {
  console.log('lookFarm的record', record);
  // 将点击的记录存储到 recordToShow 中
  getFullAddress.value = {
    latitude: record.latitude,
    longitude: record.longitude,
    detailedAddress: record.detailedAddress,
  };
  console.log('这是传给地图的经度和纬度：', getFullAddress.value);
  recordToShow.value = record;
  openLook.value = true;
};
const onClose = () => {
  openLook.value = false;
  getFullAddress.value = {};
};
const showChildrenDrawer = () => {
  childrenDrawer.value = true;
};
// 用于存储要查看的记录
const recordToShow = ref({});
</script>
<style scoped>
.user-form {
  padding-top: 20px;
  padding-left: 20px;
  display: flex;
  justify-content: space-between;
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

/* 一级抽屉样式调整 */
.ant-drawer-content-wrapper.ant-drawer-content-wrapper.ant-drawer-open {
  width: 500px; /* 调整抽屉的宽度 */
}

/* 二级抽屉样式调整 */
.ant-drawer-content-wrapper.ant-drawer-content-wrapper.ant-drawer-open.ant-drawer-right.ant-drawer-secondary {
  width: 600px; /* 调整二级抽屉的宽度 */
}
</style>
