<template>
  <div class="tradeList" :class="{'min-center tradeList-pc':!isMobile,'tradeList-m':isMobile}">
    <comtitle title="全部交易信息" firstUrl="/index" firstUrlTitle="首页"></comtitle>
    <div class="table-box">
      <div class="table">
        <table class="table-head">
          <thead>
            <tr>
              <th>交易哈希</th>
              <th>发送方</th>
              <th></th>
              <th>接收方</th>
              <th>价值</th>
              <th>手续费</th>
              <th>调用函数</th>
              <!-- <th>交易类型</th> -->
              <th>时间(GMT+8)</th>
              <th>代币</th>
            </tr>
          </thead>
        </table>
        <table class="table1">
          <tbody
            class="scroll-loading"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
          >
            <tr
              v-for="(e,index) in txList"
              :key="index"
              :class="{'tradeGroup-one': e.tradeG===1,'tradeHead':e.tradeG===2,'tradeSlot':e.tradeG===3}"
            >
              <td>
                <p v-if="e.tradeG===2" class="Head-title">交易组</p>
                <div :class="{'group-box group-first':e.tradeG===2}">
                  <em></em>
                  <span></span>
                  <p class="light">
                    <router-link
                      class="light"
                      :to="{path:'/tradeHash', query:{'hash':e.txHash}}"
                    >{{e.txHash|addressEll}}</router-link>
                  </p>
                  <p class="trade-line line-first" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td>
                <div :class="{'group-box':e.tradeG===2}">
                  <div class="light">
                    <p class="light" @click="goAddress(e.tx.from)">{{e.tx.from|addressEll}}</p>
                  </div>
                  <p class="trade-line" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td>
                <div :class="{'group-box':e.tradeG===2}">
                  <img src="@/assets/images/img/right.png">
                  <p class="trade-line" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td>
                <div :class="{'group-box':e.tradeG===2}">
                  <div class="light">
                    <p class="light" @click="goAddress(e.tx.to)">{{e.tx.to|addressEll}}</p>
                  </div>
                  <p class="trade-line" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td>
                <div :class="{'group-box':e.tradeG===2}">
                  {{e|getTradeValue}}
                  <p class="trade-line" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td>
                <div :class="{'group-box':e.tradeG===2}">
                  {{e.tx.fee|filterFee}}
                  <p class="trade-line" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td>
                <div :class="{'group-box':e.tradeG===2}">
                  {{e.actionName === 'unknown'? 'none':e.actionName}}
                  <p class="trade-line" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <!-- <td>{{e|tradeGroup}}</td> -->
              <td>
                <div :class="{'group-box':e.tradeG===2}">
                  {{e.blockTime | formatTime}}
                  <p class="trade-line" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td v-if="e.tokenName === '--'||e.tokenName===$store.getters.baseCoin" class="symbol">
                <div :class="{'group-box group-last':e.tradeG===2}">
                  <div class="flex-center">
                    <img :src="$store.getters.baseIcon">
                    <p>（{{$store.getters.baseCoin}}）</p>
                  </div>
                  <p class="trade-line line-last" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
              <td v-else class="symbol" @click="viewToken(e.tokenName,true)">
                <div :class="{'group-box group-last':e.tradeG===2}">
                  <div class="flex-center" v-show="e.tokenSymbol!==undefined">
                    <div v-if="e.tokenSymbol!==''" :class="{'h-light':viewToken(e.tokenName)}">
                      <img :src="e.tokenSymbol">
                      <p>（{{e.tokenName}}）</p>
                    </div>
                    <div v-else :class="{'h-light':viewToken(e.tokenName)}">
                      <img :src="coin">
                      <p>（{{e.tokenName}}）</p>
                    </div>
                  </div>
                  <p class="trade-line line-last" v-if="e.tradeG !== 0&&e.tradeG!==3"></p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="nodata" v-show="isLoading&&refreshTime===0">
        <beat-loader :num="8"></beat-loader>
      </div>
      <div class="nodata" v-show="updateload">
        <beat-loader :num="8"></beat-loader>
      </div>
      <div class="nodata" v-if="txList.length===0&&!isLoading">暂无记录</div>
    </div>
    <div class="loadmore">提示：滚动加载更多. . .</div>
  </div>
