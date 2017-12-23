<template>
  <div class="content_Binding">

        <!-- <div class="cell-left">手机号：</div> -->
        <div class="content_BindingPhone"><input type="number" pattern="[0-9]*" placeholder="请输入您的魔法现金注册手机号码" autocomplete="off" v-model="phoneNum" @blur="changeNum"/></div>

     <div class="getcontent_BindingPhone">
        <!-- <div class="cell-left">验证码：</div> -->

         <input type="number" placeholder="请输入短信验证码" autocomplete="off" v-model="code" maxlength='6'/>
          <div  class="getcontent_BindingPhone2">
          <button v-if="btnState =='normal'" type="button" v-on:click="getVcode" >
            <span >获取验证码</span>
          </button>
          <button v-if="btnState =='forbid'" type="button" class="forbidClick">
            <span >获取验证码</span>
          </button>
          <button v-if="btnState =='none'" type="button">
            <span  class="count">{{count}} s  后重新获取</span>
          </button>
        </div>

    </div>
   <div class="getcontent_BindingPhone" v-if='displayVertify'>
        <input  placeholder="请输入图形验证码"  v-model="imgCode" @blur='checkImgCode'/>
        <div v-on:click="" class="getcontent_BindingPhone2">
           <img :src="imgurl" class="vertifyImg" @click='getImgCode'>
        </div>

    </div>
    <div class="New_user">新用户将自动注册,并视为同意<a href="https://cdn.aladingbank.com/help/dealOfRegister.html">《用户注册协议》</a></div>
    <button type="button"  class="new_sure" v-on:click="bindNumber">确定</button>
    <div id="bind_success">绑定成功</div>
    </div>

</template>
<style lang="scss" type="text/css">
  @import '../../assets/scss/rulebinding.scss';
</style>

<script>


