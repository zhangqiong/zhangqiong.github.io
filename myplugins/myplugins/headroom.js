(function(){
'use strict';

	function Headroom(ele){
		// _this=this;
		this.scrollY;
		this.lastScrollY;
		this.scrolled;
		this.ele=ele;
		this.parent_ele=this.ele.parentNode;

		this.init();
	};
	Headroom.prototype={
		// 获取当前y
		setClass:function(){
			if(this.scrolled>0){
				// console.log(this,this.ele);
				
				this.ele.className="headroom headroom--unpinned";
			}
			else{
				this.ele.className="headroom headroom--pinned";
			}
		},
		update:function(e){
			console.log(e.target);
			this.scrollY=window.pageYOffset;
			// this.getScrollY();
			this.scrolled=this.scrollY-this.lastScrollY;
			this.lastScrollY=this.scrollY;
			// console.log(this.scrolled);
			// console.log("update",this);
			this.setClass();
		},
		init:function(){
			console.log(this.parent_ele)
			this.parent_ele
			window.addEventListener("scroll",this.update.bind(this));
		},
		getScrollY:function(){
			if(window.pageYOffset!==undefined)return window.pageYOffset;
			else 
				// if(document.body.scroolTop)
				return document.body.scroolTop; 
		}
		
	};//end Headroom.prototupe

	// var header=document.querySelector('header');
	
	var headrooms=document.querySelectorAll(".headroom");
	var headr_length=headrooms.length;
	var whi_c=headr_length;
	while(whi_c>0){
		whi_c--;
		console.log(whi_c);
		new Headroom(headrooms[whi_c]); 
	}
	
	// console.log(headroom.getScrollY());
	})();