<template>
  <div id="markdown-wrap">
    <div :id="randomID"></div>
    <beat-loader :color="'#37cbf1'" :num="7" :size="10" v-if="jsLoading"></beat-loader>
	</div>
</template>
<script>
import {loadScript} from '@/assets/js/async-js'
import beatLoader from '@/components/beatLoader'
import store from '@/assets/js/store.js'
export default {
  components: {
    beatLoader
  },
  props:{
    content: {
      type: Object,
      default: function() {
        return {
          value: ''
        }
      }
    }
  },
  data: function() {
    return {
      jsLoading: false,
      randomID: `markdown-wrap${Math.round(Math.random()*100000)}`,
    }
  },
  watch: {
    'content': function() {
      this.analysisMarkdown();
    }
  },
  mounted() {
    let sources = [
      // '/static/jquery.min.js',
      // '/static/lib/marked.min.js',
      // '/static/lib/prettify.min.js',
      // '/static/lib/raphael.min.js',
      // '/static/lib/underscore.min.js',
      // '/static/lib/sequence-diagram.min.js',
      // '/static/lib/flowchart.min.js',
      // '/static/lib/jquery.flowchart.min.js',
      // '/static/editormd.js',
      '/static/markdown-depends.min.js'
    ];
    if (!store.editorMdLoaded) {
      this.jsLoading = true;
      loadScript(sources, ()=>{
        this.jsLoading = false;
        store.editorMdLoaded = true;
        this.analysisMarkdown()
      });
    } else {
      this.analysisMarkdown();
    }
  },
  methods: {
    analysisMarkdown: function() {
        let mdContent = this.content.value;
        /* eslint-disable-next-line */
        $(`#${this.randomID}`).html('');
        /* eslint-disable-next-line */
        editormd.markdownToHTML(this.randomID,{
          markdown: mdContent,
          htmlDecode: "style,script,iframe",
          emoji: true,
          taskList: true,
          tex: true, // 默认不解析
          flowChart: true, // 默认不解析
          sequenceDiagram: true, // 默认不解析
          codeFold: true
        });

    }
  }
}
</script>
<style lang="scss">
@import '/static/editormd.preview-custome.css';
</style>


