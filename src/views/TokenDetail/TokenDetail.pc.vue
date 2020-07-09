<template>
  <div class="tokenDetail-box min-center">
    <comtitle title="Token详情" firstUrl="/token" firstUrlTitle="Token"></comtitle>
    <div class="tokenTitle">
      <p>TOKEN</p>
      <img :src="icon" class="icon" v-if="showIcon===true">
      <span>{{$route.query.TokenName}}</span>
    </div>
    <div class="adressInfo">
      <p class="theme">简介</p>
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
          <span @click="toOfficial(official)" class="light">{{official|officialWeb}}</span>
        </div>
      </div>
      <div class="right-box">
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
          <i class="iconfont icon-sousuo search"></i>
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
    <div class="table-box box-shadow">
      <p class="tradeRecord">交易记录</p>
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
          <tr
            v-for="(item,index) in tradeList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            :key="index"
          >
            <td>
              <p class="broke">
                <router-link
                  class="light"
                  :to="{path:'/tradeHash', query:{'hash':item.txHash}}"
                >{{item.txHash|addressEll}}</router-link>
              </p>
            </td>
            <td>
              <p class="broke">
                <router-link
                  :class="{'light':coinSearchValue!==item.fromAddr}"
                  :to="{'path':'/addressDetail', query:{'address':item.fromAddr}}"
                >{{item.fromAddr|addressEll}}</router-link>
              </p>
            </td>
            <td class="in-out">
              <img
                src="../../assets/images/img/right.png"
                height="32"
                width="32"
                v-if="isSearch === false||coinSearchValue === ''"
              >
              <p v-show="isSearch === true && coinSearchValue===item.tx.to">接收</p>
              <p v-show="isSearch === true && coinSearchValue===item.fromAddr">转出</p>
            </td>
            <td>
              <p class="broke">
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
        <tfoot v-if="tradeList.length===0">
          <tr v-if="bottomLoading === true">
            <td colspan="8">
              <beat-loader :num="8" :loading="bottomLoading"></beat-loader>
            </td>
          </tr>
          <tr>
            <td colspan="8" v-if="bottomLoading === false">暂无记录</td>
          </tr>
        </tfoot>
      </table>
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
.tokenDetail-box {
  padding-bottom: 30px;
  .page-box {
    width: 300px;
    margin: 30px auto 0;
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
    font-size: 25px;
    position: relative;
    left: 33px;
    z-index: 2;
  }
  input.search {
    height: 42px;
    width: 380px;
    margin-top: 5px;
    padding: 0 40px;
    position: absolute;
    font-size: 14px;
    border-radius: 21px;
  }
  > div.adressInfo {
    width: 100%;
    height: 218px;
    padding: 6px 0;
    margin-top: 21px;
    box-shadow: rgba(185, 185, 185, 0.45) 0px 0px 7px;
    .theme {
      padding-left: 30px;
      font-size: 20px;
      line-height: 50px;
    }
    > div.left-box {
      // min-width: 500px;
      width: 52%;
      height: 80%;
      float: left;
    }
    > div.right-box {
      width: 48%;
      min-width: 500px;
      height: 80%;
      // border-left: 1px solid #eee;
      float: left;
    }
    .left-box div,
    .right-box div {
      height: 52px;
      width: 500px;
      line-height: 52px;
      font-size: 14px;
      p {
        display: inline-block;
        width: 100px;
        color: #8e8e8e;
      }
      span {
        margin-left: 25px;
      }
    }
    .left-box {
      p {
        text-align: left;
        padding-left: 30px;
      }
    }
    .right-box {
      p {
        text-align: right;
      }
    }
  }
  .tokenTitle {
    height: 60px;
    margin-top: 20px;
    line-height: 60px;
    font-size: 20px;
    box-shadow: rgba(185, 185, 185, 0.45) 0px 0px 7px;
    p {
      display: inline-block;
      margin-left: 30px;
      float: left;
    }
    span {
      margin-left: 10px;
    }
    img {
      margin-top: 15px;
      margin-left: 20px;
      width: 30px;
      height: 30px;
      float: left;
    }
  }

  //交易记录部分
  .tradeRecord {
    height: 57px;
    // line-height: 57px;
    font-size: 18px;
    font-weight: 600;
    margin-top: 30px;
    padding: 20px 0 20px 30px;
    // margin-bottom: 14px;
    .Record-total {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 500;
    }
  }
  > div.table-box {
    width: 100%;
    table {
      width: 100%;
      .in-out {
        p {
          width: 65px;
          height: 27px;
          line-height: 27px;
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
      thead th {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        // border-bottom:1px solid #E2E8EA;
      }
      th:nth-of-type(1),
      td:nth-of-type(1) {
        width: 215px;
      }
      th:nth-of-type(2),
      td:nth-of-type(2) {
        width: 200px;
      }
      th:nth-of-type(3),
      td:nth-of-type(3) {
        width: 75px;
      }
      th:nth-of-type(4),
      td:nth-of-type(4) {
        width: 200px;
      }
      th:nth-of-type(5),
      td:nth-of-type(5) {
        width: 135px;
      }
      th:nth-of-type(6),
      td:nth-of-type(6) {
        width: 160px;
      }
      th:nth-of-type(7),
      td:nth-of-type(7) {
        width: 130px;
      }
      th:nth-of-type(8),
      td:nth-of-type(8) {
        width: 215px;
        min-width: 160px;
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
        p {
          margin: 0 auto;
        }
      }
      .error {
        font-size: 20px;
        color: #eb6506;
        position: absolute;
        left: 11px;
        top: 22px;
      }
      .w215 {
        width: 145px;
      }
      .w200 {
        width: 130px;
      }
    }
  }
  .box-shadow {
    box-shadow: rgba(185, 185, 185, 0.45) 0px 0px 7px;
  }
  .broke {
    width: 170px;
  }
}
</style>
<style lang="scss">
.tokenDetail-box {
  .page-btn {
    background: #383538;
    color: #fff;
    cursor: pointer;
  }
  > div.table-box {
    color: $black_font_white;
  }
  .tokenTitle,
  .adressInfo {
    background: #363339;
    background-color: #363339;
  }
  .broke a {
    color: #efefef;
    cursor: default;
  }
  .broke a.light {
    color: #d9a73a;
    cursor: pointer;
  }
  .theme {
    color: $black_font_white;
  }
  .tokenTitle {
    p {
      color: #8e8e8e;
    }
    span {
      color: #dadada;
    }
  }
  .adressInfo {
    span {
      color: #dadada;
    }
    .light {
      color: #d9a73a;
      cursor: pointer;
    }
  }
  .tradeRecord {
    background: $black_bg_table;
    .Record-total {
      color: #8e8e8e;
    }
  }
  .table1 {
    thead th {
      background-color: #2d2c2d;
      color: $black_font_white;
    }
  }
  table {
    color: #efefef;
  }
  tbody tr:hover {
    background: $black_bg_black;
  }
  tr:nth-of-type(2n) {
    background-color: #3e3d41;
  }
  tr:nth-of-type(2n + 1) {
    background-color: $black_bg_table;
  }
  i.search {
    color: #fff;
  }
  input.search {
    border: 1px solid #38373a;
    background: #212025;
    color: #e0e0e4;
  }
  input.search::-webkit-input-placeholder {
    color: #dadada;
  }
}
</style>