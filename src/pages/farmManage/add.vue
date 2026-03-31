<template>
  <div class="container">
    <Modal
      destroyOnClose
      :open="open"
      :title="title"
      ok-text="确认"
      cancel-text="取消"
      :style="{ width: '1000px' }"
      @ok="ok"
      @cancel="cancel"
    >
      <div class="modal-content">
        <div class="form-container">
          <!-- 表单 -->
          <Form ref="formRef" :model="formData">
            <Form.Item label="牧场名称" name="farmName" :rules="[{ required: true, message: '请输入牧场名称' }]">
              <Input v-model:value="formData.farmName"></Input>
            </Form.Item>
            <Form.Item label="场地规模" name="areaSize" :rules="[{ required: true, message: '请输入场地规模' }]">
              <Input v-model:value="formData.areaSize" placeholder=""></Input>
            </Form.Item>
            <Form.Item label="养殖规模" name="breedingScale" :rules="[{ required: true, message: '请输入养殖规模' }]">
              <Input v-model:value="formData.breedingScale"></Input>
            </Form.Item>
            <Form.Item label="地址" :rules="[{ required: true, message: '请选择地址' }]">
              <Cascader v-model:value="addressValue" :options="addressOptions" placeholder="请选择" @change="getId" />
              <Input v-model:value="detailedAddress" />
            </Form.Item>

            <Form.Item label="位置" :rules="[{ required: true }]">
              <!-- <Input v-model:value="formData.longitude" disabled></Input>
              <Input v-model:value="formData.latitude" disabled></Input> -->
              <Input v-model:value="locationText" disabled></Input>
            </Form.Item>
            <Form.Item label="牲畜品种" name="dictInfoId" :rules="[{ required: true, message: '请输入牲畜品种' }]">
              <Select v-model:value="formData.dictInfoId" :options="dictOptions" placeholder="请选择"> </Select>
            </Form.Item>
          </Form>
        </div>
        <div class="map-container">
          <farmMap v-if="open" :address="getFullAddress" :location="locationText1" @getValue="handleGetValue"></farmMap>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script setup>
