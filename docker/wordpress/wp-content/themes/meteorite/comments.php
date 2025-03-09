<?php
/**
 * The template for displaying comments.
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * Derived from Twentyseventeen theme version 1.7
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Meteorite
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area">

	<?php if ( have_comments() ) : ?>
		<h2 class="comments-title">
			<?php
			$comments_number = get_comments_number();
			if ( '1' === $comments_number ) {
				/* translators: %s: post title */
				printf( _x( 'One Reply to &ldquo;%s&rdquo;', 'comments title', 'meteorite' ), get_the_title() );
			} else {
				printf(
					/* translators: 1: number of comments, 2: post title */
					_nx(
						'%1$s Reply to &ldquo;%2$s&rdquo;',
						'%1$s Replies to &ldquo;%2$s&rdquo;',
						$comments_number,
						'comments title',
						'meteorite'
					),
					number_format_i18n( $comments_number ),
					get_the_title()
				);
			}
			?>
		</h2>

		<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // Are there comments to navigate through? ?>
			<nav id="comment-nav-above" class="navigation comment-navigation" role="navigation">
				<h2 class="screen-reader-text"><?php _e( 'Comment navigation', 'meteorite' ); ?></h2>
				<div class="nav-links">

					<div class="nav-previous"><?php previous_comments_link( __( 'Older Comments', 'meteorite' ) ); ?></div>
					<div class="nav-next"><?php next_comments_link( __( 'Newer Comments', 'meteorite' ) ); ?></div>

				</div>
			</nav>
		<?php endif; // Check for comment navigation. ?>

		<ol class="comment-list">
			<?php
				wp_list_comments(
					array(
						'style'			=> 'ol',
						'short_ping' 	=> true,
						'avatar_size'	=> 60,
						'callback'		=> '',
					)
				);
			?>
		</ol>

		<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // Are there comments to navigate through? ?>
			<nav id="comment-nav-below" class="navigation comment-navigation" role="navigation">
				<h2 class="screen-reader-text"><?php _e( 'Comment navigation', 'meteorite' ); ?></h2>
				<div class="nav-links">

					<div class="nav-previous"><?php previous_comments_link( __( 'Older Comments', 'meteorite' ) ); ?></div>
					<div class="nav-next"><?php next_comments_link( __( 'Newer Comments', 'meteorite' ) ); ?></div>

				</div>
			</nav>
		<?php endif; // Check for comment navigation.

	endif; // Check for have_comments().

	// If comments are closed and there are comments, let's leave a little note, shall we?
	if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
		<p class="no-comments"><?php _e( 'Comments are closed.', 'meteorite' ); ?></p>
	<?php
	endif;

	comment_form();
	?>

</div><!-- #comments -->
