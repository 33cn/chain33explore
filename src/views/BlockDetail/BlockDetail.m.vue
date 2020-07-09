<template>
  <div class="qukuai">
    <div class="content">
      <comtitle
        title="区块详情"
        firstUrl="/index"
        firstUrlTitle="首页"
        secondUrl="/block"
        secondUrlTitle="全部区块信息"
      ></comtitle>
      <div class="h-title">
        <span></span>
        <p>区块 {{data.Height}}</p>
      </div>

      <!-- 区块哈希 -->
      <div class="hash">
        <p>区块哈希 &nbsp;{{data.Hash|filterHash}}</p>
        <img
          src="../../assets/images/img/copy.png"
          class="copy-m"
          v-clipboard:copy="data.Hash"
          v-clipboard:success="success"
          v-clipboard:error="error"
        >
      </div>
      <div class="h-title">
        <span></span>
        <p>概况</p>
      </div>
      <!-- 概况 -->
      <div class="allcention">
        <ul>
          <li>
            <span>交易数量</span>
            <span>{{Txcount}}</span>
          </li>
          <li>
            <span>高度</span>
            <span>{{blockInfo.height}}</span>
          </li>
          <li v-if="!ParallelChain">
            <span>区块收益</span>
            <span>30(矿工18+发展基金12)</span>
          </li>
          <li>
            <span>时间</span>
            <span>{{blockInfo.blockTime | formatTime}}</span>
          </li>
          <li>
            <span>上一块</span>
            <span class="link" v-if="Number(blockInfo.height)<=0">无</span>
            <span
              class="link"
              v-if="Number(blockInfo.height)>0"
              @click="selectblockdetail(parseInt(blockInfo.height)-1)"
            >{{parseInt(blockInfo.height)-1}}</span>
          </li>
          <li>
            <span>下一块</span>
            <span class="link" v-if="Number(blockInfo.height)>=maxHeight">暂无</span>
            <span
              class="link"
              v-if="Number(blockInfo.height)<maxHeight"
              @click="selectblockdetail(parseInt(blockInfo.height)+1)"
            >{{parseInt(blockInfo.height)+1}}</span>
          </li>
          <li>
            <span>默克尔根</span>
            <div class="auto">{{blockInfo.txHash|filterHash}}</div>
            <img
              src="../../assets/images/img/copy.png"
              class="copy-m"
              v-clipboard:copy="blockInfo.txHash"
              v-clipboard:success="success"
              v-clipboard:error="error"
            >
          </li>
          <li>
            <span>状态哈希</span>
            <div class="auto">{{blockInfo.stateHash|filterHash}}</div>
            <img
              src="../../assets/images/img/copy.png"
              class="copy-m"
              v-clipboard:copy="blockInfo.stateHash"
              v-clipboard:success="success"
              v-clipboard:error="error"
            >
          </li>
        </ul>
      </div>
      <div class="h-title">
        <span></span>
        <p>交易记录</p>
      </div>
      <!-- 表格 -->
      <div class="table">
        <table>
          <tr class="tr-head">
            <!-- <td class="icom"></td> -->
            <td>交易哈希</td>
            <td>发送方</td>
            <td>接收方</td>
            <td>价值</td>
            <td>手续费</td>
            <td class="time">时间(GMT+8)</td>
            <td>调用函数</td>
            <td>代币</td>
          </tr>
          <tr
            v-for="(data,index) in blockTable"
            :key="index"
            :class="{'tradeGroup-one': data.tradeG!==0,'tradeHead':data.tradeG===2,'tradeSlot':data.tradeG===3}"
          >
            <td class="link" style="position:relative">
              <p v-if="data.tradeG===2" class="Head-title">交易组</p>
              <div :class="{'group-box group-first':data.tradeG===2}">
                <em></em>
                <span></span>
                <i v-if="isTradeError(data, data.receipt.ty)"></i>
                <i class="iconfont icon-chucuo" v-if="data.isError"></i>
                <p @click="goTradeHash(data.hash)">{{data.hash|addressEll}}</p>
                <p class="trade-line line-first" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td class="link">
              <div :class="{'group-box':data.tradeG===2}">
                <p class="link" @click="goAddress(data.fromAddr)">{{data.fromAddr|addressEll}}</p>
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td class="link">
              <div :class="{'group-box':data.tradeG===2}">
                <p class="link" @click="goAddress(data.tx.to)">{{data.tx.to|addressEll}}</p>
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                {{data | getTradeValue}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                {{data.tx.fee|filterFee}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td class="time">
              <div :class="{'group-box':data.tradeG===2}">
                {{data.blockTime | formatTime}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td>
              <div :class="{'group-box':data.tradeG===2}">
                {{data.actionName === 'unknown'? 'none':data.actionName}}
                <p class="trade-line" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
            <td v-if="symbol[index] === $store.getters.baseCoin" class="symbol">
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
                  <p>（{{symbol[index]}}）</p>
                </div>
                <p class="trade-line line-last" v-if="data.tradeG !== 0&&data.tradeG!==3"></p>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="nodata" v-if="blockTable.length===0">暂无记录</div>
      <div class="fenye">
        <el-pagination
          small
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pagesize"
          :total="total"
          layout="prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import comtitle from "@/components/comtitle.vue";
import blockDetailBase from "./blockDetail.base.js";
export default {
  components: {
    comtitle
  },
  mixins: [blockDetailBase]
};
</script>
<style lang="scss">
.qukuai {
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1),
    rgba(239, 245, 252, 1)
  );
  .content {
    padding: 0 3vw 5vw;
    .h-title {
      height: 10vw;
      line-height: 10vw;
      span {
        border-left: 0.5vw solid #838b9e;
      }
      p {
        font-size: 4.5vw;
        display: inline-block;
        margin-left: 3vw;
      }
    }
  }
  .nodata {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #fff;
    border: 1px solid #eee;
  }
  .hash {
    /*width: 100%;*/
    height: 10vw;
    background: #fff;
    padding: 0 3vw;
    overflow-x: auto;
    color: #5d6187;
    p {
      display: inline-block;
      float: left;
      width: 75vw;
      line-height: 37px;
      // color: #333;
      font-size: 3.5vw;
    }
  }
  .copy-m {
    width: 5vw;
    height: 5vw;
    margin-top: 2vw;
    margin-left: 3vw;
  }
  .hash::-webkit-scrollbar {
    display: none;
  }
  .link {
    color: #0975a7;
  }
  .allcention {
    background: #fff;
    border: 1px solid #eee;
    li {
      height: 12vw;
      line-height: 12vw;
      border-bottom: 1px solid #eee;
      span {
        float: left;
        display: block;
        width: 30%;
        padding-left: 4vw;
      }
      .auto {
        float: left;
        display: block;
        height: 12vw;
        overflow-y: auto;
        width: 50%;
        margin-left: 3.5vw;
      }
      span:last-child {
        width: 60%;
        padding-left: 3vw;
      }
    }
  }
  .fenye {
    /*width: 50%;*/
    margin: 0 auto;
    text-align: center;
    margin-top: 3vw;
  }
  .table::-webkit-scrollbar {
    display: none;
  }
  .table {
    width: 100%;
    overflow-x: auto;
    .Head-title {
      position: absolute;
      top: 3vw;
      left: 33%;
      font-weight: 600;
      color: #d7a93a;
    }
    tr.tradeGroup-one {
      background-color: #fffaee !important;
    }
    .tradeSlot {
      border-bottom: 1px solid #f6e4b7;
      border-left: 1px solid #f6e4b7;
      border-right: 1px solid #f6e4b7;
    }
    tr.tradeHead {
      background-color: #fff !important;
      height: 25vw;
      td {
        padding-top: 12.5vw;
      }
      .group-box {
        height: 14vw;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid #f6e4b7;
        background: #fffaee;
      }
      .group-first {
        border-left: 1px solid #f6e4b7;
        em {
          display: block;
          border-width: 3vw;
          position: absolute;
          top: 7vw;
          left: 17vw;
          border-style: solid dashed dashed;
          font-size: 0;
          line-height: 0;
          border-color: transparent transparent #f6e4b7;
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
          border-color: transparent transparent #fffaee;
        }
      }
      .group-last {
        border-right: 1px solid #f6e4b7;
      }
    }
    .trade-line {
      position: absolute;
      width: 100%;
      bottom: 0;
      margin: 0 auto;
      height: 1px;
      padding: 0 !important;
      background: #f5eedd;
    }
    .symbol {
      div {
        cursor: pointer;
        p {
          margin-left: 1vw;
          padding-top: 1.5vw;
        }
      }
      div > img {
        margin-top: 1.5vw;
        margin-left: 6vw;
        width: 5vw;
        height: 5vw;
        float: left;
      }
    }
    table {
      .time {
        width: 40vw;
      }
      .icon-chucuo {
        position: absolute;
        left: 2vw;
      }
      table-layout: fixed;
      text-align: center;
      width: 200%;
      tr {
        height: 15vw;
        /*line-height: 60px;*/
        color: #333;
        font-size: 3.5vw;
        border: 1px solid #eee;
        background: #f9f9f9;
        .light {
          color: #0975a7;
        }
        td {
          position: relative;
          &:nth-of-type(1) {
            width: 45vw;
          }
          &:nth-of-type(2) {
            width: 40vw;
          }
          &:nth-of-type(3) {
            width: 40vw;
          }
          &:nth-of-type(4) {
            width: 20vw;
          }
          &:nth-of-type(5) {
            width: 20vw;
          }
          &:nth-of-type(6) {
            width: 45vw;
          }
          &:nth-of-type(7) {
            width: 25vw;
          }
          &:nth-of-type(8) {
            width: 35vw;
          }
          span {
            max-width: 40px;
          }
          i {
            color: #ff4e00;
            font-size: 3.5vw;
          }
        }
        .icom {
          width: 4vw;
          padding: 0;
        }
      }
      tr:nth-child(odd) {
        background: #fff;
      }
      .tr-head {
        height: 15vw;
        color: #333;
        font-size: 3.7vw;
        font-weight: bold;
      }
    }
  }
}
</style>