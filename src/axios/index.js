import Vue from 'vue'
import router from '../router/index'
import axios from 'axios'
import tool from './tool'
import QS from 'qs'
import store from '@/store';
import nprogress from 'nprogress'
import jsonLong from 'json-bigint'
import config from '@/config'
import errorCode from './error'

axios.defaults.transformResponse = function (data) {
  return jsonLong.parse(data)
}
axios.interceptors.request.use(config => {
  return config
}, error => Promise.reject(error))

axios.interceptors.response.use(response => {

  return response
}, error => {
  setTimeout(_ =>{ nprogress.done(); }, 300)
  Vue.prototype.$message({ showClose: true, message: errorCode[error.response.status], type: 'error' });
})

var checkStatus = response =>{

  if (response.status === 200 || response.status === 304) {
    return response.data
  }
  setTimeout(_ =>{ nprogress.done(); }, 300)
  Vue.prototype.$message({ showClose: true, message: '服务器错误,错误状态码为:' + response.status, type: 'error' });
  return {
    status: true,
    code: response.status,
    message: response.statusText,
    data: response.statusText,
  }
},
checkCode = res =>{
  if(res.status){
    return res
  }
  if(res.code === 10102){
    // Vue.prototype.$message({ showClose: true, message: '登录已过期,请重新登录', type: 'error' });
    tool.removeLocalStorage('userInfo');
    router.push({ path: '/login' })
  } else if (res.code !== 0) {
    Vue.prototype.$message({ showClose: true, message: res.message, type: 'error' });
  }
  setTimeout(_ =>{ nprogress.done(); }, 300)
  return res
},
post = (url, data, isLoading = true) =>{
  var user_info = tool.getLocalStorage('userInfo') || { token: '' };
  /* appCode: 应用代码 全局 */
  data = { appCode: config.appCode,...data,   }
  isLoading && nprogress.start()
  return axios({
    method: 'post',
    url: `${config.host}${url}?token=${user_info.token}`,
    data,
    timeout: 30000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    }
  }).then(checkStatus).then(checkCode)
},
post2 = (url, data, isShowLoading) =>{
  !(data instanceof FormData) && (data = QS.stringify(data))
  return axios({
    method: 'post',
    url: `${config.host}${url}`,
    data,
    timeout: 30000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(checkStatus).then(checkCode)
},
post3 = (url, data, isShowLoading) => {
  var user_info = tool.getLocalStorage('userInfo') || { token: '' };
  !(data instanceof FormData) && (data = QS.stringify(data))
  return axios({
    method: 'post',
    url: `${config.host}${url}?token=${user_info.token}`,
    data,
    timeout: 30000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(checkStatus).then(checkCode)
},
get = (url, params) =>{
  return axios({
    method: 'get',
    url,
    params,
    timeout: 30000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(checkStatus).then(checkCode)
};
Vue.prototype.post = post;
Vue.prototype.post2 = post2;
Vue.prototype.post3 = post3;
Vue.prototype.get = get;
//挂载到VUE下
Vue.prototype.$common = Object.assign({}, tool, {
})
