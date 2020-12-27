<template>
	<div>
		<Header />
		<div id="CFWrap" class="cf-wrap">
			<div class="cf-wrap-content">
				<div class="slm-load-Status" v-if="getLoadStatus() != 1" style="height: 788px; line-height: 788px;">{{loadStatusText}}</div>
				<ul class="cf-collection">
					<li class="cf-cell-work" v-bind:class="{'cf-cell-right': ((index+1)%3==0)}" v-for=" (value,index) in works">
						<div class="ret-works-cover">
							<router-link :to="{ path: '/WorkDetail', query: { productId: value.id }}" class="mod-cover-list-thumb mod-cover-effect ui-db" >
								<img class="lazy" :src="value.thumUrl" style="display: block;">
								<span class="mod-layer-mask">&nbsp;&nbsp;</span>
							</router-link>
							<p class="mod-cover-list-updata">
								<router-link :to="{ path: '/WorkDetail', query: { productId: value.id }}" class="mod-cover-list-mask" >
									<span class="mod-cover-list-text">{{value.status==1?'连载中...':'已完结'}}</span>
								</router-link>
							</p>
						</div>
						<div class="ret-works-info">
							<h3 class="ret-works-title clearfix">
								<router-link :to="{ path: '/WorkDetail', query: { productId: value.id }}">
									{{value.name}}
								</router-link>
							</h3>
							<p class="ret-works-author" :title="value.author">{{value.author}} &nbsp;</p>
							<p class="ret-works-tags">
								<a href="/Comic/all/theme/1" target="_blank">{{value.typeName}}</a>
								<span>人气：<em>{{value.clickCount}}</em></span>
							</p>
							<p class="ret-works-decs">{{value.desciption}}...</p>
							<router-link :to="{ path: '/WorkDetail', query: { productId: value.id }}" class="ret-works-view ui-btn-pink" >开始阅读</router-link>
						</div>
					</li>
				</ul>
			</div>
			<div class="cf-page">
				<div class="ret-page-wr mod-page" id="pagination2" v-if="paginationVo.totalPage > 1">
					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:paginationVo.prePage }}" class="mod_page_prev" >上一页</router-link>
					<!-- <a :href="'ComicClassfication.html?type='+type+'&pageNumber='+paginationVo.prePage" class="mod_page_prev">上一页</a> -->
					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:paginationVo.prePage }}" >1</router-link>
					<!-- <a href=:href="'ComicClassfication.html?type='+type+'&pageNumber=1'" v-if="paginationVo.pageNo >= 3">1</a> -->
					<span v-if="paginationVo.pageNo >= 4">...</span>

					<!-- 这两个能显示就显示 -->
					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:(paginationVo.pageNo-1) }}" v-if="paginationVo.pageNo >1" >{{paginationVo.pageNo - 1}}</router-link>
					<!-- <a :href="'ComicClassfication.html?type='+type+'&pageNumber='+(paginationVo.pageNo-1)" v-if="paginationVo.pageNo >1">{{paginationVo.pageNo - 1}}</a> -->
					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:paginationVo.pageNo }}" class="current" >{{paginationVo.pageNo}}</router-link>
					<!-- <a :href="'ComicClassfication.html?type='+type+'&pageNumber='+paginationVo.pageNo" class="current">{{paginationVo.pageNo}}</a> -->
					
					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:(paginationVo.pageNo+1) }}" v-if="(paginationVo.pageNo + 1) <= paginationVo.totalPage"  >{{paginationVo.pageNo + 1}}</router-link>
					<!-- <a :href="'ComicClassfication.html?type='+type+'&pageNumber='+(paginationVo.pageNo+1)" v-if="(paginationVo.pageNo + 1) <= paginationVo.totalPage">{{paginationVo.pageNo + 1}}</a> -->

					<span v-if="(paginationVo.totalPage - paginationVo.pageNo) > 3">...</span>
					<!-- 保证下面两个比上一个大就显示 -->
					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:(paginationVo.totalPage-1) }}" v-if="(paginationVo.totalPage-1) >(paginationVo.pageNo + 1)" >{{paginationVo.totalPage-1}}</router-link>
					<!-- <a :href="'ComicClassfication.html?type='+type+'&pageNumber='+(paginationVo.totalPage-1)" v-if="(paginationVo.totalPage-1) >(paginationVo.pageNo + 1)">{{paginationVo.totalPage-1}}</a> -->
					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:paginationVo.totalPage }}" v-if="(paginationVo.totalPage)  > (paginationVo.pageNo + 1)"  >{{paginationVo.totalPage}}</router-link>
					<!-- <a :href="'ComicClassfication.html?type='+type+'&pageNumber='+paginationVo.totalPage" v-if="(paginationVo.totalPage)  > (paginationVo.pageNo + 1)">{{paginationVo.totalPage}}</a> -->

					<router-link :to="{ path: '/CategoryLookMore', query: { type: type,pageNumber:paginationVo.nextPage }}" >下一页</router-link>
					<!-- <a :href="'ComicClassfication.html?type='+type+'&pageNumber='+paginationVo.nextPage" class="mod_page_next">下一页</a> -->
				</div>
			</div>
		</div>
		<Footer />
	</div>

