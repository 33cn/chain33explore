<template>
  <div id="app" :class="{'app-white':isDay, 'mapp':isMobile }">
    <pc-header v-if="!isMobile"></pc-header>
    <mobile-header v-if="isMobile"></mobile-header>
    <div class="content-block" :class="{'min-bg':!isMobile}">
      <router-view></router-view>
    </div>
    <div
      :class="['lose-connection', 'box-shadow',{'active': !connectStatus}]"
    >无法连接节点 {{currentProvider}}，请检查节点正常运行后刷新页面！</div>
  </div>
</template>
<script>
import pcHeader from "./components/header/header.pc";
import mobileHeader from "./components/header/header.m";
import display from "@/mixins/display.js";
export default {
  name: "app",
  mixins: [display],
  components: {
    pcHeader,
    mobileHeader
  },
  computed: {
    currentProvider() {
      return this.$store.state.apiSetting.provider;
    }
  }
};
</script>
<style>
html,
body {
  width: 100%;
  min-height: 100vh;
}
</style>
<style lang="scss" scoped>
.content-block {
  width: 100%;
  margin: auto;
  min-height: calc(100vh - 79px);
}
.min-bg {
  min-width: 1300px;
}
.h-light {
  color: #d9a73a;
}
.lose-connection {
  position: fixed;
  z-index: -1;
  left: 20px;
  right: 20px;
  top: 200px;
  text-align: center;
  background-color: rgba(222, 177, 66, 0.64);
  line-height: 100px;
  font-size: 24px;
  color: #ffffff;
  border-radius: 2px;
  opacity: 0;
  transform: translateY(-200px);
  transition: transform 0.3s;
  &.active {
    z-index: 3;
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
