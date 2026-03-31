<!--
 * new page
 * @author: wuyuting
 * @since: 2024-12-25
 * index.vue
-->
<template>
  <div class="login-container">
    <Form ref="formRef" :model="formData" class="login-form" @finish="go">
      <h2 class="title">用户登录 LOGIN</h2>
      <Form.Item label="账号" name="loginAccount" :rules="[{ required: true, message: '请输入登录账号!' }]">
        <Input v-model:value="formData.loginAccount" class="inputBox"></Input>
      </Form.Item>

      <Form.Item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
        <Input v-model:value="formData.password" class="inputBox1"></Input>
      </Form.Item>
      <Form.Item :wrapper-col="{ offset: 6, span: 14 }">
        <Button type="primary" html-type="finish">登录</Button>

        <Button type="primary">取消</Button>
      </Form.Item>
    </Form>
  </div>
</template>

<script setup>
import { Form, Input, Button } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import User from '@/api/login';
import { ref } from 'vue';
const router = useRouter();
console.log(router);
const formRef = ref(null);
const formData = ref({
  loginAccount: '',
  password: '',
});
const go = async (value) => {
  console.log(formData.value);
  // 调用登录方法
  const loginRes = await User.login(formData.value.loginAccount, formData.value.password);
  console.log('loginRes', loginRes);
  const token = loginRes.data.data;
  // 将 token 存储到 localStorage
  localStorage.setItem('token', token);
  //保存登录时间
  localStorage.setItem('lastLoginTime', new Date().toLocaleString());
  // 登录成功后跳转页面
  if (loginRes.data.code === 100200) {
    router.push('/index');
  } else {
    alert(loginRes.data.msg);
  }
  // console.log(await formRef.value.validateFields());
  // const res = await User.login(formData.value.loginAccount, formData.value.password);
  // console.log('res', res);
  // await router.push('/index');
};
</script>

<style scoped>
/* 背景 */
.login-container {
  width: 100vw;
  height: 100vh;
  background: url('../../img/beijing2.png') no-repeat;
  background-size: 100% 100%;
  display: flex; /* 使用flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.login-form {
  width: 565px;
  height: 372px;
  background: url('../../img/44872c82e103aae435524c5f400ab0ff_2024-12-25_16-05-16.png');
  padding: 40px 110px;
}

/* 用户登陆标题 */
.title {
  margin-bottom: 50px;
  font-weight: 700;
  font-size: 24px;
  font-family: Microsoft Yahei;
  color: #fff;
  margin-left: 80px;
}
label {
  margin: 5px 15px;
  height: 20px;
}
/* 输入框 */
.inputBox {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  padding: 1px 8px 1px 29px;
  background: url('../../img/登录-copy.png') no-repeat;
  background-position: 1px 1px;
  background-size: 25px;
}
/* 输入框 */
.inputBox1 {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  padding: 1px 8px 1px 29px;
  background: url('../../img/password.png') no-repeat;
  background-position: 1px 1px;
  background-size: 25px;
}

/* 输入框内左边距50px */
/* .ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 50px;
} */
button {
  margin: 5px 15px;
}
</style>
