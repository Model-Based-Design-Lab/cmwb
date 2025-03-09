<?php
/**
 * The home template file for displaying the blog posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Meteorite
 */

get_header();

// Layout class for full width blog page and masonry layout
$fullwidth	= '';
$masonry	= '';

if ( get_theme_mod( 'fullwidth_blog_checkbox', false ) == true ) {
	$fullwidth = 'fullwidth';
}
if ( get_theme_mod( 'blog_layout', 'fullwidth' ) == 'masonry' ) {
	$masonry = 'masonry';
}
?>

<?php do_action( 'meteorite_before_content' ); ?>

<div id="primary" class="content-area col-md-9 <?php echo $fullwidth . ' ' . $masonry; ?>">
	<main id="main" class="site-main" role="main">

	<?php if ( have_posts() ) : ?>

		<div class="posts-layout clearfix">
			<?php
			while ( have_posts() ) :
				the_post();

				/*
				 * Include the Post-Format-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
				 */
				get_template_part( 'template-parts/content', ( post_type_supports( get_post_type(), 'post-formats' ) ? get_post_format() : get_post_type() ) );
			endwhile;
			?>
		</div><!-- .posts-layout -->

		<?php
		// Blog navigation type
		meteorite_blog_navigation_type();

	else :

		get_template_part( 'template-parts/content', 'none' );

	endif; ?>

	</main><!-- #main -->
</div><!-- #primary -->

<?php do_action( 'meteorite_after_content' ); ?>

<?php
if ( get_theme_mod( 'fullwidth_blog_checkbox', false ) == false && get_theme_mod( 'blog_layout', 'fullwidth' ) != 'masonry' ) {
	get_sidebar();
}
get_footer();
