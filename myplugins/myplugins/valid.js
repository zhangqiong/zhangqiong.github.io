$.fn.valid=function(hint){
	// console.log(this);
	// var _this=this;
	// _this.is_ok=true;
		var $_this=$(this);
		var is_ok={
			not_null:false,
				max:true,
				min:false,
				email:false,
				same:true
		};
		// 默认提示
		var hint=$.extend({
			not_null:"不能为空",
				max:"注意字数限制",
				min:"注意字数限制",
				email:"请输入正确的邮箱",
				same:"请输入一致"
		},hint);
		// 存储一些正则
		var rule={
			email:/^\w+([-.]\w+)*@\w+([-.]\w+)*\.\w{2,4}$/,

		};
		var not_null=function(){
			$_this.children("[not_null='y']").each(
					function(){
						$(this).blur(
							function(){
								if($(this).val()!=""){
									// console.log("not_null");
									is_ok.not_null= true;
								}
								else{
									// console.log("null");
									// console.log($(this).hint["not_null"]);
									// console.log(this);
									// console.log($(this));
									show_error("not_null",$(this));
									// return false;
									is_ok.not_null=false;
								} 
							}
						);
					}
				);
		}
		;
		var min=function(){
			$_this.children("[min]").each(
				function(){
					$(this).blur(
					function(){
						var min_val=$(this).attr("min");
						// console.log(min_val);
						if($(this).val().length<min_val){
							// console.log("<",min_val);
							show_error("min",$(this));
							// return false;
									is_ok.min=false;
							
						}
						else{
							// console.log("OK>=",min_val);
							
							is_ok.min= true;
						} 
					}
					);
				}
				);
		};
		var max=function(){
			$_this.children("[max]").each(
				function(){
					$(this).blur(
							function(){
								var max_val=$(this).attr("max");
								// console.log(max_val);
								if($(this).val().length>max_val){
									// console.log(">",max_val);
									show_error("max",$(this));
									// return false;
									is_ok.max=false;

								}else{
									// console.log("OK<=",max_val);

									is_ok.max=true;
								}
							}
						);
				}

					
				);
		};
		var email=function(){
			$_this.children("[email='y']").each(

					function(){
						$(this).blur(
							function(){
								if(rule["email"].test($(this).val())){
									// console.log("邮箱");
									is_ok.email= true;
								}else{
									console.log("email is incorrect")
									show_error("email",$(this));
									// console.log("邮箱错误");
									// return false;
									is_ok.email=false;

								}
							}
						);}
				);
		};
		var same=function(){
			$_this.children("[same='2']").each( 
				function(){
					$(this).blur(
						function same_blur(){
							var name=$(this).attr("name");
							var same1=$(this).prevAll('[name="'+name+'"]').filter('[same="1"]');
							var same2=$(this);
							same1.blur($.proxy(same_blur,same2));
							same1.blur(function(){
								if(same1.val()===same2.val()){
									hide_error(same2);
								} 
							});
							if(same1.val()!=$(this).val()){
								show_error("same",$(this));
									// return false;
									is_ok.same=false;

							}else{
								is_ok.same=true;
							}
						});
				});
		};
		var show_error=function(type,item){
			
			// console.log($(this));
			// var top=$(this).offset().top+20;
			// var left=$(this).offset().left;
			// console.log($(this).offset(),top,left);

			if(item.next(".error")[0]==null){
				$("<label></label>").html(hint[type]).addClass("hint error").insertAfter(item);
			}
			
		};
		function on_submit(){
			var re=true;
			for(var item in is_ok){
				re=re&&is_ok[item];
				console.log(re);
				if(!re) return false;
			}
			return true;
		}
		var hide_error=function($item){
			if(!$item){
				$_this.children("input").each(function(){
					$(this).click(function(){
						if($(this).next(".hint")[0]!=null){
							// console.log($(this).next(".hint")[0]);
							$(this).next(".hint").remove();
						}
					});
				}
					
				);
			}else{
				if($item.next(".hint")[0]!=null){
				// console.log($(this).next(".hint")[0]);
				$item.next(".hint").remove();
			}
			}
			
		};
		min();
		max();
		hide_error();
		email();
		same();
		not_null();
		// if(min() && max() && hide_error() && email() && same() && not_null())return this.is_ok=true;
		$("#submit_btn").click(function(){
		
		// console.log(form.is_ok)
		if(on_submit()){
			$_this.submit();
		}else{
			alert("请填写完整");
		}
	});
	};