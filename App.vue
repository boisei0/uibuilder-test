<template>
  <div id="app">
    <router-view name="menu" />
    <b-container fluid>
      <router-view />
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'BaseApp',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
