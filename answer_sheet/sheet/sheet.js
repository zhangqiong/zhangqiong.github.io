(function($,K) {
	var no_1=0,no_2=0;
	var data_str=localStorage.data||'[{"type":"choices","point_each":2,"count":5,"options":4,"part_right":"","name":"cd1"},{"type":"subjective","name":"sd1","point":5,"describe":"sssss","small":[{"point":3,"border":false,"line":2.026315789473684},{"point":"","border":false,"line":2},{"point":"","border":false,"line":0.9736842105263158}]},{"type":"choices","point_each":"","count":9,"options":"","part_right":"","name":""},{"type":"subjective","name":"","point":"","describe":"","small":[{"point":5,"border":false,"line":4.631578947368421},{"point":"","border":false,"line":2.9473684210526314},{"point":"","border":false,"line":1.9736842105263157}]},{"type":"choices","point_each":"","count":500,"options":"","part_right":"","name":""},{"type":"subjective","small":[{"point":"","border":false,"line":1}]}]';
	var add_other_choices_to_page,add_other_choices_to_index,add_other_subjective_to_page,add_other_subjective_to_index;
	var modify_question;
	var choices_column_count=4,
		two_big_gap=11.339/*px,3mm*/,
		big_padding=11.339;
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
					$small.children('.editor-show').html(big.small[j].content)
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

//分页部分
// 答题卡的resize
	$('.sheet').delegate('.page', 'mod_ele.sheet', function(event) {
		// 内容高度
		var contentHeight = $(this).children('.page-container').height(),
			$next_page=$(this).next('.page');
		if(contentHeight===0){
			$next_page.trigger('mod_ele.sheet');
			console.log($(this).next('.page'))
			$(this).remove();
			return;
		}
		var height = $(this).height(),
			$this_page=$(this);
		// // 当页第一题高度小于上页空白
		
		// 当页溢出
		if(contentHeight > height){
			$next_page=$(this).next('.page').length>0 ? $(this).next('.page') : $('<div class="page"><div class="page-container"></div></div>').appendTo('#target');
			var overflow_height=contentHeight-height;
			divd_ele($(this).children('.page-container'),$next_page.children('.page-container'),overflow_height);
		// 当页不够，下页填充
		}else if(contentHeight < height-two_big_gap*2){//two_big_gap*2 是两道题之间的边距+一行
			if($next_page.length>0){
				var blank_height=height - contentHeight;
				while( $next_page.find('.big').length===0){
					if($next_page.length===0) return;
					var $tmp=$next_page.next('.page');
					$next_page.remove();
					$next_page=$tmp;
				}
				up_ele($this_page.children('.page-container'),$next_page.children('.page-container'),blank_height);
			}
		}
		// console.log(contentHeight,height,$next_page)
		if($next_page.length>0)$next_page.trigger('mod_ele.sheet');
	});
	// 当页空白下一题补
	function up_ele($this_page_c,$next_page_c,blank_height){
		// console.log(arguments)
		var $this_last;
		var $next_first;
		while(true){
			// console.log(blank_height)
			$this_last=$this_page_c.children(':last');
			$next_first=$next_page_c.children(':first');
			blank_height=$this_page_c.parent('.page').height()-$this_page_c.height();
			if($next_first.length===0)return;
			if($next_first.hasClass('subjective')&& blank_height>$next_first.children(':first').outerHeight()+two_big_gap){
				if($next_first.hasClass('question')){
					if(blank_height<$next_first.children(':first').outerHeight()+big_padding*2+two_big_gap+2/*2是大题的border*/)return;
					blank_height-=$next_first.children(':first').outerHeight()+big_padding*2+two_big_gap+2/*2是大题的border*/;
					$('<div class="big question subjective"></div>').append($next_first.children(':first')).appendTo($this_page_c);
					$next_first.removeClass('question')
					console.log('主观小题move_up1')
				}else{
					// console.log($next_first.children(':first').outerHeight())
					blank_height-=$next_first.children(':first').outerHeight();
					$this_last.append($next_first.children(':first'));
					if($next_first.children('.small').length===0)$next_first.remove();
					// console.log('zhuxiao')
				}
			}else if(blank_height>$next_first.outerHeight()+two_big_gap){
				// console.log('大题move_up',$next_first);
				blank_height-=$next_first.outerHeight();
				if($next_first.hasClass('question')){
					$this_page_c.append($next_first);
				}else{
					$this_last.append($next_first.html());
					$next_first.remove();
				}
			}else if($next_first.hasClass('choices') && blank_height>$next_first.children(':first').outerHeight()){
				var small_height=$next_first.children('.small').outerHeight();
				if($next_first.hasClass('question')){
					var move_small=Math.floor((blank_height-$next_first.children(':first').outerHeight()-big_padding-2-two_big_gap)/$next_first.children('.small').outerHeight())*4;
					if(blank_height<$next_first.children(':first').outerHeight()+big_padding*2+two_big_gap+2/*2是大题的border*/)return;
					$('<div class="big question choices"></div>').append($next_first.children('.title')).append($next_first.children('.small:lt('+(move_small)+')')).appendTo($this_page_c);
					$next_first.removeClass('question')
					if($next_first.children('.small').length===0)$next_first.remove();
				}else{
					var move_small=Math.floor(blank_height/$next_first.children('.small').outerHeight())*4;
					$this_last.append($next_first.children('.small:lt('+(move_small)+')'));
					if($next_first.children('.small').length===0)$next_first.remove();
				}
				blank_height=0;
			}else break;
		}
		
	}
	// 大题超出分页
	function divd_ele($this_page_c,$next_page_c,overflow_height){
		var $move_child,$last_child;
		var move_child_height;
		while(overflow_height>0){
		overflow_height=$this_page_c.height()-$this_page_c.parent('.page').height();
		if(overflow_height<=0)return;
			$last_child=$this_page_c.children(':last');
			while($last_child.hasClass('subjective') && $last_child.children('.small').length>0){
				move_child_height=($move_child=$last_child.children('.small:last')).outerHeight()-two_big_gap;
				if($next_page_c.children(':first:not(.question)').length>0){
					$next_page_c.children(':first').prepend($move_child);
				}else{
					$('<div class="big subjective"></div>').append($move_child).prependTo($next_page_c);
				}
				// console.log('主观小题down',overflow_height)
				overflow_height=$this_page_c.height()-$this_page_c.parent('.page').height();
				if(overflow_height<=0)return;
			}
			if(overflow_height<=0)break;
			if($last_child.hasClass('choices') && $last_child.children('.small').length>0 && overflow_height<$last_child.height()-$last_child.children('.title').height()){
				divd_choices($last_child,$next_page_c,overflow_height);
				// overflow_height=0;
			}else{
				move_child_height=($move_child=$last_child).outerHeight()-two_big_gap;
				if($next_page_c.children(':first:not(.question)').length>0){
					$next_page_c.children(':first').prepend($move_child.html()).addClass('question');
					$move_child.remove();
					$move_child = null;
				}else{
					$next_page_c.prepend($move_child);
				}
				// overflow_height-=(move_child_height+two_big_gap);
				continue;
			}
		}
	}
	function divd_choices($ele,$next_page,overflow_height){
		var small_height=$ele.children('.small').outerHeight();
		var remain_small=(Math.ceil($ele.children('.small').length/choices_column_count)-Math.ceil(overflow_height/small_height))*choices_column_count;
		if(remain_small===0){
			if($next_page.children(':first:not(.question)').length>0){
				$next_page.children(':first').prepend($ele.children('.small'));
			}else{
				$('<div></div>').addClass('choices big').append($ele.children('.small')).prependTo($next_page);
			}
		}
		if($next_page.children(':first:not(.question)').length>0){
			$next_page.children(':first').prepend($ele.children('.small:gt('+(remain_small-1)+')'));
		}else{
			$('<div></div>').addClass('choices big').append($ele.children('.small:gt('+(remain_small-1)+')')).prependTo($next_page);
		}
	}
	// 分割主观小题
	function divd_subjective_small($ele,first_height){
		if(keditor){
			if(keditor.srcElement[0]==$ele[0]){

			}else{

			}
		}
	}
//分页部分end


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
		//console.log($('.subjective:eq('+add_other_subjective_to_index+')'))
		//console.log($('.page:eq('+add_other_subjective_to_page+') .subjective:eq('+add_other_subjective_to_index+')'))
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
		var $ele=$(this).closest('.question');
		var count=0;
		while($ele.length>0 && $ele.parent('.page-container').children(':last')[0]==$ele[0]&&count++<30){
		console.log($ele.length>0,$ele,$ele.parent('.page-container').children(':last'),$ele.parent('.page-container').children(':last')[0]==$ele[0]);
			// console.log($ele.html());
			var $next=$ele.parents('.page').next('.page').children('.page-container').children(':first');
			if(!$next.hasClass('question')){
				$ele.remove();
				$ele=$next;
			}else{
				break;
			}
		}
		$ele.remove();
		reset_no();
		if($this_page.prev('.page').length>0){
			$this_page.prev('.page').trigger('mod_ele.sheet');
		}else{
			$this_page.trigger('mod_ele.sheet')
		}

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
		closeEditor();
		keditor=null;
			//console.log(keditor)
		ke_options.height=$(this).outerHeight()-2;
		// console.log(ke_options.height)
		keditor=K.create('#'+$(this).attr('id'),ke_options);
	});
	function closeEditor(){
		if(keditor){
			$(keditor.srcElement[0]).height($('.ke-container').outerHeight()-10/*10是editor-show的padding*/);
			// console.log($('.ke-container').height())
			keditor.remove();
		}
	}
	// 提交
	$('#submit_btn').click(submit_fn);
	function submit_fn(){
		var data=[];
		// var small_count=0;
		closeEditor();
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
						item.line=$(this).children('[id^="ke"]').css('height').slice(0,-2)/38;
						item.content=$(this).children('[id^="ke"]').html();
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
					item.line=$(this).children('[id^="ke"]').css('height').slice(0,-2)/38;
					item.content=$(this).children('[id^="ke"]').html();
					small.push(item);
					// small_count++;
					// console.log(item.line,small_count);
				});
				big.small=small;
			}
			data.push(big);
		});
		console.log(JSON.stringify(data));
		localStorage.data=JSON.stringify(data);
	}

	load_data();

})(jQuery,KindEditor);
