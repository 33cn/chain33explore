<template>
  <div class="address-m">
    <div class="content">
      <!-- 标题 -->
      <comtitle
        title="个人地址"
        firstUrl="/idnex"
        firstUrlTitle="首页"
        secondUrl="/block"
        secondUrlTitle="全部区块信息"
      ></comtitle>
      <div class="h-title">
        <span></span>
        <p>概况</p>
      </div>
      <!-- 概况 -->
      <div class="allcention">
        <ul>
          <li>
            <span>地址</span>
            <p class="perHash">{{ addressInfo.adr|filterHash }}</p>
            <img
              src="../../assets/images/img/copy.png"
              class="copy-m"
              v-clipboard:copy="addressInfo.adr"
              v-clipboard:success="success"
            >
          </li>
          <!-- <li>
					<span>余额</span>
					<span>{{ addressInfo.balance?(addressInfo.balance/100000000).toFixed(4):0 }}&nbsp;BTY</span>
				</li>
				<li>
					<span>总发送</span>
					<span>{{ addressInfo.reciver?((addressInfo.reciver - addressInfo.balance)/100000000).toFixed(4):0 }}&nbsp;BTY</span>
				</li>
				<li>
					<span>总接收</span>
					<span>{{ addressInfo.reciver? (addressInfo.reciver/100000000).toFixed(4):0 }}&nbsp;BTY</span>
          </li>-->
          <li>
            <span>交易笔数</span>
            <span>{{addressInfo.txCount?addressInfo.txCount:0}}</span>
          </li>
          <li>
            <span>主代币余额</span>
            <span>{{parseFloat(addressInfo.balance.toFixed(8))}} {{$store.getters.baseCoin}}</span>
          </li>
          <li>
            <span>Token总价值</span>
            <div class="token-balance">
              <el-select
                size="medium"
                v-model="BalanceSelect"
                no-data-text="暂无代币"
                filterable
                :placeholder="`约 ${(totalValue).toFixed(2)} CNY`"
                class="token-select"
                @visible-change="openList"
              >
                <el-option
                  v-for="(token,index) in TokenBalance"
                  :key="index"
                  :label="index"
                  :value="index"
                  class="token-s"
                >
                  <div style="float: left">
                    <div class="token-box">
                      <img :src="token.icon?token.icon:coin" class="selectIcon">
                      <p class="broke-words">
                        {{ token.name }}
                        <span v-if="token.nickname">（{{token.nickname}}）</span>
                      </p>
                    </div>
                    <p
                      class="token-box2"
                    >{{parseFloat((token.balance).toFixed(8))}} {{token.symbol}}</p>
                  </div>
                  <div style="color: #838B9E;float:right">
                    <p
                      class="token-count"
                    >￥{{ token.rmb?(token.rmb).toFixed(2):parseInt(0).toFixed(2) }}</p>
                    <p
                      class="token-count"
                    >￥{{token.rmb?(token.balance*token.rmb).toFixed(2):parseInt(0).toFixed(2)}}</p>
                  </div>
                </el-option>
              </el-select>
              <div class="token-length">{{TokenBalance.length}}</div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 标题 -->
      <div class="h-title tradeRecord">
        <span></span>
        <p>交易记录</p>
      </div>
      <div class="tokenRecord">
        <el-select
          v-model="chooseToken"
          @change="searchToken(chooseToken)"
          popper-class="selectIcon-box-m"
        >
          <el-option
            v-for="(item,index) in selectTokenSymbol"
            :key="index"
            :value="index"
            :label="item.symbol"
            class="selectIcon-detail"
          >
            <div style="float:left" class="select-left">
              <img :src="item.icon?item.icon:coin" class="selectIcon" v-if="item.symbol!=='全部'">
            </div>
            <div style="float:left" class="select-right-m">{{item.symbol}}</div>
          </el-option>
        </el-select>
      </div>
      <!-- 表格 -->
      <div class="table">
        <table>
          <tr class="tr-head">
            <td class="icom"></td>
            <td>交易哈希</td>
            <td>发送方</td>
            <td class="icom"></td>
            <td>接收方</td>
            <td>价值</td>
            <td>手续费</td>
            <td class="time">时间(GMT+8)</td>
            <td>调用函数</td>
            <td>代币</td>
          </tr>
          <tr v-for="(data,index) in TableList" :key="index">
            <td class="icom">
              <span v-if="isTradeError(data,data.receipt.ty)"></span>
              <i v-if="data.isError" class="iconfont icon-chucuo"></i>
            </td>
            <td class="link">
              <router-link
                class="link"
                :to="{ path: '/tradeHash', query: { hash: data.txHash } }"
              >{{data.txHash|addressEll}}</router-link>
            </td>
            <td>
              <p
                :class="{link:addressInfo.adr  !==  data.fromAddr}"
                @click="linkAddr(data.fromAddr)"
              >{{data.fromAddr|addressEll}}</p>
            </td>
            <td class="in-out">
              <p v-show="data.tx.to == $route.query.address">接收</p>
              <p v-show="data.fromAddr == $route.query.address">转出</p>
            </td>
            <td>
              <p
                :class="{link:addressInfo.adr  !==  data.tx.to}"
                @click="linkAddr(data.tx.to)"
              >{{data.tx.to|addressEll}}</p>
            </td>
            <td>{{data | getTradeValue}}</td>
            <td>{{data.tx.fee|filterFee}}</td>
            <td class="time">{{data.blockTime|fulltime}}</td>
            <td>{{data.actionName === 'unknown'? 'none':data.actionName}}</td>
            <td class="symbol">
              <div
                class="flex-center unknowSymbol"
                :class="{'link':viewToken(checkToken(data))}"
                @click="viewToken(checkToken(data),true)"
              >
                <img
                  :src="data.icon?data.icon:coin"
                  v-if="checkToken(data)!==$store.getters.baseCoin"
                >
                <img :src="$store.getters.baseIcon" height="20" width="20" v-else>
                <p>（{{data|getTradeSymbol}}）</p>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="nodata" v-if="TableList.length === 0&&!isloading">暂无交易记录</div>
      <div class="nodata" v-show="isloading">
        <beat-loader :num="5"></beat-loader>
      </div>
      <!-- 交易记录分页 -->
      <div class="page-box flex-center">
        <div class="page-btn" @click="PageChange('first')">首页</div>
        <div
          class="page-btn"
          :class="{'isDisabled':pageType===1||pageType===5}"
          @click="PageChange('pre')"
        >上一页</div>
        <div
          class="page-btn"
          :class="{'isDisabled':pageType===4||pageType===5}"
          @click="PageChange('next')"
        >下一页</div>
        <div class="page-btn" @click="PageChange('last')">尾页</div>
      </div>
    </div>
  </div>
