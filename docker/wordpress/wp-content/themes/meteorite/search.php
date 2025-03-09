<?php
/**
 * The template for displaying search results pages.
 *
 * @package Meteorite
 */

get_header();

// Layout class for full width search page and masonry layout
$fullwidth	= '';
$masonry	= '';

if ( get_theme_mod( 'fullwidth_search_checkbox', false ) == true ) {
	$fullwidth = 'fullwidth';
}
if ( get_theme_mod( 'blog_layout', 'fullwidth' ) == 'masonry' ) {
	$masonry = 'masonry';
} 
?>

<div id="primary" class="content-area col-md-9 <?php echo $fullwidth . ' ' . $masonry; ?>">
	<main id="main" class="site-main" role="main">

	<?php if ( have_posts() ) : ?>

		<?php if ( get_theme_mod( 'header_titlebar', 'off' ) == 'off' ) : ?>
			<header class="entry-header clearfix">
				<h1 class="page-header">
					<?php
					/* translators: %s: search query. */
					printf( __( 'Search Results for: %s', 'meteorite' ), '<span>' . esc_html( get_search_query( false ) ) . '</span>' );
					?>
				</h1>
			</header>
		<?php endif; ?>

		<div class="post-wrapper posts-layout clearfix">
			<?php
			while ( have_posts() ) : 
				the_post();

				/**
				 * Run the loop for the search to output the results.
				 * If you want to overload this in a child theme then include a file
				 * called content-search.php and that will be used instead.
				 */
				get_template_part( 'template-parts/content', ( post_type_supports( get_post_type(), 'post-formats' ) ? get_post_format() : get_post_type() ) );
			endwhile; 
			?>
		</div><!-- .post-wrapper -->

		<?php
		// Search page navigation type
		meteorite_blog_navigation_type();

	else :

		get_template_part( 'template-parts/content', 'none' );

	endif; ?>

	</main><!-- #main -->
</div><!-- #primary -->

<?php 
if ( get_theme_mod( 'fullwidth_search_checkbox', false ) == false && get_theme_mod( 'blog_layout', 'fullwidth' ) != 'masonry' ) {
	get_sidebar();
}
get_footer();
