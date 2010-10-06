/*
 * jQuery "JustSlide" content slider plug-in 0.4
 *
 * http://blog.justprofessionals.com/just-professionals/just-slide-jquery-content-slider/
 * Copyright (c) 2010 Jeremy Woertink
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function($) {
	$.extend($.fn, {
		justslide: function() {
			var slider = this;
			var options = arguments[0] || {};
			
			//This is how many items to display
			slider.display = options['display'] || 2;
			//This is how many to slide
			slider.slide = options['slide'] || 1;
			//This is the speed of the animation
			slider.speed = options['speed'] || 'slow';
			//Auto slide. Direction is to the left.
			slider.autoSlide = options['autoSlide'] || false;
			//Enable the slider if there are more than 1 child element
			slider.enabled = ($(slider).children().length > 1) ? true : false;
			slider.log = function(msg) {
				if('console' in window) window.console.log(msg);
			}
			slider.prev = function(control) {
				if(control != null) {
					$(control).live('click', function() {
						animatePrev();
						return false;
					});
				} else {
					animatePrev();
				}
			}
			slider.next = function(control) {
				if(control != null) {
					$(control).live('click', function() {
						animateNext();
						return false;
					});
				} else {
					animateNext();
				}
			}
			slider.reset = function() {
				animateReset();
			}
			if(slider.enabled) {
				var childCount = $(slider).children().length;
				$(slider).children().css({
					'float': 'left',
					'position': 'absolute',
					'z-index': 2,
					'top': 0
				});
				function spaceship(a,b) {
					if(a.height < b.height) return -1;
					if(a.height == b.height) return 0;
					if(a.height > b.height) return 1;
				}
				
				var childHeight = function() {
					var height = 0;
					var item = $(slider).children().sort(spaceship)[$(slider).children().length - 1];
					height += $(item).height();
					height += parseInt($(item).css('margin-top'), 10);
					height += parseInt($(item).css('margin-bottom'), 10);
					height += parseInt($(item).css('padding-top'), 10);
					height += parseInt($(item).css('padding-bottom'), 10);
					return height;
				}
				var childWidth = function() {
					var width = 0;
					width += $(slider).children().width();
					width += parseInt($(slider).children().css('margin-left'), 10);
					width += parseInt($(slider).children().css('margin-right'), 10);
					width += parseInt($(slider).children().css('padding-left'), 10);
					width += parseInt($(slider).children().css('padding-right'), 10);
					return width;
				}
			
				$(slider).css({
					'position': 'relative',
					'overflow': 'hidden',
					'list-style': 'none',
					'z-index': '1',
					'width': ((childWidth() * slider.display) + 'px'),
					'height': (childHeight() +'px')
				});
				
				var left = 0;
				$(slider).children().each(function(i,e) {
					$(e).css('left', left);
					left += childWidth();
				});
				
				var animateNext = function() {
					if(canMoveNext()) {
						$(slider).children().animate({
							left: '-='+Math.abs(parseInt(childWidth()), 10)
						}, slider.speed);
					} else {
						return false;
					}
				}
				
				var animatePrev = function() {
					if(canMoveBack()) {
						$(slider).children().animate({
							left: '+='+Math.abs(parseInt(childWidth()), 10)
						}, slider.speed);
					} else {
						return false;
					}
				}
				
				var animateReset = function() {
					var offset = $(slider).children(':first').position().left;
					$(slider).children().animate({
						left: '+='+ Math.abs(offset)
					}, 'slow');
				}
			
				var canMoveBack = function() {
					return (parseInt($(slider).children(':eq(0)').css('left'), 10)+childWidth() <= 0);
				}
				var canMoveNext = function() {
					return (parseInt($(slider).children(':eq('+(childCount - 1)+')').css('left'), 10) - childWidth() >= 0);
				}
				
				if($(options['next']).length > 0) {
					slider.next(options['next']);
				} else {
					$(slider).after('<a href="#" class="nextSlide" rel="'+slider.selector+'">Next &rarr;</a>');
					slider.next('.nextSlide[rel^='+slider.selector+']');
				}

				if($(options['prev']).length > 0) {
					slider.prev(options['prev']);
				} else {
					$(slider).after('<a href="#" class="prevSlide" rel="'+slider.selector+'">&larr; Previous</a>');
					slider.prev('.prevSlide[rel^='+slider.selector+']');
				}
				
				if(slider.autoSlide) {
					setInterval(function() {
						if(canMoveNext()) {
							slider.next();
						} else {
							slider.reset();
						}
					}, 6000);
				}

			}	else {
				slider.log('Could not activate slider. Try adding more child elements.');
			}
		}
	});
})(jQuery);