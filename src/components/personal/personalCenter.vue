<template>
  <div class="perCenter">
    <!-- <div style="width:100%;height:100%;position:absolute">
        <div class="shareImg" id='toImg'  style="z-index:0" >
         <img class="title" src="../../assets/images/word.png">
          <p>邀请的好友越多，获得积分越多</p>
          <img src="../../assets/images/sq.gif">
          <p>我的专属二维码</p>
          <p>好友点击识别后关注即可获得积分</p>
        </div>
        <p class="message">长按二维码可分享我的专属海报</p>
    </div> -->
    <div class="MyCentent">
        <div :class="['banner','banner_bg']">
          <div>
               <div class="residue">
                <span v-cloak class="ative">{{myInformation.remainIntegral}}</span>
                <p>剩余积分</p>
               </div>
               <div class="all">
                <span v-cloak class="ative">{{myInformation.totalIntegral}}</span>
                <p>获得总积分</p>
               </div>
          </div>
          <ul class="My_friends">
              <li v-cloak>直接推荐好友数 ：{{myInformation.directNumber}}</li>
              <li v-cloak class="indirect_friends">间接推荐好友数 ： {{myInformation.indirectNumber}}</li>
              <li v-cloak v-show='!myInformation.directUsername'>我的推荐人 ： 无</li>
              <li v-cloak v-show='myInformation.directUsername'>我的推荐人 ： {{myInformation.directUsername }}</li>
              
          </ul>
          <div class="banner_rule">
            <router-link :to="{path:'/other/activityRules'}"><span>活动规则</span></router-link>
          </div>
        </div>

      <div class="center">
      
          <div :class="['center_rank']">
          <router-link :to="{path:'/personal/integralList'}">
            <p>积分排行榜</p>
            </router-link>
          </div>
        
        
          <div :class="['center_record']">
            <router-link :to="{path:'/personal/exchangeRecord'}">
                <p>兑换记录</p>
                 </router-link>
          </div>
       
      </div>


        <div class="List_friends">
            <div class="friends_recom">
                <p>我的推荐好友</p>
            </div>

            <div v-if='goodsList.length>0'class="friends_Direct"  v-infinite-scroll="loadMore"
                 infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10">
                <div class="Direct"  v-for="item in goodsList">
                  <img :src="item.headimgurl"/>
                  <div class="Direct_namedate">
                    <span>{{item.nickname}}</span>
                    <p>{{item.createdAt |time}}</p>
                  </div>
                  <div class="indirect_friend">
                    {{DirectFriends}}
                  </div>


              </div>
          </div>
          <div v-else class="kong" id='kong'>暂无推荐好友</div>
      </div>
        <footer @click='displayImg'>
          <span >邀请好友得积分</span>
        </footer>
      </div>
       <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade" class="popup">
        <img :src="ownerImg" >
        <p class="message">长按二维码进行分享</p>
      </mt-popup>
  </div>
</template>

<style scoped>

</style>

<script type="text/babel">
  import http from '../../utils/axios'
  import axios from 'axios'
  import Vue from 'vue'
  import { InfiniteScroll,Toast} from 'mint-ui';

  Vue.use(InfiniteScroll);
import HistoryList from '../../components/personal/historyList'
  import api from "../../utils/api";
  Vue.filter('time', function (value) {//value为13位的时间戳
    function add0(m) {
      return m < 10 ? '0' + m : m
    }
    var time = new Date(parseInt(value));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var H = time.getHours(),
      i = time.getMinutes(),
      s = time.getSeconds();

    return  y +'.'+ add0(m) + '.' + add0(d);
  });
  export default {
    name: 'hello2',
    data() {
      return {
        goodsList: [],
        ownerImg: '',
        popupVisible: false,
        showLoading: true,
        loadGif: true,
        loading: true,
        myInformation:{},
        directWxusers:{},
        ending:false,
        DirectFriends:"直接好友",
        page:1

      }
    },
    mounted() {
     // this.initImg();
     this.getWxuserInfo();
      this.loadMore();
      this.ownerImg = decodeURIComponent(JSON.parse(window.localStorage.getItem('individualCode')));
    },
    methods: {

      getWxuserInfo: async function(){
        const res = await http.get(api.getWxuserInfo)
        if (res.data.success) {
          this.myInformation = res.data.respObj;
        }
      },

      initImg() {
        var that = this;
        html2canvas(document.getElementById('toImg'), {
          onrendered: function (canvas) {
            var url = canvas.toDataURL("image/png");
            that.ownerImg = url;
          },
        });
      },
      displayImg() {
        this.popupVisible = true;
      },

      loadMore: async function () {
        if(this.ending || (this.loading && this.page >1)) return;
        if(this.page>1){
          this.loading = true;
        }

        let parmas = {
          pageNo:this.page,
          pageSize:10
        }
        var that = this;
        const res = await http.get(api.getDirectWxusers,parmas)
        if(res.data && res.data.success){
          if(res.data.respObj.length<10) this.ending = true;
          if(that.goodsList.length==0){
            that.goodsList = res.data.respObj;
          }else{
            that.goodsList = that.goodsList.concat(res.data.respObj);
          }
          if(res.data.respObj.length==0 && that.page==1){
               var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
              document.getElementById('kong').style.height = clientHeight-470+'px';
               document.getElementById('kong').style.lineHeight = clientHeight-470+'px';
          }
          this.loading = false;
          that.page+=1;
        }else{
          this.alertMessage(res.data.errorMsg);
        }
      },

      alertMessage(message) {
        Toast({
          message:message,
          position:"center",
          duration: 2000
        });
      }



    },
    watch: {},
  };
</script>