</template>
<script>
import comtitle from "@/components/comtitle.vue";
import beatLoader from "@/components/beatLoader";
import homeBase from "./tradeList.base.js";
export default {
  name: "index",
  components: {
    comtitle,
    beatLoader
  },
  mixins: [homeBase]
};
</script>
<style lang="scss" scoped>
.tradeList-pc {
  padding-bottom: 20px;
  .scroll-loading {
    display: block;
    max-height: 730px;
    overflow: auto;
  }
  .loadmore {
    padding-top: 30px;
    font-size: 16px;
  }
  .nodata {
    width: 100%;
    height: 49px;
    line-height: 49px;
    text-align: center;
  }
  .btySymbol > div {
    cursor: default !important;
  }
  .table-box {
    width: 100%;
    table thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
    thead th {
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      text-align: center;
    }
    tr {
      height: 49px;
      text-align: center;
      font-size: 14px;
    }
    td {
      position: relative;
    }
    .table-head {
      margin-top: 12px;
    }
    .table1 {
      width: 100%;
      color: #fff;
      .symbol {
        .flex-center {
          height: 30px;
          p {
            float: left;
            margin-left: 3px;
          }
        }
        div > img {
          width: 20px;
          height: 20px;
          float: left;
        }
      }
      .tradeHead {
        height: 90px;
        td {
          padding-top: 40px;
        }
      }
      .Head-title {
        position: absolute;
        top: 5px;
        left: 65px;
        font-weight: 600;
      }
      .group-box {
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .group-first {
        em {
          display: block;
          border-width: 10px;
          position: absolute;
          top: 21px;
          left: 75px;
          border-style: solid dashed dashed;
          font-size: 0;
          line-height: 0;
        }
        span {
          display: block;
          border-width: 10px;
          position: absolute;
          top: 23px;
          left: 75px;
          border-style: solid dashed dashed;
          font-size: 0;
          line-height: 0;
        }
      }
      .trade-line {
        position: absolute;
        width: 100%;
        bottom: 0;
        margin: 0 auto;
        height: 1px;
      }
    }
    table th:nth-child(1),
    table td:nth-child(1) {
      width: 180px;
    }
    table th:nth-child(2),
    table td:nth-child(2) {
      width: 180px;
    }

    table th:nth-child(3),
    table td:nth-child(3) {
      width: 80px;
    }
    table th:nth-child(4),
    table td:nth-child(4) {
      width: 180px;
    }
    table th:nth-child(5),
    table td:nth-child(5) {
      min-width: 60px;
    }
    table th:nth-child(9),
    table td:nth-child(9) {
      width: 140px;
    }
  }
  .light {
    width: 150px;
  }
}

.tradeList-m {
  height: 93vh;
  width: 100vw;
  padding-bottom: 10vh;
  .scroll-loading {
    max-height: 62vh;
    display: block;
    overflow: auto;
  }
  .loadmore {
    padding-top: 3vw;
    font-size: 3.5vw;
  }
  .nodata {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #fff;
  }
  .table-box {
    width: 95vw;
    margin: 0 auto;
    .table {
      width: 100%;
      overflow: auto;
      margin-top: 2vw;
      .symbol {
        div {
          p {
            float: left;
            margin-left: 1vw;
          }
        }
        div > img {
          width: 5vw;
          height: 5vw;
          float: left;
        }
        .h-light {
          color: #d9a73a;
        }
      }
      .tradeHead {
        height: 25vw;
        td {
          padding-top: 12.5vw;
        }
      }
      .Head-title {
        position: absolute;
        top: 3vw;
        left: 35%;
      }
      .group-box {
        height: 14vw;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .group-first {
        em {
          display: block;
          border-width: 3vw;
          position: absolute;
          top: 7vw;
          left: 17vw;
          border-style: solid dashed dashed;
          font-size: 0;
          line-height: 0;
        }
        span {
          display: block;
          border-width: 3vw;
          position: absolute;
          top: 7.5vw;
          left: 17vw;
          border-style: solid dashed dashed;
          font-size: 0;
          line-height: 0;
        }
      }
      .trade-line {
        position: absolute;
        width: 100%;
        bottom: 0;
        margin: 0 auto;
        height: 1px;
        padding: 0 !important;
      }
      .btySymbol > div {
        cursor: default !important;
      }
    }
    tr:nth-of-type(2n) {
      background-color: #f9fafc;
    }
    tr:nth-of-type(2n + 1) {
      background-color: #fff;
    }
    thead th {
      height: 12vw;
      line-height: 12vw;
      font-size: 3.5vw;
      font-weight: 700;
      text-align: center;
      background: #fff;
      color: #000;
    }
    td {
      position: relative;
      height: 12vw;
      text-align: center;
      font-size: 3.5vw;
      p {
        padding: 0 2vw;
      }
    }
    .table1,
    .table-head {
      color: #838b9e;
      // text-align: center;
      min-width: 350%;
      thead {
        display: block;
      }
    }
    table th:nth-child(1),
    table td:nth-child(1) {
      width: 40vw;
    }
    table th:nth-child(2),
    table td:nth-child(2) {
      width: 40vw;
    }

    table th:nth-child(3),
    table td:nth-child(3) {
      width: 23.4vw;
      img {
        width: 5vw;
        height: 5vw;
      }
    }
    table th:nth-child(4),
    table td:nth-child(4) {
      width: 40vw;
    }
    table th:nth-child(5),
    table td:nth-child(5) {
      width: 35vw;
    }
    table th:nth-child(6),
    table td:nth-child(6) {
      width: 27vw;
    }
    table th:nth-child(7),
    table td:nth-child(7) {
      width: 40vw;
    }
    table th:nth-child(8),
    table td:nth-child(8) {
      width: 40vw;
    }
    table th:nth-child(9),
    table td:nth-child(9) {
      width: 45vw;
    }
    table th:nth-child(10),
    table td:nth-child(10) {
      width: 40vw;
    }
    .notBTY {
      min-width: 300%;
    }
  }
  .box-shadow {
    box-shadow: rgba(229, 235, 243, 1) 0 0 5vw;
    margin-top: 2vw;
  }
  .light {
    width: 40vw;
  }
}
</style>

<style lang="scss">
.tradeList {
  .loadmore {
    text-align: center;
    color: #838b9e;
  }
  .nodata {
    background: #3e3d41;
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
    tbody {
      color: #efefef;
    }
    tr.tradeGroup-one,
    tr.tradeSlot {
      background-color: #242327 !important;
      border-left: 1px solid #453b14;
      border-right: 1px solid #453b14;
    }
    .tradeSlot {
      border-bottom: 1px solid #f6e4b7;
    }
    tr.tradeHead {
      background-color: #363339 !important;
      .group-box {
        border-top: 1px solid #453b14;
        background: #242327;
      }
      .group-first {
        border-left: 1px solid #453b14;
        em {
          border-color: transparent transparent #453b14;
        }
        span {
          border-color: transparent transparent #242327;
        }
      }
      .group-last {
        border-right: 1px solid #453b14;
      }
    }
    .trade-line {
      background: #333236;
    }
    .line-first {
      width: 85%;
      left: 15%;
    }
    .line-last {
      width: 85%;
      right: 15%;
    }
    .tradeSlot {
      border-bottom: 1px solid #453b14;
    }
    .tradeHead {
      border-left: none;
    }
  }
  .light {
    margin: 0 auto;
    color: #d9a73a;
    text-align: center;
    cursor: pointer;
  }
  .h-light {
    color: #d9a73a;
    cursor: pointer;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>