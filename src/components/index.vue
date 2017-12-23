<template>
  <div class="mainContent">

  <div class="homeConeten" >
    <header>
      <mt-swipe v-cloak v-if='imgArr.length>0' :show-indicators="false">
           <mt-swipe-item   v-for='site in imgArr'><a :href="site.targetUrl |filterUrl"><img  :src="site.imgUrl"></a></mt-swipe-item>
        </mt-swipe>
        <ul class="twoButton">
              <router-link  v-cloak :to="{path:'/other/activityRules'}">查看活动规则</router-link>
              <router-link  v-cloak :to="{path:'/personal/personalCenter'}"> 查看我的积分</router-link>
          </ul>
    </header>
      <ul v-cloak v-if='goodsList.length>0'class="goodsList"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
             <li v-for='site in goodsList' :key='site.id'>
              <div @click='getPrizeInfo(site)'>
               <div class="goodsImg">
                <img  v-cloak :src="site.imgUrl">
               </div>
               <div class="content">
                 <p>{{site.goodName}}</p>
                 <div class="bottom"><p>{{site.goodIntegral}}积分</p>
                    <button  v-cloak v-if='site.inventory!=0' class="exchangeButton">兑换</button>
                    <button  v-cloak v-else class="noExchangeButton">已兑光</button>
                </div>
               </div>
             </div>
            </li>

    </ul>
    <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade" class="popup">
        <img  v-cloak :src="ownerImg" >
        <p class="message">长按二维码进行分享</p>
    </mt-popup>
    <div @click='displayImg()'> <button class="fixedCircle"> 邀请好友得积分</button></div>
    <div v-if='ending' class="getAll">已加载全部~</div>
  </div>

</div>
</template>

<style lang="scss" scoped="" type="text/css">
 @import '../assets/scss/homeAndPrize.scss';
</style>

<script type="text/babel">
  import http from '../utils/axios'
  import api from '../utils/api'
  import axios from 'axios'
import Vue from 'vue'
 import { Swipe, SwipeItem ,Toast} from 'mint-ui';
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
  Vue.filter('filterUrl', function (value) {//value为13位的时间戳
      if(value.indexOf('http')>-1)
        return value;
      else
        return ('http://'+value);
  });
  export default {
    name: 'hello1',
    data() {
       return{
          popupVisible:false,
           ownerImg:'',
           popupVisible1:false,
           imgArr:[],
           page:1,
           goodsList:[],
           loading:true,
           ending:false,
           getList:''
       }
      },
    mounted() {
      
      if(document.URL.indexOf('?poster')<0){
         this.loadMore();
        this.getBanner();
        // this.Login();
        this.ownerImg = decodeURIComponent(JSON.parse(window.localStorage.getItem('individualCode')));
      }
    },
    methods: {
      getPrizeInfo(site){
        this.$router.push({path:'/commodity/prizeInfo',query:{goodsId:site.id}});
      },
      Login: async function () {
        let parmas = {
          openid:'osDCp0Sql4Pt1XvIvmXKcYvzfn20'
        };
           const res = await http.get(api.Login,parmas)
           if(res.data){
               
               this.getBanner();
               this.loadMore();
           }
      },
      displayImg(){
        this.popupVisible = true;

      },

      getBanner: async function () {
         const res = await http.get(api.getBanner)
         if(res.data.success){

            this.imgArr= res.data.respObj;
         }else{
            this.alertMessage(res.data.errorMsg);

         }
       },
       loadMore: async function () {
        if(this.getList!=''){
          this.goodsList = this.goodsList.concat(this.getList);
          this.getList='';
          this.loading = true;
          if(!this.ending){
              this.getMore();
          }

          return;
        }
          let parmas = {
            pageNo:this.page,
            pageSize:10
          }
          const res = await http.get(api.getIndexGoodList,parmas)
          if(res.data && res.data.success){
            if(res.data.respObj.list.length<10) this.ending = true;
            if(this.goodsList.length==0){
              this.goodsList = res.data.respObj.list;
            }else{
              this.goodsList = this.goodsList.concat(res.data.respObj.list);
            }
            this.page+=1;
            setTimeout(()=>{
                 this.getMore();
            },1000);
          }else{
            this.alertMessage(res.data.errorMsg);
         }
       },
       getMore: async function () {
        this.loading = true;
        let parmas = {
            pageNo:this.page,
            pageSize:10
          }
          const res = await http.get(api.getIndexGoodList,parmas)
           if(res.data && res.data.success){
            this.loading = false;
            this.getList = res.data.respObj.list;
            this.page +=1;
            if(res.data.respObj.list.length<10) this.ending = true;
           }else{
            this.alertMessage(res.data.errorMsg);
          }
       },
      alertMessage(message){
          Toast({
              message: message,
              position: 'center',
              duration: 2000
            });
     }
    },
    watch: {

      },
  }
</script>
