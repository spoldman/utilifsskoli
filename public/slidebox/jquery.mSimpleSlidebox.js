/*
Slidebox jQuery banner rotator and image slideshow plugin
Author: malihu [http://manos.malihu.gr]
Homepage: http://manos.malihu.gr/slidebox-jquery-banner-rotator
*/
(function($){
	$(document).data("slideboxID",0);
	$.fn.mSlidebox=function(options){
		var defaults={ //default options
			autoPlayTime:7000, //milliseconds
			animSpeed:1000, //milliseconds
			easeType:"easeInOutQuint", //see jQuery UI easing types
			controlsPosition:{buttonsPosition:"inside",thumbsPosition:"inside"}, //inside/outside
			numberedThumbnails:false, //display numbers inside thumbnails
			pauseOnHover:true //boolean
		};
		var options=$.extend(defaults,options);
		return this.each(function(){
			var slidebox=$(this);
			var slideboxID=$(document).data("slideboxID");
			slideboxID++;
			$(document).data("slideboxID",slideboxID);
			slidebox.wrap("<div class='slideboxContainer slideboxContainer_"+$(document).data("slideboxID")+"' />");
			var slideboxContainer=slidebox.parent(".slideboxContainer");
			var autoPlayTimer;
			var slideboxWidth=slidebox.width();
			var slideboxSlides=slidebox.find("ul");
			slideboxSlides.addClass("slideboxSlides");
			var slideboxSlide=slideboxSlides.children("li");
			var slideboxTotalWidth;
			var slideboxEnd;
			var slideboxStart="0";
			var currentSlide=1;
			if(slideboxSlide.length>1){ //if more than 1 slides
				autoPlayTimer=setInterval(autoPlay,options.autoPlayTime);
				var autoPlayState="on";
				if(options.controlsPosition.buttonsPosition=="outside"){
					slidebox.after("<a class='slideboxPrevious'></a><a class='slideboxNext'></a>");
				}else{
					slidebox.append("<a class='slideboxPrevious'></a><a class='slideboxNext'></a>");
				}
				var slideboxPrevious=slideboxContainer.find(".slideboxPrevious");
				var slideboxNext=slideboxContainer.find(".slideboxNext");
				if(options.controlsPosition.thumbsPosition=="outside"){
					slidebox.after("<div class='slideboxThumbs' />");
				}else{
					slidebox.append("<div class='slideboxThumbs' />");
				}
				var slideboxThumbs=slideboxContainer.find(".slideboxThumbs");
				slideboxSlide.each(function(index){
					if(index >= 1){
						$('.image-box-' + (index+1)).css({left: "+="+slideboxWidth});
					}
					if(options.numberedThumbnails){
						slideboxThumbs.append("<a class='slideboxThumb' rel='"+(index+1)+"'>"+(index+1)+"</a>");
					}else{
						slideboxThumbs.append("<a  class='slideboxThumb' rel='"+(index+1)+"' />");
					}
					$(this).attr("rel",index+1).addClass("slideboxSlide slideboxSlide_"+(index+1)).children().addClass("slideboxCaption");
					slideboxTotalWidth=(index+1)*slideboxWidth;
					slideboxSlides.css("width",slideboxTotalWidth);
					slideboxEnd=index*slideboxWidth;
				});
				var slideboxThumb=slideboxThumbs.children(".slideboxThumb");
				slideboxThumb.click(function(e){
					e.preventDefault();
					SlideboxAction($(this).attr("rel"));
				});
				slideboxNext.click(function(e){
					e.preventDefault();
					SlideboxAction("next","stop");
				});
				slideboxPrevious.click(function(e){
					e.preventDefault();
					SlideboxAction("previous","stop");
				});
				if(options.pauseOnHover){
					slidebox.hover(function(){
						clearInterval(autoPlayTimer);
					},function(){
						if(autoPlayState!="off"){
							autoPlayTimer=setInterval(autoPlay,options.autoPlayTime);
						}
					});
				}
				slideboxThumb.first().addClass("selectedSlideboxThumb");
			}else{ //if less than 1 slides
				slideboxSlide.each(function(){
					$(this).addClass("slideboxSlide slideboxSlide_1").children().addClass("slideboxCaption");
				});
			}
			function autoPlay(){
				SlideboxAction("next");
			}
			slideboxSlides.css("left",0);
			function SlideboxAction(slideTo,autoPlay){
				var leftPosition=parseInt(slideboxSlides.css("left"));
				if(!slideboxSlides.is(":animated")){
					var selectedSlideboxThumb=slideboxThumbs.children(".selectedSlideboxThumb");
					if(slideTo=="next"){ // Next button
						if(autoPlay=="stop"){
							clearInterval(autoPlayTimer);
							autoPlayState="off";
						}
						
						if(leftPosition==-slideboxEnd){


							// End of slides
							goRight();
							if(!slideboxSlides.data("carouselFirst")){
								slideboxSlide.first().clone().appendTo(slideboxSlides);

								slideboxSlides.css("width",slideboxSlides.width()+slideboxWidth).data("carouselFirst","duplicated");
							}
							slideboxSlides.animate({left:-(slideboxSlides.width()-slideboxWidth)},options.animSpeed,options.easeType,function(){
								slideboxSlides.css("left",slideboxStart);
							});
							slideboxThumb.first().addClass("selectedSlideboxThumb");
							slideboxThumb.last().removeClass("selectedSlideboxThumb");
							currentSlide = 1;
						}else{
							// Next slide
							goRight(); // Paralax function on image-box				
							slideboxSlides.animate({left:"-="+slideboxWidth},options.animSpeed,options.easeType); //next
							selectedSlideboxThumb.removeClass("selectedSlideboxThumb").next().addClass("selectedSlideboxThumb");
							currentSlide += 1;
						}
					}else if(slideTo=="previous"){ //Previous button
						if(autoPlay=="stop"){
							clearInterval(autoPlayTimer);
							autoPlayState="off";
						}
						if(leftPosition==slideboxStart){
							// Beginning of slides
							goLeft();
							if(!slideboxSlides.data("carouselLast")){
								slideboxSlide.last().clone().prependTo(slideboxSlides);
								slideboxSlides.css({"width":slideboxSlides.width()+slideboxWidth,"left":-slideboxWidth}).data("carouselLast","duplicated");
							}
							slideboxSlides.animate({left:0},options.animSpeed,options.easeType,function(){
								slideboxSlides.css("left",-slideboxTotalWidth);
								slideboxStart=-slideboxWidth;
								slideboxEnd=slideboxTotalWidth;
							});
							slideboxThumb.first().removeClass("selectedSlideboxThumb");
							slideboxThumb.last().addClass("selectedSlideboxThumb");
							currentSlide = slideboxSlide.length;
						}else{
							// Previous slide
							goLeft(); // Paralax function on image-box				
							slideboxSlides.animate({left:"+="+slideboxWidth},options.animSpeed,options.easeType); //previous
							selectedSlideboxThumb.removeClass("selectedSlideboxThumb").prev().addClass("selectedSlideboxThumb");
							currentSlide -= 1;
						}
					}else{ //go to slide
						var slide2;
						if(!slideboxSlides.data("carouselLast")){
							slide2=(slideTo-1)*slideboxWidth;
						}else{
							slide2=slideTo*slideboxWidth;
						}
						if(leftPosition!=-slide2){
							clearInterval(autoPlayTimer);
							autoPlayState="off";
							goToSlide(slideTo);
							slideboxSlides.animate({left:-slide2},options.animSpeed,options.easeType); 
							selectedSlideboxThumb.removeClass("selectedSlideboxThumb");
							slideboxThumb.eq((slideTo-1)).addClass("selectedSlideboxThumb");
						}
						currentSlide = parseInt(slideTo);
					}
				}
			}
			function goRight(){
				
				var current = $('.image-box-' + currentSlide);
				var next;

				if(currentSlide === slideboxSlide.length){
					next = $('.image-box-1');
				} else {
					next = $('.image-box-' + (currentSlide+1));
				}
				
				sendBoxLeft(current, getBoxRight(next));
			}
			function goLeft(){
				
				var current = $('.image-box-' + currentSlide);
				var prev;
				if(currentSlide === 1){
					prev = $('.image-box-' + slideboxSlide.length);
				} else {
					prev = $('.image-box-' + (currentSlide-1));
				}
				
				sendBoxRight(current, getBoxLeft(prev));
			}

			function goToSlide(s){
				var current = $('.image-box-' + currentSlide);
				var prev = $('.image-box-' + s);
				
				if(s>currentSlide){
					// Fara til hægri
					sendBoxLeft(current, getBoxRight(prev));
				} else {
					// Fara til vinstri
					sendBoxRight(current, getBoxLeft(prev));
				}				
			}


			function sendBoxLeft(box, callback){
				box.last().animate({left: "-="+(slideboxWidth+1000)}, options.animSpeed+400, function () {
					box.last().css({left: "+=" + 1000})
				});
				box.first().animate({left: "-="+slideboxWidth}, options.animSpeed+100, callback);
			}

			function sendBoxRight(box, callback){
				box.last().animate({left: "+="+(slideboxWidth+1000)}, options.animSpeed+400, function () {
					box.last().css({left: "-=" + 1000})
				});
				box.first().animate({left: "+="+slideboxWidth}, options.animSpeed+100, callback);
			}
			function getBoxLeft(box, callback){
				if(box.position().left > 0){
					// Hann er hægramegin sendum yfir
					box.css({left: "-=" +slideboxWidth*2});
				}
				box.last().css({left: "-=" + 1000})
				box.last().animate({left: "+="+(slideboxWidth+1000)}, options.animSpeed+500, null);
				box.first().animate({left: "+="+slideboxWidth}, options.animSpeed+500, callback);
			}

			function getBoxRight(box, callback){
				if(box && box.position().left < 0){
					// Hann er vinstramegin sendum yfir
					box.css({left: "+=" +slideboxWidth*2});
				}
				box.last().css({left: "+=" + 1000})
				box.last().animate({left: "-="+(slideboxWidth+1000)}, options.animSpeed+500, null);
				box.first().animate({left: "-="+slideboxWidth}, options.animSpeed+500, callback);

			}


			
		});
	};

})(jQuery);

