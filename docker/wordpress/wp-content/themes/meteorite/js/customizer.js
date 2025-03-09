/**
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

( function( $ ) {

	/*--------------------------------------------------------------
	# Colors
	--------------------------------------------------------------*/

	// Body text color
	wp.customize( 'body_text_color', function( value ) {
		value.bind( function( newval ) {
			$( 'body' ).css( 'color', newval );
		} );
	});
	// Site title
	wp.customize( 'site_title_color', function( value ) {
		value.bind( function( newval ) {
			$( '.site-title a' ).css( 'color', newval );
		} );
	});
	// Site desc
	wp.customize( 'site_desc_color', function( value ) {
		value.bind( function( newval ) {
			$( '.site-description' ).css( 'color', newval );
		} );
	});
	// Topbar background
	wp.customize( 'topbar_bg_color', function( value ) {
		value.bind( function( newval ) {
			$( '.topbar' ).css( 'background-color', newval );
		} );
	});
	// Topbar color
	wp.customize( 'topbar_color', function( value ) {
		value.bind( function( newval ) {
			$( '.topbar span, .topbar span a, .topbar .social-nav a, .topbar .topbar-nav-left ul li a' ).css( 'color', newval );
		} );
	});
	// Menu background
	wp.customize( 'menu_bg_color', function( value ) {
		value.bind( function( newval ) {
			$( '.nav-container' ).css( 'background-color', newval );
		} );
	});
	// Top level menu items
	wp.customize( 'top_items_color', function( value ) {
		value.bind( function( newval ) {
			$( '#main-nav ul li::before, #main-nav ul li a, .search-wrapper i, .btn-menu span' ).not( '#main-nav .sub-menu li a' ).css( 'color', newval );
		} );
	});
	// Submenu background
	wp.customize( 'submenu_background', function( value ) {
		value.bind( function( newval ) {
			$( '#main-nav .sub-menu' ).css( 'background-color', newval );
		} );
	});
	// Submenu items
	wp.customize( 'submenu_items_color', function( value ) {
		value.bind( function( newval ) {
			$( '#main-nav .sub-menu li a ' ).css( 'color', newval );
		} );
	});
	// Mobile menu background
	wp.customize( 'mobile_menu_bg_color', function( value ) {
		value.bind( function( newval ) {
			$( '#mobile-menu' ).css( 'background-color', newval );
		} );
	});
	// Mobile menu item color
	wp.customize( 'mobile_menu_items_color', function( value ) {
		value.bind( function( newval ) {
			$( '#mobile-menu ul li a' ).css( 'color', newval );
		} );
	});
	// Header Overlay color
	wp.customize( 'header_overlay_color', function( value ) {
		value.bind( function( newval ) {
			$( '.header-image .overlay' ).css( 'background-color', newval );
		} );
	});
	// Header image text color
	wp.customize( 'header_image_text_color', function( value ) {
		value.bind( function( newval ) {
			$( '.parallax-text .header-image-heading, .parallax-text .header-image-text' ).css( 'color', newval );
		} );
	});
	// Header titlebar background
	wp.customize( 'header_titlebar_background', function( value ) {
		value.bind( function( newval ) {
			$( '.titlebar' ).css( 'background-color', newval );
		} );
	});
	// Header titlebar color
	wp.customize( 'header_titlebar_color', function( value ) {
		value.bind( function( newval ) {
			$( '.titlebar' ).css( 'color', newval );
		} );
	});
	// Footer widgets background
	wp.customize( 'footer_widgets_background', function( value ) {
		value.bind( function( newval ) {
			$( '.footer-widgets' ).css( 'background-color', newval );
		} );
	});
	// Footer color
	wp.customize( 'footer_widgets_color', function( value ) {
		value.bind( function( newval ) {
			$( '.footer-widgets, .footer-widgets a, .footer-widgets caption, .footer-widgets .widget-title' ).css( 'color', newval );
			$( '.footer-widgets .widget_nav_menu ul li::before' ).css( 'background-color', newval );
		} );
	});
	// Footer background
	wp.customize( 'footer_background', function( value ) {
		value.bind( function( newval ) {
			$( '.site-footer' ).css( 'background-color', newval );
		} );
	});
	// Footer color
	wp.customize( 'footer_color', function( value ) {
		value.bind( function( newval ) {
			$( '.site-footer, .site-footer a' ).css( 'color', newval );
		} );
	});

} )( jQuery );