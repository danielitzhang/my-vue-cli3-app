import axios from 'axios'
import router from '../router.js'
import Vue from 'vue'
// import store from '../store.js'
// import qs from 'qs'
import { Toast } from 'vant'
// http request 拦截器
const domain='https://api.demo.lumous.cn';
// const domain='https://lmapi.jj-inn.com';
// const domain='http://127.0.0.1:8887';
// const domain='http://192.168.31.246:8887';
// const domain='http://192.168.31.6:8801';
// const domain='https://apiv1.ailumous.com';
Vue.prototype.$domain = domain;
Vue.prototype.$picMaxScale=2;//图片资源最大2M
axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type':'application/json',
    };
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // loadingInstance.close();
    Toast.clear();
    if(response.data.resultCode == 100) {
      return response.data;
    } else {
      Toast.fail(response.data.resultMessage);
      if(response.data.resultCode==401){
        localStorage.removeItem('token');
        router.push({path:'/'})
      }
      return Promise.reject(response)
    }
  },
  error => {
    return Promise.reject(error)
  });

//post方法,post方法返回一个promise对象，
export function post(url, data = {},loading=true) {
  return new Promise((resolve, reject) => {
    //默认post是带有token
    if(localStorage.getItem('token')){
      data.token=localStorage.getItem('token');
    }
    url=domain+url;
    if(loading){
      Toast.loading({
        text: '正在努力加载中',
        mask:true
      });
    }
    axios.post(url, data)
      .then(response => {
        if(response){
          resolve(response);
        }
      }, err => {
        reject(err);
      })
  })
}

//get方法,get方法返回一个promise对象，
export function get(url, data = {},loading=true) {
  return new Promise((resolve, reject) => {
    //默认get是带有token
    if(localStorage.getItem('token')){
      data.token=localStorage.getItem('token');
    }
    url=domain+url;
    if(loading){
      Toast.loading({
        text: '正在努力加载中',
        mask:true
      });
    }
    axios.get(url, {params:data})
      .then(response => {
        if(response){
          resolve(response);
        }
      }, err => {
        reject(err);
      })
  })
}

export default axios;