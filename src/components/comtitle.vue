<template>
  <div  class="comtitle">
    <img src="../assets/images/site.png" height="20" width="20">
    <p v-if="!(!firstUrl||!firstUrlTitle)">
      <router-link class="url" :to="{ path: firstUrl}">{{firstUrlTitle}}</router-link>
    </p>
    <p v-if="!(!firstUrl||!firstUrlTitle)">></p>
    <p v-if="!(!secondUrl||!secondUrlTitle)">
      <router-link class="url" :to="{ path: secondUrl}">{{secondUrlTitle}}</router-link>
    </p>
    <p v-if="!(!secondUrl||!secondUrlTitle)">></p>
    <p class="url-word">{{title}}</p>
  </div>
</template>
<script>
  export default{
    props:['title','firstUrlTitle','firstUrl','secondUrlTitle','secondUrl'],
  }
</script>
<style scoped lang="scss">
  .comtitle{
    height: 50px;
    line-height: 65px;
    font-size:14px;
    img{
      margin-top:5px;
    }
    p{
      position:relative;
      display:inline-block;
      top:-5px;
      margin-left:10px;
      height:30px;
      line-height:30px;
      color:#fff;  
    }
    .url{
      cursor: pointer; 
      color:#fff;  
    }
    .url-word{
      color:#FAC765!important;
    }
  }
  .app-white .comtitle{
    .url,p{
      color:#7E7E7E;
    }
  }
</style>