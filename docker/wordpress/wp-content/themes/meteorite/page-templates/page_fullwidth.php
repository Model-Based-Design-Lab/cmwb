<?php
/*
Template Name: Full width
*/

get_header(); 
?>

<div id="primary" class="content-area col-md-12">
	<main id="main" class="site-main" role="main">

		<div class="entry-content">
			<?php 
			while ( have_posts() ) : 

				the_post();
				get_template_part( 'template-parts/content', 'page' );

				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

			endwhile; // end of the loop. 
			?>
		</div>

	</main><!-- #main -->
</div><!-- #primary -->

<?php 
get_footer();

