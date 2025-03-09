<?php
/**
 * Template for single pages (employees, clients, other custom post types etc.) except posts with a post format.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Meteorite
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php do_action( 'meteorite_inside_post_top' ); ?>

	<?php 
	if ( has_post_thumbnail() ) :
		if ( get_post_type() == 'post' ) {
			if ( get_theme_mod( 'post_feat_image', false ) == false ) { 
				?>
				<div class="single-thumb">
					<?php the_post_thumbnail(); ?>
				</div><!-- .single-thumb -->
			<?php
			} 
		} else { ?>
			<div class="single-thumb">
				<?php the_post_thumbnail(); ?>
			</div><!-- .single-thumb -->
		<?php
		}
	endif; ?>

	<?php if ( get_theme_mod( 'header_titlebar', 'off' ) == 'off' ) : ?>
		<header class="single-header">
			<?php
			if ( get_post_type() == 'post' ) {
				if ( get_theme_mod( 'hide_title_single', false ) == false ) {
					the_title( '<h1 class="title-post">', '</h1>' );
				}
			} else {
				the_title( '<h1 class="title-post">', '</h1>' );
			}
			?>

			<?php if ( get_theme_mod( 'hide_meta_single', false ) == false && get_post_type() == 'post' ) : ?>
				<div class="post-meta">
					<?php meteorite_meta_info(); ?>
				</div>
			<?php endif; ?>
		</header><!-- .single-header -->
	<?php endif; ?>

	<div class="single-content clearfix">
		<?php the_content(); ?>
		<?php meteorite_link_pages(); ?>
	</div><!-- .single-content -->

	<footer class="single-footer">
		<?php 
		meteorite_entry_footer();

		if ( get_post_type() == 'post' && get_theme_mod( 'post_author_check', true ) == true ) :
			meteorite_about_the_author();
		endif;
		?>
	</footer><!-- .single-footer -->

	<?php do_action( 'meteorite_inside_post_bottom' ); ?>

</article>