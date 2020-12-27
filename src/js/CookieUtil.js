//**end

let CookieUtil = {
	sessionkey: 'sessionkey',
	set: function(name, value) {
		return this.setCookie(name, value)
	},
	get: function(name) {
		return this.getCookie(name)
	},
	delete: function(name) {
		return this.delCookie(name)
	},
	clear: function() {
		return this.clearCookie()
	},
	getBrowserIdentify: function() {
		return this.cans()
	},
	setCookie: function(name, value) {
		if (value) {
			var Days = 365
			var exp = new Date()
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
			document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
		}
	},

	getCookie: function(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	//清除指定cookie值
	delCookie: function(name) {
		var exp = new Date()
		exp.setTime(exp.getTime() - 1)
		var cval = this.setCookie(name)
		if (cval && cval != null) {
			document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
		}
	},
	//清除全部cookie值
	clearCookie: function() {
		var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
		if (keys) {
			for (var i = keys.length; i--;) {
				document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
			}
		}
	},

	//**用户获取唯一值
	cans: function() {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var txt = 'http://security.tencent.com/';
		ctx.textBaseline = "top";
		ctx.font = "14px 'Arial'";
		ctx.textBaseline = "tencent";
		ctx.fillStyle = "#f60";
		ctx.fillRect(125, 1, 62, 20);
		ctx.fillStyle = "#069";
		ctx.fillText(txt, 2, 15);
		ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
		ctx.fillText(txt, 4, 17);

		var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
		var bin = atob(b64);
		var crc = this.bin2hex(bin.slice(-16, -12));
		//var crc = bin.slice(-16,-12);
		return crc;
	},

	bin2hex: function(str) {
		var result = "";
		for (var i = 0; i < str.length; i++) {
			result += this.int16_to_hex(str.charCodeAt(i));
		}
		return result;
	},

	int16_to_hex: function(i) {
		var result = i.toString(16);
		var j = 0;
		while (j + result.length < 4) {
			result = "0" + result;
			j++;
		}
		return result;
	}
} 

export default CookieUtil