import http from '../../utils/axios'
import api from '../../utils/api'
import { Toast } from 'mint-ui'
import output from '../../assets/js/getDeviceId'
export default {
  name:'',
  mounted(){
    this.obj = output();
    this.getDeviceId();
  },
  created() {
      document.title = '绑定手机号'

    },
  data(){
    return {
          btnState: 'normal',
          count: 0,
          timer: null,
          phoneNum:'',
          code:'',
          imgCode:'',
          displayVertify:false,
          imgCode:'',
          verifyIDKey:'',
          setCodeNum:'',
          imgurl:'',
          finger:''
        }
  },
  methods:{
    changeNum(){
      if(this.setCodeNum!='' && this.setCodeNum != this.phoneNum){
          this.displayVertify = false;
          this.code = '';
          this.btnState = 'normal';
          clearInterval(this.timer);
          this.timer = null;
      }
    },
    getDeviceId(){
      var that =this;
       
      that.obj.devReg(function(finger){
        if(finger=='error'){
          that.getDeviceId();
          
        }else{
          that.finger = finger;
        }
      });
    },

    getVcode: async function(){
      var that = this;
      this.preTime = new Date().getTime();
      if(this.phoneNum.trim()==''){
        return this.alertMessage('请输入手机号码！');
      }   
      if(!(/^1[34578]\d{9}$/.test(this.phoneNum))){
         return this.alertMessage('手机号码格式错误，请重新输入！');

      }
      if(!that.finger){
        this.alertMessage('未获取到设备标识，请刷新后重试！');
      }
      this.setCodeNum = this.phoneNum;
      let parmas = {
        mobilePhone:that.phoneNum,
        deviceId:that.finger
      }
      const res = await http.post(api.getVerifiCode,parmas);
      if(res.data.success){
           that.btnState = 'none';
            that.verifyIDKey = res.data.respObj.verifyId;
            if (!that.timer) {
                    that.count = 60;
                    that.show = false;
                    that.timer = setInterval(() => {
                      if (that.count > 0 && that.count <= 60) {
                        that.count--;
                      } else {
                        that.show = true;
                        clearInterval(that.timer);
                        that.timer = null;
                        that.btnState = 'normal';
                      }
                    }, 1000)
                  }
      }else if(res.data.errorCode=="global.system_error"){
        that.alertMessage(res.data.errorMsg);
      }else if(res.data.errorCode=="code-10-times-rejected"){
        that.alertMessage(res.data.errorMsg);
      }else if(res.data.errorCode=="code-3-times-rejected"){
        that.btnState = 'forbid';
        that.displayVertify = true;
        that.getImgCode();
      }else{
        that.alertMessage(res.data.errorMsg);
      } 
    },
    getImgCode: async function(){
      var that = this;
      let parmas = {
        mobilePhone:that.phoneNum
      }
      var xhr = new XMLHttpRequest();
      xhr.responseType = "blob"; //因为后台返回一个图片，所以需要设置响应消息的对象为blob
      xhr.onreadystatechange = function() 
          {
              if(4 === xhr.readyState) 
              {
                  if(200 === xhr.status) 
                  {
                      var blob = this.response; //返回的是一个blob对象
                      var src = window.URL.createObjectURL(blob); //静态方法会创建一个 DOMString
                      console.log(src);
                      that.imgurl = src;
                      //src 就是一个可以显示图片的相对路径。因为window.URL.crateObjectURL(blob)已经进行了转换
                  }
              }
          }
      xhr.open("post", api.getImageCode+"?mobilePhone="+that.phoneNum, true); //默认值是true
      xhr.send();
    },
    checkImgCode: async function(){
      var that = this;
      if(that.imgCode=='') return;
      if(that.imgCode.length<4){
         that.alertMessage('验证码错误，请重新输入！');
      }
      let parmas = {
        mobilePhone:that.phoneNum,
        imageCode:that.imgCode
      }
      const res = await http.post(api.vertifyImgCode,parmas);
      if (res.data.success) {
           that.btnState = 'none';
            that.verifyIDKey = res.data.respObj.verifyId;
            if (!that.timer) {
                that.count = 60;
                that.show = false;
                that.timer = setInterval(() => {
                  if (that.count > 0 && that.count <= 60) {
                    that.count--;
                  } else {
                    that.show = true;
                    clearInterval(that.timer);
                    that.timer = null;
                  }
                }, 1000)
              }
      }else if(!res.data.success){
        that.alertMessage('验证码错误！请重新输入！');
        that.imgCode = '';
      }else if(res.data.errorCode=="global.system_error"){
        that.alertMessage(res.data.errorMsg);
      }else if(res.data.errorCode=="code-10-times-rejected"){
        that.alertMessage(res.data.errorMsg);
      }else{
        that.alertMessage(res.data.errorMsg);
      }
    },
    bindNumber: async function(){
      if(this.phoneNum.trim()==''){
        return this.alertMessage('请输入手机号码！');
      }else if(this.code.trim()==''){
        return this.alertMessage('请输入短信验证码！');
      }else if(this.verifyIDKey==''){
        return this.alertMessage('请获取短信验证码!');
      }
      var that =this;
     let parmas = {
        verifyId:that.verifyIDKey,
        loginName:this.phoneNum,
        verifyCode:this.code
     }
      const res = await http.post(api.bindMagicCash,parmas);
      if(res.data && res.data.success){
        window.localStorage.setItem('customerId', JSON.stringify('isBind')); 
        Toast({
              message: '绑定成功！',
              position: 'center',
              duration: 1000
            });
         window.history.go(-1); 
      }else{
        this.alertMessage(res.data.errorMsg);
      }
      
     
    },
    alertMessage(message){
          Toast({
              message: message,
              position: 'top',
              duration: 2000,
              className:'toTop'
            });
     }
  },
  watch:{
    phoneNum(val,oldval){
          if(val.length>11){
            this.phoneNum =  this.phoneNum.substr(0,11);
          }
        },
    code(val,oldval){
      this.code = this.code.replace(/\D/g,'')
          if(val.length>6){
            this.code =  this.code.substr(0,6);
          }
        },
  }

}
</script>