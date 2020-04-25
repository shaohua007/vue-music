<template>
  <transition appear name="slide">
    <music-list class="singer-detail" :songs="songs" :title="title" :avatar="bgImage"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
import { ERR_OK } from "../../api/config";
import { getSongList } from "../../api/recommend";
import { createSong, processSongsUrl } from "../../common/song";
import MusicList from "../music-list/music-list";

export default {
  data() {
    return {
      songs: [],
      hide: true,
      hideFlag: true
    };
  },
  created() {
    this._getSongList();
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code == ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
            res => {
              console.log("歌曲信息：");
              console.log(res);
              this.songs = res;
            }
          );
        //   this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let musicData = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active {
  transition: all 0.3s;
}

.slide-enter {
  transform: translateX(100%);
}
</style>