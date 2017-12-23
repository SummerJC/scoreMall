<template>  
  <div >
  <div v-if='currentIntegral<0' class="exchangeContent">
      <ul class="inputInfo">
        <li class="normalInput"><p>姓名</p>
          <input type="text" placeholder="请输入收货人姓名" v-model='userName'  @input='changeName'>
        </li>
        <li class="normalInput"><p>电话</p>
          <input type="number"  placeholder="请输入收货人联系电话" v-model='phoneNum' @blur='checkNum'>
        </li>
        <li class="normalInput remakes"><p>备注</p>
          <textarea type="text" v-model='message'placeholder="请输入收货人地址/兑换平台账号" @input='changeText'>
            
          </textarea> 
        </li>
        <li class="goodsInfo">
          <img :src="goodsInfo.imgUrl">
          <div>
              <p>{{goodsInfo.name}}</p>
              <p ><span>兑换数量：{{goodsInfo.num}}</span><span>支付积分：{{goodsInfo.needPay}}</span></p>
          </div>
        </li>
        <li class="delivery"> <span>配送方式</span> <span>包邮</span></li>
      </ul>
      <div class="onsure" v-if='losefocu'>
          <p>温馨提示：确认兑换后不可取消或修改，请仔细核对您的兑换信息</p>
          <div class='likeButton'v-if='isClicked'>确认兑换</div>
          <button v-else @touchstart='isChange()'>确认兑换</button>
      </div>
  </div>
  <div v-else>
    <ExchangeSuccess></ExchangeSuccess>
  </div>
  
  </div>
</template>

<style lang="scss" type="text/css">
 @import '../../assets/scss/homeAndPrize.scss';
</style>

<script type="text/babel">
import { Toast } from 'mint-ui'
  import http from '../../utils/axios'
  import api from '../../utils/api'
  import ExchangeSuccess from'../../components/commodity/exchangeSuccess';
  export default {
    name: 'hello1',
    components:{ExchangeSuccess},
    data() {
       return{
         phoneNum:'',
         message:'',
         userName:'',
         goodsInfo:{},
         losefocu:true,
         isClicked:false,
         preVal:'',
         clickBtn:0,
         currentIntegral:-1
       }
      },
    mounted() {
       var that = this;
      var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      $(window).on('resize', function () {
          var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
          if (clientHeight > nowClientHeight) {
 
              that.losefocu = false;
          }else{

              that.losefocu = true;
          }
      });
       this.goodsInfo = JSON.parse(window.localStorage.getItem('goodsInfo'));
       this.currentIntegral = JSON.parse(window.localStorage.getItem('currentIntegral')) ||-1;
    },
    methods: {
      isChange: async function (){
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/; 
        if(this.userName==''){
          return this.alertMessage('请输入收货人姓名');
        }else if(this.phoneNum.trim()==''){
          return this.alertMessage('请输入收货人的手机号码');
        }else if(!myreg.test(this.phoneNum)){
          return this.alertMessage('请输入正确的手机号码');
        }else if(this.message ==''){
          return this.alertMessage('请输入收货地址或者兑换平台的账号');
        }
        if( this.clickBtn==1) return;
          this.isClicked = true;
          this.clickBtn = 1;
         let parmas = {
            contactName:this.userName,
            contactPhone:this.phoneNum,
            address:this.message,
            goodId:this.goodsInfo.goodsId,
            purchaseQuantity:this.goodsInfo.num
         };
          const res = await http.post(api.createOrderInfo,parmas)
          if(res && res.data && res.data.success){
            
             this.currentIntegral =res.data.respObj.currentIntegral;
              window.localStorage.setItem('currentIntegral', JSON.stringify(res.data.respObj.currentIntegral)); 

          }else{
            var message='兑换失败';
            if(res.data && res.data.errorMsg){
              var message = res.data.errorMsg;
            }
            this.alertMessage(message);
            if(res.data ){
              alert(JSON.stringify(res.data))
            }
            this.isClicked = false;
            this.clickBtn=0;
          }
      },
      changeName(){
        this.userName = this.userName.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig,'');
      },
      changeText(){
     
       this.message = this.message.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig,'');
         if( this.message.length>220){
            this.message = this.message.substr(0,220);
            this.alertMessage('备注最多220个字符');

          }
      },
      alertMessage(message){
          Toast({
              message: message,
              position: 'top',
              duration: 1500,
              className:'toTop'
            });
      },
      checkNum(){
         var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/; 
         if(this.phoneNum!=''&&!myreg.test(this.phoneNum)){
          return this.alertMessage('请输入正确的手机号码');
        }
      }
    },  
    watch: {
        userName(val,oldval){
          if(val.length>15){
           this.userName = val.substr(0,15);
           this.alertMessage('收件人姓名最多15个字符');
          }
        },
        phoneNum(val,oldval){
          if(val.length>11){
            this.phoneNum =  this.phoneNum.substr(0,11);
          }
        },
      },
  }
</script>
