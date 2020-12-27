<template>
	<div>
		<div class="lg_shop_nav"></div>
		<div id="bottomShop" class="bottom_shop">
		<ul id="ComCollectionView" class="com_collection_view">
			<li v-for="(value,index) in adList" v-bind:style="getCellStyle(index)">
				<img :width="cellWidth" :height="cellWidth/126*80" :src="value.thumUrl" />
			</li>
			</ul>
						
						
		</div>
	</div>
</template>


<script>
	import $ from 'jquery'
	//父组件传值过来
	export default {
		name: 'HomeAd',
		props: ["adList"],
		data () {
		  return {
					cellWidth:126,
					cellNum:7,
					maxRowNum:15,
					allwidth:0,
		  }
		},
		mounted () {
				  console.log("----adlist:"+JSON.stringify(this.adList))
				  
				  let that = this;
				  $(window).resize(function(){
				  	console.log("jquery 商店++++监听到窗口变化");
				  	that.allwidth = $("#ComCollectionView").width()
				  	that.updateCellWidth();
				  });
				
				that.allwidth = $("#ComCollectionView").width()
				console.log('总宽度:' + this.allwidth)
				console.log("最大允许值:"+this.maxRowNum)
				 this.updateCellWidth();
		},methods:{
				  pageBtnClick:function(index) {
					  
				  },
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
				  
				  	let padding = 27 //间距
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
				  			'margin-left': '27px'
				  		}
				  	}
				  }
		}
	}
</script>
</script>

<style scoped>
	@import "../css/Home.css";
</style>
