//Masonry init
jQuery(function($) {
	var $container = $('.posts-layout');
	$container.imagesLoaded( function() {
		$container.masonry({
			itemSelector: 'article',	// changed from .hentry to article due to WooCommerce items not having a hentry class
			isFitWidth: true,
			animationOptions: {
				duration: 400,
				easing: 'linear',
			}
	    });
	});
});