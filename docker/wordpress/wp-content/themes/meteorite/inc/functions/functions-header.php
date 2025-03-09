<?php
/**
 * Header functions
 *
 * @package Meteorite
 */

/**
 * Prints the HTML for the preloader.
 *
 * @since 1.0.6
 */
function meteorite_preloader() {
	if ( get_theme_mod( 'preloader_type', 'none' ) == 'wave' ) : 
		?>
		<div id="preloader">
			<div class="preloader-type-wave">
				<div class="spinner">
					<div class="rect1"></div>
					<div class="rect2"></div>
					<div class="rect3"></div>
					<div class="rect4"></div>
					<div class="rect5"></div>
				</div>
			</div>
		</div><!-- #preloader -->
	<?php elseif ( get_theme_mod( 'preloader_type', 'none' ) == 'dots' ) : ?>
		<div id="preloader">
			<div class="preloader-type-dots">
				<div class="spinner">
					<div class="dot1"></div>
					<div class="dot2"></div>
				</div>
			</div>
		</div><!-- #preloader -->
	<?php elseif ( get_theme_mod( 'preloader_type', 'none' ) == 'circles' ) : ?>
		<div id="preloader">
			<div class="preloader-type-circles">
				<div class="spinner">
				</div>
			</div>
		</div><!-- #preloader -->
	<?php
	endif;
}
add_action( 'meteorite_before_site', 'meteorite_preloader', 7 );

/**
 * Prints the HTML for the fullscreen search.
 *
 * @since 1.1
 */
function meteorite_fullscreen_search() {
	if ( get_theme_mod( 'search_type', 'search_fullscreen' ) == 'search_fullscreen' ) : ?> 
	<div id="search-fullscreen" class="meteorite-header-search">
		<div class="overlay-search">
			<div class="search-form">
				<?php get_search_form(); ?>
			</div>
			<div class="overlay-search-close">
				<button type="button">
					<i class="fa fa-remove" aria-hidden="true"></i>
					<span class="screen-reader-text"><?php _e( 'Close search', 'meteorite' ); ?></span>
				</button>
			</div>
		</div>
	</div><!-- #search-fullscreen -->
	<?php 
	endif;
}
add_action( 'meteorite_before_site', 'meteorite_fullscreen_search', 8 );

if ( ! function_exists( 'meteorite_menu_position' ) ) :
	/**
	 * Echo menu position class.
	 *
	 * @since 1.0.6
	 */
	function meteorite_menu_position() {
		$menuPosition = get_theme_mod( 'menu_pos', 'above' );

		if ( 'above' == $menuPosition ) {
			echo 'above';
		} elseif ( 'below' == $menuPosition ) { 
			echo 'below';
		} elseif ( 'above_solid' == $menuPosition ) {
			echo 'above above-solid';
		}
	}
endif;

if ( ! function_exists( 'meteorite_sticky_menu' ) ) :
	/**
	 * Echo menu sticky class.
	 *
	 * @since 1.0.6
	 */
	function meteorite_sticky_menu() {
		if ( get_theme_mod( 'sticky_menu', 'sticky' ) == 'sticky' ) {
			echo 'sticky';
		} else {
			echo 'static';
		}
	}
endif;

