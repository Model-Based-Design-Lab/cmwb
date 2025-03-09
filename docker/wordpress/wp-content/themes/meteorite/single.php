<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Meteorite
 */

get_header();

// Layout class for full width singles
$fullwidth = '';
$smallwidth = '';

if ( get_theme_mod( 'fullwidth_single_checkbox', false ) == true ) {
	$fullwidth = 'fullwidth';
}
if ( get_theme_mod( 'smallwidth_single_checkbox', false ) == true ) {
	$smallwidth = 'smallwidth';
}
?>

<?php do_action( 'meteorite_before_content' ); ?>

<div id="primary" class="content-area col-md-9 <?php echo $fullwidth . ' ' . $smallwidth; ?>">
	<main id="main" class="site-main" role="main">

	<?php
	while ( have_posts() ) : 
		the_post();

		/*
		 * Include the Post-Format-specific template for the content.
		 * If you want to override this in a child theme, then include a file
		 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
		 */
		get_template_part( 'template-parts/content', ( post_type_supports( get_post_type(), 'post-formats' ) ? get_post_format() : get_post_type() ) );

		// Singles navigation type
		meteorite_single_navigation_type();

		// Related posts
		if ( get_post_type() == 'post' && get_theme_mod( 'related_posts_check', false ) == true ) :
			meteorite_show_related_posts();
		endif;

		// If comments are open or we have at least one comment, load up the comment template.
		if ( comments_open() || get_comments_number() ) :
			comments_template();
		endif;

	endwhile; // End of the loop.
	?>

	</main><!-- #main -->
</div><!-- #primary -->

<?php do_action( 'meteorite_after_content' ); ?>

<?php
if ( get_theme_mod( 'fullwidth_single_checkbox', false ) == false || get_theme_mod( 'smallwidth_single_checkbox' ) == false ) {
	get_sidebar();
}
get_footer();
