<template>
  <div class="token-m day" name="listtbox">
    <div class="table-box">
      <comtitle title="Token"></comtitle>
      <div class="h-title">
        <span></span>
        <p>概况</p>
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
            <div style="float:left" class="Symbol-left-m">
              <img
                :src="tokenList[item.index].icon?tokenList[item.index].icon:coin"
                class="SymbolIcon-m"
              >
            </div>
            <div style="float:left" class="Symbol-right-m">{{item.value}}</div>
          </template>
        </el-autocomplete>
      </div>
      <div class="table">
        <table class="table1 box-shadow">
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
              <tr :key="e.symbol">
                <td>
                  <span>{{index+(page-1)*pagesize+1}}</span>
                </td>
                <td>
                  <p class="Icon-box flex-center">
                    <img :src="e.icon?e.icon:coin" class="tokenIcon">
                    <span class="light" @click="searchToken(e.symbol)">{{e.symbol}}</span>
                  </p>
                </td>
                <td class="tokenName">
                  <p>{{e.nickname}}</p>
                  <p>{{e.name}}</p>
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
      </div>
      <div class="pageblock">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pagesize"
          :current-page.sync="page"
          :total="total"
          :pager-count="5"
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
.token-m {
  height: 94vh;
  width: 100vw;
  .table-box {
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
      .tokenNum {
        margin-left: 3vw;
        color: #8e8e8e;
        font-size: 3.5vw;
        border: none;
      }
    }
    .table {
      margin-top: 3vw;
      max-height: 110vw;
      width: 100%;
      overflow: auto;
      .nodata {
        padding: 0;
        color: #000;
        font-size: 3.5vw;
      }
    }
    .introduce {
      text-align: left;
      padding: 5vw;
      pre {
        padding: 0 2em;
        line-height: 1.5em;
        white-space: pre-wrap;
        font-family: sans-serif;
      }
    }
    tbody tr {
      height: 36vw;
    }
    thead th {
      height: 12vw;
      line-height: 12vw;
      font-size: 3.5vw;
      text-align: center;
    }
    td {
      height: 12vw;
      text-align: center;
      line-height: 5vw;
      font-size: 3.5vw;
    }
    .table1 {
      color: #fff;
      width: 350%;
    }
    .table1 th:nth-child(1),
    .table1 td:nth-child(1) {
      width: 10vw;
    }
    .table1 th:nth-child(2),
    .table1 td:nth-child(2) {
      width: 40vw;
    }
    .table1 th:nth-child(3),
    .table1 td:nth-child(3) {
      width: 50vw;
    }
    .table1 th:nth-child(5),
    .table1 td:nth-child(5) {
      width: 50vw;
    }
  }
  .box-shadow {
    box-shadow: rgba(229, 235, 243, 1) 0 0 5vw;
    margin-top: 2vw;
  }
  .light {
    color: #d9a73a;
    cursor: pointer;
  }
  .pageblock {
    width: 90vw;
    margin: 3vw auto 0;
  }
  .searchToken {
    text-align: center;
    height: 8vw;
    line-height: 8vw;
    .search {
      position: relative;
      z-index: 20;
      top: 0.5vw;
      left: 9vw;
      font-size: 6vw;
    }
  }
}
</style>

<style lang="scss">
.token-m {
  .tokenIcon {
    width: 6vw;
    float: left;
  }
  .Icon-box {
    width: 30vw;
    height: 10vw;
    padding: 2vw 0;
    margin: 0 auto;
    text-align: left;
    span {
      float: left;
      margin-left: 2vw;
    }
  }
  .el-input__inner {
    width: 71vw;
    height: 8vw;
    border-radius: 5vw;
    text-indent: 7vw;
    background-color: $day_bg;
    border: 1px solid #bbb;
    color: $day_font_deepgray;
  }
  .tokenTitle {
    span {
      color: #000;
    }
  }
  .table-box {
    tr:nth-of-type(2n) {
      background-color: #f9fafc;
    }
    tr:nth-of-type(2n + 1) {
      background-color: #fff;
    }
    thead th {
      background: #fff;
      color: #000;
    }
    tbody {
      color: #838b9e;
    }
    .table1 th,
    .table1 td {
      border-right: 1px solid #f1f2f6;
    }
  }
  .searchToken .search {
    color: $day_font_deepgray;
  }
  .searchToken .el-input {
    font-size: 3.5vw;
  }
}
.Symbol-left-m {
  width: 9vw;
  height: 8vw;
  line-height: 8vw;
}
.Symbol-right-m {
  height: 8vw;
  line-height: 8vw;
}
.SymbolIcon-m {
  // margin-top: 5px;
  width: 7vw;
}
</style>
