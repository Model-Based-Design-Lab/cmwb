
;(function($) {

	$('.meteorite-tab-button').on('click', function(event) {
		event.preventDefault();

		var target = $(this).data('target');

		if ( ! $(this).hasClass('active') ) {
			$('.meteorite-tab-nav').find('.active').removeClass('active');
			$('.meteorite-tab-nav').find("a[data-target='" + target +"']").addClass('active');

			$('.meteorite-tab-wrapper').find('.show').removeClass('show');
			$('.meteorite-tab-wrapper').find('.' + target).addClass('show');
		}
	});

})(jQuery);
