<template>
  <div class="prizeInfoContent">
      <header>
        <img  v-cloak :src="prizeInfo.imgUrl">
        <div class="goodsInfo">
            <p  v-cloak>{{prizeInfo.goodName}}</p>
            <p  v-cloak><span>{{prizeInfo.goodIntegral}}积分</span> <span>市场价:￥{{prizeInfo.marketPrice}}</span><span>
            剩余库存:{{prizeInfo.inventory}}</span></p>
        </div>
      </header>
      <article>
        <div v-html='prizeInfo.goodDetail'></div>
        <div style="width:100%;height:70px;"></div>  
      </article>
      <div class="bottomArea">
         <p><span  v-cloak >支付:{{needPay}}积分</span> <span>可用积分:{{totalIntegral}}</span> </p>
          <ul class="btn-numbox">
              <li>
                  <ul class="count">
                      <li><span :class="['num-add', inputNum > 1 ? 'icon-add':'icon-add-forbid']" @click='minusNum'></span></li>
                      <li class="input_num"> {{inputNum}}</li>
                      <li @click="addNum()"><span :class="['num-minus',canAdd?'icon-minus':'icon-minus-forbid']" ></span></li>
                  </ul>
              </li>
  　　　  </ul>
         <button style="background:#ccc"v-if='prizeInfo.inventory==0'>已兑光</button>
        <button v-else-if='totalIntegral<prizeInfo.goodIntegral' @click='share'>邀请好友得积分</button>       
        <button v-else @click='toExchange'>立即兑换</button>
      </div>
     <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade" class="popup">
        <img :src="ownerImg" >
        <p class="message">长按二维码进行分享</p>
    </mt-popup>
  </div>

</template>

<style lang="scss" type="text/css">
 @import '../../assets/scss/homeAndPrize.scss';
</style>


<script type="text/babel">
  import http from '../../utils/axios'
  import api from '../../utils/api'
  export default {
    name: 'hello1',
    data() {
       return{
          inputNum:1,
          needPay:0,
          totalIntegral:0,
          integral:20,
          canAdd:true,
          goodsId:this.$route.query.goodsId,
          prizeInfo:{},
          customerId:'',
          ownerImg:'',
          popupVisible:false

       }
      },
    mounted() { 
     window.onpageshow = function(event){
        if (event.persisted) {
          window.location.reload();
        }
      }
      this.getPrizeInfo();   
      this.customerId = JSON.parse(window.localStorage.getItem('customerId')); 
      if(this.customerId===null){
        this.getCurrentWxuser();
      }

    },
    methods: {
      share(){
        this.popupVisible=true;
        this.ownerImg = decodeURIComponent(JSON.parse(window.localStorage.getItem('individualCode')));
      },
      getCurrentWxuser: async function (){
        const res = await http.get(api.getCurrentWxuser);
        if(res.data && res.data.respObj){
          this.customerId = res.data.respObj.customerId;
          window.localStorage.setItem('customerId', JSON.stringify(this.customerId)); 
          
        }
      },
      getPrizeInfo: async function () {
        let parmas = {
            goodId:this.goodsId
          }
        const res = await http.get(api.getGoodDetailById,parmas)
        if(res.data && res.data.success){
             this.prizeInfo = res.data.respObj;
            this.needPay = this.prizeInfo.goodIntegral;
            this.prizeInfo.goodDetail = this.tochange(res.data.respObj.goodDetail);
             this.getUsableScore();
        }
      },
      minusNum(){
        var inputNum = parseInt(this.inputNum);
        if(inputNum>1){
          this.inputNum =this.inputNum- 1;
           this.canAdd = true;
           this.needPay = this.prizeInfo.goodIntegral * this.inputNum;
        }
        
      },
      addNum(){
        if(!this.canAdd) return;
        if(this.inputNum*this.prizeInfo.goodIntegral < this.totalIntegral && this.inputNum<this.prizeInfo.inventory){
           this.inputNum = parseInt(this.inputNum)+1;
           this.needPay = this.prizeInfo.goodIntegral * this.inputNum;
        }
        var addInputNum = this.inputNum+1;
        if(addInputNum*this.prizeInfo.goodIntegral > this.totalIntegral || addInputNum >this.prizeInfo.inventory){
            this.canAdd = false;
        }

      },
      getUsableScore:async function(){
         var obj  = JSON.parse(window.localStorage.getItem('myIntegral'));
         var addInputNum = this.inputNum+1;
        if(obj){
          var currentTimestamp = new Date().getTime();
          if(currentTimestamp - obj.timestamp <60000){
            this.totalIntegral = obj.integral;
            if(addInputNum*this.prizeInfo.goodIntegral >this.totalIntegral || addInputNum >this.prizeInfo.inventory){
                this.canAdd = false;
            }
            return;
          }
         
        }
        const res = await http.get(api.getUsableScore)
        if(res.data.success){
          this.totalIntegral = res.data.respObj.usableScore;
          var timestamp=new Date().getTime();
          let obj = {
            timestamp:timestamp,
            integral:this.totalIntegral
          };
           
          if(addInputNum*this.prizeInfo.goodIntegral >this.totalIntegral || addInputNum >this.prizeInfo.inventory){
              this.canAdd = false;
          }
           window.localStorage.setItem('myIntegral', JSON.stringify(obj));
        }
      },
      toExchange(){
        if(!this.customerId){
          this.$router.push('/other/accountBinding');
          return;
        }
         if(window.localStorage){
          let obj={
             num:this.inputNum,
             goodsId:this.prizeInfo.goodsId,
             name:this.prizeInfo.goodName,
             needPay:this.needPay,
             goodsId:this.prizeInfo.id,
             imgUrl:this.prizeInfo.imgUrl
           }
           window.localStorage.setItem('goodsInfo', JSON.stringify(obj));

         }
         window.localStorage.removeItem('currentIntegral');
        this.$router.push('/commodity/exchange');
      },
      tochange(strvalue){
        strvalue = strvalue.replace(/&amp;/g,"&");
        strvalue = strvalue.replace(/&lt;/g,"<");
        strvalue = strvalue.replace(/&gt;/g,">");
        strvalue = strvalue.replace(/&quot;/g,"\"");
        strvalue = strvalue.replace(/&#39;/g,"'");
        return strvalue;
      },
    },
    watch: {

      },
  }
</script>
