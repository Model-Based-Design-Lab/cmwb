<?php
/**
 * Blog functions
 *
 * @package Meteorite
 */

if ( ! function_exists( 'meteorite_get_time_string' ) ) :
	/**
	 * Display or retrieve the post date.
	 *
	 * @param bool $echo Optional. Whether to echo or return the result. Default true for echo.
	 * @return string|void The post date if $echo is false.
	 * @since 1.0.6
	 */
	function meteorite_get_time_string( $echo = true ) {
		$time_string = '<time class="published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf( $time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);

		if ( $echo ) {
			echo $time_string;
		} else {
			return $time_string;
		}
	}
endif;

/**
 * Remove category labels in archives.
 *
 * @param string $title Archive title to be displayed.
 * @return string Archive title.
 * @since 1.0.6
 */
function meteorite_category_label( $title ) {
	if ( is_category() ) {
		$title = single_cat_title( '', false );
	} elseif ( is_tag() ) {
		$title = single_tag_title( '', false );
	} elseif ( is_author() ) {
		$title = '<span class="vcard">' . get_the_author() . '</span>';
	} elseif ( is_post_type_archive() ) {
		$title = post_type_archive_title( '', false );
	} elseif ( is_tax() ) {
		$title = single_term_title( '', false );
	} elseif ( is_day() ) {
		$title = get_the_date();
	} elseif ( is_month() ) {
		$title = get_the_date( 'F Y' );
	} elseif ( is_year() ) {
		$title = get_the_date( 'Y' );
	}

	return $title;
}
add_filter( 'get_the_archive_title', 'meteorite_category_label' );

/**
 * Changes the excerpt length.
 *
 * @param int $length Excerpt length.
 * @return int Modified excerpt length.
 * @since 1.0.6
 */
function meteorite_excerpt_length( $length ) {
	$excerpt = get_theme_mod( 'excerpt_length', '55' );
	return $excerpt;
}
add_filter( 'excerpt_length', 'meteorite_excerpt_length', 999 );

if ( ! function_exists( 'meteorite_get_link_url' ) ) :
	/**
	 * Returns the URL from the post.
	 *
	 * @uses get_url_in_content() to get the URL in the post meta (if it exists) or
	 * the first link found in the post content.
	 *
	 * Falls back to the post permalink if no URL is found in the post.
	 *
	 * @copyright Twenty Thirteen 1.0
	 * @since 2.0
	 *
	 * @return string The Link format URL.
	 */
	function meteorite_get_link_url() {
		$content = get_the_content();
		$has_url = get_url_in_content( $content );

		return ( $has_url ) ? $has_url : apply_filters( 'the_permalink', get_permalink() );
	}
endif;

if ( ! function_exists( 'meteorite_get_gallery_attachments' ) ) :
	/**
	 * Returns the IDs from a shortcode as an array.
	 *
	 * @see https://gist.github.com/hullen/5443218
	 * @param string $shortcode Gallery shortcode from which to return the image IDs. Default empty.
	 * @return array()|false The image IDs from the given shortcode. False if no IDs can be found.
	 * @since 2.0
	 */
	function meteorite_get_gallery_attachments( $shortcode = '' ){
		preg_match( '/\[gallery.*ids=.(.*).\]/', $shortcode, $ids );

		if ( null == $ids ) {
			// Exit early if no IDs found
			return false;
		}

		$images_id = explode(",", $ids[1]);
		
		return $images_id;
	}
endif;

if ( ! function_exists( 'meteorite_the_gallery_slider' ) ) :
	/**
	 * Prints the images from the given shortcode as a slider. There is a maximum of 6 images that will be displayed.
	 *
	 * @param string $shortcode Gallery shortcode which should be turned into a slider. Default empty.
	 * @param string $before Optional. Markup to prepend to the slider. Default empty.
	 * @param string $after Optional. Markup to append to the slider. Default empty.
	 * @return false|void False if no shortcode IDs can be found.
	 * @since 2.0
	 */
	function meteorite_the_gallery_slider( $shortcode = '', $before = '', $after = '' ) {
		$ids = meteorite_get_gallery_attachments( $shortcode );

		if ( false == $ids ) {
			// Exit early if no IDs found
			return false;
		}

		$carouselDataAttributes = 'data-autoplay="8000"';
		// You can modify this using add_filter()
		$carouselDataAttributes = apply_filters( 'meteorite_format_gallery_carousel_attributes', $carouselDataAttributes );
		?>

		<?php echo $before; ?>
		<div class="format-gallery-carousel-wrapper">
			<div class="format-gallery-carousel carousel owl-carousel" <?php echo sanitize_text_field( $carouselDataAttributes ); ?>>

				<?php
				for ( $i = 0; $i < count($ids); $i++ ) {
					if ( $i > 5 ) : // Fallback to not create a slider with too many images
						return;
					endif;

					echo wp_get_attachment_image( $ids[$i], array( '1140', '' ) );
				}
				?>
				
			</div><!-- .format-gallery-carousel -->
			<div class="format-gallery-controls clearfix"><div class="prev"><i class="fa fa-angle-left"></i></div><div class="next"><i class="fa fa-angle-right"></i></div></div>
		</div><!-- .format-gallery-carousel-wrapper -->
		<?php echo $after; ?>

		<?php
	}
endif;

if ( ! function_exists('meteorite_blog_navigation_type') ) {
	/**
	 * Calls the right function based on the chosen blog navigation.
	 *
	 * @since 2.0
	 */
	function meteorite_blog_navigation_type() {
		$pagination_type = get_theme_mod( 'pagination_type', 'titles' );
		if ( 'none' == $pagination_type ) :
			// empty
		elseif ( 'numbers' == $pagination_type ) :
			meteorite_post_pagination();
		elseif ( 'titles' == $pagination_type ) :
			the_posts_navigation();
		elseif ( 'arrows' == $pagination_type ) :
			meteorite_blog_navigation_arrows();
		endif;
	}
}

if ( ! function_exists('meteorite_single_navigation_type') ) {
	/**
	 * Calls the right function based on the chosen single navigation.
	 *
	 * @since 2.0
	 */
	function meteorite_single_navigation_type() {
		$pagination_type_single = get_theme_mod( 'pagination_type_single', 'titles' );
		if ( 'none' == $pagination_type_single ) :
			// empty
		elseif ( 'titles' == $pagination_type_single ) :
			meteorite_post_navigation();
		elseif ( 'titles_images' == $pagination_type_single ) :
			meteorite_extended_post_navigation();
		elseif ( 'arrows' == $pagination_type_single ) :
			meteorite_post_navigation_arrows();
		endif;
	}
}

if ( ! function_exists('meteorite_project_navigation_type') ) {
	/**
	 * Calls the right function based on the chosen project navigation.
	 *
	 * @since 2.0
	 */
	function meteorite_project_navigation_type() {
		$project_pagination_type = get_theme_mod( 'project_pagination_type', 'titles' );
		if ( 'none' == $project_pagination_type ) :
			// empty
		elseif ( 'titles' == $project_pagination_type ) :
			meteorite_project_navigation();
		elseif ( 'titles_images' == $project_pagination_type ) :
			meteorite_extended_project_navigation();
		elseif ( 'arrows' == $project_pagination_type ) :
			meteorite_project_navigation_arrows();
		endif;
	}
}