if ( ! function_exists( 'meteorite_nav_topbar' ) ) :
	/**
	 * Prints the HTML for the topbar above the menu.
	 *
	 * @since 1.0.6
	 */
	function meteorite_nav_topbar() {
		if ( get_theme_mod( 'topbar_type', 'none' ) != 'none' ) {

			$claim = '';
			if ( get_theme_mod( 'claim', 'Display your clame here.' ) != '' ) {
				$claim .= "<span class='claim'>" . esc_html( get_theme_mod( "claim", __( "Display your claim here.", 'meteorite' ) ) ) . "</span>";
			}
			$contact = '';
			if ( get_theme_mod( 'tel', '111.222.333' ) != '' ) {
				$contact .= "<span class='tel'>" . esc_html( get_theme_mod( "tel", "+1 (0) 999-000" ) ) . "</span>";
			} 
			if ( get_theme_mod( 'email', 'example@company.com' ) != '' ) {
				$contact .= "<a href='mailto:" . antispambot( sanitize_email( get_theme_mod( 'email', 'example@company.com' ) ) ) . "'><span class='email'>" . antispambot( sanitize_email( get_theme_mod( 'email', 'example@company.com' ) ) ) . "</span></a>";
			}
			$social = '';
			if ( get_theme_mod( 'social-media-one', 'www.facebook.com' ) != '' ) {
				$social .= "<li><a href='" . esc_url( get_theme_mod( 'social-media-one', 'www.facebook.com' ) ) . "' target='_blank'></a></li>";
			}
			if ( get_theme_mod( 'social-media-two', 'plus.google.com' ) != '' ) {
				$social .= "<li><a href='" . esc_url( get_theme_mod( 'social-media-two', 'plus.google.com' ) ) . "' target='_blank'></a></li>";
			}
			if ( get_theme_mod( 'social-media-three', 'www.youtube.com' ) != '' ) {
				$social .= "<li><a href='" . esc_url( get_theme_mod( 'social-media-three', 'www.youtube.com' ) ) . "' target='_blank'></a></li>";
			}
			if ( get_theme_mod( 'social-media-four', 'twitter.com' ) != '' ) {
				$social .= "<li><a href='" . esc_url( get_theme_mod( 'social-media-four', 'twitter.com' ) ) . "' target='_blank'></a></li>";
			}
			if ( get_theme_mod( 'social-media-five', 'linkedin.com' ) != '' ) {
				$social .= "<li><a href='" . esc_url( get_theme_mod( 'social-media-five', 'linkedin.com' ) ) . "' target='_blank'></a></li>";
			}
			if ( get_theme_mod( 'social-media-six', 'pinterest.com' ) != '' ) {
				$social .= "<li><a href='" . esc_url( get_theme_mod( 'social-media-six', 'pinterest.com' ) ) . "' target='_blank'></a></li>";
			} 
			?>
			
			<div class="topbar">
				<div class="container">
					<div class="row">
						<?php if ( get_theme_mod( 'topbar_type', 'none' ) == 'topbar_1' ) { ?>
							<div class="contact-field contact-field-left col-md-8">
								<?php echo $contact; ?>
							</div>
							<div class="social-icons social-nav social-nav-right col-md-4">
								<nav>
									<ul>
										<?php echo $social; ?>
									</ul>
								</nav>
							</div>
						<?php } elseif ( get_theme_mod( 'topbar_type', 'none' ) == 'topbar_2' ) { ?>
							<div class="social-icons social-nav social-nav-left col-md-4">
								<nav>
									<ul>
										<?php echo $social; ?>
									</ul>
								</nav>
							</div>
							<div class="claim-field claim-field-right col-md-8">
								<?php echo $claim; ?>
							</div>
						<?php } elseif ( get_theme_mod( 'topbar_type', 'none' ) == 'topbar_3' ) { ?>
							<div class="contact-field contact-field-left col-md-6">
								<nav>
									<?php echo $contact; ?>
								</nav>
							</div>
							<div class="claim-field claim-field-right col-md-6">
								<?php echo $claim; ?>
							</div>
						<?php } elseif ( get_theme_mod( 'topbar_type', 'none' ) == 'topbar_4' ) { ?>
							<div class="topbar-nav topbar-nav-left col-md-8">
								<nav>
									<?php
									wp_nav_menu( 
										array(
											'theme_location' => 'topbar', 
											'menu_id' => 'topbar-menu', 
											'depth' => 1, 
											'fallback_cb' => 'meteorite_menu_fallback' 
										) 
									); 
									?>
								</nav>
							</div>
							<div class="social-icons social-nav social-nav-right col-md-4">
								<nav>
									<ul>
										<?php echo $social; ?>
									</ul>
								</nav>
							</div>
						<?php } ?>
					</div><!-- .row -->
				</div><!-- .container -->
			</div><!-- .topbar -->
			<?php
		}
	}
endif;

