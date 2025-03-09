<?php
/**
 * Template used for displaying project content on archives, search page and single projects.
 *
 * @package Meteorite
 */

$archive_layout_class = '';
$archive_layout = get_theme_mod( 'blog_layout', 'fullwidth' );

// Get correct archive class depending of layout type
if ( ! is_singular( get_post_type() ) ) :
	if ( 'fullwidth' == $archive_layout || 'masonry' == $archive_layout ) :
		$archive_layout_class = 'post-type-fullwidth';
	elseif ( 'grid_2_col' == $archive_layout ) :
		$archive_layout_class = 'post-type-grid-2-col';
	elseif ( 'fullwidth_grid' == $archive_layout ) :
		$archive_layout_class = 'post-type-fullwidth-grid';
	elseif ( 'img-left' == $archive_layout ) :
		$archive_layout_class = 'post-type-img-left';
	endif;
endif;

// Get the meta box content
$project_type			= get_post_meta( $post->ID, 'tt-project-type', true );
$detail_heading_one		= get_post_meta( $post->ID, 'tt-project-detail-heading-one', true );
$detail_desc_one		= get_post_meta( $post->ID, 'tt-project-detail-desc-one', true );
$detail_heading_two		= get_post_meta( $post->ID, 'tt-project-detail-heading-two', true );
$detail_desc_two		= get_post_meta( $post->ID, 'tt-project-detail-desc-two', true );
$detail_heading_three	= get_post_meta( $post->ID, 'tt-project-detail-heading-three', true );
$detail_desc_three		= get_post_meta( $post->ID, 'tt-project-detail-desc-three', true );
$detail_heading_four	= get_post_meta( $post->ID, 'tt-project-detail-heading-four', true );
$detail_desc_four		= get_post_meta( $post->ID, 'tt-project-detail-desc-four', true );

// Check if the project has the half layout
$project_type_class = '';
if ( 'Half' == $project_type ) {
	$project_type_class = 'project-layout-half clearfix';
}

// Get the project details if set
$project_details = '';
if ( '' != $detail_heading_one && '' != $detail_desc_one ) {
	$project_details .= '<div class="project-details-box"><h5 class="project-details-heading">' . esc_html( $detail_heading_one ) . '</h5><p class="project-details-desc">' . wp_kses_post( force_balance_tags( $detail_desc_one ) ) . '</a></p></div>';
}
if ( '' != $detail_heading_two && '' != $detail_desc_two ) {
	$project_details .= '<div class="project-details-box"><h5 class="project-details-heading">' . esc_html( $detail_heading_two ) . '</h5><p class="project-details-desc">' . wp_kses_post( force_balance_tags( $detail_desc_two ) ) . '</p></div>';
}
if ( '' != $detail_heading_three && '' != $detail_desc_three ) {
	$project_details .= '<div class="project-details-box"><h5 class="project-details-heading">' . esc_html( $detail_heading_three ) . '</h5><p class="project-details-desc">' . wp_kses_post( force_balance_tags( $detail_desc_three ) ) . '</p></div>';
}
if ( '' != $detail_heading_four && '' != $detail_desc_four ) {
	$project_details .= '<div class="project-details-box"><h5 class="project-details-heading">' . esc_html( $detail_heading_four ) . '</h5><p class="project-details-desc">' . wp_kses_post( force_balance_tags( $detail_desc_four ) ) . '</p></div>';
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( array( $project_type_class, $archive_layout_class ) ); ?>>

	<?php if ( is_singular( get_post_type() ) ) : // Is single view ?>
		<div class="clearfix">

			<?php 
			if ( has_post_thumbnail() && ( get_theme_mod( 'project_feat_image', false ) == false ) ) : ?>
				<div class="single-thumb">
					<?php the_post_thumbnail(); ?>
				</div><!-- .single-thumb -->
			<?php 
			endif; ?>

			<?php if ( '' != $project_details ) : // special HTML for project details ?>
				<div class="project-has-details clearfix">
			<?php endif; // end special HTML for project details ?>

				<div class="single-content clearfix">
					<header class="single-header">
						<?php if ( get_theme_mod( 'hide_title_single_projects', false ) == false && get_theme_mod( 'header_titlebar', 'off' ) == 'off' ) : ?>
							<?php the_title( '<h1 class="title-post">', '</h1>' ); ?>
						<?php endif; ?>

						<?php if ( get_theme_mod( 'hide_meta_single_projects', true ) == false && get_theme_mod( 'header_titlebar', 'off' ) == 'off' ) : ?>
							<div class="post-meta">
								<?php meteorite_meta_info(); ?>
							</div><!-- .post-meta -->
						<?php endif; ?>
					</header><!-- .single-header -->

					<?php the_content(); ?>
					<?php meteorite_link_pages(); ?>
				</div><!-- .single-content -->

				<?php if ( '' != $project_details ) : // special HTML for project details ?>
						<div class="project-details">
							<h4 class="project-details-title"><?php _e( 'Project Details', 'meteorite' ); ?></h4>
							<?php echo $project_details; ?>
						</div><!-- .project-details -->
					</div><!-- .project-has-details -->
				<?php endif; // end special HTML for project details ?>

		</div><!-- .clearfix -->

		<footer class="single-footer">
			<?php meteorite_entry_footer(); ?>
		</footer><!-- .single-footer -->

	<?php else : // End single view ?>

		<div class="post-wrapper clearfix">

			<?php if ( 'img-left' == $archive_layout ) : // Specific HTML for img-left archive layout type ?>
				<header class="entry-header">
					<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
				</header><!-- .entry-header -->

				<?php if ( get_theme_mod( 'hide_meta_projects', true ) == false ) : ?>
					<div class="post-meta">
						<?php meteorite_meta_info(); ?>
					</div><!-- .post-meta -->
				<?php endif; ?>

				<?php if ( has_post_thumbnail() ) : ?>
					<?php if ( is_search() && get_theme_mod( 'search_feat_image', false ) == false || is_archive() && get_theme_mod( 'index_feat_image', false ) == false ) : ?>
						<div class="entry-thumb">
							<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail( 'meteorite-medium-thumb' ); ?></a>
						</div><!-- .entry-thumb -->
					<?php endif; ?>
				<?php endif; ?>

				<div class="post-inner">

			<?php else : // else ( 'img-left' != $archive_layout ): Specific HTML for blog layout types (not img-left) ?>

				<?php if ( has_post_thumbnail() ) : ?>
					<?php if ( is_search() && get_theme_mod( 'search_feat_image', false ) == false || is_archive() && get_theme_mod( 'index_feat_image', false ) == false ) : ?>
						<div class="entry-thumb">
							<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail( 'meteorite-blog-thumb' ); ?></a>
						</div><!-- .entry-thumb -->
					<?php endif; ?>
				<?php endif; ?>

				<div class="post-inner">
					<header class="entry-header">
						<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
					</header><!-- .entry-header -->

					<?php if ( get_theme_mod( 'hide_meta_projects', true ) == false ) : ?>
						<div class="post-meta">
							<?php meteorite_meta_info(); ?>
						</div><!-- .post-meta -->
					<?php endif; ?>

			<?php endif; // end archive type specific HTML ?>

				<div class="entry-content clearfix">
					<?php the_excerpt(); ?>

					<?php
					if ( get_theme_mod( 'hide_read_more', false ) == false ) :
						meteorite_read_more_button();
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