<template>
  <div class="singer">
    <scroll ref="scroll" class="singer-content" :data="singers" :listenScroll='true' :probeType='3' @scroll="scroll">
      <div class="singer-list">
        <listview>
          <ul>
            <li v-for="(itemList, index01) in singers" :key="index01" class="item-list" ref="itemlist" :data-index="index01">
              <div class="singer-title">{{itemList.title}}</div>
              <ul>
                <li v-for="(item, index02) in itemList.items" :key="index02" class="item" @click="selectItem(item)">
                  <div class="icon">
                    <img width="60" height="60" @load="loadImage" v-lazy="item.avatar" />
                  </div>
                  <div class="text">
                    <h2 class="name">{{item.name}}</h2>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </listview>
      </div>
      <div class="loading-container" v-if="!singers.length">
        <loading></loading>
      </div>
    </scroll>
    <ul class="tracking-list" @touchstart="onTackingIndex">
      <li v-for="(tList, index03) in singers" :key="index03" :data-index="index03" ref="tracking" :class="{'act': selectedIndex == index03}">{{tList.title}}</li>
    </ul>
    <router-view></router-view>
  </div>
</template>
<script>
import Singer from "../../common/singer";
import { ERR_OK } from "../../api/config";
import { getSingerList } from "../../api/singer";
import Scroll from "../../base/scroll/scroll";
import Loading from "../../base/loading/loading";
import Listview from "../../base/listview/listview";
import {mapMutations} from 'vuex'

const HOTLENGTH = 10;

export default {
  data() {
    return {
      singers: [],
      selectedIndex: 0,
      scrollY: -1
    };
  },
  created() {
    this._getSingerList();
    this.listHeight = []
    this.isTracking = true
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: "热门",
          items: []
        }
      };
      list.forEach((item, index) => {
        if (item.Findex >= "A") {
          if (index < HOTLENGTH) {
            map.hot.items.push(
              new Singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
              })
            );
          }
          let key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            };
          }
          map[key].items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
      });
      // 处理列表排序
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(map[key]);
        } else if (val.title.match()) {
          hot.push(map[key]);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    onTackingIndex(e) {
        if(e.touches[0].target.tagName != 'LI') return false
        this.selectedIndex = e.touches[0].target.dataset.index;
        this.isTracking = false
        this.$refs.scroll.scrollToElement(this.$refs.itemlist[this.selectedIndex],0)
        this.isTracking = true
    },
    scroll(pos) {
      if(this.isTracking) {
        this.scrollY = pos.y
      }
    },
    _caculateHeight() {
        const list = this.$refs.itemlist;
        let height = 0
        this.listHeight.push(height)
        for(let i=0; i<list.length; i++) {
            let item = list[i]
            height += item.clientHeight
            this.listHeight.push(height)
        }
    },
    selectItem(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      })
      this.setSinger(item)
      console.log(item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  watch: {
      singers() {
          setTimeout(()=>{
            this._caculateHeight()
          },20)
      },
      scrollY(newY) {
          if(newY >0) {
              this.selectedIndex = 0
              return
          }
          const listHeight = this.listHeight
          for(let i=0; i< listHeight.length; i++) {
              let h1 = listHeight[i]
              let h2 = listHeight[i+1]
              if(!h2 || (-newY>h1 && -newY<h2)) {
                  this.selectedIndex = i
                  return
              }
          }
          this.selectedIndex = listHeight.length-2
      }
  },

  components: {
    Scroll,
    Listview,
    Loading,
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/variable';

.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;

  .tracking-list {
    position: absolute;
    top: 0;
    right: 10px;
    text-align: center;
    font-size $font-size-small
    li {
      margin: 6px;
    }
    .act {
      color $color-theme
    }
  }

  .singer-content {
    height: 100%;
    overflow: hidden;

    .singer-list {
      .singer-title {
        padding-left: 25px;
        margin-bottom: 15px;
        text-align: left;
        font-size: $font-size-medium;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;

          img {
            border-radius: 60px;
          }
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>