if ( ! function_exists( 'meteorite_sitebranding' ) ):
	/**
	 * Prints the HTML for the site branding.
	 *
	 * @since 1.0.6
	 */
	function meteorite_sitebranding() {
		$logo_light = get_theme_mod( 'logo_light', '' );
		$has_custom_logo = has_custom_logo();
		
		if ( $has_custom_logo || $logo_light) {
			if ( function_exists( 'the_custom_logo' ) && $has_custom_logo ) {
				the_custom_logo();
			}
			if ( $logo_light ) {
				echo '<a href="' . esc_url( home_url( '/' ) ) . '" title="' . esc_attr( get_bloginfo( 'name' ) ) . '">';
					echo '<img class="site-logo light" src="' . esc_url( $logo_light ) . '" alt="' . esc_attr( get_bloginfo( 'name' ) ) . '" />';
				echo '</a>'; 
			}
		} else {
			echo '<div class="site-brand">';
				if ( is_front_page() && is_home() ) :
					echo '<h1 class="site-title"><a href="' . esc_url( home_url( '/' ) ) . '" rel="home">' . get_bloginfo( 'name', 'display' ) . '</a></h1>';
				else :
					echo '<p class="site-title"><a href="' . esc_url( home_url( '/' ) ) . '" rel="home">' . get_bloginfo( 'name', 'display' ) . '</a></p>';
				endif;
				echo '<p class="site-description">' . get_bloginfo( 'description', 'display' ) . '</p>';
			echo '</div>'; // /.site-brand
		}
	}
endif;

if ( ! function_exists( 'meteorite_nav' ) ) :
	/**
	 * Prints the HTML for the header navigation (includes sitebranding and topbar).
	 *
	 * @since 1.0.6
	 */
	function meteorite_nav() { 
		?>
		<?php do_action( 'meteorite_before_header' ); ?>
		<header id="masthead" class="site-header <?php meteorite_menu_position(); ?>" role="banner">
			<?php meteorite_nav_topbar(); ?>
			<div class="nav-placeholder">
				<div class="nav-container <?php meteorite_sticky_menu(); ?>">
					<div class="container">
						<div class="row">
							<div class="logo-container col-md-3 col-sm-9 col-xs-9">
								<?php meteorite_sitebranding(); ?>
							</div>
							<div class="navicon col-sm-9 col-xs-3">
								<?php if ( get_theme_mod( 'mobile_menu_type', 'fancy' ) == 'fancy' ) : ?>
									<button type="button" class="btn-menu fancy"><span></span></button>
								<?php else : ?>
									<button type="button" class="btn-menu classic"><i class="fa fa-bars"></i></button>
								<?php endif; ?>
							</div>
							<nav id="main-nav" class="col-md-9" role="navigation">
								<ul id="primary-menu" class="menu">
									<?php 
									wp_nav_menu( 
										array(
											'theme_location' => 'primary', 
											'menu_id' => 'primary-menu', 
											'container' => '', 
											'items_wrap' => '%3$s', 
											'fallback_cb' => 'meteorite_menu_fallback' 
										) 
									);
									?>
									
									<?php if ( get_theme_mod( 'search_checkbox', true ) == true ) : ?>
										<li class="search-button"> 
											<div class="search-wrapper">
												<a href="#" class="search-button-toggle">
													<i class="fa fa-search"></i>
												</a>
											</div>
											<?php if ( get_theme_mod( 'search_type', 'search_fullscreen' ) == 'search_under_header' ) : ?> 
												<div id="search-under-header" class="meteorite-header-search">
													<div class="overlay-search">
														<div class="search-form">
															<?php get_search_form(); ?>
														</div>
													</div>
												</div>
											<?php endif; ?>
										</li>
									<?php endif; ?>
								</ul>
							</nav><!-- .#main-nav -->
							<div class="clearfix"></div>
						</div><!-- .row -->
					</div><!-- .container -->
				</div><!-- .nav-container -->
			</div><!-- .nav-placeholder -->
			<div id="mobile-menu">
				<div class="container">
					<ul>
						<?php 
						wp_nav_menu( 
							array(
								'theme_location' => 'primary', 
								'menu_id' => 'primary-mobile-menu', 
								'container' => '', 
								'items_wrap' => '%3$s', 
								'fallback_cb' => 'meteorite_menu_fallback' 
							) 
						); 
						?>

						<?php if ( get_theme_mod( 'search_checkbox', true ) == true ) : ?>
							<li id="searchform-mobile"> 
								<?php get_search_form(); ?>
							</li>
						<?php endif; ?>
					</ul>
				</div><!-- .container -->
			</div><!-- #mobile-menu -->
		</header><!-- #masthead -->
		<?php do_action( 'meteorite_after_header' ); ?>
	<?php
	}
