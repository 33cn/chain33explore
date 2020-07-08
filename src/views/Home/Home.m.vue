<template>
  <div class="home-m">
    <!-- 区块、交易区 -->
    <div class="content">
      <div class="tab-bar">
        <p :class="{'active-tab':tabActive===true}" @click="tabActive=true">最新区块</p>
        <p :class="{'active-tab':tabActive===false}" @click="tabActive=false">最新交易</p>
        <div @click="viewAll(tabActive)">查看全部</div>
      </div>
      <img class="bottomArr" src="../../assets/images/img/bottomArr.png" v-show="tabActive===false">
      <img class="bottomArr" src="../../assets/images/img/bottomArr.png" v-show="tabActive===true">
      <div class="left-box" v-show="tabActive===true">
        <block-list :blockList="blockList" class="home-records"/>
      </div>
      <div class="right-box" v-show="tabActive===false">
        <tx-list :txList="txList"/>
      </div>
    </div>
  </div>
</template>

<script>
import BlockList from "@/components/BlockList.vue";
import TxList from "@/components/TxList.vue";
import homeBase from "@/mixins/home.js";

export default {
  mixins: [homeBase],
  methods: {
    viewAll(val) {
      if (val === true) {
        this.$router.push("/block");
      } else {
        this.$router.push("/tradeList");
      }
    }
  },
  components: {
    "block-list": BlockList,
    "tx-list": TxList
  }
};
</script>

<style lang="scss" scoped>
.home-m {
  .content {
    height: 170vw;
    width: 100vw;
    margin: 0 auto 0;
    background: #fff;
    background-image: linear-gradient(#f8f9fd, #fff 100%);
    .left-box,
    .right-box {
      margin-top: -3vw;
    }
    .bottomArr {
      width: 5vw;
      margin-top: 0.5vw;
      margin-left: 10vw;
    }
    .bottomArr:nth-of-type(1) {
      margin-left: 34vw;
    }
    .tab-bar {
      width: 100vw;
      height: 12vw;
      .active-tab {
        color: #d9a73a;
      }
      p {
        display: inline-block;
        height: 12vw;
        line-height: 17vw;
        width: 24vw;
        padding: 0 1vw;
        text-align: center;
        font-size: 4vw;
        color: #67789b;
      }
      > div {
        margin-top: 6vw;
        margin-right: 3vw;
        width: 20vw;
        height: 6vw;
        line-height: 5.5vw;
        text-align: center;
        float: right;
        font-size: 3.5vw;
        border: 1px solid rgba(185, 156, 126, 1);
        border-radius: 4vw;
        color: #838b9e;
      }
    }
    .records-box {
      background-image: none;
    }
  }
}
</style>