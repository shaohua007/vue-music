<template>
  <transition appear name="slide">
    <music-list :rank="rank" :title="title" :avatar="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '../music-list/music-list'
  import { getMusicList } from '../../api/rank'
  import { ERR_OK } from '../../api/config'
  import { mapGetters } from 'vuex'
  import { createSong, isValidMusic, processSongsUrl } from '../../common/song'
  export default {
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    created () {
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        let _this = this
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              _this.songs = songs
            })
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active
    transition: all 0.3s ease
  .slide-enter
    transform: translate3d(100%, 0, 0)
</style>
.slide-enter-active, {
  transition: all 0.3s;
}

.slide-enter {
  transform: translateX(100%);
}