<?php
/*
Template Name: Page Builder
*/

get_header(); 
?>

<div id="primary" class="fp-content-area col-md-12">
	<main id="main" class="site-main" role="main">
		<?php 
		while ( have_posts() ) :

			the_post();
			the_content();

			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif; 

		endwhile; // End of the loop. 
		?>
	</main>
</div>

<?php 
get_footer();
