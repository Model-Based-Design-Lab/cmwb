<?php
/**
 * The template for displaying the search form using get_search_form() 
 *
 * @package Meteorite
 */
?>

<form role="search" class="searchform" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<div class="search-table">
		<div class="search-field">
			<label for="s" class="screen-reader-text"><?php _e( 'Search', 'meteorite' ); ?></label> 
			<input type="text" value="" name="s" class="s" id="s" placeholder="<?php _e( 'Search', 'meteorite' ); ?>" />
		</div>
		<div class="search-button">
			<button type="submit" class="searchsubmit">
				<i class="fa fa-search" aria-hidden="true"></i>
				<span class="screen-reader-text"><?php _e( 'Search', 'meteorite' ); ?></span>
			</button>
		</div>
	</div>
</form>
