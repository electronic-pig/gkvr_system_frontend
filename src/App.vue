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
html,
body,
#app {
  margin: 0;
  padding: 0;
  /* height: 100%; */
}

html {
  overflow-y: scroll;
}
</style>
