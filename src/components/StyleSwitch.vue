<template>
  <div class="switch-style">
    <el-switch
      v-model="style"
      active-value="white"
      inactive-value="black"
      active-color="#FEBA4A"
      inactive-color="#8E8E8E"
      @change="changeStyle"
    ></el-switch>
  </div>
</template>
<script>
import { STYLE_WHITE, STYLE_BLACK } from "@/config/constants";
import display from "@/mixins/display.js";
export default {
  mixins: [display],
  data() {
    return {
      style: this.$store.state.dispalyStyle || "white"
    };
  },
  methods: {
    changeStyle(val) {
      this.$store.commit("changeStyle", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.switch-style {
  cursor: pointer;
  display: inline-block;
}
</style>
