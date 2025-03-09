<?php
/**
 * Footer functions
 *
 * @package Meteorite
 */

if ( ! function_exists( 'meteorite_footer_sidebar' ) ) :
	/**
	 * Displays the footer sidebar.
	 *
	 * @since 1.0.6
	 */
	function meteorite_footer_sidebar() {
		if ( is_active_sidebar( 'footer-1' ) || is_active_sidebar( 'footer-2' ) || is_active_sidebar( 'footer-3' ) || is_active_sidebar( 'footer-4' ) ) {
			get_sidebar( 'footer' );
		}
	}
endif;

if ( ! function_exists( 'meteorite_footer_credits' ) ) :
	/**
	 * Prints the HTML for the footer credits.
	 *
	 * @since 1.0.6
	 */
	function meteorite_footer_credits() { 
		$footer_credits = get_theme_mod( 'footer_credits', '' );
		?>
		<div class="site-info col-md-6">
			<?php if ( '' == $footer_credits ) : ?>
				<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'meteorite' ) ); ?>" rel="nofollow">
					<?php
					/* translators: %s: CMS name, i.e. WordPress. */
					printf( __( 'Proudly powered by %s', 'meteorite' ), 'WordPress' );
					?>
				</a>
				<span class="sep"> | </span>
				<?php 
				/* translators: 1: Theme name, 2: Theme author. */
				printf( __( 'Theme: %2$s by %1$s.', 'meteorite' ), 'Terra Themes', '<a href="https://terra-themes.com/theme/meteorite/">Meteorite</a>' );
				?>
			<?php else : ?>
				<?php echo wp_kses_post( force_balance_tags( $footer_credits ) ); ?>
			<?php endif; ?>
			<?php meteorite_show_privacy_policy_link(); ?>
		</div><!-- .site-info -->
	<?php
	}
endif;

if ( ! function_exists( 'meteorite_footer_menu' ) ) :
	/**
	 * Prints the HTML for the footer menu.
	 *
	 * @since 1.0.6
	 */
	function meteorite_footer_menu() {
		if ( get_theme_mod( 'footersocial_checkbox', false ) == true ) { 
			?>
			<div class="footer-nav-wrapper social-icons col-md-6">
				<?php
				wp_nav_menu(
					array(
						'theme_location' 	=> 'footer',
						'depth'				=> 1,
						'container'			=> false,
						'menu_id'			=> 'footer-nav',
						'echo'				=> 1,
						'link_before'		=> '<span class="screen-reader-text">',
						'link_after'		=> '</span>',
						'fallback_cb'		=> 'meteorite_menu_fallback',
					)
				);
				?>
				<div class="clearfix"></div>
			</div><!-- .footer-nav-wrapper -->
		<?php } else { ?>
			<div class="footer-nav-wrapper col-md-6">
				<?php
				wp_nav_menu(
					array(
						'theme_location' 	=> 'footer',
						'depth'				=> 1,
						'container'			=> false,
						'menu_id'			=> 'footer-nav',
						'echo'				=> 1,
						'fallback_cb'		=> 'meteorite_menu_fallback',
					)
				);
				?>
				<div class="clearfix"></div>
			</div><!-- .footer-nav-wrapper -->
		<?php 
		}
	}
endif;


if ( ! function_exists( 'meteorite_show_privacy_policy_link' ) ) :
	/**
	 * Displays the privacy policy link is available and set.
	 *
	 * @since 2.0
	 **/
	function meteorite_show_privacy_policy_link() {
		if ( function_exists( 'the_privacy_policy_link' ) ) {
			the_privacy_policy_link( '<span class="privacy-link">', '</span>' );
		}
	}
endif;