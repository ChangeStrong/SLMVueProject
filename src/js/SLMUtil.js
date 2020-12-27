import HttpUtil from "./HttpUtil.js"

//调用方法 SLMUtil.getClientHeight()
let SLMUtil = {
	//取窗口可视范围的高度
	getClientHeight: function() {
		var clientHeight = 0;
		if (document.body.clientHeight && document.documentElement.clientHeight) {
			var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight :
				document.documentElement.clientHeight;
		} else {
			var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight :
				document.documentElement.clientHeight;
		}
		return clientHeight;
	},
	// #得到url中的变量
	getUrlVariable: function(variable) {
		let url = window.location.href;
		//console.log("当前url:"+url)
		let wenIndex = url.lastIndexOf('?')
		let query = url.substring(wenIndex + 1)
		var vars = query.split("&");
		console.log('vars:' + vars);
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			console.log('拆分pair:' + pair);
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return (false);
	},
	getQueryVariable: function(variable) { //202006 暂时不知道谁在用 保留
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		console.log('vars:' + vars);
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			console.log('拆分pair:' + pair);
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return (false);
	},
	includeHTML: function() {
		var z, i, elmnt, file, xhttp;
		/*loop through a collection of all HTML elements:*/
		z = document.getElementsByTagName("*");
		for (i = 0; i < z.length; i++) {
			elmnt = z[i];
			/*search for elements with a certain atrribute:*/
			file = elmnt.getAttribute("w3-include-html");
			if (file) {
				/*make an HTTP request using the attribute value as the file name:*/
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4) {
						if (this.status == 200) {
							elmnt.innerHTML = this.responseText;
						}
						if (this.status == 404) {
							elmnt.innerHTML = "Page not found.";
						}
						/*remove the attribute, and call this function once more:*/
						elmnt.removeAttribute("w3-include-html");
						includeHTML();
					}
				}
				xhttp.open("GET", file, true);
				xhttp.send();
				/*exit the function:*/
				return;
			}
		}
	},
	getRootPath: function() {
		var strFullPath = window.document.location.href;
		var strPath = window.document.location.pathname;
		var pos = strFullPath.indexOf(strPath);
		var prePath = strFullPath.substring(0, pos);
		var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
		if (HttpUtil.isProduct == 1) {//生产环境
			return prePath;
		}
		return (prePath + postPath);
	},
	compare: function(objA, objB) { //判断两个对象是否相等
		if (!this.isObj(objA) || !this.isObj(objB)) return false; //判断类型是否正确
		if (this.getLength(objA) != this.getLength(objB)) return false; //判断长度是否一致
		return this.compareObj(objA, objB, true); //默认为true
	},
	compareObj: function(objA, objB, flag) {
		for (var key in objA) {
			if (!flag) //跳出整个循环
				break;
			if (!objB.hasOwnProperty(key)) {
				flag = false;
				break;
			}
			if (!this.isArray(objA[key])) { //子级不是数组时,比较属性值
				if (objB[key] != objA[key]) {
					flag = false;
					break;
				}
			} else {
				if (!this.isArray(objB[key])) {
					flag = false;
					break;
				}
				var oA = objA[key],
					oB = objB[key];
				if (oA.length != oB.length) {
					flag = false;
					break;
				}
				for (var k in oA) {
					if (!flag) //这里跳出循环是为了不让递归继续
						break;
					flag = CompareObj(oA[k], oB[k], flag);
				}
			}
		}
		return flag;
	},
	isObj: function(object) {
		return object && typeof(object) == 'object' && Object.prototype.toString.call(object).toLowerCase() ==
			"[object object]";
	},
	isArray: function(object) {
		return object && typeof(object) == 'object' && object.constructor == Array;
	},
	getLength: function(object) {
		var count = 0;
		for (var i in object) count++;
		return count;
	},
	/**
	 * 将给定源json的属性值复制到目标json中
	 * @param source 资源提供者
	 * @param target 目标接收者
	 * @param isOverwrite 提供者为空时是否覆盖
	 * @param isConvert 是否根据接受者类型提供字符串与数字的互相转换(只针对整数)
	 */
	copyProperties: function(source, target, isOverwrite, isConvert) {
		if (source == null) {
			return null;
		}
		if (target == null) {
			var newObject = JSON.parse(JSON.stringify(source));
			target = newObject
			console.log("target为空已赋值")
			return target;
		}


		for (let key in source) {
			if (isOverwrite ? target[key] != null : target[key] != null && source[key] != null && source[key] != "" && source[
					key] != undefined) {
				target[key] = isConvert ?
					typeof(target[key]) == "number" && typeof(source[key]) == "string" && source[key].indexOf(".") == -1 ? parseInt(
						source[key]) :
					typeof(target[key]) == "string" && typeof(source[key]) == "number" ? source[key].toString() : source[key] :
					source[key];
			}
		}
		return target;
	}
}

export default SLMUtil
