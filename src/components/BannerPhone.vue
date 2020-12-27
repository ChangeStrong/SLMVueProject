<template>
	<div v-swiper:mySwiper="swiperOption">
		<div class="swiper-wrapper">
			<div class="swiper-slide" :key="item.id" v-for="item in imgArray" v-bind:style="{width:bCellSize.width + 'px',height:bCellSize.height + 'px' }">
				<router-link :to="{ path: '/WorkDetail', query: { productId: item.id }}">
					<img :src="item.landScapeThumUrl" width="100%" height="100%">
				</router-link>
			</div>
		</div>
		<div class="swiper-pagination"></div>
		<div class=".swiper-button-next"></div>
		<div class=".swiper-button-prev"></div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import {
		Swiper,
		SwiperSlide,
		directive
	} from 'vue-awesome-swiper'

	// import style (>= Swiper 6.x)
	import 'swiper/swiper-bundle.css'

	//父组件传值过来
	export default {
		name: 'BannerPhone',
		props: ["imgArray"],
		data() {
			let that = this
			return {
				isShowPreNext: false,
				bannerSwiper: null,
				bCellSize: {
					width: 480,
					height: 320
				},
				imgArray2: [],
				swiperOption: {
					pagination: {
						el: '.swiper-pagination'
					},
					loop: true,
					autoplay: true,
					// 如果需要前进后退按钮
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					},
					on: {
						touchStart: function(swiper, event) {
							that.destoryTimer()
						},
						touchEnd: function(swiper, event) {
							that.startTimer()
						},
					}
				},
				timer: null,
			}
		},
		components: {
			Swiper,
			SwiperSlide,
		},
		directives: {
			swiper: directive
		},
		mounted() {
			// console.log('imgData:'+this.imgArray)
			this.windowWidth = document.documentElement.clientWidth;
			let that = this;
			let size = that.getImgsLayout(0)
			that.bCellSize = size
			console.log("bCellSize高度：" + that.bCellSize.width)

			$(window).resize(function() {
				console.log("jquery imgs监听到窗口变化");
				that.bCellSize = that.getImgsLayout(0)
			});
			that.startTimer()

			this.$once('hook:beforeDestroy', () => {
				that.destoryTimer()
				console.log("停止定时器，banner 控制器销毁");
			})
		},
		methods: {
			startTimer: function() {
				if (this.timer == null) {
					this.timer = setInterval(this.timeInterAction, 4000)
				}
			},
			destoryTimer: function() {
				if (this.timer != null) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			timeInterAction: function() {
				this.mySwiper.slideNext(300, false)
			},
			getImgsLayout: function(index) { //高度需要变化
				var widht = 0;
				var height = 0;
				let windowWidth = document.documentElement.clientWidth;
				console.log("宽度变化：" + windowWidth);
				if (index == 0) {
					widht = windowWidth;
					let scale = widht / 1242;
					height = 730 * scale;
				} else {
					widht = (windowWidth - 1) * 0.5;
					let scale = widht / 630;
					height = 831 * scale;
				}
				return {
					width: widht,
					height: height
				};
			}
		}
	}
</script>

<style scoped>

</style>
