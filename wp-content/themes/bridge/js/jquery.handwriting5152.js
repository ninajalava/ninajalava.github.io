(function($) {
    $.fn.HandWriting = function(options) {
    	var defaults = {
				xml_file: 'letters_verdana.xml',//xml file with letters
				line_offset_x: 0,//left margin?
				line_offset_y: 0,//top margin?
				text_lineWidth: 1,//default line width
				text_color: 'rgba(127,127,127,1)',//default line color, opacity is not relevant
				steps_between_letters: 3,//parts to devide curve between letters
				letter_steps: 3,//parts to devide each curve forming a letter
    		show_pen: true,//show pen
		    pen_image: 'pen.png',//default pen image
    		anim_layers: 0,//animation frames for images
				hw_scale: 0.5,//scale letters by
				line_height: 50,//height in pixels if multiline animation is needed
				isc: [],//scale images by
				stroke_above_image: false,//text can be animated above or below the images
				drawings: [],//no images by default
				paused: false,//on start
				replay: false,//auto replay option
				wait_after_finish_duration: 2000,//when animation is ready wait
				clear_frames: false,//clear drawing canvases on each frame. slows execution but can be needed for some images animation
				finish_effect: 'none',//after wait perfom fade or just stay fade/none
				finish_effect_duration: 1000,//if fade use this duration
				animate: false,//images will animate or just scale rotate one image per position
				image_rotation:'random',//each image can point in different direction random/fixed
				random_pos_x: 0.2,//each image can be offset from the line of the letter. 0.0 1.0 of image width (multiplied by image scale variable)
				random_pos_y: 0.2,//each image can be offset from the line of the letter. 0.0 1.0 of image height (multiplied by image scale variable)
				text_align: 'left',
				use_stroke: true,
				complete: null//complete handler
    	},
    	settings = $.extend({}, defaults, options);
    	//time in ms to draw each part of each curve
    	if(settings.ms === undefined) settings.ms = Math.ceil(100/settings.letter_steps);
    	if(settings.ms > 30) settings.ms = 30;
			var paused = settings.paused;
			var drawings = [];//array to hold the images
			//-------------------------------------------------------------------------------------------
			//code that loads each image and sets a ready variable
			//drawing cannot start before images are loaded
			var img_loaded = "ready";
			var img_id = 0;
			function load_next(){
				img_id++;
				if(img_id<settings.drawings.length){
					drawings[img_id] = new Image();				
					drawings[img_id].onload = load_next;
					drawings[img_id].src = settings.drawings[img_id];
				}
				else{
					img_loaded = "ready";
				}
			}
			if(settings.drawings.length){
				img_loaded = "loading";
				drawings[img_id] = new Image();				
				drawings[img_id].onload = load_next;
				drawings[img_id].onerror = function(){
					img_loaded = "error";
				}
				drawings[img_id].src = settings.drawings[img_id];
			}
			//-------------------------------------------------------------------------------------------
			//some public functions
			this.pause_anim = function(){
				paused = true;
			}
			this.play_anim = function(){
				paused = false;
			}
			//-------------------------------------------------------------------------------------------
			return this.each(function() {
				var queue = [];//array to hold images animation info
				var finish_grow;//animate images after drawing has finished
				var curves = [];//store info from xml file for each curve to be drawn - coordinates mainly
	     	var cbr;//curve counter
				var which_curve;//the curve drawing will start from the first curve
				var which_step;//each curve will draw for number of frames starting from the first
				var which_img;//image counter
				var line_br;//line counter
				var draw_int;//set interval variable
				var grow_int;//set interval variable
				var text_width;//used for multiline text
				var text_height;//used for multiline text
				var ctx_img;//canvas for images
				var ctx_anim;//canvas for images during animation
				var ctx_ready;//canvas for curves when ready
				var ctx_draw;//canvas for curves while drawing
				var ready;//ready with drawing curves but not with images
				var obj;//store each object to run plugin in
				var s_x, s_y, f_x, f_y, c_x, c_y;//store coordinates of start, end and control point
				var alpha;//0-100 to draw or not on pen move
				var old_alpha;//helper
				var span_color;//store color for one part of text
				var span_images_ids = [];//store images for one part of text
				var span_lineWidth;//store stroke width for one part of text
				var images_ids = [];//store arrays of span_images_ids for each part
				//set some variables for each obj
	    	var line_height = settings.line_height;
				var line_offset_x = settings.line_offset_x;
				var line_offset_y = settings.line_offset_y;
				var hw_scale = settings.hw_scale;
	    	var show_pen = settings.show_pen;
	    	var replay = settings.replay;
				var wait_after_finish_duration = settings.wait_after_finish_duration;
				var text_color = settings.text_color;
				var text_lineWidth = settings.text_lineWidth;
				var sdrawings = settings.drawings;
				var animate = settings.animate;
				var anim_layers = settings.anim_layers;
				var clear_frames = settings.clear_frames;
				if(animate) anim_layers = settings.drawings.length;
				var finish_effect = settings.finish_effect;
				var finish_effect_duration = settings.finish_effect_duration;
				var image_rotation = settings.image_rotation;
				var random_pos_x = settings.random_pos_x;
				var random_pos_y = settings.random_pos_y;
				var text_align = settings.text_align;
				var use_stroke = settings.use_stroke;
				
				obj = $(this);
				if(obj.attr('style').indexOf('text-align') !== -1) text_align = obj.css("text-align");
				var atext = $.trim(obj.html());//text of targeted div - can be pure text or spans
				obj.html('');
				text_width = obj.width();//used for multiline text
				text_height = obj.height();//used for multiline text
				
				//read xml file to get the curves drawing indo dor the chosen font
	      $.get(settings.xml_file, function(ls){
					//-------------------------------------------------------------------------------------------------
					obj.init = function(){
						//init of some variables
						finish_grow = false;
						queue = [];
						curves = [];
			     	cbr = 0;
						which_curve = 0;
						which_step = 0;
						which_img = 0;
						line_br = 0;
						images_ids = [];
						word_index_arr = [];
						var last_fixed;
						var my_ww = 0;//sums widths of chars
						var last_ww = 0;//stores width of words
						var letter_width = 0;
						var break_found = false;
						
						obj.empty();//remove dynamically added canvases which will be added again for a possible replay
						var z_index = 0;
						if(settings.stroke_above_image) z_index = 4;
						//this canvas shows already animated curves and ctx_ready is its 2d context
						obj.append('<canvas id="myCanvasReady" width="'+obj.width()+'" height="'+obj.height()+'" style="position: absolute; top: 0px; left: 0px; z-index: '+z_index+';"></canvas>');
						canvas = obj.children("#myCanvasReady").get(0);
						ctx_ready = canvas.getContext("2d");
						ctx_ready.strokeStyle = text_color;
						ctx_ready.lineWidth = settings.text_lineWidth;;		
						ctx_ready.lineCap = "square";
		
						z_index = 1;
						//this canvas shows animating of curves and ctx_draw is its 2d context
						if(settings.stroke_above_image) z_index = 5;
						obj.append('<canvas id="myCanvasDrawing" width="'+obj.width()+'" height="'+obj.height()+'" style="position: absolute; top: 0px; left: 0px; z-index: '+z_index+';"></canvas>');
						canvas = obj.children("#myCanvasDrawing").get(0);
						ctx_draw = canvas.getContext("2d");
						ctx_draw.lineCap = "square";
		
						//if images are defined add more canvases
						if(drawings.length>0){
							//myCanvasImg is where animated images are shows, ImgDrawing is where animations take place.
							obj.append('<canvas id="myCanvasImg" width="'+obj.width()+'" height="'+obj.height()+'" style="position: absolute; top: 0px; left: 0px; z-index: 2;"></canvas>');
							obj.append('<canvas id="ImgDrawing" width="'+obj.width()+'" height="'+obj.height()+'" style="position: absolute; top: 0px; left: 0px; z-index: 3;"></canvas>');
							canvas = obj.children("#myCanvasImg").get(0);
							ctx_img = canvas.getContext("2d");					
							canvas = obj.children("#ImgDrawing").get(0);
							ctx_anim = canvas.getContext("2d");
							/*for(var i=0;i<anim_layers;i++){queue.push([-1, 0, 0, 0]);}*/
						}
						if(settings.show_pen){//add pen
							obj.append('<div id="pen" style="position: absolute; top: 0px; left: 0px; z-index: 10; display: none"><img src="'+settings.pen_image+'"  /></div>');
						}
						space_width = parseFloat($(ls).find('ls').attr('s_w'));//the width of space char in pixels
						letter_height = parseFloat($(ls).find('ls').attr('l_h'));//the height of font in pixels
						next_letter_x = 0;
						get_word_index = true;//to get the index of first word
						word_index = 0;
						last_fixed = 0;
						//-------------------------------------------------------------------------------------------------
						//prepare curves
						//text may be devided in spans					
						$.each( $.parseHTML(atext), function( ii, el ) {
							span_text = el.nodeValue;
							//default color, width and images
							span_color = text_color;
							span_images_ids = [];
							for(d=0; d<sdrawings.length; d++){
								span_images_ids[d] = d;
							}
							span_lineWidth = text_lineWidth;
							//take color, width or images if defined in span attributes
							if(typeof $(el).html() != 'undefined'){
								span_images_ids = [];
								span_text = $(el).html();
								span_text = $(el).html(span_text).text();
								if($(el).prop('style').color!= '') {
									span_color = $(el).css("color");
								}
								if(typeof $(el).data("images")!= 'undefined'){
									string_images = String($(el).data("images"));
									parts = string_images.split(",");
									for(var i=0;i<parts.length;i++){
										more_parts = parts[i].split("-");
										if(more_parts.length==1){
											span_images_ids.push(Number(more_parts[0]));
										}
										else if(more_parts.length == 2){
											si = Number(more_parts[0]); ei = Number(more_parts[1]);
											if(typeof si==='number' && (si%1)===0 && typeof ei==='number' && (ei%1)===0){
												if(si>ei) for(var j=si; j>=ei; j--) span_images_ids.push(j);
												else for(var j=si; j<=ei; j++) span_images_ids.push(j);
											}
										}
									}
								}
								if(typeof $(el).data("width")!= 'undefined') span_lineWidth = Number($(el).data("width"))
							}
							//new line can be processed if text is in span
							span_text = span_text.replace(/<br>/g, '|');
							queue[ii] = [];
							if(animate) anim_layers = span_images_ids.length;
							//create the queue for images
							for(var i=0;i<anim_layers;i++){
								queue[ii].push([-1, 0, 0, 0, 0]);
							}
							images_ids[ii] = span_images_ids;
							for(i=0;i<span_text.length;i++){//for all letters in requested sentence
								if(span_text.charAt(i)!=" " && get_word_index){
									get_word_index = false;
									word_index = cbr;
									if(word_index>0) word_index++;
									word_indent = next_letter_x;
								}
								if(span_text.charAt(i)=="|" || span_text.charAt(i)==" "){
									get_word_index = true;//indicating that new word is to come
									next_letter_x+=space_width;
									word_index_arr.push(word_index);
									letter_width = space_width;
									last_ww = my_ww;
									
									if(span_text.charAt(i)=="|"){//break found
										if(i>0 && span_text.charAt(i-1)=="|"){
											line_br++;//next line
										}
										break_found = true;
									}
									else{
										my_ww += letter_width*hw_scale;
									}
								}
								else{
									//get info from xml
							    letter = $(ls).find('l[id="'+span_text.charAt(i)+'"]');
							    letter_width = parseFloat(letter.attr('w'));
									my_ww += letter_width*hw_scale;//all words width
									if(cbr>0){//after first letter add invisible animation between letters to move the pen
										steps = settings.steps_between_letters;
										//set curve
										curves[cbr++] = Array(f_x, f_y, (parseFloat(letter.find('c:first').attr('s_x'))+next_letter_x+line_offset_x)*hw_scale, (parseFloat(letter.find('c:first').attr('s_y'))+line_br*line_height+line_offset_y+letter_height)*hw_scale, s_x, s_y, steps, 0, 0, 0, ii, -1);
									}
									width_reached = false;
									//for all curves in symbol
							    letter.find('c').each(function(c){  
							    	c = $(this);
							    	s_x = parseFloat(c.attr('s_x'))+next_letter_x;
							    	s_y = parseFloat(c.attr('s_y'))+line_br*line_height;
							    	f_x = parseFloat(c.attr('f_x'))+next_letter_x;
							    	f_y = parseFloat(c.attr('f_y'))+line_br*line_height;
							    	c_x = parseFloat(c.attr('c_x'))+next_letter_x;
							    	c_y = parseFloat(c.attr('c_y'))+line_br*line_height;
							    	s_x = (s_x+line_offset_x)*hw_scale;
							    	s_y = (s_y+line_offset_y+letter_height)*hw_scale;
							    	f_x = (f_x+line_offset_x)*hw_scale;
							    	f_y = (f_y+line_offset_y+letter_height)*hw_scale;
							    	c_x = (c_x+line_offset_x)*hw_scale;
							    	c_y = (c_y+line_offset_y+letter_height)*hw_scale;
							    	a = parseFloat(c.attr('a'));
										steps = settings.letter_steps;
										if(s_x > (text_width-line_offset_x) || f_x > (text_width-line_offset_x)){
											width_reached = true;
										}
										//set curve
										curves[cbr++] = Array(s_x, s_y, f_x, f_y, c_x, c_y, steps, a, span_color, span_lineWidth, ii, -1);
									})
									//handle new line
									if(width_reached || break_found){
										if(word_indent>1){
											line_br++;//next line	
											for(k=word_index;k<cbr;k++){
												curves[k][0] -= word_indent*hw_scale;
												curves[k][2] -= word_indent*hw_scale;
												curves[k][4] -= word_indent*hw_scale;
												curves[k][1] += line_height*hw_scale;
												curves[k][3] += line_height*hw_scale;
												curves[k][5] += line_height*hw_scale;
											}
											if(word_index>0){
												s_x -= word_indent*hw_scale;f_x -= word_indent*hw_scale;c_x -= word_indent*hw_scale;
												s_y += line_height*hw_scale;f_y += line_height*hw_scale;c_y += line_height*hw_scale;
											}
											for(k=last_fixed;k<word_index;k++){
												curves[k][11] = last_ww; 
											}
											if(!break_found) my_ww -= space_width*hw_scale;
											my_ww -= last_ww;
											last_fixed = word_index;
											next_letter_x -= word_indent;
											word_indent = 0;
										}
										break_found = false;										
									}						
									next_letter_x+=letter_width;
								}
							}
						})
						//handle alignment
						for(var i=0; i<curves.length; i++){
							if(curves[i][11] == -1) curves[i][11] = my_ww;
							if(text_align == "center"){
								curves[i][0]+= (text_width-curves[i][11])/2-line_offset_x;
								curves[i][2]+= (text_width-curves[i][11])/2-line_offset_x;
								curves[i][4]+= (text_width-curves[i][11])/2-line_offset_x;
							}
							else if(text_align == "right"){
								curves[i][0]+= text_width-(curves[i][11]+2*line_offset_x);
								curves[i][2]+= text_width-(curves[i][11]+2*line_offset_x);
								curves[i][4]+= text_width-(curves[i][11]+2*line_offset_x);
							}
							//connect disconnected symbols
							if(i>0 && (Math.abs(curves[i][0]-curves[i-1][2])>space_width*hw_scale/2)){
								curves[i-1][2] = curves[i][0];
								curves[i-1][3] = curves[i][1];
								curves[i-1][6] *= 5;								
							}
						}
					}
					//-------------------------------------------------------------------------------------------------
					obj.handwrite = function(){
				
						grow = function(){//this function places the images on the curves
							var width;
							var height;
							var r_angle;
							var r_scale;
							
							if(clear_frames) ctx_anim.clearRect(0, 0, text_width, text_height);
							ready = false;
							//for all queues
							for(var i=0;i<images_ids.length;i++){
								var myready = false;
								if(queue[i].length>0){
									//for each image in queue
									for(var j=queue[i].length-1;j>=0;j--){
										iid = queue[i][queue[i].length-1-j][0];//for normal mode
										if(iid!=-1){
											if(animate){//for animation sequence mode
												iid = images_ids[queue[i][queue[i].length-1-j][4]][j];//!!!
											}
											myready = true;
											x = queue[i][queue[i].length-1-j][1];
											y = queue[i][queue[i].length-1-j][2];
											rot = queue[i][queue[i].length-1-j][3];
											width = drawings[iid].width;
											height = drawings[iid].height;
											r_angle = rot+(j/anim_layers)*Math.PI/2;
											if(animate) r_angle = rot;
											if(iid>settings.isc.length-1) r_scale = ((j+1)/anim_layers)*settings.isc[0];
											else r_scale = ((j+1)/anim_layers)*settings.isc[iid];
											if(animate) r_scale = settings.isc[0];
											
											ctx_anim.save();
											ctx_anim.translate(x, y);
											ctx_anim.rotate(r_angle);
											ctx_anim.scale(r_scale, r_scale);
											ctx_anim.drawImage(drawings[iid], -width / 2, -height / 2, width, height);
											ctx_anim.restore();
										}
									}						
								}
								ready = myready || ready;//set to true if there is at least one image to animate
							}
							//permanent canvas for images	
							for(var i=0;i<images_ids.length;i++){
								if(queue[i].length>0 && queue[i][0][0]!=-1){
									//clearInterval(grow_int);
									iid = queue[i][0][0];
									if(animate) iid = images_ids[i][images_ids[i].length-1];
									x = queue[i][0][1];
									y = queue[i][0][2];
									rot = queue[i][0][3];
									width = drawings[iid].width;
									height = drawings[iid].height;
									r_angle = rot+((queue[i].length-1)/anim_layers)*Math.PI/2;
									if(animate) r_angle = rot;
									if(iid>settings.isc.length-1) r_scale = ((queue[i].length)/anim_layers)*settings.isc[0];
									else r_scale = ((queue[i].length)/anim_layers)*settings.isc[iid];
									if(animate) r_scale = settings.isc[0];
									ctx_img.save();
									ctx_img.translate(x, y);
									ctx_img.rotate(r_angle);
									ctx_img.scale(r_scale, r_scale);
									ctx_img.drawImage(drawings[iid], -width / 2, -height / 2, width, height);
									ctx_img.restore();
								}
							}
							if(finish_grow){//when animation is finished but there still are images to animate
								for(var i=0;i<images_ids.length;i++){
									queue[i].push([-1, 0, 0, 0, 0]);
									if(animate){if(queue[i].length > images_ids[i].length) queue[i].shift()}
									else{ if(queue[i].length > anim_layers) queue[i].shift();}
								}
								if(!ready){//when all images are done
									clearInterval(grow_int);//stop executing
									if ( $.isFunction( settings.complete ) ) {
										settings.complete.call( this );//call complete handler
									}	
									setTimeout(function(){//wait after finish duration
										if(finish_effect == "fade"){//fade if needed
											if(typeof obj.children("#ImgDrawing") != 'undefined') obj.children("#ImgDrawing").animate({opacity: 0}, finish_effect_duration);
											if(typeof obj.children("#myCanvasDrawing") != 'undefined') obj.children("#myCanvasDrawing").animate({opacity: 0}, finish_effect_duration);
											if(typeof obj.children("#myCanvasImg") != 'undefined') obj.children("#myCanvasImg").animate({opacity: 0}, finish_effect_duration);
											obj.children("#myCanvasReady").animate({opacity: 0}, finish_effect_duration, function(){
												if(replay){//replay if needed
													obj.init();
													draw_int = setInterval(obj.handwrite,settings.ms);
												}											
											});										
										}
										else{//just check relpay
											if(replay){
												obj.init();
												draw_int = setInterval(obj.handwrite,settings.ms);
											}											
										}
									}, wait_after_finish_duration);
								}
							}
						};	
						if(img_loaded == "error"){//if any image cannot be loaded - abort
							clearInterval(draw_int);
						}
						else if(img_loaded == "ready" && !paused){//draw curves
							old_alpha = alpha;
							s_x = curves[which_curve][0];
							s_y = curves[which_curve][1];
							f_x = curves[which_curve][2];
							f_y = curves[which_curve][3];
							c_x = curves[which_curve][4];
							c_y = curves[which_curve][5];
							steps = curves[which_curve][6];
							alpha = curves[which_curve][7];
							//alpha = 1;
							//calculate the moveto and curveto points
							first_step_x = (c_x - s_x)/steps;
							first_step_y = (c_y - s_y)/steps;
							first_curve_step = 1/steps;
							t = which_step*first_curve_step;
							dest_x = (1-t)*(1-t)*s_x + 2*t*(1-t)*c_x + t*t*f_x;
							dest_y = (1-t)*(1-t)*s_y + 2*t*(1-t)*c_y + t*t*f_y;
							control_x = s_x + which_step*first_step_x;
							control_y = s_y + which_step*first_step_y;
							ctx_draw.beginPath();
							if(show_pen){
								obj.children("#pen").css("top",  parseInt(dest_y)+"px");
								obj.children("#pen").css("left", parseInt(dest_x)+"px");
								if(show_pen && obj.children("#pen").css("display")=="none") obj.children("#pen").fadeIn();
							}
							//draw curve
							ctx_draw.moveTo(s_x, s_y);
							ctx_draw.quadraticCurveTo(control_x, control_y, dest_x, dest_y);
							if(alpha>0 && use_stroke){
								ctx_draw.strokeStyle = curves[which_curve][8];
								ctx_draw.lineWidth = curves[which_curve][9];
								ctx_draw.stroke();
							}

							var iid;
							var x;
							var y;
							var sii;//span ide
							
							//set queues
							if(alpha == 0 && which_step == steps){
								//invisible animation between symbols
								sii = curves[which_curve][10];
								if(animate) which_img = 0;
								iid = which_img%images_ids[sii].length;
								which_img++;
								iid = Number(images_ids[sii][iid]);
								x = dest_x;
								y = dest_y;
								if(queue[sii].length > 0){
									rot = Math.random()*Math.PI*2;
									if(image_rotation == 'fixed') rot = 0;
									queue[sii][queue[sii].length-1][0] = iid;
									queue[sii][queue[sii].length-1][1] = x;
									queue[sii][queue[sii].length-1][2] = y;
									queue[sii][queue[sii].length-1][3] = rot;
									queue[sii][queue[sii].length-1][4] = sii;
									if(animate){if(queue[sii].length > images_ids[sii].length) queue[sii].shift()}
									else{ if(queue[sii].length > anim_layers) queue[sii].shift();}
								}
								//push all previous queues one step
								for(var i=sii-1; i>=0;i--){
									queue[i].push([-1, 0, 0, 0, 0]);
									if(animate){if(queue[i].length > images_ids[i].length) queue[i].shift()}
									else{ if(queue[i].length > anim_layers) queue[i].shift();}
								}
							}
							else if(which_curve<curves.length && drawings.length>0){
								if(alpha){
									iid = which_img%images_ids[curves[which_curve][10]].length;
									iid = Number(images_ids[curves[which_curve][10]][iid]);
									if(iid!=-1){
										if(animate || iid>settings.isc.length-1) myisc = settings.isc[0];
										else myisc = settings.isc[iid];
										x = dest_x+(Math.random()*drawings[iid].width-drawings[iid].width/2)*myisc*random_pos_x;
										y = dest_y+(Math.random()*drawings[iid].height-drawings[iid].height/2)*myisc*random_pos_y;
										rot = Math.random()*Math.PI*2;
										if(image_rotation == 'fixed') rot = 0;
									}
									else{
										x = 0;y = 0;rot = 0;
									}
								}
								else{
									iid = -1;x = 0;y = 0;rot = 0;
								}
								sii = curves[which_curve][10];
								queue[sii].push([iid, x, y, rot, sii]);
								
								if(animate){if(queue[sii].length > images_ids[sii].length) queue[sii].shift()}
								else{ if(queue[sii].length > anim_layers) queue[sii].shift();}
																
								//push all previous queues one step
								for(var i=sii-1; i>=0;i--){
									queue[i].push([-1, 0, 0, 0, 0]);
									if(animate){if(queue[i].length > images_ids[i].length) queue[i].shift()}
									else{ if(queue[i].length > anim_layers) queue[i].shift();}
								}
							}
							//next step
							which_step++;
							if(alpha)which_img++;
							if(which_step>steps){//if done with the curve
								if(clear_frames) ctx_draw.clearRect(0, 0, text_width, text_height);
								//canvas for ready curves
								ctx_ready.beginPath();
								ctx_ready.moveTo(s_x, s_y);
								ctx_ready.quadraticCurveTo(c_x, c_y, f_x, f_y);
								if(alpha>0 && use_stroke){
									ctx_ready.strokeStyle = curves[which_curve][8];
									ctx_ready.lineWidth = curves[which_curve][9];
									ctx_ready.stroke();
								}
								which_curve++;//goto next curve
								which_step = 1;//initialize the step counter
								if(which_curve==curves.length){//if all curves are ready
									clearInterval(draw_int);
									finish_grow = true;//flag is finish is on
									grow_int = setInterval(grow,settings.ms);//finish image animations
									if(settings.show_pen){//hide pen
										obj.children("#pen").fadeOut();
									}
								}
							}
							grow();//grow images on each step using queues
						}
					}
					obj.init();//init variables
					draw_int = setInterval(obj.handwrite,settings.ms);//handwrite
				});  
			});
    };
})(jQuery);