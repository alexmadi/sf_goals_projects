$(document).ready(function(){

	// unicue name of Large Imgs 
	var unicue_lg_img_str = "_xl_" ; 
	//$product_config_wrapper = $(".product_images_section");
	$img_container = $(".product_primary_image");

	var img_length = $('.thumb').length;
	var curr_num = $('.thumb.selected').index() + 1;
	var xl_img_width ;
	var xl_img_heigth;

	$('.product_images_section .thumb').click(function(){

		$('.product_images_section .thumb').not(this).removeClass('selected');
		$(this).addClass('selected');
		$( '.product_primary_image img').css('transform','');
		if ($('.product_images_section .thumb').hasClass('selected')) {
			var thumb_index = $(this).index() + 1;
			$img_container.find('img').attr("src","img/conf_m_img_" + thumb_index + ".jpg");
		}
		$img_container.find('img').removeClass('zoomed')
		curr_num = $(this).index() + 1;
	});
	
	$('.product_images_section .product_img_prev').click(function() {
		var counter_prev = curr_num - 1;
		curr_num = counter_prev;
		if (counter_prev < 1 ) {
			counter_prev = img_length;
			curr_num = img_length;
		}
		$img_container.find('img').attr("src","img/conf_m_img_" + curr_num + ".jpg");		
		$('.thumb').eq((curr_num-1)).addClass('selected');
		$('.thumb').eq(curr_num-4).removeClass('selected');
	});
	$('.product_images_section .product_img_next').click(function(){

		var counter_next = curr_num + 1;
		curr_num = counter_next;	
		if (counter_next > img_length ) {
			counter_next = 1;
			curr_num = 1;
		}
		$img_container.find('img').attr("src","img/conf_m_img_" + curr_num + ".jpg");
		$('.product_images_section .thumb').eq((curr_num-1)).addClass('selected');
		$('.product_images_section .thumb').eq((curr_num-2)).removeClass('selected');
	});	


	function imgSize(){
	    $img_container.find('img').load(function(){
	    	var curr_src = $(this).attr("src");
	    	if (curr_src.indexOf(unicue_lg_img_str)>=0) {
		        xl_img_width = $img_container.find('img').width();
		        xl_img_heigth = $img_container.find('img').height();
		    }
	    });
	} 
	imgSize(); 

	$img_container.click(function(e){
		$(this).find('img').toggleClass('zoomed');
		if ($('.product_primary_image img').hasClass('zoomed')) {
			$(this).find('img').attr("src","img/conf_xl_img_" + curr_num + ".jpg");
			new_pos = newPosition(e.offsetX, e.offsetY);
			setPosition(); 
		} else {
			$(this).find('img').attr("src","img/conf_m_img_" + curr_num + ".jpg");	
			$( '.product_primary_image img').css('transform','');		
		}
	});	

	function newPosition(curr_offsetX, curr_offsetY) {
		canvas_width = $img_container.width();
		canvas_heigth = $img_container.height();

		zoom_ratio_x = xl_img_width / canvas_width;
		zoom_ratio_y = xl_img_heigth / canvas_heigth;

		h_position_fixed = xl_img_width-curr_offsetX-(canvas_width-curr_offsetX)*zoom_ratio_x;
		v_position_fixed = xl_img_heigth-curr_offsetY-(canvas_heigth-curr_offsetY)*zoom_ratio_y;

		return {
			x: h_position_fixed,
			y: v_position_fixed
		}
	}

	function setPosition() {
		$img_container.find('img').css('transform',"translate(-"+new_pos.x+"px" + ",-" + new_pos.y+"px)")		
	}

	$('.product_images_container .product_img_prev, .product_images_container .product_img_next').click(function(){
		$img_container.find('img').removeClass('zoomed');
		$img_container.find('img').css('transform','');	
	}); 

	var img_wrap_width = $img_container.width();
	var img_wrap_height = $img_container.height();		
	var img_width = $img_container.find('img').width();
	var img_height = $img_container.find('img').height();

	var mY = 0;
	var mX = 0;

	$img_container.on('mousemove', function (e) {		
	  	if ($img_container.find('img').hasClass('zoomed')) {
		  	offset_left = e.pageX;
			offset_top = e.pageY;
			
			var position_left = $img_container.offset().left;
			var position_top = $img_container.offset().top;
		
			var h_position = offset_left - position_left;	
			var v_position = offset_top - position_top;

			new_pos = newPosition(h_position, v_position);
		    
			$img_container.find('img').css('transform',"translate(-"+new_pos.x+"px" + ",-" + new_pos.y+"px)")		 

		    mY = e.pageY;
		    mX = e.pageX;
	  	}   
	});

});














