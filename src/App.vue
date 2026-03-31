<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
// import HelloWorld from './components/HelloWorld.vue';
import layout from '@/components/layout/index.vue';
const route = useRoute();
// console.log(route);
const router = useRouter();
// const go = () => {
//   router.push{ { path: '/login' } };
// }
// 是否展示layout，如果定义了layout并且为false不展示，其他情况都展示
// const isDefinedLayout = typeof meta.layout !== 'undefined'
// const isNotShowLayout = isDefinedLayout && routeLocationKey.meta.layout === false
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/pinia">Pinia</RouterLink>
      </nav>
    </div>
  </header> -->
  <!-- <button @click="go">跳转</button>
 <div>layout:{{ route.meta.layout }}</div>
  {{ isNotShowLayout }}-->
  <layout v-if="!(typeof route.meta.layout !== 'undefined' && route.meta.layout === false)">
    <RouterView />
  </layout>
  <RouterView v-else />
  <!-- <RouterView v-if="typeof route.meta.layout !== 'undefined' && route.meta.layout === false" />
  <layout v-else /> -->
</template>

<style scoped>
header {
  max-height: 100vh;
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  margin-top: 2rem;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    flex-wrap: wrap;
    place-items: flex-start;
  }

  nav {
    padding: 1rem 0;
    margin-top: 1rem;
    margin-left: -1rem;
    font-size: 1rem;
    text-align: left;
  }
}
</style>
