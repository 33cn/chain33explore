<template>
  <div class="address-box min-center">
    <comtitle
      title="个人地址"
      firstUrl="/idnex"
      firstUrlTitle="首页"
      secondUrl="/block"
      secondUrlTitle="全部区块信息"
    ></comtitle>
    <div class="adressInfo">
      <div class="left-box">
        <p class="theme">概况</p>
        <div class="info">
          <p>地址</p>
          <p>{{addressInfo.adr}}</p>
          <div class="copy" v-clipboard:copy="addressInfo.adr" v-clipboard:success="success">复制</div>
        </div>
        <div class="infoBottom">
          <p>交易笔数</p>
          <p>{{addressInfo.txCount?addressInfo.txCount:0}}</p>
        </div>
      </div>
      <div class="right-box">
        <div class="info">
          <p>主代币余额</p>
          <p>{{parseFloat(addressInfo.balance.toFixed(8))}} {{$store.getters.baseCoin}}</p>
        </div>
        <div class="infoBottom">
          <p>Token总价值</p>
          <div>
            <el-select
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
                  <p class="token-box">
                    <img :src="token.icon?token.icon:coin" class="selectIcon">
                    <span>
                      {{ token.name }}
                      <span v-if="token.nickname">（{{token.nickname}}）</span>
                    </span>
                  </p>
                  <p class="token-count">{{parseFloat((token.balance).toFixed(8))}} {{token.symbol}}</p>
                </div>
                <div style="float: right; color: #838B9E; font-size: 14px">
                  <p
                    class="token-box2"
                  >￥{{ token.rmb?(token.rmb).toFixed(2):parseInt(0).toFixed(2) }}</p>
                  <p
                    class="token-count2"
                  >￥{{token.rmb?(token.balance*token.rmb).toFixed(2):parseInt(0).toFixed(2)}}</p>
                </div>
              </el-option>
            </el-select>
            <div class="token-length">{{TokenBalance.length}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易记录表 -->
    <div class="table-box">
      <div class="theme">
        交易记录
        <!-- Token筛选框 -->
        <div class="tokenRecord">
          <el-select v-model="chooseToken" @change="searchToken(chooseToken)">
            <el-option
              v-for="(item,index) in selectTokenSymbol"
              :key="index"
              :value="index"
              :label="item.symbol"
              class="selectIcon-box"
            >
              <div style="float:left" class="select-left">
                <img :src="item.icon?item.icon:coin" class="selectIcon" v-if="item.symbol!=='全部'">
              </div>
              <div style="float:left" class="select-right">{{item.symbol}}</div>
            </el-option>
          </el-select>
        </div>
      </div>
      <table class="table1">
        <thead>
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
          <tr v-show="isloading" align="center">
            <td colspan="9">
              <beat-loader :num="5"></beat-loader>
            </td>
          </tr>
          <tr v-for="(data,index) in TableList" :key="index">
            <td>
              <span v-if="isTradeError(data,data.receipt.ty)"></span>
              <i class="iconfont icon-chucuo error" v-if="data.isError"></i>
              <p>
                <router-link
                  class="light"
                  :to="{ path: '/tradeHash', query: { hash: data.txHash } }"
                >{{data.txHash|addressEll}}</router-link>
              </p>
            </td>
            <td>
              <p
                :class="{light:addressInfo.adr  !==  data.fromAddr}"
                @click="linkAddr(data.fromAddr)"
              >{{data.fromAddr|addressEll}}</p>
            </td>
            <td class="in-out">
              <p v-show="data.tx.to == $route.query.address">接收</p>
              <p v-show="data.fromAddr == $route.query.address">转出</p>
            </td>
            <td>
              <p
                :class="{light:addressInfo.adr  !==  data.tx.to}"
                @click="linkAddr(data.tx.to)"
              >{{data.tx.to|addressEll}}</p>
            </td>
            <td>{{data | getTradeValue}}</td>
            <td>{{data.tx.fee|filterFee}}</td>
            <td>{{data.actionName === 'unknown'? 'none':data.actionName}}</td>
            <td>{{data.blockTime|fulltime}}</td>
            <td class="symbol">
              <div
                class="flex-center unknowSymbol"
                :class="{'light':viewToken(checkToken(data))}"
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
        </tbody>
        <tfoot v-if="TableList.length === 0&&!isloading">
          <tr>
            <td colspan="9">暂无交易记录</td>
          </tr>
        </tfoot>
      </table>
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
</template>

<script>
import comtitle from "@/components/comtitle";
import beatLoader from "@/components/beatLoader";
import addressBase from "./address.base.js";
export default {
  components: { beatLoader, comtitle },
  mixins: [addressBase]
};
</script>
<style lang="scss" scoped>
.address-box {
  .token-length {
    display: inline-block;
    position: relative;
    top: -20px;
    left: -20px;
    width: 35px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background: #e65656;
    border-radius: 50%;
    color: #fff;
  }
  .theme {
    padding-left: 30px;
    font-size: 20px;
    line-height: 60px;
  }
  .copy {
    display: inline-block;
    // margin-left:30px;
    width: 100px;
    height: 35px;
    line-height: 35px;
    // background:#DEB142;
    border-radius: 17px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
  }
  .page-box {
    position: relative;
    width: 450px;
    margin: 20px auto 0px;
    padding-bottom: 30px;
    .page-btn {
      display: inline-block;
      width: 60px;
      height: 25px;
      line-height: 25px;
      border-radius: 2px;
      margin: 0 10px;
      text-align: center;
    }
    .isDisabled {
      color: #ccc;
      cursor: not-allowed;
    }
  }
  .adressInfo {
    width: 100%;
    height: 180px;
    margin-top: 21px;
    padding: 6px 0;
    .left-box {
      width: 50%;
      height: 100%;
      float: left;
      padding-right: 14px;
    }
    .info {
      width: 100%;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      p {
        float: left;
        margin-right: 20px;
        &:nth-of-type(1) {
          padding-left: 10px;
          width: 100px;
          height: 46px;
          text-align: right;
          color: $black_font_gray;
          .el-select {
            width: 60%;
          }
        }
        &:nth-of-type(2) {
          width: 330px;
          height: 46px;
          .el-select {
            width: 40%;
            margin-right: 20px;
          }
        }
      }
      .info_balance {
        span {
          display: inline-block;
          margin-right: 30px;
        }
      }
    }
    .infoBottom {
      font-size: 14px;
      // color: #333;
      line-height: 49px;
      p {
        float: left;
        margin-right: 20px;
        // border-top: 1px solid #eee;
        // background-color: #f4f4f4;
        &:nth-of-type(1) {
          padding-left: 10px;
          width: 100px;
          height: 46px;
          text-align: right;
          color: $black_font_gray;
        }
        &:nth-of-type(2) {
          width: calc(100% - 210px);
          height: 46px;
        }
      }
    }
    > div.right-box {
      padding-top: 55px;
      padding-left: 14px;
      width: 48%;
      height: 100%;
      float: left;
    }
  }
  .tradeRecord {
    height: 57px;
    float: left;
    font-size: 18px;
    padding: 20px 0 20px 30px;
  }
  .table-box {
    width: 100%;
    margin-top: 30px;
    .tokenRecord {
      float: right;
      margin-right: 30px;
      width: 150px;
      .el-select {
        width: 150px !important;
      }
    }
    table {
      width: 100%;
      .in-out {
        p {
          margin-top: 1px;
          width: 65px;
          height: 27px;
          line-height: 27px;
          color: #fff;
          border-radius: 4px;
          cursor: default;
        }
        p:nth-of-type(2) {
          background: #e65656;
        }
        p:nth-of-type(1) {
          background: #44852f;
        }
      }
      thead th {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        text-align: center;
      }
      th:nth-of-type(1),
      td:nth-of-type(1) {
        width: 230px;
      }
      th:nth-of-type(2),
      td:nth-of-type(2) {
        width: 230px;
      }
      th:nth-of-type(3),
      td:nth-of-type(3) {
        width: 75px;
      }
      th:nth-of-type(4),
      td:nth-of-type(4) {
        width: 230px;
      }
      th:nth-of-type(5),
      td:nth-of-type(5) {
        width: 150px;
      }
      th:nth-of-type(6),
      td:nth-of-type(6) {
        width: 160px;
      }
      th:nth-of-type(7),
      td:nth-of-type(7) {
        width: 125px;
      }
      th:nth-of-type(8),
      td:nth-of-type(8) {
        width: 210px;
      }
      th:nth-of-type(9),
      td:nth-of-type(9) {
        width: 140px;
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
      }
      .symbol {
        div {
          width: auto;
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
      .unknowSymbol {
        cursor: default;
      }
      .error {
        font-size: 20px;
        color: #eb6506;
        position: absolute;
        left: 11px;
        top: 22px;
      }
    }
  }
}
.selectIcon {
  width: 20px;
  height: 20px;
  float: left;
  margin-top: 7px;
  margin-right: 15px;
}
.select-left {
  width: 40px;
  height: 33px;
}
.select-right {
  font-size: 13px;
}
.token-s {
  height: 60px;
  padding: 5px 20px;
  .token-count {
    color: #838b9e;
    height: 25px;
    line-height: 25px;
    padding-left: 35px;
  }
  .token-count2 {
    color: #838b9e;
    height: 25px;
    line-height: 25px;
  }
  .token-box {
    height: 30px;
  }
  .token-box2 {
    height: 30px;
    text-align: right;
  }
}
</style>

<style lang="scss">
.address-box {
  .page-btn {
    background: #383538;
    color: #fff;
    cursor: pointer;
  }
  a {
    color: #dadada;
    cursor: default;
  }
  .light {
    color: #d9a73a !important;
    cursor: pointer !important;
  }
  .token-select {
    input::-webkit-input-placeholder {
      color: #fff;
    }
  }
  .el-input--suffix {
    input {
      background: #f7fafd;
      color: #000;
      border: 1px solid #e8e9ee;
      border-radius: 21px;
    }
  }
  .info {
    p:nth-of-type(2) {
      color: $black_font_white;
    }
  }
  .infoBottom {
    p:nth-of-type(1) {
    }
    p:nth-of-type(2) {
      color: $black_font_white;
    }
  }
  .table-box {
    background: $black_bg_table;
  }
  .adressInfo {
    background: #2f2d32;
  }
  .tradeRecord {
    color: $black_font_white;
    background: $black_bg_table;
  }
  thead th {
    background-color: #2d2c2d;
    color: $black_font_white;
  }
  tbody tr:hover {
    background: $black_bg_black;
  }
  tr:nth-of-type(2n) {
    background-color: $black_bg_table;
  }
  tr:nth-of-type(2n + 1) {
    background-color: #3e3d41;
  }
  .table1 {
    color: $black_font_white;
  }
  .theme {
    color: $black_font_white;
  }
  .copy {
    color: $black_font_white;
    border: 1px solid $black_font_white;
  }
  .el-select {
    width: 400px;
    height: 42px;
    line-height: 42px;
    border-radius: 21px;
  }
  .adressInfo .el-input__suffix {
    right: 35px;
  }
  .el-input--suffix {
    input {
      background: #25232a;
      color: #fff;
      border: none;
      border-radius: 21px;
    }
  }
  .tokenRecord {
    .el-input__suffix {
      right: 15px !important;
    }
    .el-input--suffix input {
      text-align: center !important;
    }
  }
  .el-select-dropdown {
    max-height: 400px;
    overflow-y: scroll;
  }
}
.selectIcon-box:nth-of-type(1) {
  div {
    float: none !important;
    text-align: center;
  }
  div:nth-of-type(1) {
    width: 0;
    height: 0;
  }
}
</style>