endif;

if ( ! function_exists( 'meteorite_page_can_have_header' ) ) :
	/**
	 * Check if the page is able to have a header image/slider.
	 * 
	 * @return bool True, if the page can have a header image/slider, otherwise false.
	 * @since 2.0
	 */
	function meteorite_page_can_have_header() {
		if ( get_theme_mod( 'header_image_active', true ) == false ) {
			return false;
		}
		
		if ( is_front_page() && is_home() ) {
			return false; // Don't show image if front page shows posts
		} elseif ( is_page() || is_home() ) {
			return true;
		} elseif ( is_singular( 'post' ) && get_theme_mod( 'single_header_image', 'none' ) == 'full_width_image' ) {
			return true;
		} elseif ( is_singular( 'projects' ) && get_theme_mod( 'projects_header_image', 'none' ) == 'full_width_image' ) {
			return true;
		} else {
			return false;
		}
	}
endif;

if ( ! function_exists( 'meteorite_has_header' ) ) :
	/**
	 * Display or retrieve whether the current post has a header image/slider. Default true for echo.
	 *
	 * @param bool $echo Optional. Whether to echo or return the result. Default true for echo.
	 * @return string|void Whether the current post has a header image/slider if $echo is false.
	 * @since 1.0.6 Updated largely in 2.0
	 */
	function meteorite_has_header( $echo = true ) {

		// Prepare the check
		global $post;
		$terra_themes_header_slider_shortcode = $hasHeader = $hasSlider = '';

		// First check for sliders on the page
		if ( is_home() ) {
			$terra_themes_header_slider_shortcode = get_post_meta( get_option( 'page_for_posts' ), '_terra_themes_header_slider', true );
		} elseif ( isset( $post ) ) {
			$terra_themes_header_slider_shortcode = get_post_meta( $post->ID, '_terra_themes_header_slider', true );
		}

		// Set the output whether there is a header image/slider or not
		if ( meteorite_page_can_have_header() == true ) {
			if ( ! empty( $terra_themes_header_slider_shortcode ) ) {
				$hasHeader = 'has-header';
				$hasSlider = ' has-slider';
			} elseif ( ! is_home() && has_post_thumbnail() || is_home() && has_post_thumbnail( get_option( 'page_for_posts' ) ) ) {
				$hasHeader = 'has-header';
			} else {
				$hasHeader = 'has-not-header';
			}
		} else {
			$hasHeader = 'has-not-header';
		}

		// Then echo/return the output
		if ( true == $echo ) {
			echo $hasHeader . $hasSlider;
		} else {
			return $hasHeader;
		}
	}
endif;

