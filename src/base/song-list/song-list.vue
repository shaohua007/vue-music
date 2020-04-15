<template>
  <div class="song-list">
    <ul>
      <li v-for="(item, index) in songs" :key="index" class="item" @click="selectItem(item, index)">
        <div class="content">
          <div class="name">{{item.name}}</div>
          <div class="desc">{{item.singer}} . {{item.album}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  // import  from ''
  props: {
    songs: {
      type: Array,
      default () {
          return []
        }
    }
  },
  methods: {
    selectItem(song, index) {
      this.$emit("select",song, index)
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable';
@import '../../assets/stylus/mixin';

.song-list {
  .item {
    display: flex;
    padding-left: 20px;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;

      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>