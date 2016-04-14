$.fn.valid=function(hint){
		var $_this=$(this);
		// 默认提示
		var hint=$.extend({
			not_null:"不能为空",
				max:"注意字数限制",
				min:"注意字数限制",
				email:"请输入正确的邮箱"
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
									return true;
								}
								else{
									// console.log("null");
									// console.log($(this).hint["not_null"]);
									// console.log(this);
									// console.log($(this));
									show_error("not_null",$(this));
									return false;
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
							return false;
						}
						else{
							// console.log("OK>=",min_val);
							
							return true;
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
									return false;
								}else{
									// console.log("OK<=",max_val);

									return true;
								}
							}
						);
				}

					
				);
		};
		var email=function(){
			$_this.children("[email='y']").each(

					function(){console.log($(this));
						$(this).blur(
							function(){
								if(rule["email"].test($(this).val())){
									// console.log("邮箱");
									return true;
								}else{
									console.log("email is incorrect")
									show_error("email",$(this));
									// console.log("邮箱错误");
									return false;
								}
							}
						);}
				);
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
		var hide_error=function(){
			$_this.children("input").each(
					function(){
						$(this).click(
								function(){
									// console.log($(this).next(".hint"));
									if($(this).next(".hint")[0]!=null){
										// console.log($(this).next(".hint")[0]);
										$(this).next(".hint").remove();
									}
								}
							);
					}
				);
		};
		
		min();
		max();
		hide_error();
		email();
		
		not_null();
	};