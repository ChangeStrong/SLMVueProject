import axios from 'axios'

// 配置项目根如路径
var URLRoot = 'http://120.79.79.211/'
 let isProduct = 1
 function getBaseUrl(){
	 if(isProduct !=1){
		 return 'http://127.0.0.1:8888/Comic/'
	 }
	 return 'http://120.79.79.211/'
 }
 
 function getWebsocketBaseUrl (){
	 if(isProduct != 1){
		 return 'ws://localhost:8888/Comic/websocket/';
	 }
	 //wss://www.feifeicenter.club:443/websocket/
	 return 'ws://120.79.79.211:80/websocket/';
 }
 
// axios请求
function httpApi (method, url, params) {
	console.log('外部url'+url);
	let rooturl = getBaseUrl()
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: rooturl,
      withCredentials: false
    }).then(
      (response) => {
        resolve(response)
      }
    ).catch(
      (error) => {
        reject(error)
      }
    )
  })
}
 
// 返回在vue模板中的调用接口
var HTTPUtil = {
  get: function (url, params) {
    return httpApi('GET', url, params)
  },
  post: function (url, params) {
    return httpApi('POST', url, params)
  },
  put: function (url, params) {
    return httpApi('PUT', url, params)
  },
  delete: function (url, params) {
    return httpApi('DELETE', url, params)
  },
	websocketBaseUrl: function (){
		return getWebsocketBaseUrl()
	},
}

export default HTTPUtil