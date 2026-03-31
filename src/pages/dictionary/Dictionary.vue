<template>
  <!-- <div>数据字典</div> -->
  <div class="main">
    <div class="wrapper">
      <div
        v-for="item in dictList"
        :key="item.dictId"
        :class="['childItem', checkItem.dictId === item.dictId ? 'selected' : '']"
        @click="handleClick(item)"
      >
        {{ item.dictType }}
      </div>
    </div>
    <div class="content">
      <!-- <router-view></router-view> -->
      <Form
        ref="formRef"
        :model="formData"
        class="dict-form"
        layout="inline"
        style="display: flex; justify-content: space-between"
      >
        <Form.Item label="名称" name="dictName">
          <Input v-model:value="formData.dictName" class="inputBox"></Input>
        </Form.Item>
        <Form.Item label="状态" name="status" style="width: 200px; margin-right: 260px">
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
        <Form.Item layout="inline" style="margin-left: 10px">
          <Button type="primary" @click="search">查询</Button>
          <Button style="margin-left: 10px" @click="reset">重置</Button>
        </Form.Item>
      </Form>
      <Divider style="height: 2px; background-color: #7cb305; margin-bottom: 10px" />
      <Button type="primary" style="margin-bottom: 10px" @click="doOpen">新增</Button>
      <add :open="open" :dictId="checkItem.dictId" @close="close"></add>
      <!-- 表格 -->
      <Table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="change">
        <!-- 自定义单元格 -->
        <template v-slot:bodyCell="{ record, column }">
          <div v-if="column.dataIndex == 'actions'">
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
    </div>
  </div>
</template>
<script setup>
import Dict from '@/api/dictApi';
import { ref, computed } from 'vue';
import add from './add.vue';
import { Form, Select, Button, Divider, Table, Input } from 'ant-design-vue';
import UpdateStatus from '../UpdateStatus.vue';
const dictList = ref([]);
const formRef = ref(null);
const formData = ref({
  dictName: '',
  status: '-1',
  openStatus: false,
});
const dataSource = ref();
const open = ref(false);
const doOpen = () => {
  open.value = true;
};
const close = () => {
  open.value = false;
  getDataList();
  console.log(checkItem.value.dictId);
};
// 字典列表
const getDictList = async () => {
  const res = await Dict.getDict();
  console.log(res);
  dictList.value = res.data.data;
  checkItem.value = res.data.data[0];
  getDataList();
};
getDictList();

const handleClick = (item) => {
  console.log(item, '=======');
  checkItem.value = item;

  console.log('checkItem.value', checkItem.value);
  // 移除其他元素的 selected 类
  dictList.value.forEach((i) => (i.selected = false));
  // 添加 selected 类到当前点击的元素
  item.selected = true;
  formData.value.status = '-1';
  getDataList();
  // router.push({ path: '/animal', query: item });
};

const checkItem = ref();
const columns = computed(() => {
  console.log(checkItem.value.dictType);
  return [
    {
      title: checkItem.value.dictType,
      dataIndex: 'dictName',
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
});

// 分页数据
const pagination = ref({
  pageSize: 5,
  pageNumber: 1, //当前页码
  showSizeChanger: true,
  total: 0,
  pageSizeOptions: ['1', '2', '5', '10'],
});
// // 获取数据
const getDataList = async () => {
  const searchParams = {
    pageSize: pagination.value.pageSize,
    pageNumber: pagination.value.pageNumber,
    ...formData.value,
    dictId: checkItem.value.dictId,
  };
  console.log(formData.value);
  console.log(searchParams);
  const res = await Dict.getDictInfoByDitIdAndDicInfo(searchParams);
  console.log(res);
  //   // 数据赋值
  dataSource.value = res.data.data.records;
  console.log('dataSource', dataSource);
  //   // 分页总数赋值
  pagination.value.total = res.data.data.total;
};
const search = async () => {
  pagination.value.pageNumber = 1;
  getDataList();
  formData.value.dictName = '';
  // formData.value.status = '-1';
};
const change = ({ current, pageSize }) => {
  pagination.value.pageNumber = current;
  pagination.value.pageSize = pageSize;
  getDataList();
};
// 重置
const reset = () => {
  formData.value.dictName = '';
  //当前页面置为1
  pagination.value.pageNumber = 1;
  console.log(pagination, '===');

  formRef.value.resetFields();
  getDataList();
  // console.log(formRef.value);
};
// 关闭气泡框
const closePop = (record) => {
  console.log(record);
  record.openStatus = !record.openStatus;
  getDataList();
};
const changeStatus = (record) => {
  console.log(record);
  // 打开气泡框
  record.openStatus = !record.openStatus;
  console.log('Change status to:', record.openStatus); // 打印状态变化
};
</script>
<style scoped>
.wrapper {
  display: flex;
  /* justify-content: space-between; */
  flex-direction: column;
  border: 1px solid black;
  height: 80vh;
  width: 70px;
}
.childItem {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 4px;
  cursor: pointer;
  transition: all 0.3s ease; /* 添加过渡效果 */
}
.childItem:hover {
  background-color: #e6f7ff; /* 鼠标悬停时的背景颜色 */
  color: #1890ff; /* 鼠标悬停时的字体颜色 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
.selected {
  background-color: #d9d9d9; /* 选中时的背景颜色 */
  color: #333; /* 选中时的字体颜色 */
  border-left: 3px solid #1890ff; /* 左侧的边框颜色 */
  font-weight: bold; /* 加粗字体 */
}
.content {
  height: auto;
  width: 80vw;
  margin-left: 10px;
}
.main {
  display: flex;
}
.dict-form {
  padding-top: 20px;
  padding-left: 20px;
}
/* 设置表单内字体大小 */
.dict-form /deep/.ant-form-item-label > label {
  font-size: 15px; /* 你可以根据需要调整这个值 */
}

/* 设置输入框大小 */
.inputBox {
  font-size: 14px; /* 输入框内的字体大小 */
  height: 30px; /* 输入框的高度 */
}

/* 设置选择框大小 */
.dict-form /deep/.ant-select-selection {
  font-size: 14px; /* 选择框内的字体大小 */
  height: 40px; /* 选择框的高度 */
  line-height: 40px; /* 选择框的行高 */
}
</style>
