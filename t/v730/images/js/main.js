(function($) {

	$(function() {
		var $win = $(window),
			$doc = $(document),
			$html = $(document.documentElement),
			$body = $(document.body),
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			IOs = /iPhone|iPad|iPod/i.test(navigator.userAgent),
			IE = /MSIE|Trident/i.test(navigator.userAgent);
			
		if (document.location.search.indexOf('mobile') != -1) {isMobile = true};

		$('table').wrap('<div class="table-wrapper"></div>');
		
		if (IE) {
			headerheight();
			$win.on('resize', function(){
				headerheight();
			});
			
			function headerheight () {
				var minHeight = $('.site-header-inner-wrap').height();
				$('.site-header-inner').height(minHeight);
			}
		}

		// Slider

			(function(){

			 	$(".reviews-slider").owlCarousel({
			 		loop:true,
					margin:20,
					nav:true,
					dots: false,
					responsive: {
						0 : {
							items:1
						},
						769: {
							items: 2
						}
					}
			 	});

			 })();

		// Slider End		


		// Top Menu
		
			$('.top-menu-button').on( IOs?'touchend':'click', function(){
				$('.top-menu-inner').addClass('opened');
				$html.addClass('overflowHidden');
			});
			
			$('.close-menu').on( IOs?'touchend':'click', function(){
				$('.top-menu-inner').removeClass('opened');
				$html.removeClass('overflowHidden');
			});
			
			$body.on(IOs?'touchend':'click', function(event){
				if ($(event.target).closest('.top-menu-button, .top-menu-inner').length) return;
				$('.top-menu-inner').removeClass('opened');
				$html.removeClass('overflowHidden');
			});
		
			if (isMobile) {
				
				$('.top-menu li.has-child').find('> a').append('<span class="tree-link"></span>')
				
				$('.top-menu li.has-child').find('> a .tree-link').on('click', function(event){
					$(this).parents('li:first').siblings().removeClass('sublist-opened');
					$(this).parents('li:first').toggleClass('sublist-opened');
					return false;
				});

				
			} else {
				$('.top-menu').s3MenuAllIn({
			        type: 'bottom'
			    });
			}
			
			

		// Top Menu End

	});

})(jQuery);

// YandexMap
(function() {

	function coords(str) {
		return str.split(',');
	}

	function init(options) {
		options.center = coords(options.center);

		$.each(options.data, function(key, item) {
			item.coords = coords(item.coords);
		});

		if (options.type == 1) {

			google.maps.event.addDomListener(window, 'load', function() {
				
				var map = new google.maps.Map(document.getElementById(options.id), {
					zoom: 15,
					scrollwheel: false,
					center: new google.maps.LatLng(options.center[0], options.center[1])
				});

				$.each(options.data, function(key, item) {

					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(item.coords[0], item.coords[1]),
						map: map,
						title: item.name
					});

					var infowindow = new google.maps.InfoWindow({
						content: '<div class="baloon-content">' +
									'<h3 style="margin: 0; padding-bottom: 3px;">' + item.name + '</h3>' +
									item.desc +
								 '</div>'
					});

					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map, marker);
					});

				});
			});

		} else {

			ymaps.ready(function() {

				var map = new ymaps.Map(options.id, {
					center: options.center,
					zoom: options.zoom,
					behaviors: ['drag', 'rightMouseButtonMagnifier'],
				});

				map.controls.add(
					new ymaps.control.ZoomControl()
				);

				var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
					'<div class="baloon-content" style="padding: 10px 20px;">' +
						'<h3 style="margin: 0;">$[properties.name]</h3>' +
						'$[properties.desc]' +
					'</div>'
				);

				var myCollection = new ymaps.GeoObjectCollection();

				$.each(options.data, function(key, item) {
					myCollection.add(new ymaps.Placemark(
						item.coords,
						item, 
						{balloonContentLayout: MyBalloonContentLayoutClass}
					));
				});

				map.geoObjects.add(myCollection);

			});
		}
	}

	window.mjsMap = init;
})();
// /YandexMap