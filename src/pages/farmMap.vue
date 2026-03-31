<template>
  <div class="container">
    <div id="map"></div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
// 地图加载函数的引入
import AMapLoader from '@amap/amap-jsapi-loader';
import { mapConfig } from '../config/mapConfig';

const props = defineProps({
  // 子组件接收地址
  address: {
    type: String,
    required: false,
  },
  // 子组件接收查看时经度和纬度
  location: {
    type: Object,
  },
});
const mapValue = ref('');
let geocoder;
let map;
let amap;
// 存储当前标记点
let currentMarker = null;
// 子传父，将经度和纬度传给 add 组件
const emit = defineEmits('getValue');
// 创建标记
const setMarker = (lng, lat) => {
  // 设置标记点
  //   const markerContent = `<div class="custom-content-marker">
  // <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
  // <div >222</div>
  // </div>`;
  // 设置地图中心
  const position = new amap.LngLat(lng, lat); // Marker 经纬度
  const marker = new amap.Marker({
    position: position,
    title: '222',
    // content: markerContent, // 修正变量名
    // offset: new amap.Pixel(-10, 65), // 以 icon 的 [center bottom] 为原点
  });
  return marker;
};
// 展示地图
// 引入地图 jsApi->使用引入的 jsApi 地图对象生成我们的地图实例->通过地图实例实现对应的功能

const initMap = () => {
  // 地图加载开始，引入地图 jsApi
  AMapLoader.load({
    key: mapConfig.key, // 应用 key
    version: '2.0', // 使用地图 jsApi 的版本配置
    plugins: ['AMap.Geocoder'], // 地图插件配置
  })
    .then((AMap) => {
      amap = AMap;
      // 我们可以拿到地图 js 对象
      console.log(AMap);
      // AMap 地图 js 对象
      // 渲染地图,jsApi 生成地图实例
      map = new AMap.Map('map', {
        // 第一个参数是地图的 dom 的 id   <div id="map"></div>
        // 第二个参数是地图实例的一些配置
        viewMode: '2D', // 默认使用 2D 模式
        zoom: 15, // 地图级别
        center: [106.594459, 29.423345], // 地图中心点
      });

      // AMap.plugin('AMap.Geocoder', function () {
      geocoder = new AMap.Geocoder({
        // city: '010', // 城市设为北京，默认:“全国”
        radius: 1000, // 范围，默认:500
      });
      // 查看时根据传入的经纬度设置地图中心
      if (props.location) {
        console.log('这是查看地图时，地图接收到的经度和纬度：', props.location);
        const { longitude, latitude } = props.location;
        const look = [longitude, latitude];
        console.log(look);
        geocoder.getAddress(look, function (status, result) {
          console.log(status, result);
          if (status === 'complete' && result.regeocode) {
            console.log('地理信息', result);
          } else {
            console.error('根据经纬度查询地址失败，状态:', status, '，结果:', result);
          }
          console.log(result.regeocode.formattedAddress);
          locateAddress(result.regeocode.formattedAddress);
        });
      }

      // });
      // 地图点击监听 第一个参数是事件名称，第二个参数是事件回调函数
      map.on('click', function (e) {
        console.log('点击了地图', e);
        mapValue.value = `东经:${e.lnglat.getLat()},北纬:${e.lnglat.getLng()}`;
        console.log(mapValue);
        // 查询地址信息
        const lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
        console.log('传递给 geocoder.getAddress 的经纬度:', lnglat);
        geocoder.getAddress(lnglat, function (status, result) {
          if (status === 'complete' && result.regeocode) {
            console.log('地理信息', result);
          } else {
            console.error('根据经纬度查询地址失败，状态:', status, '，结果:', result);
          }
        });
        // 销毁之前的标记点
        if (currentMarker) {
          currentMarker.setMap(null);
        }
        // 正确调用 setMarker 函数并处理 marker
        currentMarker = setMarker(e.lnglat.getLng(), e.lnglat.getLat());
        map.add(currentMarker);
        // 触发自定义事件，将经纬度传递给父组件
        emit('getValue', {
          longitude: e.lnglat.getLng(),
          latitude: e.lnglat.getLat(),
        });
      });
      const position = new AMap.LngLat(116.681212, 39.852698); // 传入经纬度
      // 修正函数名
      map.setCenter(position);
    })
    .catch((error) => {
      console.error('地图加载失败: ', error);
    });
};
// 接收地址，并且定位
const locateAddress = (address) => {
  console.log('locateAddress:', address);
  console.log('geocoder', geocoder);
  if (address && geocoder) {
    console.log('==========');
    geocoder.getLocation(address, function (status, result) {
      console.log('status', status, 'result', result);
      if (status === 'complete' && result.info === 'OK') {
        const { location } = result.geocodes[0];
        console.log(location);
        map.setCenter(location);
        // 销毁之前的标记点
        if (currentMarker) {
          currentMarker.setMap(null);
        }
        currentMarker = setMarker(location.lng, location.lat);
        map.add(currentMarker);
        // 将定位的经度和纬度传入到父组件
        emit('getValue', {
          longitude: location.lng,
          latitude: location.lat,
        });
      } else {
        console.error('根据地址定位失败，状态:', status, '，结果:', result);
      }
    });
  }
};

onMounted(() => {
  initMap();
  // if (props.address) {
  //   console.log('子组件接收到了地址：', props.address);
  //   // 调用 locateAddress 函数根据接收到的地址进行定位
  //   locateAddress(props.address);
  // }
});
watch(
  () => props.address,
  (newAddress) => {
    if (newAddress) {
      console.log('接收到地址:', newAddress);
      locateAddress(newAddress);
    }
  },
);
</script>

<style scoped>
.container {
  width: 100%;
  height: 70vh;
  margin: 0;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
