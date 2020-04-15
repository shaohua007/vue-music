<!--
 * @Author: 少华
 * @Date: 2019-12-30 16:40:58
 * @LastEditors  : 少华
 * @LastEditTime : 2020-01-13 17:04:59
 * @Description: update time
 -->
<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "./components/m-header/m-header";
import Tab from "./components/tab/tab";
import Player from "./components/player/player";

export default {
  name: "app",
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>

<style>
</style>
