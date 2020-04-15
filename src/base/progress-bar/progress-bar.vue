<template>
  <div class="progress-bar">
    <div ref="playRatio" class="progress"></div>
    <div ref="progressBg" class="progress-bg"></div>
    <div
      ref="progressBtn"
      class="progress-btn"
      @touchstart="start"
      @touchmove="move"
      @touchend="end"
    ></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      isWatch: true,
      progressW: 0
    };
  },
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  watch: {
    progress() {
      if (this.isWatch) {
        this.progressW = this.$refs.progressBg.clientWidth - 6
        let curW = (this.progressW * this.progress) / 100 + "px";
        this.$refs.playRatio.style.width = curW
        this.$refs.progressBtn.style.left = curW
      }
    }
  },
  methods: {
    start(evt) {
      this.isWatch = false;
      console.log("触摸开始");
      this.tempW = this.$refs.playRatio.clientWidth;
      evt.preventDefault();
      let touch = event.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
      this.startPos = { x: touch.pageX, y: touch.pageY, time: +new Date() }; //取第一个touch的坐标值
      this.isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动
      // 绑事件
      //   this.$refs.progressBtn.addEventListener("touchmove", this.move, false);
      //   this.$refs.progressBtn.addEventListener("touchend", this.end, false);
    },
    move(evt) {
      evt.preventDefault();
      if (evt.targetTouches.length > 1 || (evt.scale && evt.scale !== 1))
        return;
      let touch = evt.targetTouches[0];
      this.endPos = {
        x: touch.pageX - this.startPos.x,
        y: touch.pageY - this.startPos.y
      };
      if (this.tempW + this.endPos.x <= 0) {
        this.$refs.playRatio.style.width = 0;
        this.$refs.progressBtn.style.left = 0
      }else if (this.progressW > this.tempW + this.endPos.x) {
        this.$refs.playRatio.style.width = this.tempW + this.endPos.x + "px";
        this.$refs.progressBtn.style.left =
          this.tempW + this.endPos.x + "px";
      } else {
        this.$refs.playRatio.style.width =
          this.progressW + "px";
        this.$refs.progressBtn.style.left =
          this.progressW + "px";
      }
    },
    end(evt) {
      console.log("end*************");
      evt.preventDefault();
      this.isWatch = true;
      this.$emit(
        "move",
        this.$refs.playRatio.clientWidth / this.progressW
      );
      //解绑事件
      this.$refs.progressBtn.removeEventListener("touchmove", this, false);
      this.$refs.progressBtn.removeEventListener("touchend", this, false);
    }
  },
  mounted() {}
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable';

.progress-bar {
  position: relative;
  width: 100%;

  .progress {
    position: absolute;
    width: 0;
    border: 1px solid $color-theme;
  }

  .progress-bg {
    width: 100%;
    border: 1px solid $color-highlight-background;
  }

  .progress-btn {
    position: absolute;
    top: -5px;
    left: 0;
    width: 8px;
    height: 8px;
    background: $color-theme;
    border: solid 2px $color-text-ll;
    border-radius: 8px;
  }
}
</style>