import { Modal, Form, Input, Select, Cascader } from 'ant-design-vue';
import { defineProps, defineEmits, ref, watch, watchEffect } from 'vue';
import farmMap from '../farmMap.vue';
import Farm from '@/api/farmApi';
import Dict from '@/api/dictApi';
import City from '@/api/cityApi';
const title = ref('新增');
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
  farmName: '',
  areaSize: '',
  breedingScale: '',
  // detailedAddress: '',
  dictInfoId: '',
  // longitude: '', //经度，
  // latitude: '', //纬度
  cityId: '',
});
const detailedAddress = ref('');
const longitude = ref('');
const latitude = ref('');
const addressValue = ref([]);
const addressOptions = ref([]);
// 牲畜品种下拉框
const dictOptions = ref([]);
const getDict = async () => {
  try {
    const res = await Dict.getDictInfoByDictId(1);
    console.log(res.data.data);
    dictOptions.value = res.data.data
      .filter((dict) => dict.status !== '1')
      .map((dict) => ({ label: dict.dictName, value: dict.dictInfoId }));
    console.log(dictOptions.value);
  } catch (error) {
    console.error('获取牲畜品种失败:', error);
  }
};
const emit = defineEmits('close');
const cancel = () => {
  longitude.value = '';
  latitude.value = '';
  formData.value = {};
  detailedAddress.value = '';
  locationText1.value = {};
  // locationText.value = '';
  addressValue.value = '';
  setTimeout(() => {
    emit('close');
  });

  // formRef.value.resetFields();
  // formData.value.dictName = '';
  // formData.value.dictId = props.dictId;
  // console.log('formData.value.dictId', formData.value.dictId);
};
const getId = (a, b) => {
  console.log(a, b);
  const selectedValues = b;
  console.log(selectedValues);
  const ids = selectedValues.map((item) => item.id);
  console.log('ids:', ids);
  // 获取最后一个选择的地区的 id，最后一个是县/区
  formData.value.cityId = selectedValues[selectedValues.length - 1].id;
  console.log(' formData.cityId:', formData.value.cityId);
  // // 如果你需要省、市、县的 id，可以分别获取
  // const [provinceId, cityId, districtId] = selectedValues.map((item) => item.id);
  // console.log('provinceId:', provinceId);
  // console.log('cityId:', cityId);
  // console.log('districtId:', districtId);
  // // 更新 formData.cityId 为你想要的 id，例如区的 id
  // formData.value.cityId = districtId;
};
const getAddressData = async () => {
  try {
    const res = await Farm.getCity();
    console.log(res);
    if (res.data && res.data.data) {
      const transformedOptions = transformData(res.data.data);
      addressOptions.value = transformedOptions;
      console.log(addressOptions.value);
    }
  } catch (error) {
    console.error('Error fetching address data:', error);
  }
};
const transformData = (data) => {
  return data.map((province) => ({
    id: province.id,
    label: province.name,
    value: province.name,
    children: province.children.map((city) => ({
      id: city.id,
      label: city.name,
      value: city.name,
      children: city.children?.map((district) => ({
        id: district.id,
        label: district.name,
        value: district.name,
      })),
    })),
  }));
};
const address = ref();
watch(addressValue, (newValue) => {
  if (newValue.length > 0) {
    // 传参
    console.log('newValue:', newValue);
    const selectedDistrict = newValue[newValue.length - 1];
    const selectedCity = newValue[newValue.length - 2];
    const selectedProvince = newValue[newValue.length - 3];
    address.value = `${selectedProvince}${selectedCity}${selectedDistrict}`;
    // formData.value.cityId = newValue[newValue.length - 1].id;
    console.log('选择的城市ID为：', formData.value.cityId);
    console.log('完整地址:', address.value);
  }
});
const ok = async () => {
  console.log('选择的地址：', addressValue.value);
  // formData.value.detailedAddress =
  //   selectedAddress.value + (formData.value.detailedAddress? ', ' + formData.value.detailedAddress : '');
  //传入数据库的内容
  await formRef.value.validateFields();
  //新增或修改时的数据
  const value = {
    latitude: latitude.value,
    detailedAddress: detailedAddress.value,
    longitude: longitude.value,
    farmName: formData.value.farmName,
    areaSize: formData.value.areaSize,
    breedingScale: formData.value.breedingScale,
    dictInfoId: formData.value.dictInfoId,
    cityId: formData.value.cityId,
  };
  console.log('传入数据库的value:', value);
  if (props.editData && props.editData.farmId) value.farmId = props.editData.farmId;
  // 判断请求函数
  const request = props.editData && props.editData.farmId ? Farm.updateFarm : Farm.addFarm;
  console.log(value);
  //调用接口
  const res = await request(value);
  console.log(res);
  // formData.value.dictId = props.dictId;
  emit('close');
  latitude.value = '';
  formData.value = {};
  detailedAddress.value = '';
  // locationText.value = '';
  addressValue.value = '';
};
//接收经度和纬度
const handleGetValue = (e) => {
  // console.log('Received coordinates from farmMap:', e);
  longitude.value = `${e.longitude}`;
  latitude.value = `${e.latitude}`;
  console.log('父组件接收到了经度和纬度', '经度:', longitude.value, '纬度:', latitude.value);
};
//用来返回传入map的地址
const getFullAddress = computed(() => {
  console.log(`${address.value}${detailedAddress.value}`);
  if (`${detailedAddress.value}` == 'undefined') {
    return `${address.value}`;
  }
  return `${address.value}${detailedAddress.value}`;
});
// 显示经度和纬度
const locationText = computed(() => {
  console.log(`${longitude.value}, ${latitude.value}`);
  return `${longitude.value}  ${latitude.value}`;
});
const locationText1 = ref({});
// 监听
watchEffect(async () => {
  console.log('props.editData' + props.editData.farmId);
  if (props.editData && props.editData.farmId) {
    //修改时，填充数据
    console.log('======');
    // console.log(props.editData);
    // information.value = { ...props.editData };
    formData.value = { ...props.editData };
    //填充经度和纬度以及详细地址
    longitude.value = props.editData.longitude;
    latitude.value = props.editData.latitude;
    detailedAddress.value = props.editData.detailedAddress;
    //修改时传入地图，根据该地址定位
    locationText1.value = {
      latitude: props.editData.latitude,
      longitude: props.editData.longitude,
      detailedAddress: props.editData.detailedAddress,
    };
    const res = await City.getCityById(props.editData.cityId);
    const names = [res.data.data.province.name, res.data.data.parentCity.name, res.data.data.city.name];
    addressValue.value = names;
    console.log(res.data.data);
    title.value = '修改牧场';
  } else {
    title.value = '添加牧场';
  }
});
onMounted(() => {
  getDict();
  getAddressData();
});
</script>
<style scoped>
.modal-content {
  display: flex;
  height: 100%; /* 使容器高度充满 Modal */
}

.form-container {
  flex: 1; /* 表单容器占据剩余空间 */
  padding-right: 10px; /* 右边距 */
  overflow-y: auto; /* 如果内容过长，显示滚动条 */
}

.map-container {
  width: 65%; /* 地图容器宽度为 Modal 宽度的 50% */
  height: 100%; /* 地图容器高度充满 Modal */
  border-left: 1px solid #ccc; /* 左边框 */
}

/* 地图组件样式 */
.farmMap {
  height: 100%; /* 地图组件高度充满容器 */
}
</style>
