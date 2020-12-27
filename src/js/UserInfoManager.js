import HttpUtil from "./HttpUtil.js"
import CookieUtil from "./CookieUtil.js"

let isLoginTest = HttpUtil.isProduct == 1? 0:1 //0:为正常模式 1:为强制登录成功
let saveUserKey = HttpUtil.isProduct == 1? "SLM_UserInfo":"SLM_UserInfo_local"

// let testInfo = {"id":85,"sex":2,
// "headUrl":"http://120.79.79.211/img/defaultAdminHead.png",
// "createTime":"2020-02-10 06:24:28:000",
// "username":"John C.L. Apple1",
// "roleId":"4",//3为普通用户
// "userExt":{"id":85,"openid":"001546.a1e79a4d49204457994002596e08e77d.2225","sessionKey":"iOS20200209142427220","expirationTime":"2020-02-11 06:24:28:000","originType":3}
// }

let testInfo = {"id":127,"sex":1,"headUrl":"http://thirdqq.qlogo.cn/g?b=oidb&k=2khicmpaib3JicapTJux3G0vw&s=640&t=1556986460","phone":"13760375870","createTime":"2020年10月01日","username":"道木寒夕",
"userExt":{"id":127,"openid":"BDE4CB794044DA5130996122070795E1","sessionKey":"localSessionKey320201001081914884","expirationTime":"2020-10-02 08:19:15:000","originType":3},"roleId":4,"description":"本人新作九重咒，大家多多支持哈"}

let UserInfoManager = {
	isSupportStorange:function() {
		// 判断浏览器是否支持
		if (typeof(Storage) !== "undefined") {
			return true
		} else {
			console.log("Sorry, your browser does not support Web Storage...")
			return false
		}
	},
	isLogined:function() {// 判断是否登录
		if(this.getInfo()){
			return true;
		}else {
			return false;
		}
	},
	save:function(dict) {
		if(!this.isSupportStorange) {
			return;
		}
		var storage = window.localStorage;
		let jsonStr = JSON.stringify(dict)
		storage.setItem(saveUserKey,jsonStr);
		//兼容,防止有些浏览器无法保存
		CookieUtil.set(saveUserKey,jsonStr)
		//console.log("保存用户信息:"+jsonStr)
	},
	getInfo:function() {//获取用户信息
		if(isLoginTest == 1) {
			return testInfo
		}
	
		var jsonStr = ""
		if(!this.isSupportStorange) {
			jsonStr = CookieUtil.get(saveUserKey)
		}else {
			var storage = window.localStorage;
			jsonStr = storage.getItem(saveUserKey)
			if(jsonStr == 'undefined' || jsonStr == null || jsonStr == "") {
				jsonStr = CookieUtil.get(saveUserKey)
			}
		}
		var storage = window.localStorage;
		
		if(jsonStr == 'undefined' || jsonStr == null || jsonStr == "") {
			//console.log("warn:用户信息未获取到...")
			return null;
		}else {
			console.log("已获取本地用户信息,jsonStr信息:"+jsonStr)
			let infoDict =JSON.parse(jsonStr);
			return infoDict;
		}
		
	},
	removeInfo:function() {
		if(!this.isSupportStorange) {
			return;
		}
		var storage = window.localStorage;
		storage.removeItem(saveUserKey);
		CookieUtil.delete(saveUserKey);
		console.log("已removeInfo:")
	}
}

export default UserInfoManager