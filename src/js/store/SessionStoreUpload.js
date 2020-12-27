import UserInfoManager from "../UserInfoManager.js"

let sessionStorage = window.sessionStorage
let SessinUploadStore = {
	getSavekey:function() {
		return "UploadProductInfoKey" + UserInfoManager.getInfo().id
	},
	saveProductInfo:function(info) {//保存作品信息
		console.log("保存上传作品信息:"+JSON.stringify(info))
		sessionStorage.setItem(this.getSavekey(), JSON.stringify(info));
	},getProductInfo:function() {//保存作品信息
		var info = sessionStorage.getItem(this.getSavekey());
		if(info) {
			return JSON.parse(info)
		}
		return null;
	},saveProductCoverInfo:function(portrait,landscap) {//保存作品封面
		var info = this.getProductInfo()
		if(info) {
			info.portrait = portrait
			info.landscap = landscap
			this.saveProductInfo(info)
		}else {
			console.log("error:作品信息不存在")
		}
	},
	clearProductInfo:function() {
		sessionStorage.removeItem(this.getSavekey());
	}
}

export default SessinUploadStore