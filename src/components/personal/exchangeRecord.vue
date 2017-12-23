<template>
    <div class="exchangContent">

    <div class="records">
      <div class="record" v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="10">

          <div class="record_on"  v-for="item in goodsList">
            <img :src="item.imgUrl" />
            <div class="record_m">
                <span>奖品名称:{{item.goodName}}</span>
            </div>
              <ul class="record_con">
                <li>兑换数量:{{item.purchaseQuantity}}</li>
                <li>支付积分:{{item.purchaseQuantity * item.goodIntegral}}</li>
                <li>兑换时间:{{item.createdAt |time}}</li>
              </ul>
          </div>

      </div>

      <div class="loadingMore">
        <p v-if="loadGif" class="page-infinite-loading">
          加载中...
          <mt-spinner type="fading-circle">
          </mt-spinner>
        </p>
        <p v-else>
          没有更多啦！
        </p>
      </div>
    </div>
          <div class="foot_v">
            <div class="foot">
              <a href='https://m.aladingbank.com/downApp.html?type=6'><span>下载魔法现金APP ，现金借款不用愁</span></a>
            </div>
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
  import { InfiniteScroll,Toast} from 'mint-ui';

  Vue.filter('time', function (value) {
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

    return add0(m) + '月' + add0(d)+'日'+add0(H) +':'+add0(i)+':'+add0(s);
  });
  export default {
    name: 'hello1',
    data() {
      return{
        prize:"1",
        goodsList:[],
        loading:true,
        page:1,
        loadGif:false,
        ending:false,

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
          pageSize:10
        }
        const res = await http.get(api.exchangeHistory,parmas)
        if(res.data && res.data.success){
          if(res.data.respObj.length<10) this.ending = true;
          if(this.goodsList.length==0){
            this.goodsList = res.data.respObj;
          }else{
            this.goodsList = this.goodsList.concat(res.data.respObj);
          }
          this.loading = false;
          this.page+=1;
        }else if(res.data.errorCode!='403'){
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

    }
  }
</script>
