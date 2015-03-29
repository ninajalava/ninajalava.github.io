$(document).ready(function() {
	$('.flicker-example').flicker({
		dot_navigation: false
	});
	
    $('.header_menu li').hover(
        function () {
            $('ul:first', this).css('display','block');
        }, 
        function () {
            $('ul:first', this).css('display','none');         
        }
    );  
	$('.header_spacing').css('height', $('#header').outerHeight() + 'px');
	$('.fullplate').css('height', ($(window).height() - $('#header').outerHeight()) + 'px');	
	    
	$('#main_header_menu').slicknav();
	    
	if($('#header').css('position') == 'absolute')
		$('#header').css('top', $('.slicknav_menu').outerHeight() + 'px');
	else
		$('#header').css('top', '0px');                 				
	    
	$('.home_box').hover(
		function() {
			$(this).find('.home_box_hover').css('display','block');
		},
		function() {
			$(this).find('.home_box_hover').css('display','none');
		}
	);
	$(".scroller").on("click",function(){
		//$(".webplate-content").animate({scrollTop:d},1e3,"easeInOutCubic");
		$("html, body").animate({ scrollTop: $('.fullplate').outerHeight() }, "slow");
		//alert('test');
	});	
	    
	    
});
$(window).load(function() {
	$('.header_spacing').css('height', $('#header').outerHeight() + 'px');
	$('.fullplate').css('height', ($(window).height() - $('#header').outerHeight()) + 'px');	
});
$(window).scroll(function() {
	$('.header_spacing').css('height', $('#header').outerHeight() + 'px');
	if($('#header').css('position') == 'absolute')
		$('#header').css('top', $('.slicknav_menu').outerHeight() + 'px');
	else
		$('#header').css('top', '0px');
	
});
$(window).resize(function() {
	$('.header_spacing').css('height', $('#header').outerHeight() + 'px');
	if($('#header').css('position') == 'absolute')
		$('#header').css('top', $('.slicknav_menu').outerHeight() + 'px');
	else
		$('#header').css('top', '0px');
});