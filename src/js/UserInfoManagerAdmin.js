import HttpUtil from "./HttpUtil.js"

let isLoginTest = 0 //0:为正常模式 1:为强制登录成功
let saveUserKey = HttpUtil.isProduct == 1? "SLM_UserInfo_admin":"SLM_UserInfo_local_admin"

let testInfo = {"id":85,"sex":2,
"headUrl":"http://120.79.79.211/img/defaultAdminHead.png",
"createTime":"2020-02-10 06:24:28:000",
"username":"John C.L. Apple1",
"roleId":"4",//3为普通用户
"userExt":{"id":85,"openid":"001546.a1e79a4d49204457994002596e08e77d.2225","sessionKey":"iOS20200209142427220","expirationTime":"2020-02-11 06:24:28:000","originType":3}
}

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
		storage.setItem(saveUserKey,JSON.stringify(dict));
		//console.log("保存用户信息:"+JSON.stringify(dict))
	},
	getInfo:function() {//获取用户信息
		if(isLoginTest == 1) {
			return testInfo
		}
	
		if(!this.isSupportStorange) {
			return null;
		}
		var storage = window.localStorage;
		let jsonStr = storage.getItem(saveUserKey)
		
		if(jsonStr == 'undefined') {
			//console.log("warn:用户信息未获取到...")
			return null;
		}else {
			console.log("已获取用户信息,jsonStr信息:"+jsonStr)
			let infoDict =JSON.parse(storage.getItem(saveUserKey));
			// console.log('用户信息:'+infoDict)
			return infoDict;
		}
		
	},
	removeInfo:function() {
		if(!this.isSupportStorange) {
			return;
		}
		var storage = window.localStorage;
		storage.removeItem(saveUserKey);
		console.log("已removeInfo:")
	}
}

export default UserInfoManager