</template>

<script>
	import Header from './pages/Header.vue'
	import Footer from './pages/Footer.vue'
	import HttpUtil from '../js/HttpUtil.js'

	export default {
		data() {
			return {
				loadStatus: 0,
				loadStatusText: '',
				works: [], //作品
				paginationVo: {
					pageNo: 1,
					prePage: 1,
					nextPage: 1,
					totalPage: 0
				},
				type: 0
			}
		},
		components: {
			Header,
			Footer
		},
		methods: {
			getLoadStatus: function(curRow) {
				if (this.loadStatus == 0) {
					this.loadStatusText = '正在努力加载···'
					return 0; //正在加载
				} else if (this.loadStatus == 1) {
					this.loadStatusText = ''
					return 1; //加载完成
				} else if (this.loadStatus == 2) {
					this.loadStatusText = 'o(╯□╰)o  没有找到漫画!'
					return 2; //加载完成
				} else {
					this.loadStatusText = 'o(╥﹏╥)o  加载失败!，请刷新页面'
					return 2; //部分加载完成
				}
			}
		},
		mounted() {
			let type = this.$route.query.type;
			console.log('type:' + type);
			let pageNumber = this.$route.query.pageNumber;
			let searchKeyWord = this.$route.query.keyword;

			var params = new URLSearchParams();
			if (pageNumber) {
				this.paginationVo.pageNo = pageNumber;
				this.paginationVo.prePage = pageNumber;
				this.paginationVo.nextPage = pageNumber;
			} else {
				pageNumber = 1;
			}
			params.append('pageNumber', pageNumber);
			params.append('pageSize', '30');
			
			var url = 'product/list.do'
			if(searchKeyWord) {
				url = 'product/serch.do'
				params.append('name', searchKeyWord);
			}
			else if (type) {
				this.type = type;
				params.append('type', type);
			}
			else {
				params.append('type', '0');
			}

			console.log('拿到数据：'+JSON.stringify(params));
			HttpUtil.post(url, params)
				.then(response => {

					console.log('拿到数据：'+JSON.stringify(response.data));

					if (response.data.code == 0) {
						let data = response.data.data;
						let list = data.list;

						this.paginationVo = data.paginationVo;
						this.works = list;
						console.log('长度：' + list.length + '\n');

						this.loadStatus = list.length == 0 ? 2 : 1;
					} else {
						this.loadStatus = -1;
					}
				})
				.catch(function(error) {
					// console.log('error:'+error);
					this.loadStatus = -1;
				});
		}
	}
</script>

<style>
	@import "../css/ComicClassfication.css";
</style>
