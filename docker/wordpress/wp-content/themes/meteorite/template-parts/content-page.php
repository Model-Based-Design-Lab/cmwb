<?php
/**
 * Template used for displaying page content in page.php and page content on search page.
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
		<?php if ( get_theme_mod( 'header_titlebar', 'off' ) == 'off' ) : ?>
			<header class="entry-header">
				<?php the_title( '<h1 class="title-post">', '</h1>' ); ?>
			</header><!-- .entry-header -->
		<?php endif; ?>

	<?php else : // End single view ?>

		<header class="entry-header">
			<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
		</header><!-- .entry-header -->

	<?php endif; ?>

	<div class="entry-content clearfix">
		<?php
		if ( ! is_search() ) :
			the_content();
		else :
			the_excerpt();
		endif;
		?>
		<?php meteorite_link_pages(); ?>
	</div><!-- .entry-content -->

	<footer class="single-footer">
		<?php meteorite_entry_footer() ?>
	</footer><!-- .entry-header -->
</article>
