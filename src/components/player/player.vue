<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal">
      <div
        class="normal-player"
        v-show="fullScreen"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back" @click="mini">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="imageWrapper">
                <img ref="image" class="image" :src="currentSong.image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <!-- <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div>
                <p ref="lyricLine" class="text"></p>
              </div>
              <div class="pure-music">
                <p></p>
              </div>
            </div>
          </scroll>-->
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <!-- <span class="dot"></span>
            <span class="dot"></span>-->
          </div>
          <div class="progress-wrapper">
            <span class="time time-l" v-html="currentTime">00:00</span>
            <div class="progress-bar-wrapper">
              <progress-bar ref="progressBar" :progress="playRatio" @move="move"></progress-bar>
            </div>
            <span class="time time-r" v-html="duration"></span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="modeSelect"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="modePrePlay"></i>
            </div>
            <div class="icon i-center">
              <i ref="playBtn" :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="modeNextPlay"></i>
            </div>
            <div class="icon i-right">
              <!-- <i class="icon-favorite"></i> -->
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
        <div class="icon" @click="full">
          <div class="imgWrapper" ref="miniWrapper">
            <img
              ref="miniImage"
              width="40"
              height="40"
              :src="currentSong.image"
              :class="{play: true}"
            />
          </div>
        </div>
        <div class="text" @click="full">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="mini-play">
          <!-- <progress-circle>
            <i class="icon-mini"></i>
          </progress-circle>-->
          <i :class="playIcon" @click="togglePlay"></i>
        </div>
        <!-- <div class="control">
          <i class="icon-playlist"></i>
        </div>-->
      </div>
    </transition>
    <!-- <playlist ref="playlist"></playlist> -->
    <audio ref="audio" :src="currentSong.url"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from "vuex";
//   import animations from 'create-keyframe-animation'
//   import { prefixStyle } from 'common/js/dom'
import ProgressBar from "../../base/progress-bar/progress-bar";
//   import ProgressCircle from '../../base/progress-circle/progress-circle'
//   import { playMode } from 'common/js/config'
//   import Lyric from 'lyric-parser'
//   import Scroll from '../../base/scroll/scroll'
//   import { playerMixin } from 'common/js/mixin'
//   import Playlist from '../components/playlist/playlist'
//   const transform = prefixStyle('transform')
//   const transitionDuration = prefixStyle('transitionDuration')
//   const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
export default {
  data() {
    return {
      currentTime: "",
      duration: "",
      playRatio: 0
    };
  },
  methods: {
    initPlayer() {
      // console.log(this.currentSong)
      if (!this.playlist.length) {
        return false;
      }
      console.log(66666);
      this.getDuration();
      this.getCurrentTime();
      this.$refs.audio.addEventListener("ended", this.modeNextPlay, false);
      setInterval(() => {
        this.getCurrentTime();
      }, 100);
    },
    togglePlay() {
      this.setPlayingState(!this.playing);
    },
    modeSelect() {
      const mode = this.mode === 2 ? 0 : this.mode + 1;
      this.setPlayMode(mode);
    },
    generateRandomIndex() {
      let len = this.playlist.length;
      return parseInt(Math.random() * len);
    },
    getCurrentTime() {
      this.currentTime = this.$refs.audio.currentTime;
      // 当前播放进度比例
      this.playRatio = Math.floor(
        (this.currentTime / this.currentSong.duration) * 100
      );
      let m = Math.floor(this.currentTime / 60);
      let s =
        this.currentTime % 60 < 10
          ? "0" + Math.floor(this.currentTime % 60)
          : Math.floor(this.currentTime % 60);
      this.currentTime = m + ":" + s;
      return this.currentTime;
    },
    getDuration() {
      this.duration = this.currentSong.duration;
      let m = Math.floor(this.duration / 60);
      let s =
        this.duration % 60 < 10
          ? "0" + (this.duration % 60)
          : this.duration % 60;
      this.duration = m + ":" + s;
      return this.duration;
    },
    modePrePlay() {
      if (this.currentIndex > 0) {
        return;
      }
      if (this.mode === 0 || this.mode === 1) {
        // 顺序播放 跟单曲循环时
        this.setCurrentIndex(this.currentIndex - 1);
        return;
      }
      if (this.mode === 2) {
        // 随机播放
        this.setCurrentIndex(this.generateRandomIndex());
        return;
      }
    },
    modeNextPlay() {
      if (this.currentIndex + 1 >= this.playlist.length) {
        return;
      }
      if (this.mode === 0 || this.mode === 1) {
        // 顺序播放
        this.setCurrentIndex(this.currentIndex + 1);
        return;
      }
      if (this.mode === 2) {
        // 随机播放
        this.setCurrentIndex(this.generateRandomIndex());
        return;
      }
    },
    mini() {
      this.setFullScreen(false);
    },
    full() {
      this.setFullScreen(true);
    },
    move(position) {
      this.$refs.audio.currentTime = Math.floor(
        position * this.currentSong.duration
      );
    },
    touchStart(e) {
      this.startY = e.touches[0].pageY;
    },
    touchMove(e) {
      this.endY = e.touches[0].pageY - this.startY;
    },
    touchEnd() {
      if (this.endY > 60) {
        this.mini();
      }
      this.endY = 0;
    },
    ...mapMutations({
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayingState: "SET_PLAYING_STATE",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAY_LIST",
      setFullScreen: "SET_FULL_SCREEN"
    })
  },
  computed: {
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    modeIcon() {
      return this.mode === 0
        ? "icon-sequence"
        : this.mode === 1
        ? "icon-loop"
        : "icon-random";
    },
    ...mapGetters([
      "fullScreen",
      "playing",
      "mode",
      "playlist",
      "sequenceList",
      "currentIndex",
      "currentSong"
    ])
  },
  watch: {
    currentSong() {
      console.log("开始播放");
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.initPlayer();
      });
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar
    //   ProgressCircle,
    //   Scroll,
    //   Playlist
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable';
@import '../../assets/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        padding-left: 10%;
        padding-right: 10%;
        line-height: 20px;
        text-align: center;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
        overflow: hidden;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          animation: rotate 16s linear infinite;
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          // transform: rotateZ(360deg);
          // -webkit-transform: rotateZ(360deg);
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .play {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .mini-play {
      padding: 0 20px;
      font-size: 28px;
      color: #ffcd32;
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>