
import UserInfoManager from "./UserInfoManager.js"
import SLMUtil from "./SLMUtil.js"
import HttpUtil from "./HttpUtil.js"
import SLMCommUI from "./SLMCommUI.js"

//注册Vue组件
function regsiterVueComponent() {
	console.log("*****注册组件")
	
	// 登录成功,个人中心顶部导航栏 - 名字不能大写
	Vue.component('login-status', {
		// 声明 属性
		props: ['maincolor'],
		template: '<div class="navigation_user">\
		<div class="unlogin" v-if="!isLogined">\
			<button v-on:click="showLoginView" v-bind:style="{ color: maincolor?maincolor:\'black\'}">登录</button>\
		</div>\
		<div class="logined" v-if="isLogined">\
		   <div class="headwrap">\
		   		<img class="head" width="45px" v-on:click="lookUserInfo" :src="headUrl" @mouseenter="hoverUserButton(1)" @mousedown="hoverUserButton(2)" @mouseleave="hoverUserButton(0)" />\
		   		<div id="showSelectedListID" class="showSelectedList" style="display: none;" @mouseenter="hoverUserButton(1)" @mouseleave="hoverUserButton(0)">\
		   			<div class="slcontent">\
		   				<ul>\
		   					<li><a :href=\'rootPath+"/views/User/User.html"\' target="_blank">我是读者</a></li>\
		   					<li><a :href=\'rootPath+"/views/User/author.html"\' target="_blank">我是作者</a></li>\
		   					<li><a href="javascript:;" v-on:click="clickToDreamChat">我要许愿</a></li>\
		   					<li><a href="javascript:;" v-on:click="loginOut">退出登录</a></li>\
		   				</ul>\
		   			</div>\
		   		</div>\
		   	</div>\
		   <span class="name" v-bind:style="{ color: maincolor?maincolor:\'black\'}">{{username}}</span>\
		</div>\
		</div>',
		data: function() {
			return {
				isLogined:false,
				headUrl: "",
				username:"",
				rootPath:SLMUtil.getRootPath(),
			}
		},
		mounted() {
			this.isLogined = UserInfoManager.isLogined()
			if(this.isLogined) {
				let info = UserInfoManager.getInfo()
				this.username = info.username;
				this.headUrl = info.headUrl;
			}
		},
		methods: {
			showLoginView:function() {//暂时先跳首页去登录
				let url = this.rootPath+"/home"
				window.open(url)
			},
			clickToDreamChat:function(){//许愿
				if (HttpUtil.isProduct == 1) {
					window.location.href = this.rootPath + "/views/Chat/DreamChat.html";
				}else {
					window.location.href= "/Comic/views/Chat/DreamChat.html";
				}
			},
			lookUserInfo:function() {
				if (SLMCommUI.isMobile()){
					this.showSelectedView(!this.isShowHeadListView)
				}		  
			},
			showSelectedView:function(show) {
				console.log("show"+show)
				if(show) {
					$("#showSelectedListID").css({"display":"block"})
				}else {
					$("#showSelectedListID").css({"display":"none"})
				}
			},
			hoverUserButton:function(index) {
				console.log("---鼠标事件:"+index)
				if(index == 1) {//进入
					this.showSelectedView(true)
					// 触发事件
					this.$emit('mouseevent', 1)
				}else if(index == 2) {//点击
				if (SLMCommUI.isMobile()){
					return
				}
					this.showSelectedView(true)
					this.$emit('mouseevent', 2)
				}else {//0 离开
				this.showSelectedView(false)
				this.$emit('mouseevent', 0)
				}
			},
			loginOut:function() {
				console.log('退出登录。。。。qq1')
				//注销登录
				QC.Login.signOut()
				UserInfoManager.removeInfo()
				this.isLogined = false;
				this.$emit('loginout')
				
			},
		},
	});
	
	// 登录成功,个人中心顶部导航栏 - 名字不能大写 
	Vue.component('navigation-user', {
		// 声明 属性
		props: [],
		template: '<div class="navigation_user">\
		<div class="left">\
		<a class="icon_img" :href="rootPath"></a>\
		<a class="word_img" :href="rootPath"></a>\
		</div>\
		<div class="right">\
			<div class="headwrap">\
				<img class="head" width="45px" :src="headUrl" v-on:click="lookUserInfo" @mouseenter="hoverUserButton(1)" @mousedown="hoverUserButton(2)" @mouseleave="hoverUserButton(0)" />\
				<div id="showSelectedListID" class="showSelectedList" style="display: none;" @mouseenter="hoverUserButton(1)" @mouseleave="hoverUserButton(0)">\
					<div class="slcontent">\
						<ul>\
							<li><a :href=\'rootPath+"/views/User/User.html"\' target="_blank">我是读者</a></li>\
							<li><a :href=\'rootPath+"/views/User/author.html"\' target="_blank">我是作者</a></li>\
							<li><a href="javascript:;" v-on:click="clickToDreamChat">我要许愿</a></li>\
							<li><a href="javascript:;" v-on:click="loginOut">退出登录</a></li>\
						</ul>\
					</div>\
				</div>\
			</div>\
		<span class="name">{{username}}</span></div>\
		</div>',
		data: function() {
			return {
				headUrl: "../../resources/images/defaultAdminHead.png",
				username:"",
				rootPath:SLMUtil.getRootPath(),
			}
		},
		mounted() {
			this.isLogined = UserInfoManager.isLogined()
			if(this.isLogined) {
				let info = UserInfoManager.getInfo()
				this.username = info.username;
				this.headUrl = info.headUrl;
			}else {
				top.location = this.rootPath;
			}
			
		},
		methods: {
			clickToDreamChat:function(){//许愿
			console.log("isProduct:"+HttpUtil.isProduct)
			if (HttpUtil.isProduct == 1) {
				window.location.href = this.rootPath + "/views/Chat/DreamChat.html";
			}else {
				window.location.href= "/Comic/views/Chat/DreamChat.html";
			}
			
			},
			lookUserInfo:function() {
				if (SLMCommUI.isMobile()){
					this.showSelectedView(!this.isShowHeadListView)
				}		  
			},
			showSelectedView:function(show) {
				console.log("show"+show)
				if(show) {
					$("#showSelectedListID").css({"display":"block"})
				}else {
					$("#showSelectedListID").css({"display":"none"})
				}
			},
			hoverUserButton:function(index) {
				console.log("---鼠标事件:"+index)
				if(index == 1) {//进入
					this.showSelectedView(true)
				}else if(index == 2) {//点击
				if (SLMCommUI.isMobile()){
					return
				}
					this.showSelectedView(true)
				}else {//0 离开
				this.showSelectedView(false)
				}
			},
			loginOut:function() {
				console.log('退出登录。。。。qq')
				QC.Login.signOut()
				UserInfoManager.removeInfo()
				this.isLogined = false;
				if (HttpUtil.isProduct == 1) {
					window.location.href = this.rootPath;
				}else {
					window.location.href="/Comic/home";
				}
				
			},
		},
	});
	
	//"paginationVo":{"pageSize":100,"pageNo":1,"firstResult":0,"nextPage":1,"prePage":1,"totalCount":1,"totalPage":1,"firstPage":true,"lastPage":true}
	// 注册 - 名字不能大写 分页组件<page v-bind:info="paginationVo" v-on:btnsclick="pageBtnClick" ></page>
	Vue.component('page', {
		// 声明 属性
		props: ['info'],
		template: '<ul :id="getId(info)" class="c_page" v-bind:style="{ display: (isShowPreBtn ||isShowNextBtn)? \'flex\':\'none\'}"><li v-if="isShowPreBtn"><button v-on:click="btnHandler(-1)">上一页</button></li><li v-if="isShowNextBtn" v-bind:class="[isShowNextBtn ? \'preHaveCell\':\'\']"><button v-on:click="btnHandler(-2)" >下一页</button></li></ul>',
		data: function() {
			return {
				counter: 0,
				paginationVo:{},
				isShowPreBtn:false,
				isShowNextBtn:false,
			}
		},
		mounted() {
			console.log("-------mounted:"+JSON.stringify(this.paginationVo));
		},
		methods: {
			getId:function(paginationVo) {
				//console.log("拿到数据this.paginationVo:"+JSON.stringify(this.paginationVo))
				//console.log("拿到数据paginationVo:"+JSON.stringify(paginationVo))
				//console.log("比较结果:"+SLMUtil.compare(this.paginationVo,paginationVo))
				if(!SLMUtil.compare(this.paginationVo,paginationVo)) {
					this.paginationVo = paginationVo;
				}
				//数据改没改变都得更新UI 因为数据改变不会触发mounted
				this.updateUI();
				
				return "pageDefaultId"
			},
			updateUI:function() {
				console.log("更新UI=====")
				if(this.paginationVo.pageNo > 1 && this.paginationVo.pageSize > 0) {
					this.isShowPreBtn = true
				}else {
					this.isShowPreBtn = false
				}
				let nowShowCount = this.paginationVo.pageNo * this.paginationVo.pageSize
				console.log("nowShowCount:"+nowShowCount)
				if(nowShowCount < this.paginationVo.totalCount) {
					this.isShowNextBtn = true
				}else {
					this.isShowNextBtn = false
				}
				console.log("isShowPreBtn:"+this.isShowPreBtn)
				console.log("isShowNextBtn:"+this.isShowNextBtn)
				
				//父frame刷新高度
				this.$nextTick(() => {
					console.log("DOM 更新了,让父frame刷新高度+++++++");
					//注意!!!父组件必须引入SLMComm.js 且父frame实现refreshIframesHeight,详细参考author.html和managerProduct.html页面的写法
					try {
						if(parent) {
							parent.refreshIframesHeight();
						}
					}catch(error){console.log(error)}
				})
			},
			btnHandler: function(index) {
				console.log('index:' + index)
				// 触发事件
				this.$emit('btnsclick', index)

			}
		},
	});

	// 注册
	Vue.component('collectionview', {
		// 声明 props
		props: ['data_array'],
		template: '<ul id="ComCollectionView" class="com_collection_view"><li v-for="(value,index) in data_array" v-bind:style="getCellStyle(index)"><img :width="cellWidth" :height="cellWidth/126*80" :src="value.thumUrl" /></li></ul>',
		data: function() {
			return {
				cellWidth:126,
				cellNum:7,
				maxRowNum:15,
				allwidth:0,
			}
		},
		 // watch: {
		 //     max_row_num: function(newVal,oldVal){
		 //         this.maxRowNum = newVal;  //newVal即是max_row_num
			// 	 console.log("更新最大允许值:"+this.maxRowNum);
				 
		 //     }
		 // },       
		mounted() {
			this.allwidth = $("#ComCollectionView").width()
			console.log('总宽度:' + this.allwidth)
			console.log("最大允许值:"+this.maxRowNum)
			this.updateCellWidth();
		},
		methods: {
			cellForRowHandler: function(value,index) {
				console.log('index:' + index)
				
				let html = this.$emit('cell_for_row_handler',value,index)
				console.log(html)
				// 触发事件
				return "123"
			},
			updateCellWidth: function() { //更新所有cell宽度
				let array = this.getCellFineWidth(this.maxRowNum)
				if (array) {
					let width = array[0]
					let num = array[1]

					this.cellWidth = width
					this.cellNum = num

					console.log('组件***每行个数:' + num + "cell宽度:" + width)
				}else {
					console.log("array***"+array)
				}
			},
			getCellFineWidth: function(num) { //获取cell最适合宽度
				let allwidth = this.allwidth
				if (typeof(allwidth) == "undefined") {
					console.log('组件总宽度未定义啊')
					return;
				}

				let padding = 10 //间距
				let cellW = (allwidth - padding * (num - 1)) / num
				if (cellW >= 126) {
					return [cellW, num]
				} else {
					return this.getCellFineWidth(num - 1)
				}
			},
			getCellStyle: function(index) {
				console.log('组件这是第:index:' + index + '个,余数:' + (index % this.cellNum))
				if (index % this.cellNum == 0) { //每行 第一个
					return {
						width: this.cellWidth + 'px'
					}
				} else {
					return {
						width: this.cellWidth + 'px',
						'margin-left': '10px'
					}
				}
			}
		}
	})
	
	
	// 注册 - 名字不能大写 分页组件
	//<frame-navigation showback="true" showrefresh="true" title="管理作品" showset="true" v-on:editclick="" ></frame-navigation>
	Vue.component('frame-navigation', {
		// 声明 属性
		props: ['showback','showrefresh','title','showset'],
		template: '<div class="frame_top_nav">\
				<div class="left"><button class="back" v-if="toBoolean(showback)" v-on:click="backBtnClick" title="返回上一页"></button><button class="refresh" title="刷新" v-if="toBoolean(showrefresh)" v-on:click="refreshBtnClick"></button></div>\
				<div class="title">{{title}}</div>\
				<div class="right"><button v-if="toBoolean(showset)" v-bind:class="[\'edit_btn\' ,isEdit ? \'edit_btn_cancel\':\'edit_btn_normal\']" v-on:click="editBtnClick"></button></div>\
				</div>',
		data: function() {
			return {
				isEdit: false,
			}
		},
		mounted() {
			console.log("-------mounted:"+JSON.stringify(this.paginationVo));
		},
		methods: {
			toBoolean:function(str) {
				if(str == 'true') {
					return true;
				}
				return false;
			},
			backBtnClick: function() {	
				window.history.go(-1)
			},
			refreshBtnClick: function() {
				window.location.reload()
			},
			editBtnClick: function() {
				this.isEdit = !this.isEdit;
				// 触发事件
				this.$emit('editclick',this.isEdit)
	
			}
		},
	});

}

regsiterVueComponent();
