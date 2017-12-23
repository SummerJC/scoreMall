<template>
    <div class="integContent">
      <div class="first">
        <span>排行冠军奖励50积分</span>
        <router-link :to="{path:'/personal/historyList'}">
          <div class="frist_r">
            <span>查看历史冠军</span>
          </div>
        </router-link>
      </div>

      <div class="my_ranking">
        <div class="ranking">
          <span   v-show='mySelfInfo.rowNo>0'>{{mySelfInfo.rowNo}}</span>
        </div>
        <img  v-cloak :src="mySelfInfo.headimgurl" />
        <div class="my_namedate">
          <span  v-cloak >{{mySelfInfo.nickname}}</span>
        </div>
        <div class="my_grade">
          <span v-cloak >{{mySelfInfo.integralValue}}</span>
        </div>
      </div>

      <div class="history_champion">
          <div class="champion_one"  v-for="item in goodsList">
              <div class="history_one">
                  <span>{{item.rowNo}}</span>
              </div>
            <div class="one_head">
              <img :src="item.headimgurl" />
            </div>
            <div class="one_name">
              <p>{{item.nickname}}</p>
            </div>
            <div class="one_integral">
              <span>{{item.integralValue}}</span>
            </div>
          </div>

      </div>
     <!-- <div class="loadingMore">
        <p v-if="loadGif" class="page-infinite-loading">
          加载中...
          <mt-spinner type="fading-circle">
          </mt-spinner>
        </p>
        <p v-else>
          已加载完毕
        </p>
      </div>-->


    </div>
</template>

<style scoped>
  /*前三名的样式*/
.history_champion .champion_one:nth-child(1) .history_one{
    background: #ffb400;
    color: white;
  }

.history_champion .champion_one:nth-child(2) .history_one{
  background: #92beeb;
  color: white;
}

.history_champion .champion_one:nth-child(3) .history_one{
  background: #d79976;
  color: white;
}
</style>

<script type="text/babel">
  import http from '../../utils/axios'
  import api from '../../utils/api'
  import axios from 'axios'
  import Vue from 'vue'
  import { InfiniteScroll } from 'mint-ui';
  export default {
    name: 'hello1',
    data() {
      return{
        goodsList:[],
        deCheck:"10",
        mySelfInfo:{},
        todayRank:{},
        showLoading: true,
      //  loadGif: true,
     //   page:1,
      }
    },
    mounted(){
      this.getTodayChampionRank();
    },

    methods: {
      getTodayChampionRank: async function(){
        const red = await http.get(api.getTodayChampionRank)
        if (red.data && red.data.success) {
          this.goodsList = this.goodsList.concat(red.data.respObj.todayRank);
           this.mySelfInfo = red.data.respObj.mySelfInfo;
        }else {
          this.alertMessage(red.data.errorMsg);
        }
      },

    },
    watch: {

    }
  }
</script>
