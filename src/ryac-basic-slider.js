/*
 * ryac-basic-slider
 * https://github.com/ryac/basicslider
 *
 * Copyright (c) 2013 Ryan Yacyshyn
 * Licensed under the MIT license.
 */

(function ($, window) {

	'use strict';

	var log = function (msg) {
			if (window.console) {
				window.console.log('Slider:: ' + msg);
			}
		},

		logWarn = function (msg) {
			if (window.console) {
				window.console.warn('Slider:: ' + msg);
			}
		};

	$.Slider = function (options, element) {
		this.$el = $(element);
		this.init(options);
	};

	$.Slider.defaults = {
		easing: 'ease-in-out',
		element: 'div',
		width: 500,
		speed: 300,
		interval: 2000,
		dir: 'left',
		// callbacks..
		onSlideStart: function () { return false; },
	};

	$.Slider.prototype = {

		init: function (options) {
			// options..
			this.options = $.extend(true, {}, $.Slider.defaults, options);

			// get all items..
			this.$items = this.$el.children(this.options.element);
			this.$items.css({ 'position': 'absolute' });

			// get the width of item..
			// this.itemWidth = this.$el.first(this.options.element).width();
			this.itemWidth = this.options.width;
			
			// total number of items..
			this.itemsCount = this.$items.length;

			// set current index of item..
			this.current = 0;

			this.dir = (this.options.dir === 'left') ? 1 : -1;

			// if no items..
			if (this.itemsCount === 0) {
				logWarn('no items found..');
				return false;
			}

			this.$items.not(this.$items.eq(this.current)).hide();

			this.intId = window.setInterval($.proxy(this.advanceSlide, this), this.options.interval);

		},

		advanceSlide: function () {
			this.changeSlide(this.current + 1);
		},

		changeSlide: function (id) {
			this.$items.eq(this.current).animate({
				left: -this.itemWidth * this.dir
			}, this.options.speed, function () {
				// $(this).hide();
			});

			this.current = id;

			if (this.current >= this.itemsCount) {
				this.current = 0;
			}

			this.$items.eq(this.current).show().css({ left: this.itemWidth * this.dir });

			this.$items.eq(this.current).animate({ left: '0' }, this.options.speed);

			this.options.onSlideStart(this.current);
		},

		/**
		 * Public methods..
		 */
		gotoSlide: function (id) {
			id = parseInt(id, 10);
			if (id === this.current) {
				return;
			}
			window.clearInterval(this.intId);
			this.changeSlide(id);

			this.intId = window.setInterval($.proxy(this.advanceSlide, this), this.options.interval);
		}

	};

	$.fn.slider = function (options) {

		var self = $.data(this, 'slider');

		this.each(function () {
			if (self) {
				self.init();
			}
			else {
				log('Slider init..');
				self = $.data(this, 'slider', new $.Slider(options, this));
			}
		});

		return self;
	};

})(jQuery, window);