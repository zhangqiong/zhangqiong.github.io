var Carousel=function($ele){
			var _this=this;
			this.$ele=$ele;
			this.active_index=0;
			this.interval=null;
			this.carin_count=this.$ele.find('.carousel-inner').length;
				console.log(this.carin_count);
				var whi_count=this.carin_count;
				var point_string='<ol class="carousel-point-wrapper">';
				for(whi_count=0;whi_count<this.carin_count;whi_count++){
					point_string+='<li class="carousel-point" data-slide-no="'+whi_count+'"></li>';
				}
				point_string+="</ol>";
				console.log(point_string);
				var $points_wrapper=$(point_string);
			this.$points=$points_wrapper.children("li");
				this.$points.click(
						function(){
							// console.log($(this).attr("data-slide-no"));
								_this.to($(this).attr("data-slide-no"));
						}
					);
				this.$points.eq(this.active_index).addClass("active");
				this.$ele.append($points_wrapper);
			this.$buttonL=$('<div class="carousel-lt"><span>&lt;</span></div>');
			this.$buttonR=$('<div class="carousel-gt"><span>&gt;</span></div>');

				this.$ele.append(this.$buttonL,this.$buttonR);
				// console.log(this.$buttons.eq(0));
				// console.log(this.$ele);

				this.$buttonL.click($.proxy(_this.slide_prev,_this));
				this.$buttonR.click($.proxy(_this.slide_next,_this));
				this.$ele.mouseenter($.proxy(_this.stop,_this));
				this.$ele.mouseleave($.proxy(_this.init,_this));
		}
		Carousel.prototype.to=function(index){
			console.log(this);
			if(this.active_index==index)return;
			else if(this.active_index<index){console.log("to",index);
				this.slide_next(index);
			}else{
				this.slide_prev(index);
			}
		}
		Carousel.prototype.slide_next=function (index){
			console.log(this);
			this.$points.eq(this.active_index).removeClass("active");
			if(index>=0 && index<this.carin_count){
				console.log("indexyes");
				this.active_index=index;
			}
			else{this.active_index=++this.active_index%this.carin_count;}
			var now=this.$ele.find(".carousel-inner.active").animate({left:'-100%'},1000);	
			var next=this.$ele.children(".carousel-inner").eq(this.active_index).css("left","100%").animate({left:'0'},1000);
			this.$points.eq(this.active_index).addClass("active");
			now.removeClass("active");
			next.addClass("active");
		
		}
		Carousel.prototype.slide_prev=function(index){
			this.$points.eq(this.active_index).removeClass("active");
			if(index>=0 && index<this.carin_count){
				this.active_index=index;
			}else{
				this.active_index=(--this.active_index+this.carin_count)%this.carin_count;

			}
			var now=this.$ele.find(".carousel-inner.active").animate({left:'100%'},1000);
			var prev=this.$ele.children(".carousel-inner").eq(this.active_index).css('left','-100%').animate({left:0},1000);
			this.$points.eq(this.active_index).addClass("active");
			now.removeClass("active");
			prev.addClass("active");

		}
		Carousel.prototype.stop=function(){
			console.log("stop");
			// console.log(this);
			// console.log(this.active_index);
			clearInterval(this.interval);

		}
		Carousel.prototype.init=function(){
			// console.log(this);
			this.interval=setInterval($.proxy(this.slide_next,this),4000);
			// console.log(this.interval);
		}
		var $carousel=$('.carousel');
		
		var carousel_length=$carousel.length;
		$carousel.each(function(){
			var ca=new Carousel($(this));
			ca.init();
			
		}
				
		);