/*
$(document).ready(function(){

	var img_length = $('.thumb').length;
	var curr_num = $('.thumb.selected').index() + 1;
	var canvas_width = $(".product_primary_image").outerWidth();
	var canvas_height = $(".product_primary_image").outerHeight();
	var zoomed_img_width;
	var zoomed_img_height;
	var h_koef;
	var v_koef;

	//console.log(canvas_height);

	$('.thumb').click(function(){
		$('.thumb').not(this).removeClass('selected');
		$(this).addClass('selected');
		if ($('.thumb').hasClass('selected')) {
			var thumb_index = $(this).index() + 1;
			$(".product_primary_image img").attr("src","img/conf_m_img_" + thumb_index + ".jpg");
		}
		$('.product_primary_image img').removeClass('zoomed');

		curr_num = $(this).index() + 1;
		
	});
	
	$('.product_img_prev').click(function() {
		var counter_prev = curr_num - 1;
		curr_num = counter_prev;
		if (counter_prev < 1 ) {
			counter_prev = img_length;
			curr_num = img_length;
		}
		$(".product_primary_image img").attr("src","img/conf_m_img_" + curr_num + ".jpg");		
		$('.thumb').eq((curr_num-1)).addClass('selected');
		$('.thumb').eq(curr_num-4).removeClass('selected');
	});
	$('.product_img_next').click(function(){
		var counter_next = curr_num + 1;
		curr_num = counter_next;	
		if (counter_next > img_length ) {
			counter_next = 1;
			curr_num = 1;
		}
		$(".product_primary_image img").attr("src","img/conf_m_img_" + curr_num + ".jpg");
		$('.thumb').eq((curr_num-1)).addClass('selected');
		$('.thumb').eq((curr_num-2)).removeClass('selected');
	});	

	$('.product_primary_image img').click(function(e){
		$(this).toggleClass('zoomed');

		if ($('.product_primary_image img').hasClass('zoomed')) {
			$(this).attr("src","img/conf_xl_img_" + curr_num + ".jpg");

			offset_left = e.pageX;
			offset_top = e.pageY;			
			var position_left = $('.product_primary_image').offset().left;
			var position_top = $('.product_primary_image').offset().top;		
			h_pos_clicked = offset_left - position_left;
			v_pos_clicked = offset_top - position_top;	
			
			function imgSize(){
			    $(".product_primary_image img.zoomed").load(function(){
			        zoomed_img_width = $(".product_primary_image img.zoomed").width();
			        zoomed_img_height = $(".product_primary_image img.zoomed").height();
			        $(this).attr("width",zoomed_img_width).attr("height",zoomed_img_height); 		 
			        h_koef = (zoomed_img_width/canvas_width)-1;
					v_koef = (zoomed_img_height/canvas_height)-1;
			    });
			} 
			imgSize();			

			h_pos_clicked_fixed = h_pos_clicked*h_koef;
			v_pos_clicked_fixed = v_pos_clicked*v_koef;					

			setPosition();

		} else {
			$(this).attr("src","img/conf_m_img_" + curr_num + ".jpg");
			$( '.product_primary_image img').css('transform','');					
		}
	});	

	function setPosition() {
		$('.product_primary_image img').css('transform',"translate(-"+h_pos_clicked_fixed+"px" + ",-" + v_pos_clicked_fixed+"px)")		
		
	}

	$('.product_img_prev, .product_img_next').click(function(){
		$('.product_primary_image img').removeClass('zoomed');

	}); 

	var img_wrap_width = $('.product_primary_image').width();
	var img_wrap_height = $('.product_primary_image').height();		
	var img_width = $('.product_primary_image img').width();
	var img_height = $('.product_primary_image img').height();

	var mY = 0;
	var mX = 0;

	$('.product_primary_image').on('mousemove', function (e) {		
	  	if ($('.product_primary_image img').hasClass('zoomed')) {
		  	offset_left = e.pageX;
			offset_top = e.pageY;
					
			var position_left = $('.product_primary_image').offset().left;
			var position_top = $('.product_primary_image').offset().top;		
			var h_position = offset_left - position_left;
			var v_position = offset_top - position_top;	

			//h_position_fixed = h_position*2.125 ;
		   // v_position_fixed = v_position*2.125 ;

		    h_position_fixed = h_position*h_koef;
		    v_position_fixed = v_position*v_koef;
		    //console.log(h_koef);

			$('.product_primary_image img').css('transform',"translate(-"+h_position_fixed+"px" + ",-" + v_position_fixed+"px)")		 
		  
		    // set new mY after doing test above
		    mY = e.pageY;
		    mX = e.pageX;
	  	} 	  
	});

});

*/