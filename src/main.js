
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueResource from 'vue-resource'
import MintUi from 'mint-ui';
import 'vue-ydui/dist/ydui.rem.css';
import 'mint-ui/lib/style.css';
import'../src/assets/scss/my.scss'
import VueWechatTitle from 'vue-wechat-title';

import'../src/assets/scss/homeAndPrize.scss';

  import http from './utils/axios'
  import api from './utils/api'
import { InfiniteScroll,Toast } from 'mint-ui';
Vue.use(InfiniteScroll);
Vue.use(VueWechatTitle);
Vue.use(MintUi);
Vue.use(VueResource)
Vue.config.productionTip = false



new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data(){
  	return{
  		sharePram : {
          'title' : '魔法现金',
          'desc' : '邀请好友得积分！',
          'link' : 'http://www.vr2060.com/mcmp/scoreMall/?poster',
          'img':'http://aldb-market.oss-cn-shanghai.aliyuncs.com/scoremall-test/share.jpg'
        },
  	}
  },
  mounted(){
    var u = navigator.userAgent;
    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; 
    var url =document.URL;
    if(url.indexOf('?poster')>0){
      var index = url.indexOf('?poster?');
      var last = url.indexOf('shareImg')
      var imgUrl= url.substring(index+8,last);
      this.$router.push({path:'/poster',query:{imgUrl:imgUrl}});
    }else{
       setTimeout(()=>{
           this.initImg();
          this.getShareReady();
      },2000);

      
    }
   
  },
  methods:{
      initImg: async function (){
        var that = this;
        var posterUrl = '';
        let parmas = {
          type:0
        };
       const res = await http.get(api.getPoster,parmas)
       if(res.data && res.data.success){
           this.sharePram.link = this.sharePram.link +'?'+res.data.respObj+'shareImg';
           let parmas = {
              type:1
            };
           const ret= await http.get(api.getPoster,parmas)
           if(ret.data.success){
              window.localStorage.clear();
              posterUrl = ret.data.respObj;
              window.localStorage.setItem('individualCode', JSON.stringify(posterUrl));
           }
       }
      },
  	getShareReady: async function(){
        let parms = {
          url:window.location.href
        }
        const res = await http.get(api.getJsapiTicket,parms)
        if(res.data.success){
          var myself=this;
            var wxConfig=res.data.respObj;
            wx.config({
               //debug: true,
                appId: wxConfig.appId,
                timestamp: wxConfig.timestamp,
                nonceStr: wxConfig.nonceStr,
                signature: wxConfig.signature,
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo']
            });
            wx.ready(function () {
             wx.onMenuShareAppMessage({
                title: myself.sharePram.title,
                link:  myself.sharePram.link,
                desc:  myself.sharePram.desc,
                imgUrl:  myself.sharePram.img,
                success: function () {
                  if(!myself.isAndroid){
                    myself.alertMessage('分享成功');
                  }
                },
                cancel: function () {
                  myself.alertMessage('取消了分享');
                }
              });
              wx.onMenuShareTimeline({
                title: myself.sharePram.title,
                link:  myself.sharePram.link,
                desc:  myself.sharePram.desc,
                imgUrl:  myself.sharePram.img,
                success: function () {
                  if(!myself.isAndroid){
                    myself.alertMessage('分享成功');
                  }
                	myself.shareLink();
                },
                cancel: function () {
                  myself.alertMessage('取消了分享');
                }
              });
              wx.onMenuShareQQ({
		          title: myself.share.title,
		          link: myself.share.link,
		          imgUrl: myself.share.img,
		          success: function () {
                 if(!myself.isAndroid){
                    myself.alertMessage('分享成功');
                  }
		          },
		          cancel: function () {
		            myself.alertMessage('取消了分享');
		          }
		        });
		        wx.onMenuShareWeibo({
		          title: myself.share.title,
		          link: myself.share.link,
		          imgUrl: myself.share.img,
		          success: function () {
                 if(!myself.isAndroid){
                    myself.alertMessage('分享成功');
                  }
		          },
		          cancel: function () {
		            myself.alertMessage('取消了分享');
		          }
		        });
            });

          wx.error(function(res) {
             
          });
        }

      },
      alertMessage(message){
          Toast({
              message: message,
              position: 'center',
              duration: 1000
            });
     },
      shareLink: async function(){
        	const res = await http.get(api.shareCircle)
        	if(res.data.success){
        		 if(!myself.isAndroid){
                this.alertMessage('分享成功');
              }
        	}
        }
  }
})
