<template>
  <div class="tokenDetail-box-m">
    <comtitle title="Token详情" firstUrl="/token" firstUrlTitle="Token"></comtitle>
    <div class="h-title">
      <span></span>
      <p>Token</p>
    </div>
    <div class="tokenTitle">
      <img :src="icon" class="icon" v-if="showIcon===true">
      <span>{{$route.query.TokenName}}</span>
    </div>
    <div class="h-title">
      <span></span>
      <p>简介</p>
    </div>
    <div class="adressInfo">
      <div class="left-box">
        <div>
          <p>发行总量</p>
          <span>{{total/100000000}}</span>
        </div>
        <div>
          <p>价格</p>
          <span>￥{{price}}</span>
        </div>
        <div>
          <p>官网</p>
          <p
            class="officialWeb light broke-words"
            @click="toOfficial(official)"
          >{{official|officialWeb}}</p>
        </div>
        <div>
          <p>发行时间</p>
          <span>{{createdTime | formatTime}}</span>
        </div>
        <div>
          <p>小数点</p>
          <span>8</span>
        </div>
        <div>
          <p>该币种记录</p>
          <i class="iconfont icon-sousuo search" @click="searchHash(token,coinSearchValue)"></i>
          <input
            type="text"
            class="search"
            v-model="coinSearchValue"
            v-on:keyup.enter="searchHash(token,coinSearchValue)"
            placeholder="请输入个人地址"
          >
        </div>
      </div>
    </div>
    <div class="h-title">
      <span></span>
      <p>交易记录</p>
    </div>
    <div class="table-box box-shadow-m">
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
        </thead>
        <tbody>
          <tr v-for="item in tradeList" :key="item.tradehash">
            <td>
              <p>
                <router-link
                  class="light"
                  :to="{path:'/tradeHash', query:{'hash':item.txHash}}"
                >{{item.txHash|addressEll}}</router-link>
              </p>
            </td>
            <td>
              <p>
                <router-link
                  :class="{'light':coinSearchValue!==item.fromAddr}"
                  :to="{'path':'/addressDetail', query:{'address':item.fromAddr}}"
                >{{item.fromAddr|addressEll}}</router-link>
              </p>
            </td>
            <td class="in-out">
              <img
                src="../../assets/images/img/right.png"
                width="25"
                v-if="isSearch === false||coinSearchValue===''"
              >
              <p v-show="isSearch === true && coinSearchValue===item.tx.to">接收</p>
              <p v-show="isSearch === true && coinSearchValue===item.fromAddr">转出</p>
            </td>
            <td>
              <p>
                <router-link
                  :class="{'light':coinSearchValue!==item.tx.to}"
                  :to="{'path':'/addressDetail', query:{'address':item.tx.to}}"
                >{{item.tx.to|addressEll}}</router-link>
              </p>
            </td>
            <td>{{item.amount/100000000}} {{token}}</td>
            <td>{{item.tx.fee|filterFee}}</td>
            <td>{{item.actionName === 'unknown'? 'none':item.actionName}}</td>
            <td>{{item.blockTime | formatTime}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="tradeList.length===0" class="nodata">
      <beat-loader :num="8" :loading="bottomLoading"></beat-loader>
      <div v-if="bottomLoading === false">暂无记录</div>
    </div>
    <div class="page-box flex-center">
      <div class="page-btn" @click="PageChange('first')">首页</div>
      <div
        class="page-btn"
        :class="{'isDisabled':isLast===1||isLast===4||isLast===5}"
        @click="PageChange('pre')"
      >上一页</div>
      <div
        class="page-btn"
        :class="{'isDisabled':isLast===3||isLast===4||isLast===5}"
        @click="PageChange('next')"
      >下一页</div>
      <div class="page-btn" @click="PageChange('last')">尾页</div>
    </div>
  </div>
</template>

<script>
import comtitle from "@/components/comtitle";
import beatLoader from "@/components/beatLoader";
import addressBase from "./tokenDetail.base.js";
export default {
  components: { beatLoader, comtitle },
  mixins: [addressBase]
};
</script>
<style lang="scss" scoped>
.tokenDetail-box-m {
  width: 100vw;
  margin: 0 auto;
  padding: 0 3vw 5vw;
  .page-box {
    position: relative;
    margin: 5vw auto 0;
    .page-btn {
      display: inline-block;
      width: 60px;
      height: 25px;
      line-height: 25px;
      border-radius: 5px;
      margin: 0 5px;
      text-align: center;
    }
    .isDisabled {
      color: #ccc;
      cursor: not-allowed;
    }
  }
  i.search {
    font-size: 6vw;
    position: relative;
    left: 8vw;
    z-index: 2;
  }
  input.search {
    height: 8vw;
    width: 60vw;
    line-height: 10vw;
    margin-top: 1.5vw;
    padding: 0 8vw;
    position: absolute;
    font-size: 3.5vw;
    border-radius: 5vw;
  }
  > div.adressInfo {
    width: 100%;
    height: 63vw;
    box-shadow: rgba(229, 235, 243, 1) 0 0 5vw;

    > div.left-box {
      width: 95vw;
      // height: 80%;
      float: left;
    }
    .left-box div {
      height: 10vw;
      width: 94vw;
      line-height: 10vw;
      font-size: 3.5vw;
      p {
        float: left;
        color: #838b9e;
        width: 23vw;
      }
      span {
        display: block;
        float: left;
        margin-left: 7vw;
        max-width: 58vw;
        overflow: auto;
      }
    }
    .left-box {
      p {
        float: left;
        text-align: left;
        padding-left: 3vw;
      }
      .officialWeb {
        padding-left: 0;
        margin-left: 7vw;
        width: 60vw;
        float: left;
        color: #366c96;
      }
    }
  }
  .tokenTitle {
    height: 12vw;
    margin-top: 2vw;
    margin-bottom: 3vw;
    line-height: 12vw;
    font-size: 5vw;
    box-shadow: rgba(229, 235, 243, 1) 0 0 5vw;
    span {
      margin-left: 10px;
    }
    img {
      margin-top: 2.2vw;
      margin-left: 3vw;
      width: 7vw;
      height: 7vw;
      float: left;
    }
  }

  //交易记录部分
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
  .nodata div {
    height: 10vw;
    line-height: 10vw;
    background: #fff;
    text-align: center;
    font-size: 14px;
    box-shadow: rgba(229, 235, 243, 1) 0 0 5vw;
  }
  > div.table-box {
    width: 100%;
    overflow-x: auto;
    table {
      width: 100%;
      table-layout: fixed;
      text-align: center;
      width: 300%;
      .in-out {
        p {
          width: 11vw;
          height: 6.5vw;
          line-height: 6.5vw;
          color: #fff;
          font-size: 13px;
          border-radius: 4px;
        }
        p:nth-of-type(2) {
          background: #e65656;
        }
        p:nth-of-type(1) {
          background: #44852f;
        }
      }
      thead th {
        height: 10vw;
        line-height: 10vw;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        &:nth-of-type(1) {
          width: 40vw;
        }
        &:nth-of-type(2) {
          width: 40vw;
        }
        &:nth-of-type(3) {
          width: 15vw;
        }
        &:nth-of-type(4) {
          width: 40vw;
        }
        &:nth-of-type(5) {
          width: 25vw;
        }
        &:nth-of-type(6) {
          width: 25vw;
        }
        &:nth-of-type(7) {
          width: 25vw;
        }
        &:nth-of-type(8) {
          width: 35vw;
        }
      }
      // tbody tr {
      //   border-top: 1px solid #eeeeee;
      // }
      td {
        height: 10vw;
        text-align: center;
        font-size: 3.5vw;
        position: relative;
        p {
          margin: 0 auto;
        }
        &:nth-of-type(3) {
          img {
            width: 8vw;
          }
        }
        // i {
        //   font-size: 22px;
        //   cursor: pointer;
        // }
      }
    }
  }
  .box-shadow {
    // box-shadow:rgba(229,235,243,1) 0 0 5vw;
  }
}
</style>
<style lang="scss">
.tokenDetail-box-m {
  .page-btn {
    background: #fff;
    color: #838b9e;
    cursor: pointer;
  }
  .tokenTitle,
  .adressInfo {
    background: #fff;
  }
  .light {
    color: #d9a73a;
    cursor: pointer;
  }
  .tokenTitle {
    p {
      color: #192136;
    }
    span {
      color: #8e8e8e;
    }
  }
  .adressInfo {
    span {
      color: #192136;
    }
    .light {
      color: #d9a73a;
      cursor: pointer;
    }
  }
  .tradeRecord {
    background: #fff;
    color: #192136;
    .Record-total {
      color: $day_font_deepgray;
    }
  }
  .table1 {
    thead th {
      background-color: #fff;
      color: #192136;
      border-bottom: 1px solid #e2e8ea;
    }
  }
  table {
    color: $day_font_deepgray;
  }
  tr:nth-of-type(2n) {
    background-color: $day_bg_blue;
  }
  tr:nth-of-type(2n + 1) {
    background-color: #fff;
  }
  i.search {
    color: $day_font_deepgray;
  }
  input.search {
    background: $day_bg;
    border: 1px solid #e8e9ee;
    color: $day_font_deepgray;
  }
  input.search::-webkit-input-placeholder {
    color: $day_font_deepgray;
  }
}
</style>