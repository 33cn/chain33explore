<template>
  <div v-show="loading" class="beat-loader">
    <div class="beat-loader__spinner">
      <div class="beat-loader__spinner__beat" 
      v-for="i in num" :key="i"
      :style="{'background-color': color, 'width': size + 'px', 'height': size + 'px'}"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'beatLoader',
  props: {
    num: {
      default: 3
    },
    loading: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#589bfb'
    },
    size: {
      type: Number,
      default: 10
    }
  },
  data: function() {
    return {
      
    }
  }
}
</script>
<style>
.beat-loader {
  width: 100%;
}
.beat-loader__spinner {
  text-align: center;
  padding: 0 10px;
}
.beat-loader__spinner__beat {
  margin: 2px 5px;
  border-radius: 100%;
  -webkit-animation: beatStretchDelay 0.7s infinite linear;
  animation: beatStretchDelay 0.7s infinite linear;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  display: inline-block;
}
.beat-loader__spinner__beat:nth-child(odd) {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.beat-loader__spinner__beat:nth-child(even) {
  -webkit-animation-delay: 0.35s;
  animation-delay: 0.35s;
}
@keyframes beatStretchDelay {
  50% {
    -webkit-transform: scale(0.75);
    transform: scale(0.75);
    -webkit-opacity: 0.2;
    opacity: 0.2;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-opacity: 1;
    opacity: 1;
  }
}
</style>

