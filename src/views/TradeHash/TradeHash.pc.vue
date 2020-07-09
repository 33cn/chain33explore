<template>
  <div id="tradehInfo" class="min-center">
    <comtitle
      title="交易详情"
      firstUrl="/index"
      firstUrlTitle="首页"
      secondUrl="/tradeList"
      secondUrlTitle="全部交易信息"
    ></comtitle>

    <div class="trade_hashInfo" v-if="txNotFound">
      <p class="placeholder-result tc">
        未查询到交易信息，
        <span class="c-link" @click="txNotFound=false;getTradeDetail(hash)">重试</span>
      </p>
    </div>
    <div class="trade_hashInfo" v-else>
      <div class="trade_hash pdt">
        <p class="theme">交易哈希</p>
        <p class="txt">{{hash}}</p>
      </div>
      <p class="theme_info">交易详情</p>
      <div class="info_box info_box_high">
        <div class="w390">接收状态</div>
        <div class="w810 colorGreen">{{tradehInfoState}}</div>
      </div>
      <div class="info_box bac">
        <div class="w390">区块高度</div>
        <div class="w810">
          <router-link
            class="light"
            :to="{path:'/blockDetail', query:{'height':tradehInfo.height}}"
          >{{tradehInfo.height}}</router-link>
        </div>
      </div>
      <div class="info_box">
        <div class="w390">时间(GMT+8)</div>
        <div class="w810">{{tradehInfo.blockTime | fulltime}}</div>
      </div>
      <div class="info_box bac">
        <div class="w390">来自</div>
        <div class="w810">
          <p class="light" @click="goAddress(tradehInfo.fromAddr)">{{tradehInfo.fromAddr}}</p>
        </div>
      </div>
      <div class="info_box">
        <div class="w390">去向</div>
        <div class="w810">
          <p class="light" @click="goAddress(tradehInfoTx.to)">{{tradehInfoTx.to}}</p>
        </div>
      </div>
      <div class="info_box bac">
        <div class="w390">价值</div>
        <div class="w810">{{tradehInfo | getTradeValue}}</div>
      </div>
      <div class="info_box">
        <div class="w390">手续费</div>
        <div class="w810">{{tradehInfoTx.fee|filterFee}}</div>
      </div>
      <div class="info_box bac">
        <div class="w390">随机数</div>
        <div class="w810">{{tradehInfoTx.nonce}}</div>
      </div>
      <div class="info_box">
        <div class="w390">执行器</div>
        <div class="w810">{{tradehInfoTx.execer}}</div>
      </div>
      <div class="info_box">
        <div class="w390">调用函数</div>
        <div class="w810">{{tradehInfo.actionName === 'unknown'? 'none':tradehInfo.actionName}}</div>
      </div>
      <div class="info_box">
        <div class="w390">交易类型</div>
        <div class="w810">{{tradehInfo|tradeGroup}}</div>
      </div>
      <div class="info_box markdata" id="writesdata" v-if="tradehInfoTx.execer == 'user.write'">
        <markdown :content="markdownContent"></markdown>
      </div>
      <div class="info_box high" v-if="tradehInfoTx.execer != 'user.write'">
        <div class="w390">输入数据</div>
        <div class="w810 pdb">
          <pre class="inputTxt" contenteditable="true" style="display:block"> 
              <code>{{tradehInfoTx | decodeTransferNote}}</code>
          </pre>
        </div>
      </div>
      <div class="info_box high" v-if="tradehInfoTx.execer != 'user.write'">
        <div class="w390">输出数据</div>
        <div class="w810 pdb">
          <pre class="inputTxt" contenteditable="true" style="display:block"> 
              <code>{{tradehInfo.receipt}}</code>
          </pre>
        </div>
      </div>
      <div class="info_box high" v-if="tradehInfoTx.execer != 'user.write'&&parallelData!==''">
        <div class="w390">平行链输出数据</div>
        <div class="w810 pdb">
          <pre class="inputTxt" contenteditable="true" style="display:block"> 
              <code>{{parallelData.receipt}}</code>
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import comtitle from "@/components/comtitle";
import tradeHashBase from "./tradeHash.base.js";
export default {
  name: "tradeHash",
  components: {
    markdown: () => import("@/components/markdown"),
    comtitle
  },
  mixins: [tradeHashBase]
};
</script>
<style lang="scss">
#tradehInfo {
  h1 {
    color: #000;
    font-size: 16px;
    font-weight: 700;
    line-height: 30px;
    ol {
      font-weight: 700;
      font-size: 14px;
    }
  }
  .trade_hash {
    background-color: #2d2c2d;
    > p.txt {
      color: #dadada;
    }
  }
  .trade_hashInfo {
    background-color: #363339;
    > div.info_box {
      border-top: 2px solid $black_border_gray;
    }
    > p.theme_info {
      color: $black_font_white;
    }
  }
  .w810 {
    color: $black_font_white;
  }
  .light {
    color: $black_font_light;
  }
  .inputTxt {
    border: 1px solid $black_font_gray;
    background-color: #3f3d42;
    cursor: default;
  }
  .inputTxt::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background: #4a4a4a;
  }
  .inputTxt::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: #d9a73a;
  }
}
</style>

<style lang="scss" scoped>
#tradehInfo {
  width: 100%;
  padding-bottom: 60px;
  .light {
    cursor: pointer;
  }
  .pdt {
    // padding:16px 0 26px 13px;
  }
  .pdb {
    width: calc(100% - 240px);
  }
  .trade_hash {
    width: 100%;
    height: 58px;
    margin-top: 15px;
    > p.theme {
      display: inline-block;
      margin: 0 20px 0 32px;
      height: 58px;
      line-height: 58px;
      font-size: 14px;
      color: #8e8e8e;
    }
    > p.txt {
      display: inline-block;
      height: 58px;
      line-height: 58px;
      font-size: 14px;
      // margin-top: 18px;
    }
  }
  .trade_hashInfo {
    width: 100%;
    // box-shadow: rgba(185, 185, 185, 0.45) 0px 0px 7px ;
    > p.theme_info {
      height: 57px;
      line-height: 57px;
      font-size: 20px;
      padding-left: 33px;
    }
    .high {
      height: 350px !important;
      .w390 {
        line-height: 300px;
        vertical-align: middle;
      }
    }
    > div.info_box {
      width: 100%;
      overflow: hidden;
      .colorGreen {
        // color: #6aa502;
      }
      .colorBlock {
        color: #333;
      }
      > div {
        float: left;
        height: 100%;
        line-height: 50px;
        font-size: 14px;
        // color:#333;
      }
      .w390 {
        width: 220px;
        padding-right: 80px;
        padding-left: 50px;
        text-align: right;
        color: $black_font_gray;
        /**/
      }
      .w810 {
        .inputTxt {
          vertical-align: middle;
          line-height: 300px;
          width: 100%;
          height: 300px;
          margin: 20px auto;
          overflow-y: auto;
          /*overflow-x: hidden;*/
          padding: 0px 11px;
          line-height: 14px;
          word-break: break-all;
          font-family: "Verdana";
        }
        code {
          line-height: 1.38;
          margin-left: -60px;
          font-family: "Verdana";
        }
      }
    }
    > div.info_box:nth-of-type(1) {
      border: none !important;
      margin-top: 10px;
    }
    .markdata {
      padding: 40px 40px;
      height: auto;
      overflow: hidden;
      font-size: 14px;
    }
  }
}
</style>