if ( ! function_exists( 'meteorite_header_hero_area' ) ) :
	/**
	 * Prints the header hero area for header images, slider etc.
	 *
	 * @since 1.0.6
	 */
	function meteorite_header_hero_area() {

		if ( get_theme_mod( 'header_image_active', true ) == true && meteorite_has_header( false ) == 'has-header' ) :

			global $post;

			echo '<div class="header-area">';
			
				// Create header arrow button
				$header_button = '';

				$header_image_arrow_url = get_theme_mod( 'headerimage_page_button_url', '#content' );
				if ( is_front_page() && get_theme_mod( 'headerimage_fp_button_checkbox', false ) == true ) {
					$header_button = '<a href="' . esc_url( $header_image_arrow_url ) . '" class="header-button header-button-down smooth-scroll"><i class="fa fa-angle-down"></i></a>';
				} elseif ( ! is_front_page() && get_theme_mod( 'headerimage_page_button_checkbox', false ) == true ) {
					$header_button = '<a href="' . esc_url( $header_image_arrow_url ) . '" class="header-button header-button-down smooth-scroll"><i class="fa fa-angle-down"></i></a>';
				}

				// Create header overlay
				$overlay = '';

				if ( get_theme_mod( 'headerimage_overlay_checkbox', false ) == false ) {
					$overlay = '<div class="overlay"></div>';
				}

				// Header image/text parallax disabled class
				$noParallaxImage = $noParallaxText = '';

				if ( get_theme_mod( 'headerimage_parallax_image_checkbox', false ) == true ) {
					$noParallaxImage = 'no-parallax';
				}
				if ( get_theme_mod( 'headerimage_parallax_text_checkbox', false ) == true ) {
					$noParallaxText = 'no-parallax';
				}

				// Get Header Shortcode
				$terra_themes_header_slider_shortcode = '';

				if ( is_home() ) {
					$terra_themes_header_slider_shortcode = get_post_meta( get_option( 'page_for_posts' ), '_terra_themes_header_slider', true );
				} elseif ( isset( $post ) ) {
					$terra_themes_header_slider_shortcode = get_post_meta( $post->ID, '_terra_themes_header_slider', true );
				}

				// Do shortcode or output header image
				if ( ! empty( $terra_themes_header_slider_shortcode ) ) { 														// Shortcode
					echo '<div class="shortcode-header">' . do_shortcode( $terra_themes_header_slider_shortcode ) . '</div>';
				} elseif ( ( is_home() && has_post_thumbnail( get_option( 'page_for_posts' ) ) ) || has_post_thumbnail() ) {	// Image

					// Get the header image content
					$header_image_title = $header_image_title_tag = $header_image_text = $header_image_text_tag = $cta_button_text_one = $cta_button_link_one = $cta_button_text_two = $cta_button_link_two = '';

					if ( ! is_home() && ( is_front_page() || is_page() ) ) {	// ! is_home(): needed if the front page shows the latest posts
						$header_image_title		= get_post_meta( $post->ID, '_meteorite_image_header_title', true );
						$header_image_title_tag = get_post_meta( $post->ID, '_meteorite_image_header_title_tag', true );
						$header_image_text		= get_post_meta( $post->ID, '_meteorite_image_header_text', true );
						$header_image_text_tag 	= get_post_meta( $post->ID, '_meteorite_image_header_text_tag', true );
						$cta_button_text_one 	= get_post_meta( $post->ID, '_meteorite_header_button_text_one', true );
						$cta_button_link_one 	= get_post_meta( $post->ID, '_meteorite_header_button_link_one', true );
						$cta_button_text_two 	= get_post_meta( $post->ID, '_meteorite_header_button_text_two', true );
						$cta_button_link_two 	= get_post_meta( $post->ID, '_meteorite_header_button_link_two', true );
					} elseif ( is_singular( 'post' ) ) {
						$header_image_title		= get_post_meta( $post->ID, '_meteorite_post_image_header_title', true );
						$header_image_title_tag = get_post_meta( $post->ID, '_meteorite_post_image_header_title_tag', true );
						$header_image_text		= get_post_meta( $post->ID, '_meteorite_post_image_header_text', true );
						$header_image_text_tag 	= get_post_meta( $post->ID, '_meteorite_post_image_header_text_tag', true );
						$cta_button_text_one 	= get_post_meta( $post->ID, '_meteorite_post_header_button_text_one', true );
						$cta_button_link_one 	= get_post_meta( $post->ID, '_meteorite_post_header_button_link_one', true );
						$cta_button_text_two 	= get_post_meta( $post->ID, '_meteorite_post_header_button_text_two', true );
						$cta_button_link_two 	= get_post_meta( $post->ID, '_meteorite_post_header_button_link_two', true );
					} elseif ( is_singular( 'projects' ) ) {
						$header_image_title		= get_post_meta( $post->ID, '_meteorite_project_image_header_title', true );
						$header_image_title_tag = get_post_meta( $post->ID, '_meteorite_project_image_header_title_tag', true );
						$header_image_text		= get_post_meta( $post->ID, '_meteorite_project_image_header_text', true );
						$header_image_text_tag 	= get_post_meta( $post->ID, '_meteorite_project_image_header_text_tag', true );
						$cta_button_text_one 	= get_post_meta( $post->ID, '_meteorite_project_header_button_text_one', true );
						$cta_button_link_one 	= get_post_meta( $post->ID, '_meteorite_project_header_button_link_one', true );
						$cta_button_text_two 	= get_post_meta( $post->ID, '_meteorite_project_header_button_text_two', true );
						$cta_button_link_two 	= get_post_meta( $post->ID, '_meteorite_project_header_button_link_two', true );
					} elseif ( is_home() ) {
						$header_image_title		= get_post_meta( get_option( 'page_for_posts' ), '_meteorite_image_header_title', true );
						$header_image_title_tag = get_post_meta( get_option( 'page_for_posts' ), '_meteorite_image_header_title_tag', true );
						$header_image_text		= get_post_meta( get_option( 'page_for_posts' ), '_meteorite_image_header_text', true );
						$header_image_text_tag 	= get_post_meta( get_option( 'page_for_posts' ), '_meteorite_image_header_text_tag', true );
						$cta_button_text_one 	= get_post_meta( get_option( 'page_for_posts' ), '_meteorite_header_button_text_one', true );
						$cta_button_link_one 	= get_post_meta( get_option( 'page_for_posts' ), '_meteorite_header_button_link_one', true );
						$cta_button_text_two 	= get_post_meta( get_option( 'page_for_posts' ), '_meteorite_header_button_text_two', true );
						$cta_button_link_two 	= get_post_meta( get_option( 'page_for_posts' ), '_meteorite_header_button_link_two', true );
					}

					// Get the featured image
					if ( is_home() ) {
						$featuredImageSrc = wp_get_attachment_url( get_post_thumbnail_id( get_option( 'page_for_posts' ) ) );
					} else {
						$featuredImageSrc = wp_get_attachment_url( get_post_thumbnail_id( $post->ID ) );
					}

					// Add a class if header image should be responsive
					$responsive_header_image = '';
					if ( get_theme_mod( 'header_image_responsive', false ) == true ) { 
						$responsive_header_image = 'responsive-header-image'; 
					}

					// Check the selected tags for accuracy
					$tagOptions = array( 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
					if ( in_array( $header_image_title_tag, $tagOptions ) ) {
						$title_tag = $header_image_title_tag;
					} else {
						$title_tag = 'h2';
					}
					if ( in_array( $header_image_text_tag, $tagOptions ) ) {
						$text_tag = $header_image_text_tag;
					} else {
						$text_tag = 'p';
					}
					?>

					<div class="header-container <?php echo $responsive_header_image; ?>">
						<div class="parallax-header header-image <?php echo $noParallaxImage; ?>" style="background-image: url('<?php echo esc_url( $featuredImageSrc ); ?>');">
							<?php if ( get_theme_mod( 'header_image_responsive', false ) == true ) : ?>
								<img class="header-image-small" src="<?php echo esc_url( $featuredImageSrc ) ?>" />
							<?php endif; ?>
							<?php echo $overlay; ?>
							<div class="parallax-text container <?php echo $noParallaxText; ?>">
								<?php 
								if ( ! empty( $header_image_title ) ) { 
									echo '<' . esc_attr( $title_tag ) . ' class="header-image-heading">' . wp_kses_post( force_balance_tags( $header_image_title ) ) . '</' . esc_attr( $title_tag ) . '>'; 
								}
								if ( ! empty( $header_image_text ) ) { 
									echo '<' . esc_attr( $text_tag ) . ' class="header-image-text">' . wp_kses_post( force_balance_tags( $header_image_text ) ) . '</' . esc_attr( $text_tag ) . '>';
								}
								if ( ! empty( $cta_button_text_one ) || ! empty( $cta_button_text_two ) ) { ?>
									<div class="header-cta-buttons">
										<?php if ( ! empty( $cta_button_text_one ) ) { ?>
											<a href="<?php echo esc_url( $cta_button_link_one ); ?>" class="header-cta-one meteorite-button"><?php echo esc_html( $cta_button_text_one ); ?></a>
										<?php }
										if ( ! empty( $cta_button_text_two ) ) { ?>
											<a href="<?php echo esc_url( $cta_button_link_two ); ?>" class="header-cta-two meteorite-button border"><?php echo esc_html( $cta_button_text_two ); ?></a>
										<?php } ?>
									</div>
								<?php } ?>
							</div><!-- .parallax-text -->
							<?php echo $header_button; ?>
						</div><!-- .parallax-header -->
					</div><!-- .header-container -->

				<?php
				}
				do_action( 'meteorite_inside_hero' );
			echo '</div>'; // /.header-area
			do_action( 'meteorite_after_hero' );
		endif;
	}
endif;

if ( ! function_exists( 'meteorite_header_titlebar' ) ) :
	/**
	 * Prints the HTML for the header titlebar.
	 *
	 * @since 1.0.6
	 */
	function meteorite_header_titlebar() {
		if ( get_theme_mod( 'header_titlebar', 'off' ) == 'on' && ! is_front_page() ) : ?>
			<div class="titlebar entry-header">
				<div class="container">
					<div class="row">
						<div class="titlebar-content clearfix">
							<div class="col-md-9 titlebar-heading">
								<?php 
								if ( is_page() ) :
									echo '<h1 class="entry-title">' . wp_kses_post( get_the_title() ) . '</h1>';

								elseif ( is_singular( 'post' ) && get_theme_mod( 'hide_title_single', false ) == false ) :
									echo '<h1 class="entry-title">' . wp_kses_post( get_the_title() ) . '</h1>';

								elseif ( is_singular( 'projects' ) && get_theme_mod( 'hide_title_single_projects', false ) == false ) :
									echo '<h1 class="entry-title">' . wp_kses_post( get_the_title() ) . '</h1>';

								elseif ( is_single() ) :
									echo '<h1 class="entry-title">' . wp_kses_post( get_the_title() ) . '</h1>';

								elseif ( is_home() ) :
									echo '<h1 class="entry-title">' . wp_kses_post( get_the_title( get_option( 'page_for_posts' ) ) ) . '</h1>';

								elseif ( is_category() ) :
									echo '<h1 class="entry-title">' . wp_kses_post( single_cat_title( '', false ) ) . '</h1>';

								elseif ( is_search() ) : 
								?>
									<h1 class="page-title"><?php printf(
										/* translators: %s: search term */
										__( 'Search Results for: %s', 'meteorite' ), '<span>' . esc_html( get_search_query( false ) ) . '</span>' 
									); ?></h1>
								<?php
								elseif ( is_404() ) :
									echo '<h1 class="entry-title">' . __( 'Oops! That page can\'t be found.', 'meteorite' ) . '</h1>';
								
								elseif ( is_tag() ) :
									echo '<h1 class="entry-title">' . single_tag_title() . '</h1>';

								elseif ( is_day() ) :
									echo '<h1 class="entry-title">' . get_the_date() . '</h1>';

								elseif ( is_month() ) :
									echo '<h1 class="entry-title">' . get_the_date( 'F Y' ) . '</h1>';

								elseif ( is_year() ) :
									echo '<h1 class="entry-title">' . get_the_date( 'Y' ) . '</h1>';

								elseif ( is_tax() ) :
									echo '<h1 class="entry-title">' . single_term_title( '', false ) . '</h1>';

								// is_archive() must be after is_year/is_month/is_day; otherwise they won't execute because is_archive would be true
								elseif ( is_archive() ) :
									the_archive_title( '<h1 class="entry-title">', '</h1>' );
									the_archive_description( '<div class="archive-description">', '</div>' );

								elseif ( class_exists( 'Woocommerce' ) && is_woocommerce() && ! is_archive() ) :
									echo '<h1 class="entry-title">' . get_the_title() . '</h1>';
									remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_template_single_title', 8 );
								endif;
								?>
							</div><!-- .titlebar-heading -->

							<?php if ( get_theme_mod( 'enable_titlebar_breadcrumbs', false ) == true ) : ?>
								<div class="meteorite-breadcrumb">
									<?php
									breadcrumb_trail( 
										array( 
											'container'		=> 'nav', 
											'show_on_front' => false, 
											'show_browse' 	=> false, 
											'before' 		=> '<h2 class="screen-reader-text">' . __( 'Breadcrumbs', 'meteorite' ) . '</h2>' 
										) 
									);
									?>
								</div>
							<?php endif; ?>

							<?php if ( get_theme_mod( 'hide_meta_single', false ) == false && is_singular( 'post' ) ) : ?>
								<div class="entry-meta post-meta col-md-12">
									<?php meteorite_meta_info(); ?>
								</div>
							<?php endif; ?>

							<?php if ( get_theme_mod( 'hide_meta_single_projects', true ) == false && is_singular( 'projects' ) ) : ?>
								<div class="entry-meta post-meta col-md-12">
									<?php meteorite_meta_info(); ?>
								</div>
							<?php endif; ?>

						</div><!-- .titlebar-content -->
					</div><!-- .row -->
				</div><!-- .container -->
				<?php do_action( 'meteorite_inside_titlebar' ); ?>
			</div><!-- .titlebar -->
		<?php
		endif;
	}
endif;