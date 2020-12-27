function frameLoad(iframe) {
	if(!iframe || typeof(iframe) == "undefined") {
		return
	}
	// var iframe = document.getElementById("MyFrameId1");
	console.log("frame:"+iframe)
	try{
						 
		var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
		var bHeight = iframeWin.document.body.scrollHeight;
		var dHeight = iframeWin.document.documentElement.scrollHeight;
		var height = Math.min(bHeight, dHeight);
		iframe.height = height;
		console.log("得到frame高度："+iframe.height);
	}catch (ex){console.log(ex)}
}
//时间字符串转日期
function timeStrToDate(s) {
	console.log("时间字符串转:日期"+s)
	s = s.replace(/-/g,"/");
	var date = new Date(s );
	return date
}

/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//更新某个图片的上传或下载进度imgId:图片id progress:0-100
function updateImageProgress(imgId,progress) {
	var width = $(imgId).width()
	
	
	console.log("图片("+imgId+")宽度width:"+width)
	if(width <= 0) {
		width = 100
	}
	
	if(width > 180) {
		width = 180
	}
	
	if(isNaN(progress)) {
		progress = 100
	}
	
	if(progress < 0) {
		progress = 0
	}
	
	if(progress > 100) {
		progress = 100
	}
	
	console.log("真实比列:"+progress)
	$(imgId).ShadowRing({
		r: width,// 环形外圆半径
		ti: progress,//数值大小，如进度为50%则ti为50 100 自动隐藏
		count: 100,//总数分割份数，默认为100
		offset: 10,//环形厚度
	})
}