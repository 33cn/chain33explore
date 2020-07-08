<template>
  <div :class="{'decode-tx':!isMobile,'decode-tx-m':isMobile,'min-center':!isMobile}">
    <comtitle title = "交易解析工具" firstUrl="/pushtx" firstUrlTitle="广播交易"></comtitle>
    <p class="infos">此页面将解析你的十六进制交易文本并显示成为可读的格式</p>
    <textarea name="" class="textvalue" v-model = "param"></textarea>
    <div class="bunt">
      <button type="submit" class="subbutton" @click = "getTransaction('Dtx')">提交</button>
    </div>
    
    <pre class="inputTxt" contenteditable="true" v-if="result"> 
      <code>{{result}}</code>
    </pre>
  </div>
</template>
<script>
import comtitle from '@/components/comtitle'
import transaction from '@/mixins/transaction.js';
export default {
  mixins: [transaction],
  components:{
    comtitle
  }
};
</script>
<style lang="scss">
.decode-tx,.decode-tx-m{
  .subbutton {
    width: 200px;
    height: 40px;
    line-height: 40px;
    border: 0;
    font-size: 14px;
    margin:50px auto;
    border-radius: 20px;
    background: #D9A73A;
    color: #fff;
    font-weight: 600;
    cursor:pointer;
  }
  .infos {
    color: #dadada;
    font-size: 13px;
    margin:15px 0;
  }
  .inputTxt {
    vertical-align: middle;
    line-height: 300px;
    overflow-y: auto;
    width: 100%;
    line-height: 14px;
    word-break: break-all;
    font-family: "Verdana";
    margin: 0 auto;
    padding: 0px 11px;
  }
  .bunt {
    text-align: center;
  }
  .inputTxt::-webkit-scrollbar,.textvalue::-webkit-scrollbar {
      width: 1px;
      height: 1px;
      cursor:pointer;
  }
}
.decode-tx {
  height: 800px;
  .textvalue {
    width: 100%;
    height: 120px;
    padding: 10px;
    color:#fff;
    background:#26252A;
  }
  .inputTxt {
    height: 300px;
    color:#fff;
    border: 1px solid rgb(169, 169, 169);
    background:#26252A;
  }
}
.decode-tx-m {
  width: 100%;
  position: absolute;
  top: 24vw;
  bottom: 0;
  left: 0;
  right: 0;
  background:linear-gradient(0deg,rgba(255,255,255,1),rgba(239,245,252,1));
  overflow: hidden;
  padding:0 2vw;
  .textvalue {
    width: 100%;
    height: 21.3vw;
    padding: 3vw;
    border:1px solid rgba(225,225,225,1);
  }
  .inputTxt {
    height: 50vw;
    border:1px solid rgba(225,225,225,1);
    background: #fff;
  }
}
</style>