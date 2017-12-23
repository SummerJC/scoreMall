'use strict'

import axios from 'axios'
import qs from 'qs'

axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  //  
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    // alert(JSON.stringify(res));
  }
  // if (res.data && (!res.data.success)) {
  //   alert(res.data.error_msg)
  // }
  if(res.data && res.data.errorCode &&res.data.errorCode=='401'){
   
    var url ='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa1f3bbdbc2634bda&redirect_uri=http%3A%2F%2Fwww.vr2060.com%2Fmcmp%2Fscoremall-mp%2Fredirect%2Findex&response_type=code&scope=snsapi_base&state=#wechat_redirect';
    var num = JSON.parse(window.localStorage.getItem('noPrivilege'))||1;
    if(num && num<6){
      window.localStorage.setItem('noPrivilege',JSON.stringify(num));
      window.location.href = url;
    }
    return;

  }
  return res
}

export default {
  post (url, data) {
    return axios({
      method: 'post',
      //baseURL: 'http://visitor.77pay.com.cn',
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      //baseURL: 'https://cnodejs.org/api/v1',
      url,
      data: {},
      params, // get 请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
