/*
 * jQuery "JustSlide" content slider plug-in 0.1
 *
 * http://blog.justprofessionals.com/THIS_IS_WHERE_MY_POST_WILL_GO
 * Copyright (c) 2010 Jeremy Woertink
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function($) {
	$.extend($.fn, {
		justslide: function(options) {
			var slider = this;
			//This is how many items to display
			slider.display = options['display'] || 2;
			//This is how many to slide
			slider.slide = options['slide'] || 1;
			//This is the speed of the animation
			slider.speed = options['speed'] || 'slow';
			//Enable the slider if there are more than 1 child element
			slider.enabled = ($(slider).children().length > 1) ? true : false;
			slider.log = function(msg) {
				if('console' in window) window.console.log(msg);
			}
			if(slider.enabled) {
				var childCount = $(slider).children().length;
				var childHeight = function() {
					var height = 0;
					height += $(slider).children().height();
					height += parseInt($(slider).children().css('margin-top'), 10);
					height += parseInt($(slider).children().css('margin-bottom'), 10);
					height += parseInt($(slider).children().css('padding-top'), 10);
					height += parseInt($(slider).children().css('padding-bottom'), 10);
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
					'z-index': '1',
					'width': ((childWidth() * slider.display) + 'px'),
					'height': (childHeight() +'px')
				});
				$(slider).children().css({
					'float': 'left',
					'position': 'absolute',
					'z-index': 2,
					'top': 0
				});
				var left = 0;
				$(slider).children().each(function(i,e) {
					$(e).css('left', left);
					left += childWidth();
				});
			
				var canMoveBack = function() {
					return (parseInt($(slider).children(':eq(0)').css('left'), 10)+childWidth() <= 0);
				}
				var canMoveNext = function() {
					return (parseInt($(slider).children(':eq('+(childCount - 1)+')').css('left'), 10) - childWidth() >= 0);
				}
			
				if($(options['next']).length > 0) {
					$(options['next']).live('click', function() {
						if(canMoveNext()) {
							$(slider).children().animate({
								left: '-='+Math.abs(parseInt(childWidth()), 10)
							}, slider.speed);
						}
					
						return false;
					});
				}

				if($(options['prev']).length > 0) {
					$(options['prev']).live('click', function() {
						if(canMoveBack()) {
							$(slider).children().animate({
								left: '+='+Math.abs(parseInt(childWidth()), 10)
							}, slider.speed);
						}
					
						return false;
					});
				}

			}	else {
				slider.log('Could not activate slider. Try adding more child elements.');
			}
		}
	});
})(jQuery);