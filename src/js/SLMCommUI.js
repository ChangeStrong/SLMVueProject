//处理页面布局的常用函数

let SLMCommUI = {
	//是否手机
	isMobile: function() {
		var system = {};
		var p = navigator.platform;
		console.log('当前系统为：' + p);
		// alert(p);
		system.win = p.indexOf("Win") == 0;
		system.mac = p.indexOf("Mac") == 0;
		system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
		if (system.win || system.mac || system.xll) { //如果是电脑
			return false;
		} else { //如果是手机
			return true;
		}
	},

	//根据尺寸判断是否手机
	isPhoneSize: function() {
		let windowWidth = document.documentElement.clientWidth;
		if (windowWidth < 1100) {
			return true;
		} else {
			return false;
		}
	}
}

export default SLMCommUI
