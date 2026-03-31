<!--
 * new page
 * @author: wuyuting
 * @since: 2025-01-05
 * address.vue
-->
<template>
  <div>
    <a-cascader v-model:value="value" :options="options" placeholder="Please select" />
  </div>
</template>

<script setup>
import Farm from '@/api/farmApi';
import { ref, onMounted, watch, defineExpose } from 'vue';

const value = ref([]);
const options = ref([]);
const cityId = ref(null);
/**
 *
 * const url = {
    Authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOjEsInJuU3RyIjoiYkJxT2c3U3Z5OGxCalZPRlp2dDBNUkxYMmJlSlhDMVgifQ.6aabhdSq4610-KbegB8t6ng1kVJLr_S-EEgHtlExemI",
    getAddress: "/address/getAddress"
    }

    export const getAddress = () => {
    return instance({
        url: url.getAddress,
        method: 'get',
        headers: url.Authorization
    });
    };

 */
const getAddressData = async () => {
  try {
    const res = await Farm.getCity();
    console.log(res);
    if (res.data && res.data.data) {
      const transformedOptions = transformData(res.data.data);
      options.value = transformedOptions;
      console.log(options.value);
    }
  } catch (error) {
    console.error('Error fetching address data:', error);
  }
};

const transformData = (data) => {
  return data.map((province) => ({
    label: province.name,
    value: province.name,
    children: province.children.map((city) => ({
      label: city.name,
      value: city.name,
      children: city.children?.map((district) => ({
        label: district.name,
        value: district.name,
      })),
    })),
  }));
};

onMounted(() => {
  getAddressData();
});
watch(value, (newValue) => {
  if (newValue.length > 0) {
    // 传参cityId
    cityId.value = newValue[newValue.length - 1];
    console.log('cityId:' + cityId.value);
  }
});
defineExpose({
  value,
});
</script>

<style scoped></style>
