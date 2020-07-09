<template>
  <div class="home">
    <!-- 切换按钮 -->
    <div class="content-wraper switch">
      <style-switch/>
    </div>
    <div class="content-wraper flex-around content-trade">
      <block-list :blockList="blockList" class="home-records"/>
      <tx-list :txList="txList"/>
    </div>
  </div>
</template>
<script>
import StyleSwitch from "@/components/StyleSwitch.vue";
import BlockList from "@/components/BlockList.vue";
import TxList from "@/components/TxList.vue";
import homeBase from "@/mixins/home.js";
export default {
  mixins: [homeBase],
  components: {
    "style-switch": StyleSwitch,
    "block-list": BlockList,
    "tx-list": TxList
  }
};
</script>
<style lang="scss" scoped>
.home {
  min-width: 1300px;
}
.content-wraper.switch {
  text-align: right;
  height: 84px;
  padding-right: 50px;
  padding-top: 40px;
}
.content-trade {
  height: 800px;
  min-width: 1300px;
  padding: 20px 50px 72px;
}
.home-records {
  margin-right: 30px;
}
</style>