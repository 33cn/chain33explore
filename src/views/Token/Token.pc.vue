<template>
  <div class="token" name="listtbox">
    <div class="table-box min-center">
      <comtitle title="Token"></comtitle>
      <div class="tokenTitle">
        <span>Token列表</span>
        <span class="tokenNum">(共{{total}}种币)</span>
      </div>
      <div class="searchToken">
        <i class="iconfont icon-sousuo search" @click="searchToken(coinSelect)"></i>
        <el-autocomplete
          v-model="coinSelect"
          :fetch-suggestions="querySearch"
          placeholder="请输入币种名称"
          :trigger-on-focus="false"
          @select="searchToken(coinSelect)"
          @keyup.enter.native="searchToken(coinSelect)"
        >
          <template slot-scope="{item}">
            <div style="float:left" class="Symbol-left">
              <img
                :src="tokenList[item.index].icon?tokenList[item.index].icon:coin"
                class="SymbolIcon"
              >
            </div>
            <div style="float:left" class="Symbol-right">{{item.value}}</div>
          </template>
        </el-autocomplete>
      </div>
      <table class="table1">
        <thead>
          <th></th>
          <th>币种</th>
          <th>名称</th>
          <th>简介</th>
          <th>时间(GMT+8)</th>
        </thead>
        <tr v-show="isLoading">
          <td :colspan="5">
            <beat-loader :num="5" :loading="isLoading"></beat-loader>
          </td>
        </tr>
        <tbody v-show="!isLoading">
          <template v-for="(e,index) in tableList">
            <tr :key="index">
              <td>{{index+(page-1)*pagesize+1}}</td>
              <td>
                <p class="Icon-box light flex-center" @click="searchToken(e.symbol)">
                  <img :src="e.icon?e.icon:coin" class="tokenIcon">
                  <span class="light">{{e.symbol}}</span>
                </p>
              </td>
              <td class="tokenName">
                <p v-if="e.nickname">{{e.nickname}}</p>
                <p v-if="e.name">{{e.name}}</p>
              </td>
              <td class="introduce">
                <pre>{{e.introduce || e.introduction}}</pre>
              </td>
              <td>{{e.createdTime | formatTime}}</td>
            </tr>
          </template>
        </tbody>
        <tfoot v-if="isShow">
          <tr>
            <td :colspan="5" class="nodata">暂无记录</td>
          </tr>
        </tfoot>
      </table>
      <div class="pageblock">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pagesize"
          :current-page.sync="page"
          :total="total"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import comtitle from "@/components/comtitle.vue";
import beatLoader from "@/components/beatLoader";
import homeBase from "./token.base.js";
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
.token {
  min-width: 1300px;
  .table-box {
    tbody {
      tr {
        height: 150px;
        line-height: 25px;
      }
      .introduce {
        // padding-left: 2em;
        text-align: left;
        pre {
          padding: 0 2em;
          line-height: 1.5em;
          white-space: pre-wrap;
          font-size: 14px;
          font-family: sans-serif;
        }
      }
      .tokenName p {
        height: 25px;
      }
      .tokenIcon {
        width: 30px;
        float: left;
      }
      .Icon-box {
        width: 130px;
        height: 50px;
        padding: 10px 0;
        margin: 0 auto;
        text-align: left;
        span {
          float: left;
          margin-left: 10px;
        }
      }
    }
    thead th {
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      text-align: center;
    }
    td {
      text-align: center;
      padding: 20px;
      font-size: 14px;
    }
    .table1 {
      width: 100%;
      color: #fff;
      margin-top: 12px;
    }
    .table1 th:nth-child(1),
    .table1 td:nth-child(1) {
      width: 80px;
      text-align: center;
      > span {
        cursor: pointer;
      }
    }
    .table1 th:nth-child(2),
    .table1 td:nth-child(2) {
      min-width: 180px;
      text-align: center;
    }

    .table1 th:nth-child(3),
    .table1 td:nth-child(3) {
      min-width: 180px;
      text-align: center;
    }
    .table1 th:nth-child(4),
    .table1 td:nth-child(4) {
      min-width: 600px;
    }
    .table1 th:nth-child(5),
    .table1 td:nth-child(5) {
      width: 200px;
    }
  }
  .light {
    color: #d9a73a;
    cursor: pointer;
  }
  .pageblock {
    margin: 20px auto 0px;
    padding-bottom: 30px;
  }
  .tokenTitle {
    display: inline-block;
    width: 300px;
    margin-top: 30px;
    margin-bottom: 30px;
    span {
      font-size: 18px;
    }
    .tokenNum {
      margin-left: 15px;
      color: #8e8e8e;
      font-size: 14px;
    }
  }
  .searchToken {
    // line-height:84px;
    display: inline-block;
    float: right;
    .search {
      position: relative;
      z-index: 20;
      top: 3px;
      left: 38px;
      // height:84px;
      line-height: 84px;
      font-size: 27px;
    }
  }
}
</style>

<style lang="scss">
.token {
  .el-input__inner {
    background-color: #25232a;
    width: 380px;
    height: 42px;
    border-radius: 21px;
    border: 1px solid #38373a;
    color: #e0e0e4;
    text-indent: 30px;
  }
  .tokenTitle {
    span {
      color: #fff;
    }
  }
  .table-box {
    table tbody tr:hover {
      background: $black_bg_black;
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
    .table1 th,
    .table1 td {
      border-right: 1px solid $black_border_gray;
    }
  }
  .searchToken .search {
    color: #fff;
  }
  .nodata {
    color: #fff;
  }
}
.Symbol-left {
  width: 40px;
  height: 44px;
  line-height: 35px;
}
.Symbol-right {
  height: 44px;
  line-height: 35px;
}
.SymbolIcon {
  margin-top: 7px;
  width: 20px;
}
</style>
