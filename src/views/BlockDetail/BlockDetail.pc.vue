<template>
  <div class="block-box min-center">
    <comtitle
      title="区块详情"
      firstUrl="/index"
      firstUrlTitle="首页"
      secondUrl="/block"
      secondUrlTitle="全部区块信息"
    ></comtitle>
    <div class="trade_hash pdt">
      <p class="theme">区块高度&nbsp;{{data.Height}}</p>
      <p class="txt hd20">
        <span>区块哈希</span>
        &nbsp;{{data.Hash}}
      </p>
      <div
        class="copy"
        v-clipboard:copy="data.Hash"
        v-clipboard:success="success"
        v-clipboard:error="error"
      >复制</div>
    </div>
    <div class="adressInfo mt21">
      <div class="left-box">
        <p class="theme">概况</p>
        <div class="info">
          <p>交易数量</p>
          <p>{{Txcount}}</p>
        </div>
        <div class="infoBottom" v-if="!ParallelChain">
          <p class="border">区块收益</p>
          <p class="bac border">30 (矿工18 + 发展基金12)</p>
        </div>
        <div class="infoBottom" v-if="ParallelChain">
          <p class="border">时间(GMT+8)</p>
          <p class="bac border">{{blockInfo.blockTime | formatTime}}</p>
        </div>
        <div class="infoBottom">
          <p class="border">上一块</p>
          <p v-if="Number(blockInfo.height)<=0">
            <span class="light">暂无</span>
          </p>
          <p v-if="Number(blockInfo.height)>0" class="border">
            <span
              class="lightUrl"
              @click="selectblockdetail(parseInt(blockInfo.height)-1)"
            >{{parseInt(blockInfo.height)-1}}</span>
          </p>
        </div>
        <div class="infoBottom">
          <p>默克尔根</p>
          <el-tooltip :content="blockInfo.txHash" placement="top" effect="light">
            <p class="broke-words">{{blockInfo.txHash}}</p>
          </el-tooltip>
          <div
            class="copy copy-left"
            v-clipboard:copy="blockInfo.txHash"
            v-clipboard:success="success"
            v-clipboard:error="error"
          >复制</div>
        </div>
      </div>
      <div class="right-box">
        <div class="info">
          <p>高度</p>
          <p>{{blockInfo.height}}</p>
        </div>
        <div class="infoBottom" v-if="!ParallelChain">
          <p class="border">时间(GMT+8)</p>
          <p class="bac border">{{blockInfo.blockTime | formatTime}}</p>
        </div>
        <div class="infoBottom">
          <p class="border">下一块</p>
          <p v-if="Number(blockInfo.height)>=maxHeight" class="border">
            <span class="light">暂无</span>
          </p>
          <p v-if="Number(blockInfo.height)<maxHeight" class="border">
            <span
              class="lightUrl"
              @click="selectblockdetail(parseInt(blockInfo.height)+1)"
            >{{parseInt(blockInfo.height)+1}}</span>
          </p>
        </div>
        <div class="infoBottom">
          <p>状态哈希</p>
          <el-tooltip :content="blockInfo.stateHash" placement="top" effect="light">
            <p class="broke-words">{{blockInfo.stateHash}}</p>
          </el-tooltip>
          <div
            class="copy copy-right"
            v-clipboard:copy="blockInfo.stateHash"
            v-clipboard:success="success"
            v-clipboard:error="error"
          >复制</div>
        </div>
      </div>
    </div>
    <div class="table-box box-shadow">
      <p class="tradeRecord">交易记录</p>
      <table class="table1">
        <thead>
          <!-- <th></th> -->
          <th>交易哈希</th>
          <th>发送方</th>
          <th></th>
          <th>接收方</th>
          <th>价值</th>
          <th>手续费</th>
          <th>调用函数</th>
          <th>时间(GMT+8)</th>
          <th>代币</th>
        </thead>
        <tbody>
          <tr
            v-for="(data,index) in blockTable"
            :key="index"
            :class="{'tradeGroup-one': data.tradeG!==0,'tradeHead':data.tradeG===2,'tradeSlot':data.tradeG===3}"
          >
            <td>
              <p v-if="data.tradeG===2" class="Head-title">交易组</p>
              <div :class="{'group-box group-first':data.tradeG===2}">
                <em></em>
                <span></span>
                <i v-if="isTradeError(data,data.receipt.ty)"></i>
                <i class="iconfont icon-chucuo error" v-if="data.isError"></i>
                <p class="txt lightUrl" @click="goTradeHash(data.hash)">{{data.hash|addressEll}}</p>
                <p class="trade-line line-first" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                <div class="txt">
                  <p class="lightUrl" @click="goAddress(data.fromAddr)">{{data.fromAddr|addressEll}}</p>
                </div>
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                <img src="../../assets/images/img/right.png" height="32" width="32" alt>
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                <div class="txt">
                  <p class="lightUrl" @click="goAddress(data.tx.to)">{{data.tx.to|addressEll}}</p>
                </div>
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                {{ data | getTradeValue}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                {{data.tx.fee|filterFee}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                {{data.actionName === 'unknown'? 'none':data.actionName}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                {{data.blockTime | formatTime}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <!-- <td>{{data.actionName}}</td> -->
            <td v-if="symbol[index]===$store.getters.baseCoin" class="symbol">
              <div :class="{'group-box group-last':data.tradeG===2}">
                <div class="flex-center">
                  <img :src="$store.getters.baseIcon" height="20" width="20">
                  <p>（{{$store.getters.baseCoin}}）</p>
                </div>
                <p class="trade-line line-last" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td v-else class="symbol">
              <div :class="{'group-box group-last':data.tradeG===2}">
                <div
                  class="flex-center"
                  :class="{'light':viewToken(symbol[index])}"
                  @click="viewToken(symbol[index],true)"
                >
                  <img
                    :src="tokenSymbol[index] === null? coin : tokenSymbol[index]"
                    v-if="tokenSymbol[index]!==undefined"
                  >
                  <p class="h-light">（{{symbol[index]}}）</p>
                </div>
                <p class="trade-line line-last" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
          </tr>
          <tr v-show="isloading">
            <td colspan="10">
              <beat-loader :num="5" :loading="isloading"></beat-loader>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="isShow">
          <tr>
            <td colspan="10">暂无记录</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pagesize"
      :total="total"
      layout="prev, pager, next"
      class="pageblock"
    ></el-pagination>
  </div>
</template>
<script>
import beatLoader from "@/components/beatLoader";
import comtitle from "@/components/comtitle.vue";
import blockDetailBase from "./blockDetail.base.js";
export default {
  mixins: [blockDetailBase],
  components: {
    comtitle,
    beatLoader
  }
};
</script>

<style lang="scss" scoped>
.block-box {
  .hd20 {
    display: inline-block;
  }
  .copy {
    display: inline-block;
    margin-left: 30px;
    width: 100px;
    height: 35px;
    line-height: 35px;
    border-radius: 17px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
  }
  .lightUrl {
    cursor: pointer;
  }
  .colorGreen {
    color: #8ac009;
  }
  .colorRed {
    color: #eb6506;
  }
  .colorBlue {
    color: #0975a7;
    cursor: pointer;
  }
  .pdt {
    padding: 16px 0 25px 33px;
  }
  .mt21 {
    margin-top: 21px !important;
    padding: 16px 0 25px 33px !important;
  }
  > div.trade_hash {
    width: 100%;
    box-shadow: rgba(185, 185, 185, 0.45) 0px 0px 7px;
    margin-top: 3px;
    color: #fff;
    > p.theme {
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      // color: #fff;
      span {
        border-left: 1px solid #0975a7;
        border-right: 1px solid #0975a7;
        margin-right: 9px;
      }
    }
    > p.txt {
      font-size: 14px;
      line-height: 14px;
      margin-top: 22px;
    }
  }
  > div.adressInfo {
    width: 100%;
    overflow: hidden;
    padding: 6px 0;
    box-shadow: rgba(185, 185, 185, 0.45) 0px 0px 7px;
    > div.left-box {
      width: 50%;
      height: 100%;
      // border-right: 1px solid #eee;
      float: left;
      // padding-right: 14px;
      .theme {
        // padding-left: 10px;
        font-size: 20px;
        // color: #fff;
        line-height: 50px;
      }
    }
    .copy-left,
    .copy-right {
      float: left;
      margin-top: 5px;
      // border:1px solid #D7D7D7;
    }
    > div.right-box {
      // margin-left: 100px;
      padding-top: 50px;
      padding-left: 14px;
      width: 50%;
      height: 100%;
      float: left;
    }
    .info {
      width: 100%;
      height: 49px;
      // padding-top: 15px;
      line-height: 46px;
      font-size: 14px;
      // color: #fff;
      > p {
        float: left;
        &:nth-of-type(1) {
          // padding-left: 50px;
          width: 210px;
          height: 46px;
        }
        &:nth-of-type(2) {
          width: calc(100% - 210px);
          height: 46px;
        }
      }
    }
    .infoBottom {
      font-size: 14px;
      height: 49px;
      line-height: 49px;
      .border {
        // border-top: 1px solid #eee;
      }
      > p {
        float: left;
        &:nth-of-type(1) {
          // padding-left: 50px;
          width: 210px;
          height: 46px;
        }
        &:nth-of-type(2) {
          width: calc(100% - 410px);
          height: 46px;
        }
      }
      .bac {
        width: 300px !important;
      }
    }
  }
  .table1 {
    .tradeHead {
      height: 110px;
      td {
        padding-top: 50px;
      }
    }
    .Head-title {
      position: absolute;
      top: 15px;
      left: 85px;
      font-weight: 600;
    }
    .group-box {
      height: 68px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .group-first {
      em {
        display: block;
        border-width: 10px;
        position: absolute;
        top: 30px;
        left: 95px;
        border-style: solid dashed dashed;
        font-size: 0;
        line-height: 0;
      }
      span {
        display: block;
        border-width: 10px;
        position: absolute;
        top: 32px;
        left: 95px;
        border-style: solid dashed dashed;
        font-size: 0;
        line-height: 0;
      }
      .icon-chucuo {
        margin-top: 50px;
      }
    }
    .trade-line {
      position: absolute;
      width: 100%;
      bottom: 0;
      margin: 0 auto;
      height: 1px;
    }
    .symbol {
      .flex-center {
        height: 30px;
        p {
          float: left;
          margin-left: 3px;
          padding-top: 5px;
        }
      }
      div > img {
        margin-top: 5px;
        margin-left: 10px;
        line-height: 68px;
        width: 20px;
        height: 20px;
        float: left;
      }
    }
  }
  .tradeRecord {
    height: 56px;
    line-height: 56px;
    font-size: 18px;
    margin-top: 30px;
    padding-left: 30px;
    // margin-bottom: 14px;
    span {
      border-left: 1px solid #0975a7;
      border-right: 1px solid #0975a7;
      margin-right: 9px;
    }
  }
  > div.table-box {
    margin-top: 20px;
    width: 100%;
    table {
      width: 100%;
      thead th {
        height: 60px;
        line-height: 42px;
        // padding-top: 26px;
        font-size: 14px;
        text-align: center;
      }
      tfoot {
        td {
          text-align: center;
        }
      }
      td {
        height: 69px;
        text-align: center;
        font-size: 14px;
        position: relative;
        i {
          font-size: 22px;
          cursor: pointer;
        }
        &:nth-of-type(1) {
          width: 220px;
          min-width: 220px;
          p {
            margin: 0 auto;
          }
        }
        &:nth-of-type(2) {
          width: 220px;
          p {
            margin: 0 auto;
          }
        }
        &:nth-of-type(3) {
          width: 75px;
        }
        &:nth-of-type(4) {
          width: 220px;
          p {
            margin: 0 auto;
          }
        }
        &:nth-of-type(5) {
          width: 150px;
          // padding: 015px !important;
        }
        &:nth-of-type(6) {
          width: 120px;
        }
        &:nth-of-type(7) {
          width: 135px;
        }
        &:nth-of-type(8) {
          width: 220px;
        }
        &:nth-of-type(9) {
          width: 165px;
        }
      }
      .error {
        font-size: 20px;
        color: #eb6506;
        position: absolute;
        left: 11px;
        top: 22px;
      }

      .txt {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .box-shadow {
    box-shadow: rgba(185, 185, 185, 0.45) 0px 0px 7px;
  }
  .pageblock {
    margin: 0 auto;
    padding: 30px 0 20px;
  }
}
</style>

<style lang="scss">
.block-box {
  tfoot {
    background: #363339;
    color: #fff;
  }
  .trade_hash {
    background: #363339;
    > p.txt {
      color: #fff;
      span {
        color: #8e8e8e;
      }
    }
  }
  .theme {
    color: #fff;
  }
  .info {
    color: #fff;
    p:nth-of-type(1) {
      color: #8e8e8e;
    }
  }
  .adressInfo {
    background-color: #363339;
    .infoBottom {
      color: #fff;
      p:nth-of-type(1) {
        color: #8e8e8e;
      }
    }
  }
  .lightUrl,
  .light {
    color: #d9a73a;
    cursor: pointer;
  }
  .tradeRecord {
    color: #fff;
    background: #363339;
  }
  thead th {
    background-color: #2d2c2d;
    color: #fff;
  }
  tbody tr:hover {
    background: $black_bg_deep;
  }
  tr:nth-of-type(2n) {
    background-color: #3e3d41;
  }
  tr:nth-of-type(2n + 1) {
    background-color: #363339;
  }

  .table1 {
    color: #efefef;
    tr.tradeGroup-one {
      background-color: #242327 !important;
    }
    tr.tradeSlot {
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
  .copy {
    background: #deb142;
    color: #1a191a;
  }
  .copy-left,
  .copy-right {
    background: none;
    color: #fff;
    border: 1px solid #fff;
  }
}
</style>