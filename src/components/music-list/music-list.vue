<template>
  <div class="singer-detail">
    <div>
      <!-- <div class="back" @click="back"> -->
      <!-- <span class="icon-back"></span> -->
      <!-- </div> -->
      <div class="title" ref="title">{{title}}</div>
      <div class="bg-image" :style="getImgStyle" ref="bgImage">
        <div class="filter" ref="filter"></div>
        <div class="play-wrapper">
          <div ref="playBtn" class="play" @click="playRandom">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll rel="scroll" class="list" :listenScroll="true" :probeType="3" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from "../../base/scroll/scroll";
import Loading from "../../base/loading/loading";
import SongList from "../../base/song-list/song-list";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      scrollY: 0
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    getImgStyle() {
          console.log(this.avatar)

      return `background: url(${this.avatar})`;
    }
  },
  methods: {
    ...mapActions(["selectPlay"]),
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    playRandom() {
      this.selectPlay({
        list: this.songs,
        index: "0"
      });
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      // this.$emit('backClick')
      this.$router.back();
    }
  },
  watch: {
    scrollY(newY) {
      let filterH = this.$refs.filter.clientHeight;
      let titleH = this.$refs.title.clientHeight;
      let h = filterH - titleH;
      let scale = 1;
      const percent = Math.abs(newY / filterH);
      if (newY > 0) {
        scale = 1 + percent;
        this.$refs.bgImage.style["transform"] = `scale(${scale})`;
        this.$refs.bgImage.style["zIndex"] = 10;
      }
      if (h >= -newY && newY <= 0) {
        let ratio = 0.4 + (-newY / h) * 0.6;
        console.log(ratio);
        this.$refs.filter.style.opacity = ratio;
        this.$refs.title.style.opacity = ratio;
        this.$refs.layer.style.top = newY + "px";
        this.$refs.bgImage.style["zIndex"] = 0;
      } else if (newY < 0) {
        this.$refs.layer.style.top = -h + "px";
      }
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable';
@import '../../assets/stylus/mixin';
.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
.title {
  position: absolute;
  z-index: 60;
  top: 0;
  width: 80%;
  padding 0 10%;
  text-align: center;
  line-height: 42px;
  color: $color-text-ll;
  font-size: $font-size-large;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // background: $color-background-d;
  // opacity: 0;
}

.back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 70;

  .icon-back {
    display: block;
    padding: 10px;
    font-size: $font-size-large-x;
    color: $color-theme;
  }
}

.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
  transform-origin: top;
  background-size: 100% !important;

  .play-wrapper {
    position: absolute;
    bottom: 20px;
    width: 100%;

    .play {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-theme;
      color: $color-theme;
      border-radius: 100px;
      font-size: 0;

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
  }

  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(7, 17, 27);
    opacity: 0.4;
  }
}

.bg-layer {
  position: relative;
  height: 100%;
  background: $color-background;
}

.list {
  position: absolute;
  top: 40%;
  bottom: 0;
  width: 100%;
  background: $color-background;

  .song-list-wrapper {
    padding: 20px 30px;
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>