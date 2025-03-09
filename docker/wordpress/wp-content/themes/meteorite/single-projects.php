<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Meteorite
 */

get_header();

// Layout class for full width single projects
$fullwidth = '';

if ( get_theme_mod( 'fullwidth_single_project_checkbox', true ) == true ) {
	$fullwidth = 'fullwidth';
}
?>

<?php do_action( 'meteorite_before_content' ); ?>

<div id="primary" class="content-area col-md-9 <?php echo $fullwidth; ?>">
	<main id="main" class="site-main" role="main">

	<?php
	while ( have_posts() ) : 
		the_post();

		/*
		 * Include the specific template for the project content.
		 * If you want to override this in a child theme, then include a file
		 * called content-projects.php and that will be used instead.
		 */
		get_template_part( 'template-parts/content', 'projects' );

		// Single project navigation
		meteorite_project_navigation_type();

		// Related projects
		if ( get_theme_mod( 'related_projects_check', false ) == true ) :
			meteorite_show_related_projects();
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
if ( get_theme_mod( 'fullwidth_single_project_checkbox', true ) == false ) {
	get_sidebar();
}
get_footer();
