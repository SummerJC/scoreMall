var Constant = {
	"SHORT_URL" : 'https://mp.aladingbank.com',
	"API_ROOT_URL": "https://api.aladingbank.com",
	"USERAPI_CONTEXT_PATH": "",
	"CASHAPI_CONTEXT_PATH": "",
	"MAKAPI_CONTEXT_PATH": "",
	"X_ALADING_CLIENTID": "1226fbcd-9f04-456e-8caf-279b6f675ceb",
	"ActId":"26"
};
function randomUUID (){
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1)
		}
		s[14] = "4";
		s[19] = hexDigits.substr((s[19] & 3) | 8, 1);
		s[8] = s[13] = s[18] = s[23] = "-";
		var uuid = s.join("");
		return uuid;
	};
var obj = {
	getId :function(callback){
		var data="";
		var d1 = new Date();
	    var fp = new Fingerprintid();
	    fp.get(function(result) {
	      var d2 = new Date();
	      var timeString = "Time took to calculate the fingerprint: " + (d2 - d1) + "ms";
	      if(typeof window.console !== "undefined") {
	        console.log(timeString);
	        console.log(result);
	      }
	      callback && callback(result)
	     
	    });
	},
	getCookie : function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			var v = unescape(arr[2]);
			return v.substring(0,v.length-6);
		}else{
			return null;
		}
	},
	setCookie : function(key,value){
		value = value + this.ramdom();
		var expire = new Date();
		expire.setTime(expire.getTime()+24*60*60*1000*365*99);
		var cookie = ""; 
		if(key != null && value != null) 
		cookie = cookie + key + "=" + value + ";"; 
		cookie = cookie + "expires=" + expire.toGMTString() + ";";
		cookie = cookie + "path="+"/";
		document.cookie = cookie; 
	},
	Ajax:function (){  
	    var xmlhttprequest;  
	    if(window.XMLHttpRequest){  
	        xmlhttprequest=new XMLHttpRequest();  
	        if(xmlhttprequest.overrideMimeType){  
	            xmlhttprequest.overrideMimeType("charset=utf-8");  
	        }  
	    }else if(window.ActiveXObject){  
	        var activeName=["MSXML2.XMLHTTP","Microsoft.XMLHTTP"];  
	        for(var i=0;i<activeName.length;i++){  
	            try{  
	                xmlhttprequest=new ActiveXObject(activeName[i]);  
	                break;  
	            }catch(e){  
	                         
	            }  
	        }  
	    }  
	      
	    if(xmlhttprequest == undefined || xmlhttprequest == null){  
	        alert("XMLHttpRequest对象创建失败！！");  
	    }else{  
	        this.xmlhttp=xmlhttprequest;  
	    }  
	      
	    //用户发送请求的方法  
	    obj.Ajax.prototype.send=function(data){
	    	//防重复
	    	var method=data.type.toUpperCase(),
	        		url = data.url,
	        		params = data.data,
	        		success = data.success,
	        		error = data.error,
	        		complete = data.complete;
	        if(this.xmlhttp!=undefined && this.xmlhttp!=null){
	            if(method!="GET" && method!="POST"){
	            	alert("ajax type can not empty");
	                return;  
	            }  
	            if(url==null || url==undefined){
	            	alert("ajax url can not empty");
	                return ;  
	            }  
	            var tempxmlhttp=this.xmlhttp;  
	            this.xmlhttp.onreadystatechange=function(){
	                if(tempxmlhttp.readyState==4){ 
	                    if(tempxmlhttp.status==200){  
	                        var response=JSON.parse(tempxmlhttp.response);  
	                        if(success==undefined || success==null){  
	                        }else{  
	                            success(response,tempxmlhttp);  
	                        }  
	                    }else{  
	                        if(error==undefined ||error==null){  
	                        }else{  
	                            error(tempxmlhttp,tempxmlhttp.status,tempxmlhttp.statusText);  
	                        }  
	                    } 
	                    if(complete)complete(tempxmlhttp);
	                }
	                
	            }   
	            this.xmlhttp.open(method,url,true);
	              
	            //如果是POST方式，需要设置请求头  
	            if(method=="POST"){  
	                this.xmlhttp.setRequestHeader("Content-type","application/json");  
	            }
	            if(data.headers){
	            	for (var key in data.headers){
	            		this.xmlhttp.setRequestHeader(key,data.headers[key]);
				    }
	            }
	            this.xmlhttp.send(JSON.stringify(params));
				var that = this;
	            setTimeout(function(){
					if(complete)complete(tempxmlhttp);
	            	that.abort();
	            },30000)
	    }else{  
	        alert("XMLHttpRequest对象创建失败，无法发送数据！");  
	    }  
	    obj.Ajax.prototype.abort=function(){  
	        this.xmlhttp.abort();  
	    }
	  }  
	},
	isEmpty :function(v, allowBlank){
		return v === null || v === undefined
				|| String(v).toUpperCase() === 'NULL'
				|| ((Array.isArray(v) && !v.length))
				|| (!allowBlank ? v === '' : false);
	},
	ramdom : function(){
		var a = randomUUID();
		return a.substr(0,6)+"";
	},
	resetDeviceToken : function(){
		obj.setCookie("deviceToken","");
		devReg();
	},
	devReg : function(callback){
		var carrierInfo = navigator.userAgent;
		var weChatVersion = "";
		var phoneBrand = "";
		if (carrierInfo.indexOf("Android") != -1) {
			phoneBrand = "Android";
			var arr = carrierInfo.split(";");
			for(var i = 0 ; i < arr.length;i++){
				if(arr[i].indexOf("Android") > 0){
					weChatVersion = arr[i].split("Android ")[1];
				}
			}
		}
		if (carrierInfo.indexOf("iPhone") != -1) {
			phoneBrand = "iPhone";
			var arr = carrierInfo.split(" ");
			weChatVersion = arr[5];
		}
		var param = {
			"androidSerial" : "",
			"installId" :randomUUID(),
			"macAddress" : "",
			"operatSystemType" : 10,
			"operatSystemVersion" : weChatVersion,
			"phoneBrand" : phoneBrand,
			"phoneSerial" : "",
			"terminalType" : 30,
			"thirdRiskCoId" : ""
		};
		var ajax = new obj.Ajax();
		ajax.send({
			type : "POST",
			contentType : "application/json",
			headers : {"x-alading-clientid" : Constant.X_ALADING_CLIENTID},
			url : Constant.API_ROOT_URL + Constant.USERAPI_CONTEXT_PATH + "/member/terminal",
			data : param,
			dataType : "json",
			success : function(res,xhr){
				if (res.resp == true && res.errCode == null) {
					var appDeviceToken = xhr.getResponseHeader("x-alading-token");
					callback && callback(appDeviceToken);
				}
			},
			error : function(xhr, status, error){
				callback('error');
			}
		});
	}
};
// obj.devReg();
export default function output( ){
       return obj;
    }
// export default {
//     customData: function(){
//         return obj
//     }
// }
	