<template>
 <div class="historyContent">

    <div class="history_champions"  v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="20">
      <div class="champions_record"  v-for="item in goodsList">

            <img :src="item.headimgurl" />
            <div class="champions_namedate">
              <span>{{item.nickname}}</span>
              <p>{{item.createdAt}}</p>
            </div>
            <div class="champions_integral">
              <span>{{item.integralValue}}</span>
            </div>


      </div>

      </div>


   <div class="loadingMore">
     <p v-if="loadGif" class="page-infinite-loading">
       加载中...
       <mt-spinner type="fading-circle">
       </mt-spinner>
     </p>  
     <p v-else>
       没有更多啦
     </p>
   </div>
 </div>






</template>

<style scoped>

</style>

<script type="text/babel">
  import http from '../../utils/axios'
  import api from '../../utils/api'
  import axios from 'axios'
  import Vue from 'vue'

  export default {
    name: 'hello1',
    data() {
      return {

        showLoading: true,

        goodsList:[],
        loading:true,
        loadGif: false,
        page:1,
        ending:false
      }
    },
    mounted(){
        this.loadMore();
    },
    methods: {

      loadMore: async function () {
        if(this.ending || (this.loading && this.page >1)) return;
        if(this.page>1){
          this.loading = true;
        }

        let parmas = {
          pageNo:this.page,
          pageSize:20
        }
        const res = await http.get(api.getHistoryChampionRank,parmas)
        if(res.data && res.data.success){
          if(res.data.respObj.length<20) this.ending = true;
          if(this.goodsList.length==0){
            this.goodsList = res.data.respObj;
          }else{
            this.goodsList = this.goodsList.concat(res.data.respObj);
          }
          this.loading = false;
          this.page+=1;
        }else{
          this.alertMessage(res.data.errorMsg);
        }
      },
    },
    watch: {

      }
  }
</script>
