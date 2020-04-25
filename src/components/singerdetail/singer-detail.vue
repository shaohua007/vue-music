<template>
  <transition appear name="slide" >
    <music-list :songs="songs" :title="title" :avatar="avatar"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapGetters} from "vuex";
import { getSingerDetail } from "../../api/singer";
import { ERR_OK } from "../../api/config";
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
    this._getDetail();
  },
  computed: {
    title() {
      return this.singer.name;
    },
    avatar() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then(res => {
            console.log("歌曲信息：");
            console.log(res);
            this.songs = res;
          });
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
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

.slide-enter-active, {
  transition: all 0.3s;
}

.slide-enter {
  transform: translateX(100%);
}
</style>