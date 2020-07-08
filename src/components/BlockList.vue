<template>
  <div class="records-box">
    <h4 class="records-title flex-between" v-if="!isMobile">
      <span>最新区块</span>
      <router-link to="/block">查看全部</router-link>
    </h4>
    <div v-for="blockinfo in blockList" :key="blockinfo.height" class="record-item">
      <div class="record-title flex-between">
        <div>
          区块高度：
          <router-link :to="blockinfo.height | blockDetail" class="numtext">{{blockinfo.height}}</router-link>
        </div>
        <div v-show="blockinfo.blockTime">
          时间：
          <span class="numtext">{{blockinfo.blockTime | fulltime}}</span>
        </div>
      </div>
      <div v-if="blockinfo.hash" class="record-content flex-center">
        <div v-show="!isParallelChain && blockinfo.txCount" class="record-col address">
          <p>挖矿地址</p>
          <p>
            <placeholder v-if="!blockinfo.minerAddress" :width="160" :height="18"/>
            <router-link
              v-else
              :to="blockinfo.minerAddress | addressDetail"
            >{{blockinfo.minerAddress | addressEll}}</router-link>
          </p>
        </div>
        <div v-show="!blockinfo.txCount" class="record-col">
          <p>
            <span class="text">自增高度</span>
          </p>
        </div>
        <div class="record-col">
          <p>交易数</p>
          <p>
            <span class="num">{{blockinfo.txCount}}</span>
          </p>
        </div>
        <div v-show="!isParallelChain && blockinfo.minerAddress" class="record-col miner">
          <p>挖矿收益</p>
          <p>
            <span class="text">30（矿工18+发展基金12）</span>
          </p>
        </div>
      </div>
      <div v-else class="record-content flex-center">
        <div class="placeholder-wraper">
          <placeholder :width="480" :height="18"/>
          <placeholder :width="270" :height="18"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Placeholder from "@/components/Placeholder.vue";
import display from "@/mixins/display.js";
export default {
  props: ["blockList"],
  mixins: [display],
  components: {
    placeholder: Placeholder
  }
};
</script>
