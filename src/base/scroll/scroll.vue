<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number,
      defaut: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
      this._listenScroll();
    },
    enable() {
      this.scroll && this.scroll.enable;
    },
    disable() {
      this.scroll && this.scroll.disable;
    },
    refresh() {
      this.scroll && this.scroll.refresh;
    },
    scrollToElement(options) {
      this.scroll && this.scroll.scrollToElement(options);
    },
    _listenScroll() {
      if (this.listenScroll) {
        let _this = this;
        this.scroll.on("scroll", (pos) => {
          _this.$emit("scroll", pos);
        });
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>