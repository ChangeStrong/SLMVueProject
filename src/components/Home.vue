<template>
	<div>
		<Header />
		<div class="lg_body_wrap" id="homeData">
			<div class="lg_body_content">
				<div class="lg_left">
					<div class="lg_ring">
						<BannerPhone :imgArray='bannerData' />
					</div>
					<div class="lg_levels" id="vue_det">
									
						<div class="lg_s" v-for="(item,index) in categoryArray">
							<div class="lg_nav nav_s">
								<router-link class='nav_title' :to="{ path: '/CategoryLookMore', query: { type: item.type }}">{{item.title}}</router-link>
								<div class="nav_s_more">
									<router-link :to="{ path: '/CategoryLookMore', query: { type: item.type }}">查看更多></router-link>
								</div>
							</div>
							<div class="lg_content">
								<ul data-cid="10" data-seq="1" id="lgcontentUl">
									<li v-for="(lidata,tnum) in getLeveProducts(item.items)" v-bind:style="getCellStyle(tnum)">
										<router-link :to="{ path: '/WorkDetail', query: { productId: lidata.id }}">
										<img :width="levelCellWidth - 2" :height="(levelCellWidth -2)/630*831" :src="lidata.thumUrl" />
										</router-link>
										<div class="lg_title">
											<router-link :to="{ path: '/WorkDetail', query: { productId: lidata.id }}">{{lidata.name}}</router-link>
										</div>
									</li>
								</ul>
							</div>
						</div>
					
					</div>

					<div class="lg_a"></div>
				</div>
				<div class="lg_shop_nav"></div>
				<div class="lg_shop">
					<ul>
						<li v-for="(value,index) in adData" class="lg-shop-li" v-bind:style="{ marginRight: index==(adData.length-1)?'0':'27px'}">
							<img width="126px" height="80px" :src="value.thumUrl" />
						</li>
						<div class="clear_float"></div>
					</ul>
				</div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script>
	import Header from './pages/Header.vue'
	import Footer from './pages/Footer.vue'
	import BannerPhone from './BannerPhone.vue'
	import HTTPUtil from '../js/HttpUtil.js'
	import CookieUtil from '../js/CookieUtil.js'

	export default {
		metaInfo: {
			title: '神龙漫',
			meta: [{
				name: 'Keywords',
				content: '神龙漫画网首页,神龙漫画网,神龙漫,漫画列表,免费漫画,在线漫画,漫画大全,动漫之家,漫画网,无翻页漫画,少年漫画,热血漫画,少女漫画,搞笑漫画,古风漫画,优质漫画,H漫,摸鱼,漫画教程'
			}, {
				name: 'Description',
				content: '神龙漫画网站的首页,漫画资源丰富,交互体验俱佳,看漫画一键滑到低,无需翻页,少年少女漫画为广大青年提供优质健康的漫画内容'
			}]
		},
		components: {
			Header,
			Footer,
			BannerPhone
		},
		data() {
			return {
				bannerData: [],
				categoryArray: [],
				adData: [],
				levelCellWidth:104,
				levelCellNum:9,
			}
		},
		methods: {
			updateCellWidth:function() {//更新所有cell宽度
			//从多少个开始适配
							let array = this.getCellFineWidth(15)
							let width = array[0]
							let num = array[1]
							
							this.levelCellWidth = width
							this.levelCellNum = num
							
							// console.log('每行个数:'+num+"cell宽度:"+width)		  
						  },
						  getCellFineWidth:function(num) {//获取cell最适合宽度
						  
						  				  let allwidth = $("#lgcontentUl").width()
						  				  // console.log('总宽度:'+allwidth)
						  				  let padding = 10//间距
						  				  let cellW = (allwidth - padding * (num - 1))/num
						  				  if (cellW >= 104) {
						  					  return [cellW,num]
						  				  }else {
						  					  return this.getCellFineWidth(num - 1)
						  				  }
						  },
						  getCellStyle:function(index) {
							  // console.log("当前cell序号index:"+index);
						  				  if (index % this.levelCellNum == 0) {//每行 第一个
						  				    // console.log('这是第一个:index:'+index+'余数:'+(index % this.levelCellNum))
						  					return {width:this.levelCellWidth+'px'}
						  				  }else {
						  					return {width:this.levelCellWidth+'px','margin-left':'10px'}
						  				  }
						  },
						  getLeveProducts:function(items){//切掉不够显示一行的作品
						  
							//多了的作品数
							 let remain = items.length % this.levelCellNum
							  if (items.length > 2 && items.length > this.levelCellNum && remain <= this.levelCellNum / 2.0) {
								  let tItems = [].concat(items)
								  // let tItems = JSON.parse(JSON.stringify(items))
								  var removeIndex =  items.length - remain
								  //删除多余作品
								  tItems.splice(removeIndex)
								  return tItems
							  }
							  return items
						  }
		},
		mounted() {
			HTTPUtil.get('home/getadAndBanner.do', null)
				.then(response => {
					console.log('bannerdata:'+ response.data);
					if (response.data.code == 0) {
						let data = response.data.data;

						this.bannerData = data.banner.items;
						this.adData = data.Ad.items;
						// this.categoryArray = data.Category;
						console.log('banner:' + this.bannerData.length);
						console.log('categoryArray:' + JSON.stringify(this.bannerData));
					}
				})
				.catch(function(error) {
					console.log(error);
				});

			// 获取banner
			HTTPUtil.get('home/getProducts.do', null)
				.then(response => {
					console.log('作品列表')
					console.log(response.data);
					if (response.data.code == 0) {
						let data = response.data.data;
						this.categoryArray = data.Category;
						// console.log('categoryArray:' + JSON.stringify(this.categoryArray));
					}
				})
				.catch(function(error) {
					console.log(error);
				});
				
				
		}
	}
</script>

<style scoped>
	@import "../css/Home.css";
</style>
