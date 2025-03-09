<?php
/**
 * Template for Status post format on blog page, archives, search and single.
 *
 * @package Meteorite
 */

$layout_type_class = '';
$layout_type = get_theme_mod( 'blog_layout', 'fullwidth' );

// Get correct class depending of layout type
if ( ! is_singular( get_post_type() ) ) :
	if ( 'fullwidth' == $layout_type || 'masonry' == $layout_type ) :
		$layout_type_class = 'post-type-fullwidth';
	elseif ( 'grid_2_col' == $layout_type ) :
		$layout_type_class = 'post-type-grid-2-col';
	elseif ( 'fullwidth_grid' == $layout_type ) :
		$layout_type_class = 'post-type-fullwidth-grid';
	elseif ( 'img-left' == $layout_type ) :
		$layout_type_class = 'post-type-img-left';
	endif;
endif;
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $layout_type_class ); ?>>

	<?php if ( is_singular( get_post_type() ) ) : // Is single view ?>

		<?php do_action( 'meteorite_inside_post_top' ); ?>

		<?php 
		if ( has_post_thumbnail() ) :
			if ( get_theme_mod( 'post_feat_image', false ) == false ) { 
				?>
				<div class="single-thumb">
					<?php the_post_thumbnail(); ?>
				</div><!-- .single-thumb -->
			<?php
			}
		endif;
		?>

		<?php if ( get_theme_mod( 'header_titlebar', 'off' ) == 'off' ) : ?>
			<header class="single-header">
				<?php 
				if ( get_theme_mod( 'hide_title_single', false ) == false ) :
					the_title( '<h1 class="title-post">', '</h1>' );
				endif;

				if ( get_theme_mod( 'hide_meta_single', false ) == false ) : 
					?>
					<div class="post-meta">
						<?php meteorite_meta_info(); ?>
					</div><!-- .post-meta -->
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

			if ( get_theme_mod( 'post_author_check', true ) == true ) :
				meteorite_about_the_author();
			endif;
			?>
		</footer><!-- .single-footer -->

		<?php do_action( 'meteorite_inside_post_bottom' ); ?>

	<?php else : // End single view ?>

		<div class="meteorite-format-status post-wrapper clearfix">
			<div class="post-inner">

				<div class="entry-content clearfix">
					<?php the_excerpt(); ?>
				</div><!-- .entry-content -->

				<?php if ( ( is_home() || is_archive() ) && get_theme_mod( 'hide_meta_index', false ) == false || ( is_search() && get_theme_mod( 'hide_meta_search', false ) == false ) ) : ?>
					<div class="post-meta">
						<?php meteorite_meta_info(); ?>
					</div><!-- .post-meta -->
				<?php endif; ?>

				<footer class="entry-footer">
					<?php meteorite_entry_footer(); ?>
				</footer><!-- .entry-footer -->

			</div><!-- .post-inner -->
		</div><!-- .post-wrapper -->

	<?php endif; ?>

</article>