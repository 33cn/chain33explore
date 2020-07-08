<template>
  <div class="blockInfo" :class="{'blockInfo-pc  min-center':!isMobile,'blockInfo-m':isMobile}">
    <div class="table-box">
      <comtitle title="全部区块信息" firstUrl="/index" firstUrlTitle="首页"></comtitle>
      <div class="content">
        <table class="table">
          <thead>
            <th>高度</th>
            <th>区块哈希</th>
            <th v-if="!ParallelChain">挖矿收益</th>
            <th>交易数量</th>
            <th>时间(GMT+8)</th>
          </thead>
          <tbody>
            <tr v-show="isLoading&&BlockInfo.length===0">
              <td :colspan="!ParallelChain?5:4">
                <beat-loader :num="5"></beat-loader>
              </td>
            </tr>
            <tr v-for="(e,index) in BlockInfo" :key="index">
              <td>
                <router-link
                  class="light"
                  :to="{path:'/blockDetail', query:{'height':e.height}}"
                >{{e.height}}</router-link>
              </td>
              <td class="light">
                <router-link
                  class="light"
                  :to="{path:'/blockDetail', query:{'height':e.height}}"
                >{{e.hash|filterHash}}</router-link>
              </td>
              <td v-show="!ParallelChain">30 BTY (矿工18+发展基金12)</td>
              <td class="light">{{e.txCount}}</td>
              <td>{{e.blockTime|formatTime}}</td>
            </tr>
          </tbody>
          <tfoot v-if="!isLoading&&BlockInfo.length===0">
            <tr>
              <td colspan="5">暂无记录</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="pageblock">
        <el-pagination
          background
          :small="isMobile"
          layout="prev, pager, next"
          :page-size="pagesize"
          :current-page.sync="page"
          :total="total"
          :pager-count="5"
          @current-change="pagechange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import comtitle from "@/components/comtitle.vue";
import beatLoader from "@/components/beatLoader";
import Base from "./block.base.js";
export default {
  name: "index",
  components: {
    comtitle,
    beatLoader
  },
  mixins: [Base]
};
</script>
<style lang="scss" scoped>
//PC样式
.blockInfo-pc {
  .table-box {
    width: 100%;
    .adress {
      width: 200px;
    }
    thead th {
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      text-align: center;
    }
    td {
      height: 49px;
      text-align: center;
      line-height: 49px;
      font-size: 14px;
    }
    .table {
      width: 100%;
      color: #fff;
      margin-top: 12px;
    }
    .table th:nth-child(1),
    .table td:nth-child(1) {
      min-width: 150px;
      text-align: center;
    }
    .table th:nth-child(2),
    .table td:nth-child(2) {
      min-width: 350px;
      // width: 500px;
      text-align: center;
    }

    .table th:nth-child(3),
    .table td:nth-child(3) {
      // width: 300px;
      min-width: 200px;
      text-align: center;
    }
    > .table th:nth-child(4),
    .table td:nth-child(4) {
      // width: 250px;
      min-width: 150px;
    }
    .table th:nth-child(5),
    .table td:nth-child(5) {
      // width: 350px;
      min-width: 250px;
    }
  }
  .pageblock {
    margin: auto;
    padding: 30px 0 30px;
  }
}

//mobile样式
.blockInfo-m {
  background: linear-gradient(0deg, #f3f7fc, rgba(239, 245, 252, 1));
  padding: 0 3vw 5vw;
  width: 100vw;
  .content {
    width: 100%;
    overflow-x: auto;
    margin-top: 2vw;
  }
  .table {
    box-shadow: rgba(229, 235, 243, 1) 0 0 3vw;
    width: 250%;
    th,
    td {
      text-align: center;
      height: 11vw;
    }
    th:nth-child(1),
    td:nth-child(1) {
      min-width: 25vw;
    }
    th:nth-child(2),
    td:nth-child(2) {
      min-width: 65vw;
    }
    th:nth-child(3),
    td:nth-child(3) {
      width: 53vw;
    }
    th:nth-child(4),
    td:nth-child(4) {
      width: 33vw;
    }
    th:last-child,
    td:last-child {
      width: 45vw;
    }
    .adress {
      width: 36vw;
      margin: 0 auto;
    }
  }
  .pageblock {
    margin: auto;
    padding: 30px 0 30px;
  }
}
</style>

<style lang="scss">
.blockInfo {
  .light {
    color: #d9a73a;
  }
  .table-box {
    table tbody tr:hover {
      background: $black_bg_gray;
    }
    tr:nth-of-type(2n) {
      background-color: #363339;
    }
    tr:nth-of-type(2n + 1) {
      background-color: #3e3d41;
    }
    thead th {
      background-color: #2d2c2d;
      color: #fff;
    }
  }
}
</style>
