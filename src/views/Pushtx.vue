<template>
  <div :class="{'pushtx':!isMobile,'pushtx-m':isMobile,'min-center':!isMobile}">
    <div class="title">
      <comtitle title="广播交易"></comtitle>
    </div>
    <p class="tips">
      <span class="light">提示：</span>在广播交易之前使用
      <span class="decodtx">
        <router-link class="light" :to="{ path: '/decode-tx'}">解析交易工具</router-link>
      </span>检查你的交易
    </p>
    <p class="infos">你可以在此页面粘贴交易的十六进制格式文本，并通过区块链网络广播出去。</p>
    <textarea name class="textvalue" v-model="param"></textarea>

    <p class="link" v-if="result">
      <router-link :to="{ path: '/tradeHash', query: { hash: result }}">{{result}}</router-link>
    </p>
    <div class="btn-wrap">
      <button type="submit" class="subbutton" @click="getTransaction('Ptx')">提交</button>
    </div>
  </div>
</template>
<script>
import comtitle from "@/components/comtitle.vue";
import transaction from "@/mixins/transaction.js";
export default {
  components: {
    comtitle
  },
  mixins: [transaction]
};
</script>
<style lang="scss" scoped>
.pushtx,
.pushtx-m {
  .subbutton {
    border: 0;
    background: #d9a73a;
    color: #fff;
  }
  .btn-wrap {
    text-align: center;
  }
  .link {
    text-decoration: underline;
    font-size: 14px;
    a {
      color: #0975a7;
    }
  }
}
.pushtx {
  .tips {
    width: 100%;
    height: 52px;
    line-height: 52px;
    font-size: 14px;
    margin: 15px 0;
    text-align: left;
    .decodtx {
      padding: 0 5px;
      cursor: pointer;
    }
  }
  .infos {
    font-size: 14px;
    line-height: 28px;
    margin: 15px 0;
  }
  .textvalue {
    width: 100%;
    height: 143px;
    padding: 10px;
  }
  .subbutton {
    width: 200px;
    height: 40px;
    line-height: 40px;
    margin-top: 72px;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
  }
}
.pushtx-m {
  width: 100%;
  height: 93vh;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1),
    rgba(239, 245, 252, 1)
  );
  .title {
    margin-left: 3vw;
  }
  .tips {
    width: 95%;
    background: #fff;
    height: 11vw;
    line-height: 11vw;
    font-size: 3.5vw;
    color: #838b9e;
    padding-left: 2vw;
    margin: 0 auto;
    box-shadow: 3px 0px 13px 0px rgba(229, 235, 243, 1);
    .tipsTitle {
      color: #366c96;
    }
    .decodtx {
      color: #0975a7;
      padding: 0 1vw;
    }
  }
  .infos {
    width: 95%;
    margin: 3vw auto;
    padding: 0 2vw;
    color: #838b9e;
    font-size: 3.5vw;
    line-height: 7vw;
  }
  .textvalue {
    width: 95%;
    height: 21.3vw;
    margin-left: 2.5%;
    padding: 3vw;
    border: 1px solid rgba(225, 225, 225, 1);
  }
  .subbutton {
    width: 25vw;
    height: 8vw;
    line-height: 8vw;
    margin-top: 8vw;
    border-radius: 10vw;
  }
  .light {
    color: #366c96;
  }
}
</style>

<style lang="scss">
.pushtx {
  .infos {
    color: #dadada;
  }
  .tips {
    color: #dadada;
  }
  .light {
    color: #fac765;
  }
  .textvalue {
    border: 1px solid #4a4a4a;
    background: #26252a;
    color: #fff;
  }
}
</style>