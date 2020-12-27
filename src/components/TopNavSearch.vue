<template>
	<div class="tn-wrap" id="topNavigationId">
		<div class="tn-title" id="tn-title">
			<router-link class="icon_img" :to="{ path: '/'}"></router-link>
			<router-link class="word_img" :to="{ path: '/'}">
				<img src="../resources/images/show/logo.png"
					 width="150" />
			</router-link>
		</div>
	
		<div class="tn-input">
			<div class="mod-search-input-wr ui-left">
				<label v-if="searchKeyWord.length == 0 && isblur" class="mod-search-label" id="mod-search-label" style="display: block;">请输入作品名称</label>
				<input class="mod-search-input ac_input" type="text" id="top-search-input" value="" autocomplete="off" v-model="searchKeyWord">
				<div class="ac_results" id="ac_results">
					<ul id="ac_results_ul">
						<li v-for="item in searchResults">
							<router-link :to="{ path: '/WorkDetail', query: { productId: item.id }}">{{item.name}}</router-link>
							</li>
						</li>
					</ul>
				</div>
			</div>
			<button class="mod-search-submit ui-left ui-text-hide" type="submit" v-on:click="clickToSearch()">搜索</button>
		</div>
		<div class="user">
			<div class="logined" v-if="isLogined">
				<button v-on:click="lookUserInfo" @mouseenter="hoverUserButton(1)" @mousedown="hoverUserButton(2)" @mouseleave="hoverUserButton(0)">
					<img class="head_img" :src="headImgUrl" width="40px" height="40px">
				</button>
				<div id="showSelectedListID" class="showSelectedList" style="display: none;" @mouseenter="hoverUserButton(1)"
				 @mouseleave="hoverUserButton(0)">
					<div class="slcontent">
						<ul>
							<li><a href="${pageContext.request.contextPath}/views/User/User.html" target="_blank">我是读者</a></li>
							<li><a href="${pageContext.request.contextPath}/views/User/author.html" target="_blank">我是作者</a></li>
							<li><a href="javascript:;" v-on:click="clickToDreamChat">我要许愿</a></li>
							<li><a href="javascript:;" v-on:click="loginOut">退出登录</a></li>
						</ul>
					</div>
	
				</div>
			</div>
			<div class="login" v-else>
				<button v-on:click="showLoginView">登录</button>
			</div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	import HttpUtil from '../js/HttpUtil.js'
	import UserInfoManager from "../js/UserInfoManager.js"
	import SLMUtil from '../js/SLMUtil.js'
	import SLMCommUI from "../js/SLMCommUI.js"
	
	var isEnterResult = false;
	export default {
		  data () {
		    return {
				isLogined:false,
				searchResults: [],
				searchKeyWord: this.$route.query.keyword ? this.$route.query.keyword:"",
				isblur: 1,
				headImgUrl:"../resources/images/defaultAdminHead.png",
				isShowHeadListView:false,
		    }
		  },
		  watch: {
					'searchKeyWord': function(newvalue) {
						this.searchKeyWord = newvalue;
						console.log('输入：' + newvalue)
						if (newvalue.length > 0) {
		this.showHidddenResult(true);
							this.searchForKeyWord(newvalue);
						} else {
		this.showHidddenResult(false);
							this.searchResults = []
						}
		
					}
				},
		  mounted () {
			  let that = this
			  $("#showSelectedListID").css({"display":"block"})
			  console.log("判断用户是否登录");
			  if(UserInfoManager.isLogined()) {
				  this.loginSuccess();
			  }
		
		    //获取焦点
			 $("#top-search-input").focus(function() {
			 	that.isblur = false;
			     
			   	if(that.isHaveSearchValue()){
			   		that.showHidddenResult(true);
			   	}
			 });
			 
			//失去焦点
			 $("#top-search-input").blur(function() {
		that.isblur = true;
				 if(!isEnterResult){//没有移动到结果div
					 that.showHidddenResult(false);
				 }
				 
			 });
			 
			 //进入搜索结果的div
			 $("#ac_results").mouseenter(function() {
			 	isEnterResult = true;
			 });
			 
			 $("#ac_results").mouseleave(function() {
			 	isEnterResult = false;
			 	/* 	 showHidddenResult(false); */
			 });
		  },
		methods: {
			clickToDreamChat:function(){//许愿
				window.location.href = "${pageContext.request.contextPath}/views/Chat/DreamChat.html"
				// this.$router.push({
				// 	path: '/CategoryLookMore',
				// 	query: {
				// 		pageNumber: 1,
				// 		keyword: this.searchKeyWord
				// 	}
				// })
			},
			showLoginView:function() {
				let windowWidth = $(window).width();
				let windowHeight = $(window).height();
				console.log("宽高："+windowWidth +'windowHeight:'+windowHeight)
				//$("#loginWrapAlert").css({"width":windowWidth,"height":windowHeight,"display":"flex"})
			},
			lookUserInfo:function() {
				if (SLMCommUI.isMobile()){
					console.log("lookUserInfo-"+!this.isShowHeadListView)
					this.showSelectedView(!this.isShowHeadListView)
				}		  
			},
			showSelectedView:function(show) {
				this.isShowHeadListView = show
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
			loginSuccess:function() {
				this.isLogined = UserInfoManager.isLogined();
				console.log("判断用户是否登录完成---"+this.isLogined);
				$("#loginWrapAlert").css({"display":"none"})
				console.log("获取到用户头像："+UserInfoManager.getInfo().headUrl);
				this.headImgUrl = UserInfoManager.getInfo().headUrl;
			},
			loginOut:function() {
				console.log('退出登录。。。。qq2')
				UserInfoManager.removeInfo()
				this.isLogined = false;
			},
			searchForKeyWord: function(keyWork) {
				console.log("开始查询："+keyWork);
				let that = this;
				var params = new URLSearchParams();
				params.append('name', keyWork);
				params.append('pageNumber', '1');
				params.append('pageSize', '10');
				
				HttpUtil.post('product/serch.do', params)
					.then(response => {
						console.log(JSON.stringify(response.data));
						if (response.data.code == 0) {
							let data = response.data.data;
							that.searchResults = data.list;
				
						}
					})
					.catch(function(error) {
						console.log(error);
					});		
					},
			clickToSearch: function() {
				this.$router.push({
					path: '/CategoryLookMore',
					query: {
						pageNumber: 1,
						keyword: this.searchKeyWord
					}
				})
			},
			showHidddenResult:function (isShow) {
				if (isShow) {
					$("#ac_results").show();
				} else {
					$("#ac_results").hide();
				}
			
			},
			isHaveSearchValue:function () {
				var value = $("#top-search-input").val();
				if (value.length > 0) {
					return true;
				}
				return false;
			}
		}
	}
</script>

<style scoped>
	@import "../css/TopNavSearch.css";
	@import "../css/SLMComm.css";
</style>
