<template>
  <a-layout>
    <a-layout-header class="header" style="height: 55px">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '55px' }"
        style="display: flex; flex-direction: row-reverse"
      >
        <!-- 显示上次登录时间 -->

        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span style="margin-right: auto">上次登录时间：{{ lastLoginTime }}</span>
            </span>
          </template>
        </a-sub-menu>
        <a-menu-item key="1" @click="loginout">退出</a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 20px">
      <a-layout style="padding: 1px 0; background: #fff">
        <a-layout-sider width="160" style="background: #fff">
          <a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline" style="height: 80vh">
            <a-menu-item key="2" @click="goToIndex">主页</a-menu-item>
            <a-sub-menu key="sub2">
              <template #title>
                <span>系统管理</span>
              </template>
              <a-menu-item key="3" @click="goToStaffManagement">人员管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub3">
              <template #title>
                <span>基础配置</span>
              </template>
              <a-menu-item key="4" @click="goToDictionary">数据字典</a-menu-item>
              <a-menu-item key="5" @click="goToPenManagement">圈舍管理</a-menu-item>
              <a-menu-item key="6" @click="goToFarmManagement">牧场管理</a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center"> Ant Design ©2018 Created by Ant UED </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import router from '@/router';
import User from '@/api/login';
// 定义路由跳转的方法
// 存储上次登录时间
const lastLoginTime = ref('');

const selectedKeys1 = ref(['2']);
const selectedKeys2 = ref(['1']);
const openKeys = ref(['sub1']);

const loginout = () => {
  User.logout();
  // 清理token
  localStorage.clear();
  router.push('/login');
};

const goToIndex = () => {
  router.push('/index');
};

const goToStaffManagement = () => {
  router.push('/userManage');
};

const goToDictionary = () => {
  router.push('/dictionary');
};

const goToPenManagement = () => {
  router.push('/PenManage');
};

const goToFarmManagement = () => {
  router.push('/FarmManage');
};
// 从 localStorage 获取上次登录时间
onMounted(() => {
  const storedTime = localStorage.getItem('lastLoginTime');
  if (storedTime) {
    lastLoginTime.value = storedTime;
  }
});
</script>

<style scoped>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(32, 179, 125, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
