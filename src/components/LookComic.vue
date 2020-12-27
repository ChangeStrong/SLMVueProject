<template>
	<div id="LCAllVue" class="lc-main-wrap" @mousemove="touchmove">
		<div class="top-nav" v-bind:class="{ 'hiddenDiv': isHiddenTopAndBottomNav }">
			<div class="left">
				<router-link class="logo-top" :to="{ path: '/'}">
					<img src="../resources/images/show/logo_white.png" height="30" />
					</router-link>
				<router-link class="top-nav-title" :to="{ path: '/WorkDetail', query: { productId: productId }}">{{productName}}</router-link>
				<span>>{{chapterName}}</span>
			</div>
			<div class="right">
				<!-- <login-status v-on:mouseevent="loginViewEvent" maincolor="white"></login-status> -->
			</div>
		</div>
		<div class="lc-main-content" @click="clickSpaceArea">
			<section class="comic-pic-list-all">
				<ul class="comic-pic-list" data-cid="10" data-seq="1">
					<li class="comic-pic-item pic-loaded" v-for="purl in pictures">
						<div class="comic-pic-pad" data-width="800" data-height="546"></div>
						<div class="comic-pic-box">
							<img class="comic-pic" :src="purl" @load="imgloadHandle" @error="imgErrorHandle">
						</div>
					</li>
				</ul>
			</section>
			<div class="slm-load-Status" v-if="curLoadIndex < resources.length"><span>加载中...</span></div>
		</div>
		<div class="bottom-nav fix_iphonex" v-bind:class="{ 'hiddenDiv': isHiddenTopAndBottomNav }" v-bind:style="{ height: bottomBarHeight + 'px' }">
			<router-link class="logo-bottom" :to="{ path: '/'}">
				<img src="../resources/images/show/logo_white.png" height="30" />
			</router-link>
			<div class="bottom-nav-right">
				<a class="b-a" v-on:click="clickChptersBtn()">目录</a>
				<a v-on:click="clickNext()" class="b-a" v-bind:class="{ 'b-a-bad': nextChapterId<=0 }">下一话</a>
				<a v-on:click="clickUp()" class="b-a" v-bind:class="{ 'b-a-bad': upChapterId<=0 }">上一话</a>
			</div>
		</div>
		<div id="wdCatalogueList" class="work-catalogue-list" v-bind:class="{ 'hiddenDiv': isHiddenTopAndBottomNav||isHiddenChapter }">

			<ul>
				<li class="more" v-if="!paginationVo.firstPage" @click="preCatalogBtnClick">
					<span>{{isRequesting?"加载中···":"向上加载更多"}}</span>
				</li>
				<li v-for="(value,index) in cataloguelist" :id="value.id == activeChapterId?'activedLi':''">
					<router-link v-bind:class="{ 'active': value.id == activeChapterId }" :to="{ path: '/LookComic', query: {charptId:value.id, productId: productId }}">
					{{ value.name }}
					 </router-link>
				</li>
				<li class="more" v-if="!paginationVo.lastPage" @click="nextCatalOgBtnClick" style="border-bottom: 0px;">
					<span>{{isRequesting?"加载中···":"向下加载更多"}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	import HTTPUtil from '../js/HttpUtil.js'
	import SLMUtil from '../js/SLMUtil.js'

	export default {
		metaInfo() {
			return {
				title: '《' + this.productName + '》' + this.chapterName + '-在线漫画-神龙漫官方网站',
				meta: [{
					name: 'Keywords',
					content: this.productName + '漫画,' + this.productName + '全集,' + this.productName + '漫画全集,神龙漫' + this.productName +
						',' + this.chapterName + ',动漫,漫画,在线漫画阅读,神龙漫官方网站'
				}, {
					name: 'Description',
					content: '《' + this.productName + '》《' + this.chapterName + '》在线阅读，漫画《' + this.productName + '》'
				}]
			}
		},
		data() {
			return {
				productId: 0,
				isHiddenChapter: true,
				isHiddenTopAndBottomNav: false,
				activeChapterId: 0,
				pictures: [],
				resources: [],
				cataloguelist: [],
				nextChapterId: -1,
				upChapterId: -1,
				productName: '',
				chapterName: '',
				curLoadIndex: 0,
				isEnterNavScope: false,
				isEnterLoginView: false, //鼠标是否进入登录按钮视图
				defaultImg: "../resources/images/show/custom.jpg",
				paginationVo: {
					"pageSize": 100,
					"pageNo": 1,
					"firstResult": 0,
					"nextPage": 0,
					"prePage": 0,
					"totalCount": 0,
					"totalPage": 0,
					"firstPage": true,
					"lastPage": true
				}, //目录
				isRequesting: false,
				bottomBarHeight: 50,
			}
		},
		mounted() {
			let productId = this.$route.query.productId;
			// let productId = getQueryVariable('productId');
			this.productId = productId;
			//获取本话所有图片
			let charptId = this.$route.query.charptId;
			// let charptId = getQueryVariable('charptId');
			this.activeChapterId = charptId;

			var params = new URLSearchParams();
			if (productId) {
				params.append('productId', productId);
			}
			if (charptId) {
				params.append('chapterId', charptId);
			}
			params.append('pageNumber', '1');
			params.append('pageSize', '200');

			console.log('请求参数：' + charptId + 'pid:' + productId)
			HTTPUtil.post('product/getChapter.do', params)
				.then(response => {
					// console.log('图片s：' + JSON.stringify(response.data));

					if (response.data.code == 0) {
						let Chapt = response.data.data.Chapter;
						let info = Chapt.episodeVos[0];

						this.resources = info.resources;
						if (this.resources.length > 0) {
							this.curLoadIndex = 0;
							this.pictures.push(this.resources[this.curLoadIndex]);
						}
						this.nextChapterId = Chapt.nextChapterId;
						this.upChapterId = Chapt.upChapterId;
						this.chapterName = Chapt.name;
						console.log('长度：' + this.pictures[0] + '\n');
						this.productName = Chapt.productName;
						document.title = this.productName;
					}
				})
				.catch(function(error) {
					console.log(error);
				});

			let content = document.getElementById("wdCatalogueList")
			content.style.height = window.innerHeight - 140 + "px"
			window.onresize = function() {
				let content = document.getElementById("wdCatalogueList")
				content.style.height = window.innerHeight - 140 + "px"
			}
			console.log('*****监听滚动到底');
			//监听滚动到底
			window.addEventListener('scroll', this.handleScroll, true);
		},
		methods: {
			clickSpaceArea: function(event) {
				this.isHiddenTopAndBottomNav = !this.isHiddenTopAndBottomNav;
				console.log('点击space')
				if (!this.isHiddenTopAndBottomNav) { //用户要求必须显示
					this.isUserMustShowNav = true;
				} else {
					this.isUserMustShowNav = false;
				}

			},
			clickNext: function() {
				if (this.nextChapterId > 0) {
					this.$router.push({
						path: '/LookComic',
						query: {
							charptId: this.nextChapterId,
							productId: this.productId
						}
					})
				}
			},
			clickUp: function() {
				if (this.upChapterId > 0) {
					this.$router.push({
						path: '/LookComic',
						query: {
							charptId: this.upChapterId,
							productId: this.productId
						}
					})
				}
			},
			addChpterRecoder: function() { //添加章节浏览记录
				if (!UserInfoManager.isLogined()) {
					return;
				}
				let sessionKey = UserInfoManager.getInfo().userExt.sessionKey
				var params = new URLSearchParams();
				params.append('productId', this.productId);
				params.append('chpterId', this.activeChapterId);
				params.append('sessionkey', sessionKey);

				if (this.cataloguelist.length > 0) { //已经有目录数据
					return;
				}

				HTTPUtil.post('/click/productAdd.do', params)
					.then(response => {
						console.log(JSON.stringify(response.data));

						if (response.data.code == 0) {
							console.log('添加浏览记录成功****');

						}
					})
					.catch(function(error) {
						console.log(error);
					});

			},
			preCatalogBtnClick: function() { //上一页
				if (this.isRequesting) {
					return
				}
				this.paginationVo.pageNo = this.paginationVo.prePage
				this.requestCatelogList("pre")
			},
			nextCatalOgBtnClick: function() { //下一页
				if (this.isRequesting) {
					return
				}
				this.paginationVo.pageNo = this.paginationVo.nextPage
				this.requestCatelogList("next")
			},
			clickChptersBtn: function() { //点击目录
				console.log('点击chapter');
				this.isHiddenChapter = !this.isHiddenChapter;
				if (this.cataloguelist.length > 0 || this.isRequesting) { //已经有目录数据
					return;
				}
				//设置为当前章节所在的那一页
				this.paginationVo.pageNo = Math.floor((this.sortIndex - 1) / this.paginationVo.pageSize) + 1
				this.requestCatelogList("now")
			},
			//请求目录
			requestCatelogList: function(event) {
				this.isRequesting = true
				var params = new URLSearchParams();
				params.append('productId', this.productId);
				params.append('pageNumber', this.paginationVo.pageNo);
				params.append('pageSize', this.paginationVo.pageSize);

				console.log("request 目录参数：" + JSON.stringify(params))
				let that = this
				HTTPUtil.post('product/chapter/list.do', params)
					.then(response => {
						console.log(JSON.stringify(response.data));
						that.isRequesting = false
						if (response.data.code == 0) {
							let data = response.data.data;
							that.paginationVo = data.paginationVo;
							let list = data.list;
							if (event == "now") { //获取当前目录
								that.cataloguelist = list;

								that.$nextTick(() => { //下次DOM更新执行
									console.log(document.getElementById("activedLi"))
									if (document.getElementById("activedLi")) {
										console.log("自动滚动。。。")
										document.getElementById("activedLi").scrollIntoView();
									} else {
										console.log("不自动滚动。。。11")
									}

								})
							} else if (event == "pre") { //上一页
								list = list.concat(that.cataloguelist)
								that.cataloguelist = list
							} else if (event == "next") {
								that.cataloguelist = that.cataloguelist.concat(list)
							}

							console.log('长度：' + list.length);



						}
					})
					.catch(function(error) {
						that.isRequesting = false
						console.log(error);
					});
			},
			handleScroll(e) {
				console.log(e);
				if (!this.isHiddenChapter) {
					return;
				}

				//变量scrollTop是滚动条滚动时，距离顶部的距离
				var scrollTop = e.target.documentElement.scrollTop || document.documentElement.scrollTop || window.pageYOffset ||
					document.body.scrollTop;
				//变量windowHeight是可视区的高度
				var windowHeight = e.target.documentElement.clientHeight;
				//变量scrollHeight是滚动条的总高度
				var scrollHeight = e.target.documentElement.scrollHeight;
				//滚动条到底部的条件
				if (scrollTop + windowHeight == scrollHeight) {
					//
					this.isHiddenTopAndBottomNav = false;
					//console.log('到达底部')
				} else if (scrollTop == 0) {
					this.isHiddenTopAndBottomNav = false;
				} else if (scrollTop > 0) {
					this.isHiddenTopAndBottomNav = true;
				}
			},
			imgloadHandle(e) {
				this.curLoadIndex++;
				if (this.curLoadIndex < this.resources.length) {
					console.log('加载第' + this.curLoadIndex + '张')
					this.pictures.push(this.resources[this.curLoadIndex]);
				}
			},
			imgErrorHandle(event) {
				console.log("图片加载出错")
				let img = event.srcElement;
				img.src = this.defaultImg;
				img.onerror = null; //防止闪图
				this.curLoadIndex++;
				if (this.curLoadIndex < this.resources.length) {
					console.log('加载第' + this.curLoadIndex + '张')
					this.pictures.push(this.resources[this.curLoadIndex]);
				}
			},
			// 当鼠标移动时触发
			touchmove(e) {
				// 获取y 坐标
				// let mY = event.offsetY
				let mY = event.clientY;

				var windowHeight = SLMUtil.getClientHeight()
				if (mY < 50 || mY >= windowHeight - this.bottomBarHeight) { //进入范围
					this.isHiddenTopAndBottomNav = false;
					this.isEnterNavScope = true;
				} else { //鼠标离开导航栏
					//用户没要求显示，且当前滚动条非滑到顶部或者底部则隐藏
					if (this.isEnterNavScope && this.isHiddenChapter && !this.isEnterLoginView) {
						this.isEnterNavScope = false;
						this.isHiddenTopAndBottomNav = true;
					}
				}
			},
			loginViewEvent: function(event) { //进入或者移出登录框
				if (event > 0) { //移进
					console.log("进入登录按钮视图。。。")
					this.isEnterLoginView = true;
				} else { //移出
					console.log("移出登录按钮视图。。。")
					// this.isEnterLoginView = false;
				}
			},
		}

	}
</script>

<style>
	@import "../css/LookComic.css";
	@import "../css/SLMComm.css";
</style>
