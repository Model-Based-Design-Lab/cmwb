<?php
/**
 * Post metaboxes for header image text
 *
 * @package Meteorite
 */


function call_Meteorite_Post_Metabox() {
	new Meteorite_Post_Metabox();
}

if ( is_admin() ) {
	add_action( 'load-post.php', 'call_Meteorite_Post_Metabox' );
	add_action( 'load-post-new.php', 'call_Meteorite_Post_Metabox' );
}

class Meteorite_Post_Metabox {

	public function __construct() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'save_post', array( $this, 'save' ) );
	}


	public function add_meta_box( $post_type ) {
		$post_types = array( 'post' );

		if ( in_array( $post_type, $post_types ) ) {
			add_meta_box(
				'meteorite_post_metabox'
				,__( 'Header Text', 'meteorite' )
				,array( $this, 'render_meta_box_content' )
				,$post_type
				,'advanced'
				,'high'
			);
		}
	}

	public function save( $post_id ) {
	
		if ( ! isset( $_POST['meteorite_post_inner_custom_box_nonce'] ) )
			return $post_id;

		$nonce = $_POST['meteorite_post_inner_custom_box_nonce'];

		if ( ! wp_verify_nonce( $nonce, 'meteorite_post_inner_custom_box' ) )
			return $post_id;
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
			return $post_id;

		if ( ! current_user_can( 'edit_post', $post_id ) )
			return $post_id;

		$meteorite_post_image_header_title 		= isset( $_POST['meteorite_post_image_header_title'] ) ? wp_kses_post( $_POST['meteorite_post_image_header_title'] ) : false;
		$meteorite_post_image_header_title_tag 	= isset( $_POST['meteorite_post_image_header_title_tag'] ) ? esc_attr( $_POST['meteorite_post_image_header_title_tag'] ) : false;
		$meteorite_post_image_header_text 		= isset( $_POST['meteorite_post_image_header_text'] ) ? wp_kses_post( $_POST['meteorite_post_image_header_text'] ) : false;
		$meteorite_post_image_header_text_tag 	= isset( $_POST['meteorite_post_image_header_text_tag'] ) ? esc_attr( $_POST['meteorite_post_image_header_text_tag'] ) : false;

		update_post_meta( $post_id, '_meteorite_post_image_header_title', $meteorite_post_image_header_title );
		update_post_meta( $post_id, '_meteorite_post_image_header_title_tag', $meteorite_post_image_header_title_tag );
		update_post_meta( $post_id, '_meteorite_post_image_header_text', $meteorite_post_image_header_text );
		update_post_meta( $post_id, '_meteorite_post_image_header_text_tag', $meteorite_post_image_header_text_tag );

	}

	public function render_meta_box_content( $post ) {
	
		wp_nonce_field( 'meteorite_post_inner_custom_box', 'meteorite_post_inner_custom_box_nonce' );

		$meteorite_post_image_header_title		= get_post_meta( $post->ID, '_meteorite_post_image_header_title', true );
		$meteorite_post_image_header_title_tag	= get_post_meta( $post->ID, '_meteorite_post_image_header_title_tag', true );
		$meteorite_post_image_header_text		= get_post_meta( $post->ID, '_meteorite_post_image_header_text', true );
		$meteorite_post_image_header_text_tag	= get_post_meta( $post->ID, '_meteorite_post_image_header_text_tag', true );
		?>

	<div class="tt-meta-wrapper">
		<div class="tt-meta-section">
			<div class="tt-field-desc">
				<h4><?php _e( 'Header Image Headline', 'meteorite' ); ?></h4>
				<p><?php _e( 'Enter a headline for this header image', 'meteorite' ); ?></p>
			</div>
			<div class="tt-section-content">
				<div class="container-fluid">
					<div class="row">
						<div class="col-lg-6">
							<em class="tt-field-description"><?php _e( 'Text', 'meteorite' ); ?></em>
							<input type="text" class="form-control tt-form-element" id="meteorite_post_image_header_title" name="meteorite_post_image_header_title" value="<?php echo esc_html( $meteorite_post_image_header_title ); ?>">
						</div>
						<div class="col-lg-6">
							<em class="tt-field-description"><?php _e( 'Tag', 'meteorite' ); ?></em>
							<select id='meteorite_post_image_header_title_tag' name='meteorite_post_image_header_title_tag' class="form-control tt-form-element">
							<?php
							$options = array( '', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
							foreach ( $options as $option ) {
								echo '<option value="' . $option . '" id="' . $option . '"', $meteorite_post_image_header_title_tag == $option ? ' selected="selected"' : '', '>', esc_attr( $option ), '</option>';
							}
							?>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tt-meta-section">
			<div class="tt-field-desc">
				<h4><?php _e( 'Header Image Text', 'meteorite' ); ?></h4>
				<p><?php _e( 'Enter a text for this header image', 'meteorite' ); ?></p>
			</div>
			<div class="tt-section-content">
				<div class="container-fluid">
					<div class="row">
						<div class="col-lg-6">
							<em class="tt-field-description"><?php _e( 'Text', 'meteorite' ); ?></em>
							<input type="text" class="form-control tt-form-element" id="meteorite_post_image_header_text" name="meteorite_post_image_header_text" value="<?php echo esc_html( $meteorite_post_image_header_text ); ?>">
						</div>
						<div class="col-lg-6">
							<em class="tt-field-description"><?php _e( 'Tag', 'meteorite' ); ?></em>
							<select id='meteorite_post_image_header_text_tag' name='meteorite_post_image_header_text_tag' class="form-control tt-form-element">
							<?php
							$options = array( '', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
							foreach ( $options as $option ) {
								echo '<option value="' . $option . '" id="' . $option . '"', $meteorite_post_image_header_text_tag == $option ? ' selected="selected"' : '', '>', esc_attr( $option ), '</option>';
							}
							?>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<?php
	}
}