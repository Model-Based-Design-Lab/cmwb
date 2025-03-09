<?php
/*
Template Name: Sidebar left
*/

get_header(); 
?>

<?php get_sidebar( 'left' ); ?>

<div id="primary" class="content-area col-md-9">
	<main id="main" class="site-main" role="main">
		<?php 
		while ( have_posts() ) : 

			the_post();
			get_template_part( 'template-parts/content', 'page' );

			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;

		endwhile; // End of the loop. 
		?>
	</main><!-- #main -->
</div><!-- #primary -->

<?php 
get_footer();