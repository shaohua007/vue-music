/*
 * @Author: your name
 * @Date: 2020-01-13 14:19:00
 * @LastEditTime : 2020-01-13 19:51:33
 * @LastEditors  : 少华
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/recommend'
import Singer from '../components/singer/singer'
import Rank from '../components/rank/rank'
import Search from '../components/search/search'
import SingerDetail from '../components/singerdetail/singer-detail'
// import Player from '../components/player/player'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/recommend',
            component: Recommend
        },
        {
            path: '/search',
            component: Search
        },
        {
            path: '/singer',
            component: Singer,
            children:[
                {
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/rank',
            component: Rank
        }
    ]
})