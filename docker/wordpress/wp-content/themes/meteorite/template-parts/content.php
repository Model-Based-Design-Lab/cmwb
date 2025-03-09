<?php
/**
 * Template part for blog page, archives and search results page. Only for standard post format.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Meteorite
 */

$blog_layout_class = '';
$blog_layout = get_theme_mod( 'blog_layout', 'fullwidth' );

// Get correct class depending of layout type
if ( ! is_singular( get_post_type() ) ) :
	if ( 'fullwidth' == $blog_layout || 'masonry' == $blog_layout ) :
		$blog_layout_class = 'post-type-fullwidth';
	elseif ( 'grid_2_col' == $blog_layout ) :
		$blog_layout_class = 'post-type-grid-2-col';
	elseif ( 'fullwidth_grid' == $blog_layout ) :
		$blog_layout_class = 'post-type-fullwidth-grid';
	elseif ( 'img-left' == $blog_layout ) :
		$blog_layout_class = 'post-type-img-left';
	endif;
endif;

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $blog_layout_class ); ?>>

	<?php if ( is_singular( get_post_type() ) ) : // Is single view ?>

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

			if ( get_post_type() == 'post' && get_theme_mod( 'post_author_check', true ) == true ) :
				meteorite_about_the_author();
			endif;
			?>
		</footer><!-- .single-footer -->

		<?php do_action( 'meteorite_inside_post_bottom' ); ?>

	<?php else : // End single view ?>

		<div class="post-wrapper clearfix">

			<?php if ( 'img-left' == $blog_layout ) : // Specific HTML for img-left blog layout type ?>

				<header class="entry-header">
					<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
				</header><!-- .entry-header -->

				<?php if ( get_post_type() == 'post' ) : ?>
					<?php if ( is_search() && get_theme_mod( 'hide_meta_search', false ) == false || ( is_home() || is_archive() ) && get_theme_mod( 'hide_meta_index', false ) == false ) : ?>
						<div class="post-meta">
							<?php meteorite_meta_info(); ?>
						</div><!-- .post-meta -->
					<?php endif; ?>
				<?php endif; ?>
			
				<?php if ( has_post_thumbnail() ) : ?>
					<?php if ( is_search() && get_theme_mod( 'search_feat_image', false ) == false || ( is_home() || is_archive() ) && get_theme_mod( 'index_feat_image', false ) == false ) : ?>
						<div class="entry-thumb">
							<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail( 'meteorite-medium-thumb' ); ?></a>
						</div><!-- .entry-thumb -->
					<?php endif; ?>
				<?php endif; ?>

				<div class="post-inner">

			<?php else : // else ( 'img-left' != $blog_layout ): Specific HTML for blog layout types (not img-left) ?>

				<?php if ( has_post_thumbnail() ) : ?>
					<?php if ( is_search() && get_theme_mod( 'search_feat_image', false ) == false || ( is_home() || is_archive() ) && get_theme_mod( 'index_feat_image', false ) == false ) : ?>
						<div class="entry-thumb">
							<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail( 'meteorite-blog-thumb' ); ?></a>
						</div><!-- .entry-thumb -->
					<?php endif; ?>
				<?php endif; ?>

				<div class="post-inner">
					<header class="entry-header">
						<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
					</header><!-- .entry-header -->

					<?php if ( get_post_type() == 'post' ) : ?>
						<?php if ( is_search() && get_theme_mod( 'hide_meta_search', false ) == false || ( is_home() || is_archive() ) && get_theme_mod( 'hide_meta_index', false ) == false ) : ?>
							<div class="post-meta">
								<?php meteorite_meta_info(); ?>
							</div><!-- .post-meta -->
						<?php endif; ?>
					<?php endif; ?>

			<?php endif; // end blog type specific HTML ?>

				<div class="entry-content clearfix">
					<?php 
					if ( ( is_home() && get_theme_mod( 'full_content_home', false ) == true ) || ( is_archive() && get_theme_mod( 'full_content_archives', false ) == true ) ) :
						the_content();
					else :
						the_excerpt();
						if ( get_theme_mod( 'hide_read_more', false ) == false ) :
							meteorite_read_more_button();
						endif;
					endif;
					?>
					<?php meteorite_link_pages(); ?>
				</div> <!-- .entry-content -->

				<footer class="entry-footer">
					<?php meteorite_entry_footer(); ?>
				</footer> <!-- .entry-footer -->

			</div> <!-- .post-inner -->

		</div><!-- .post-wrapper -->

	<?php endif; ?>

</article>