</template>
<script>
import comtitle from "@/components/comtitle.vue";
import beatLoader from "@/components/beatLoader";
import addressBase from "./address.base.js";
export default {
  components: {
    comtitle,
    beatLoader
  },
  mixins: [addressBase]
};
</script>
<style lang="scss" scoped>
.selectIcon {
  width: 5vw;
  height: 5vw;
  margin-top: 2.3vw;
  float: left;
  margin-right: 2vw;
}
.token-s {
  height: 15vw;
  padding: 0 2vw;
  font-size: 3vw;
  .token-count {
    color: #838b9e;
    height: 7vw;
    line-height: 7vw;
    text-align: right;
  }
  .token-box {
    height: 8vw;
    > p {
      height: 8vw;
      line-height: 8vw;
      width: 37vw;
    }
  }
  .token-box2 {
    height: 8vw;
    line-height: 8vw;
    text-align: left;
    text-indent: 2.3em;
  }
}
</style>
<style lang="scss">
.selectIcon-box-m ul {
  height: 50vw;
}
.selectIcon-detail:nth-of-type(1) {
  div {
    float: none !important;
    text-align: center;
  }
  div:nth-of-type(1) {
    width: 0;
    height: 0;
  }
}
.el-select-dropdown__item {
  padding: 0 2vw;
}
.select-right-m {
  text-align: center;
  margin-left: 2vw;
}
.address-m {
  min-height: 92vh;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1),
    rgba(239, 245, 252, 1)
  );
  .h-light {
    color: #d9a73a;
    cursor: pointer;
  }
  .tradeRecord {
    margin-top: 6vw;
    float: left;
  }
  .tokenRecord {
    float: right;
    margin: 6.5vw 0 3vw;
    width: 40vw;
    .el-select {
      width: 40vw !important;
      input {
        height: 8vw;
        line-height: 8vw;
      }
      i {
        line-height: 8vw;
      }
    }
    .el-input__suffix {
      right: 4vw !important;
    }
    .el-input--suffix input {
      text-align: center !important;
    }
  }
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
    .el-select {
      width: 67vw;
      background: none;
    }
    .el-select-dropdown__item {
      padding: 0;
    }
    .token-balance {
      display: inline-block;
      width: 65vw;
      margin-left: 2vw;
      .token-length {
        display: inline-block;
        position: relative;
        top: -15vw;
        left: 61vw;
        width: 7vw;
        height: 7vw;
        font-size: 4vw;
        line-height: 7vw;
        text-align: center;
        background: #e65656;
        border-radius: 50%;
        color: #fff;
      }
      .el-input__suffix {
        width: 15vw;
        right: 2vw;
        // height: 8vw;
        i {
          height: 8vw;
          line-height: 8vw;
        }
      }
    }
  }
  .allcention {
    background: #fff;
    border: 1px solid #eee;
    box-shadow: rgba(229, 235, 243, 1) 0 0 2vw;
    .copy-m {
      width: 7vw;
      height: 7vw;
      margin-top: 3vw;
    }
    li {
      height: 12.5vw;
      line-height: 12.5vw;
      border-bottom: 1px solid #eee;
      span {
        display: inline-block;
        float: left;
        width: 21%;
        margin-left: 3vw;
        color: #838b9e;
      }
      span:last-child,
      .perHash {
        width: 60%;
        margin-left: 3vw;
        color: #192136;
      }
      .perHash {
        display: inline-block;
        float: left;
        width: 55vw;
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
  .page-box {
    position: relative;
    width: 90vw;
    margin: 8vw auto 0px;
    padding-bottom: 10vw;
    .page-btn {
      display: inline-block;
      width: 60px;
      height: 27px;
      line-height: 25px;
      color: #606266;
      border: 1px solid #dcdfe6;
      margin: 0 5px;
      text-align: center;
    }
    .isDisabled {
      color: #ccc;
      cursor: not-allowed;
    }
    button {
      width: 15vw;
      height: 28px;
      line-height: 28px;
      padding: 0;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
    }
  }
  .table::-webkit-scrollbar {
    display: none;
  }
  .table {
    box-shadow: 0px 0px 13px 0px rgba(229, 235, 243, 1);
    width: 100%;
    overflow-x: auto;
    .time {
      width: 40vw;
    }
    .symbol {
      div {
        p {
          float: left;
          margin-left: 1vw;
          padding-top: 1.5vw;
        }
      }
      div > img {
        margin-top: 1.5vw;
        // margin-left: 6vw;
        width: 5vw;
        height: 5vw;
        float: left;
      }
    }
    .unknowSymbol {
      cursor: default;
    }
    table {
      table-layout: fixed;
      text-align: center;
      width: 300%;
      .in-out {
        p {
          width: 15vw;
          height: 7vw;
          margin: 0 auto;
          line-height: 7vw;
          color: #fff;
          border-radius: 4px;
        }
        p:nth-of-type(2) {
          background: #e65656;
        }
        p:nth-of-type(1) {
          background: #44852f;
        }
      }
      tr {
        height: 13vw;
        /*line-height: 60px;*/
        color: #333;
        font-size: 13px;
        border: 1px solid #eee;
        background: #f9f9f9;
        .link {
          color: #366c96;
        }
        td {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &:nth-of-type(1) {
            width: 8vw;
          }
          &:nth-of-type(2) {
            width: 45vw;
          }
          &:nth-of-type(3) {
            width: 45vw;
          }
          &:nth-of-type(4) {
            width: 30vw;
          }
          &:nth-of-type(5) {
            width: 45vw;
          }
          &:nth-of-type(6) {
            width: 35vw;
          }
          &:nth-of-type(7) {
            width: 30vw;
          }
          &:nth-of-type(8) {
            width: 45vw;
          }
          &:nth-of-type(9) {
            width: 25vw;
          }
          &:nth-of-type(10) {
            width: 35vw;
          }
          i {
            color: #ff4e00;
            font-size: 3.5vw;
          }
          .green {
            color: #8ac009;
          }
        }
        .icom {
          width: 4vw;
          padding: 0;
          img {
            width: 8vw;
            // height: 15px;
            margin-top: 5px;
          }
        }
      }
      tr:nth-child(odd) {
        background: #fff;
      }
    }
  }
  .tr-head {
    height: 15vw;
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
  .slot-btn-block {
    position: relative;
    display: inline-block;
  }
  .slot-btn-block .first-page-btn {
    position: absolute;
    transform: translateX(-122px);
  }
  .slot-btn-block button {
    border: none;
    padding: 0 6px;
    margin: 0;
    background: 0 0 !important;
    display: inline-block;
    font-size: 13px;
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    box-sizing: border-box;
  }
}
</style>