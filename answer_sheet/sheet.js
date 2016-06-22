require.config({
	paths:{
		'jQuery':'../jquery.js',
		'KindEditor':'../kindeditor/kindeditor-all.js',
		'bootstrap':'../bootstrap.js',
		'jquery.tmpl':'../jquery.tmpl.js',
		'jquery.tmplPlus':'../jquery.tmplPlus.js',
		'kindeditor_zh_cn':'../kindeditor/lang/zh-CN.js'
	}
})
require(['jquery'],['KindEditor'],['bootstrap'],['jquery.tmpl'],['jquery.tmplPlus'],['kindeditor_zh_cn'],function($,K) {
	
	var no_1=0,no_2=0;
	var data_str='[{"type":"choices","point_each":2,"count":5,"options":4,"part_right":"","name":"cd1"},{"type":"subjective","name":"sd1","point":5,"describe":"sssss","small":[{"point":3,"border":false,"line":2.789473684210526},{"point":3,"border":true,"line":5.973684210526316},{"point":"","border":false,"line":2.736842105263158},{"point":"","border":false,"line":2.736842105263158}]},{"type":"choices","point_each":3,"count":9,"options":"","part_right":"","name":""},{"type":"subjective","name":"","point":5,"describe":"","small":[{"point":5,"border":false,"line":2.8157894736842106},{"point":"","border":false,"line":2.763157894736842},{"point":"","border":false,"line":2.789473684210526}]},{"type":"choices","point_each":"","count":500,"options":"","part_right":"","name":""}]';
	var add_other_choices_to_page,add_other_choices_to_index,add_other_subjective_to_page,add_other_subjective_to_index;
	var modify_question;
	var choices_column_count=4;
	var editor_count=0;
	var keditor;

	var ke_options = {
		filterMode : true,
		items : [
	        'source', '|', 'undo', 'redo', '|', 'preview', 'template', 'code', 'cut', 'copy', 'paste',
	        'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
	        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
	        'superscript', 'clearhtml', 'quickformat', 'selectall',  '/',
	        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
	        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
	         'insertfile', 'table', 'emoticons', 'baidumap',
	        '|', 'about'
		],
		resizeType:1,
		fontSizeTable : [
			'3mm','4mm','5mm','8mm','10mm'
		],
		htmlTages : {
			font : ['red','3mm']
		},
		newlineTag: 'br',
		minHeight : 37,
		// cssPath:'kindeditor/themes/sheet_editor/sheet_editor.css',
		themeType: 'sheet_editor',
		afterBlur:function(){
			this.sync();
			$(this.srcElement[0]).height($('.ke-container').height());
			// console.log($(this.srcElement[0]),$('.ke-container').height())
		},
		afterFocus : function(){
			// console.log('focus',document.activeElement)
		},
		afterCreate : function(){
			$('.ke-edit-iframe')[0].focus();
		},
		afterChange : function(){
			// console.log('change')
		}
	}
	// 读取数据渲染页面
	function load_data(){
		var bigs=JSON.parse(data_str);
		var $tmp=$('<div></div>');
		// console.log(bigs);
		for(var k=0,bigs_length=bigs.length;k<bigs_length;k++){
			var big=bigs[k];
			// console.log(k,big.type)
			if(big['type']==="choices"){
				var items_count=big.count,
					point_each=big.point_each,
					options=big.options,
					part_right=big.part_right,
					name=big.name;
				var i,items=[];
				for(i=0;i<items_count;i++){
					items.push(++no_2);
				}
				var choices_obj={
					no_1:transform_to_Chinese(++no_1),
					part_right:part_right,
					point_each:point_each,
					options:options,
					items:items,
					name:name
				};
				$('#choices').tmpl(choices_obj).appendTo($tmp);
			}else if(big['type']==="subjective"){
				var subjective_obj={
					no_1:transform_to_Chinese(++no_1),
					name:big.name,
					describe:big.describe,
					point:big.point
				};
				var $subjective=$('#subjective').tmpl(subjective_obj);
				$subjective.appendTo($tmp);
				for(var j=0,small_length=big.small.length;j<small_length;j++){
					big.small[j].editor_count=editor_count;
					var $small=$('#subjective_small').tmpl(big.small[j]);
					editor_count++;
					$subjective.append($small);
				}
			}
		}
		$('.page:first-child').children('.page-container').append($tmp.html());
		reset_no();
		$('.page:first-child').trigger('mod_ele.sheet');
	}
	var count=0;
	// 答题卡的resize

	/*$('.sheet').delegate('.ke-edit-iframe', 'resize', function(event) {
		console.log('ke-containerresize');
		console.log($(this).parents('.page'))
		$('.sheet').trigger('mod_ele.sheet');
	});*/
	$('.sheet').delegate('.page', 'mod_ele.sheet', function(event) {
		// console.log('pageresize')
		var contentHeight = $(this).children('.page-container').height();
		var height = $(this).height(),$this_page=$(this).children('.page-container');
		// console.log(contentHeight,height,$(this));
		if(contentHeight > height){
			var $next_page=$(this).next('.page').length>0 ? $(this).next('.page') : $('<div class="page"><div class="page-container"></div></div>').appendTo('#target');
			var overflow_height=contentHeight-height;
			
			divd_ele($(this),$next_page,overflow_height);

			// console.log($(this).prevAll('.page').length,$next_page.prevAll('.page').length)
			// console.log($(this).prevAll('.page'),$next_page.prevAll('.page'))
			// console.log($(this),$next_page)

 
			// count++;
		}else if(contentHeight < height-24){//24 是两道题之间的边距+一行
			var $next_page=$(this).next('.page').children('.page-container');
			if($next_page.length>0){
				var blank_height=height - contentHeight;
				var $this_last=$this_page.children(':last');
				var $next_first=$next_page.children(':first');
				if($next_first.hasClass('subjective') && blank_height>$next_first.children(':first').height()+12){
					console.log('主观小题move_up')
					if($next_first.hasClass('question')){
						$('<div class="big question subjective"></div>').append($next_first.children(':first')).appendTo($this_page);
						$next_first.removeClass('question')
					}else{
						$this_last.append($next_first.children(':first'));
						if($next_first.children('.small').length===0)$next_first.remove();
					}
				}else if(blank_height>$next_page.children(':first').height()){
					console.log('大题move_up');
					if($next_first.hasClass('question')){
						$(this).children('.page-container').append($next_page.children(':first'));
					}else{
						$this_last.append($next_first.children(':first'));
						$next_first.remove();
					}
					
				}else if($next_first.hasClass('choices')){

				}
			}
		}
		$next_page.trigger('mod_ele.sheet');




	});
	// 大题超出分页
	function divd_ele($this_page,$next_page,overflow_height){
		// console.log('分页')
		$this_page=$this_page.children('.page-container');
		$next_page=$next_page.children('.page-container');
		var $move_child,$last_child;
		var move_child_height;
		// var count=0;
		while(overflow_height>0){
			$last_child=$this_page.children(':last')
			// console.log(overflow_height)
			if(overflow_height>(move_child_height=($move_child=$last_child).height())){
				console.log('大题move_down')
				if($next_page.children(':first:not(.question)').length>0){
					$next_page.children(':first').prepend($move_child.html()).addClass('question');
					$move_child.remove();
					$move_child = null;
				}else{
					$next_page.prepend($move_child);
				}
				overflow_height-=move_child_height;
				continue;
			}
			if($last_child.hasClass('subjective') ){
				console.log('主观小题move_down');
				if($last_child.children('.small').length===0)return;
				move_child_height=($move_child=$last_child.children('.small:last')).height();
				if($next_page.children(':first:not(.question)').length>0){
					$next_page.children(':first').prepend($move_child);
				}else{
					$('<div class="big subjective"></div>').append($move_child).prependTo($next_page);
				}
				overflow_height-=move_child_height;
				continue;
			}
			if($last_child.hasClass('choices')){
				console.log('选择小题move_down')
				var overflow_height_tmp=overflow_height;
				if($last_child.height()>overflow_height){
					overflow_height=0;
				}else{
					overflow_height-$last_child.height();
				}
				divd_choices($last_child,$next_page,overflow_height_tmp);
			} 
			// console.log($last_child);
			// // count++;
			// if(count>10)return;
		}
		
	}
	function divd_choices($ele,$next_page,overflow_height){
		var small_height=$ele.children('.small').outerHeight();
		var remain_small=(Math.ceil($ele.children('.small').length/4)-Math.ceil(overflow_height/small_height))*choices_column_count;
		if(remain_small<=0){
			if($next_page.children(':first:not(.question)').length>0){
				$next_page.children(':first').prepend($ele.html());
				if($ele.hasClass('question'))$next_page.children(':first').addClass('question');
				$ele.remove;
			}else{
				$ele.prependTo($next_page);
			}
			return;
		}
		console.log(remain_small);
		if($next_page.children(':first:not(.question)').length>0){
			$next_page.children(':first').prepend($ele.children('.small:gt('+(remain_small-1)+')'));
		}else{
			$('<div></div>').addClass('choices big').append($ele.children('.small:gt('+(remain_small-1)+')')).prependTo($next_page);
		}
	}
	function divd_subjective($ele,overflow_height){

	}

	// 添加选择题
	function add_choices_fn(event) {
		/* Act on the event */
		var items_count=$('#add_choices_form')[0].count.value,
			point_each=$('#add_choices_form')[0].point_each.value,
			options=$('#add_choices_form')[0].options.value,
			part_right=$('#add_choices_form')[0].part_right.value,
			name=$('#add_choices_form')[0].name.value;
		var i,items=[];
		for(i=0;i<items_count;i++){
			items.push(++no_2);
		}
		var choices_obj={
			no_1:transform_to_Chinese(++no_1),
			part_right:part_right,
			point_each:point_each,
			options:options,
			items:items,
			name:name
		};
		$('#choices').tmpl(choices_obj).appendTo('.page:last-child>.page-container');
		$('#add_choices_modal').modal('hide');
		$('.page:last-child').trigger('mod_ele.sheet');
	}
	$('#add_choices_ok').click(add_choices_fn);

	// 再加小题选择
	$('.sheet').delegate('.add_other_choice_btn', 'click', function(event) {
		add_other_choices_to_page=$(this).parents('.page').prevAll('.page').length;
		add_other_choices_to_index=$(this).parents('.choices').prevAll('.choices').length;
	});
	function add_other_choices_fn(event) {
		/* Act on the event */
		var htmlStr='',
			count=$('#add_other_choices_form')[0].count.value;
		for(var i=0;i<count;i++){
			htmlStr+='<span class="small"><span class="no_2"></span> [A][B][C][D]</span> '
		}
		// console.log($('.choices:eq('+add_other_choices_to+')'));
		var $item=$('.page:eq('+add_other_choices_to_page+') .choices:eq('+add_other_choices_to_index+')');
		$item.append(htmlStr);
		reset_no();
		reset_choices_total_point($item);
		$('.page:eq('+add_other_choices_to_page+')').trigger('mod_ele.sheet');
		$('#add_other_choices_modal').modal('hide');
	}
	$('#add_other_choices_ok').click(add_other_choices_fn);
	// 再加主观题小题
	$('.sheet').delegate('.add_other_subjective_btn', 'click', function(event) {
		add_other_subjective_to_page=$(this).parents('.page').prevAll('.page').length
		add_other_subjective_to_index=$(this).parents('.subjective').prevAll('.subjective').length;

	});
	function add_other_subjective_fn(event) {
		/* Act on the event */
		var small_obj={};
		small_obj.line=$('#add_other_subjective_form')[0].line.value||1;
		small_obj.name=$('#add_other_subjective_form')[0].name.value;
		small_obj.point=$('#add_other_subjective_form')[0].point.value;
		small_obj.border=!!$('#add_other_subjective_form')[0].border.checked;
		small_obj.editor_count=editor_count;
		editor_count++;
		var $small=$('#subjective_small').tmpl(small_obj);
		console.log($('.subjective:eq('+add_other_subjective_to_index+')'))
		console.log($('.page:eq('+add_other_subjective_to_page+') .subjective:eq('+add_other_subjective_to_index+')'))
		$('.page:eq('+add_other_subjective_to_page+') .subjective:eq('+add_other_subjective_to_index+')').append($small);
		reset_no();
		$('.page:eq('+add_other_subjective_to_page+')').trigger('mod_ele.sheet')
		$('#add_other_subjective_modal').modal('hide');
	}
	$('#add_other_subjective_ok').click(add_other_subjective_fn);

	// 添加主观题
	function add_subjective_fn(){
		var subjective_obj={
			no_1:transform_to_Chinese(++no_1),
			name:$('#add_subjective_form')[0].name.value,
			describe:$('#add_subjective_form')[0].describe.value,
			point:$('#add_subjective_form')[0].point.value
		};
		$('#subjective').tmpl(subjective_obj).appendTo('.page:last-child>.page-container');
		$('#add_subjective_modal').modal('hide');
		$('.page:last-child').trigger('mod_ele.sheet');
	}
	$('#add_subjective_ok').click(add_subjective_fn);

	// 删除按钮事件绑定
	$('.sheet').delegate('.remove_btn', 'click', function(event) {
		var $this_page=$(this).parents('.page');
		$(this).closest('.question').remove();
		reset_no();
		$this_page.trigger('mod_ele.sheet');

	});
	// 转成大写序号
	function transform_to_Chinese(num){
		var res='';
		if(num<10){
			switch(num){
				case 1:res='一';break;
				case 2:res='二';break;
				case 3:res='三';break;
				case 4:res='四';break;
				case 5:res='五';break;
				case 6:res='六';break;
				case 7:res='七';break;
				case 8:res='八';break;
				case 9:res='九';break;
			}
		}
		return res;
	}
	// 重排序号
	function reset_no(){
		$('.sheet').each(function (argument) {
			// body...
			var no_1=0,no_2=0;
			$(this).find('.no_1').each(function(){
				$(this).text(transform_to_Chinese(++no_1)+'、');
			});
			window.no_1=no_1;
			$(this).find('.no_2').each(function(index, el) {
				$(this).text(++no_2);
			});
			window.no_2=no_2;
		})
	}
	//重算总分
	function reset_choices_total_point($item){
		// console.log($item.data('point-each'),$item.children('.small').length);
		var total_point=$item.data('point-each')*$item.children('.small').length;
		if(total_point) $item.find('.point').text(total_point);
		else $item.find('.point').text(' ');
	}
	// 模态框显示，输入框获取焦点
	$('.modal').on('shown.bs.modal',function(){
		$(this).find('input:eq(0)')[0].focus();
	});

	// 模态框显示，回车键确认
	$('[id$="modal"]').keydown(function(event) {
		/* Act on the event */
		if(event.which==13){
			$(this).find('[id$="ok"]').trigger('click');
			return false;
		}
	});
	// 绑定点击显示富文本编辑器
	$('.sheet').delegate('[id^="ke_"]', 'dblclick', function(event) {
		if(keditor){
			$(keditor.srcElement[0]).height($('.ke-container').height());
			// console.log($(keditor.srcElement[0]),$('.ke-container').height())
			keditor.remove();
		}
		keditor=null;
			console.log(keditor)
		ke_options.height=$(this).height();
		// console.log(ke_options.height)
		keditor=K.create('#'+$(this).attr('id'),ke_options);
	});
	
	// 提交
	$('#submit_btn').click(submit_fn);
	function submit_fn(){
		var data=[];
		$('#target').find('.big').each(function(){
			var big={};
			if($(this).hasClass('choices')){
				if(!$(this).hasClass('question')){
					data[data.length-1].count+=$(this).children('.small').length;
					return;
				}else{
					big.type="choices";
					big.point_each=$(this).data('point-each');
					big.count=$(this).children('.small').length;
					big.options=$(this).data('options');
					big.part_right=$(this).data('part-right');
					big.name=$(this).data('name');
				}
				
			}else if($(this).hasClass('subjective')){
				if(!$(this).hasClass('question')){
					var small=[];
					$(this).children('.small').each(function(index, el) {
						var item={};
						item.point=$(this).data('point');
						item.border=$(this).hasClass('border');
						item.line=$(this).css('height').slice(0,-2)/38;
						small.push(item);
					});
					data[data.length-1].small=data[data.length-1].small.concat(small);
					return;
				}
				big.type="subjective";
				big.name=$(this).data('name');
				big.point=$(this).data('point');
				big.describe=$(this).data('describe');
				var small=[];
				$(this).children('.small').each(function(index, el) {
					var item={};
					item.point=$(this).data('point');
					item.border=$(this).hasClass('border');
					item.line=$(this).css('height').slice(0,-2)/38;
					small.push(item);
				});
				big.small=small;
			}
			data.push(big);
		});
		console.log(JSON.stringify(data));
	}

	load_data();

});
