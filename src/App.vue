<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  created(){
    document.title = '高考志愿推荐系统';
  }
}
</script>

<style>
html {
  overflow-y: scroll;
}
</style>
