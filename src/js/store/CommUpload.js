import HttpUtil from "../HttpUtil.js"
import UserInfoManager from "../UserInfoManager.js"

let uploadArray = [] 

var CommUpload = {
	uploadFile:function(fileName,fileBlob,progress,complete) {
		let that = this
		this.getToken(fileName,function(token){
			if(token) {
				if(progress) {
					progress(10)
				}
				
				console.log("开始上传,获取到token:"+token)
				that.startUploadQinniu(fileName,fileBlob,token,progress,complete)
			}else {
				console.log("error:获取token失败");
				if(progress) {
					progress(100)
				}
			}
		});
	},
	//服务器获取token
	getToken:function(fileName,complete) {
		//let sessionKey = UserInfoManager.getInfo().userExt.sessionKey
		var params = new URLSearchParams();
		params.append('fileKey', fileName);
		console.log("params:"+params);								
		HttpUtil.post('upload/getToken.do', params)
		.then(response => {
			console.log(JSON.stringify(response.data));	    		    
			if (response.data.code == 0) {
				let data = response.data.data;
				let upToken = data.upToken;
				complete(upToken)
			}else {
				complete(null)
			}	    						
		})
		.catch(function(error) {
			console.log(error);
			complete(null)
		});	
	},
	//刷新cdn缓存,暂时不做了token生成貌似有点麻烦,详情访问下面:
	//https://developer.qiniu.com/fusion/api/1229/cache-refresh
	refreshCDN:function(access_token,urls,complete) {
		var params = new URLSearchParams();
		params.append('Authorization', access_token);
		params.append('urls', urls);
		// params.append('dirs', []);
		console.log("params:"+params);
		let headers = {
			"Authorization":access_token
		}
		HttpUtil.httpApi('POST',headers,null,'https://fusion.qiniuapi.com/v2/tune/refresh', params)
		.then(response => {
			console.log("data:"+JSON.stringify(response.data));	    		    
			if (response.data.code == 0) {
				console.log(response.data);
				complete(true)
			}else {
				complete(false)
			}	    						
		})
		.catch(function(error) {
			console.log(error);
			complete(false)
		});	
	},
	//上传七牛
	startUploadQinniu:function(fileName,fileBlob,token,progress,complete) {
		let that = this
		let putExtra = {fname: fileName,//文件原文件名
						params: {}, //用来放置自定义变量
						mimeType: null,//限制文件类型 为null自动判断:image/png", "image/jpeg", "image/gif"
						}
		var config = {
		  useCdnDomain: true,//表示是否使用 cdn 加速域名
		  region: qiniu.region.z2 //选择上传域名区域
		};
		if(!fileBlob || typeof(fileBlob) == "undefined") {
			console.log("error:上传文件不能为空")
			if(complete) {
				complete(null)
			}
			return;
		}
		console.log("七牛上传参数1:fileName:"+fileName+"token:"+token)
		console.log("七牛上传参数2:file:"+fileBlob)
		var observable = qiniu.upload(fileBlob, fileName, token, putExtra, config)
		var observer = {
		  next(res){
			console.log('七牛上传进度'+res.total.percent+"total"+res.total.size+"load"+res.total.loaded)
			console.log(typeof(res.total.percent))
			console.log("总进度1:"+res.total.percent/100.0)
			//拿到token算10%
			let nowP = res.total.percent/100.0 * 90.0 + 10.0
			console.log("总进度:"+nowP)
			if(progress) {
				progress(nowP)
			}
		  },
		  error(err){
		    console.log('上传出错'+err)
			if(progress) {
				progress(100)
			}
			if(complete) {
				complete(null)
			}
		  }, 
		  complete(res){
			  console.log('在七牛云网站上创建的存储空间名称地址'+res)
			console.log('在七牛云网站上创建的存储空间名称地址'+res.key)
			let urls = ["http://qinniu.goddragon.pub/"+res.key]
			// that.refreshCDN(token,urls,function(succes){
				
			// });
			if(progress) {
				progress(100)
			}
			if(complete) {
				complete(res.key)
			}
		  }
		}
		var subscription = observable.subscribe(observer) // 上传开始
		//subscription.unsubscribe() // 上传取消
	},
	addWaterMark:function(key) {//添加水印
	let domain = "qinniu.goddragon.pub"
		let imgLink = qiniu.watermark({
       mode: 1, // 图片水印
       image: 'https://www.goddragon.pub/resources/images/show/logo_watermark.png', // 图片水印的Url，mode = 1 时 **必需**
       dissolve: 50, // 透明度，取值范围1-100，非必需，下同
       gravity: 'SouthEast', // 水印位置,右下角，为以下参数[NorthWest、North、NorthEast、West、Center、East、SouthWest、South、SouthEast]之一
       ws: 0.1,//缩放比列 水印图片自适应原图的短边比例，ws的取值范围为0-1。具体是指水印图片保持原比例，并短边缩放到原图短边＊ws。
	   wst: 2,//水印图片自适应原图的类型，取值0、1、2、3分别表示为自适应原图的短边、长边、宽、高，默认值为0
	   dx: 5.5,  // 横轴边距，单位:像素(px)
       dy: 5.5 // 纵轴边距，单位:像素(px)
   }, key, domain)
   //真实返回结果：qinniu.goddragon.pub/product_chapter_js_2_2_40_0_1.jpg?watermark/1/image/aHR0cHM6Ly93d3cuZ29kZHJhZ29uLnB1Yi9yZXNvdXJjZXMvaW1hZ2VzL3Nob3cvbG9nb193YXRlcm1hcmsucG5n/dissolve/100/gravity/SouthEast/dx/5/dy/5
	let relKey = imgLink.substring(domain.length + 1)
	return relKey
	}
}

export default CommUpload