<?php
/**
 * Meteorite Theme Customizer
 *
 * @package Meteorite
 */

function meteorite_customize_register( $wp_customize ) {
	$wp_customize->get_section( 'title_tagline' )->priority = '5';
	$wp_customize->get_section( 'title_tagline' )->title = __( 'Site information', 'meteorite' );
	$wp_customize->get_section( 'colors' )->title = __( 'General', 'meteorite' );
	$wp_customize->get_section( 'colors' )->panel = 'meteorite_colors_panel';
	$wp_customize->get_section( 'colors' )->priority = '10';

	// Titles
	class Meteorite_Info extends WP_Customize_Control {
		public $type = 'info';
		public $label = '';
		public function render_content() {
		?>
			<h3 style="margin-top:30px;color:#FFF;padding:5px;background-color:#435159;text-align:center;text-transform:uppercase;"><?php echo esc_html( $this->label ); ?></h3>
		<?php
		}
	}

	// Logo title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'logo_title', array(
		'label' 	=> __( 'Logo Options', 'meteorite' ),
		'section' 	=> 'title_tagline',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 2
		) )
	);

	// Logo Lite Upload
	$wp_customize->add_setting(
		'logo_light',
		array(
			'default-image'		=> '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'logo_light',
			array(
				'label'			=> __( 'Logo Light', 'meteorite' ),
				'description'	=> __( 'Upload your logo for use on a dark background.', 'meteorite' ),
				'type'			=> 'image',
				'section'		=> 'title_tagline',
				'settings'		=> 'logo_light',
				'priority'		=> 8,
			)
		)
	);

	// Logo type before scroll
	$wp_customize->add_setting(
		'logo_before_scroll',
		array(
			'default'			=> 'logo-default',
			'sanitize_callback' => 'meteorite_sanitize_logo_type',
		)
	);
	$wp_customize->add_control(
		'logo_before_scroll',
		array(
			'type'			=> 'radio',
			'label'			=> __( 'Logo before scroll', 'meteorite' ),
			'description' 	=> __( 'Choose which logo should be shown before the user scrolls.', 'meteorite' ),
			'section'		=> 'title_tagline',
			'priority'		=> 9,
			'choices' 		=> array(
				'logo-default'	=> __( 'Default Logo', 'meteorite' ),
				'logo-light'	=> __( 'Light Logo', 'meteorite' ),
			),
		)
	);

	// Logo type after scroll
	$wp_customize->add_setting(
		'logo_after_scroll',
		array(
			'default'			=> 'logo-default',
			'sanitize_callback' => 'meteorite_sanitize_logo_type',
		)
	);
	$wp_customize->add_control(
		'logo_after_scroll',
		array(
			'type'			=> 'radio',
			'label'			=> __( 'Logo after scroll', 'meteorite' ),
			'description'	=> __( 'Choose which logo should be shown after the user scrolls.', 'meteorite' ),
			'section'		=> 'title_tagline',
			'priority'		=> 9,
			'choices' 		=> array(
				'logo-default'	=> __( 'Default Logo', 'meteorite' ),
				'logo-light'	=> __( 'Light Logo', 'meteorite' ),
			),
		)
	);

	// Logo type mobile
	$wp_customize->add_setting(
		'logo_type_mobile',
		array(
			'default'			=> 'logo-default',
			'sanitize_callback' => 'meteorite_sanitize_logo_type',
		)
	);
	$wp_customize->add_control(
		'logo_type_mobile',
		array(
			'type'			=> 'radio',
			'label'			=> __( 'Logo type mobile', 'meteorite' ),
			'description' 	=> __( 'Choose which logo should be shown on screens < 992px.', 'meteorite' ),
			'section'		=> 'title_tagline',
			'priority'		=> 9,
			'choices' 		=> array(
				'logo-default'	=> __( 'Default Logo', 'meteorite' ),
				'logo-light'	=> __( 'Light Logo', 'meteorite' ),
			),
		)
	);

	// Site title/description title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'site_information_title', array(
		'label' 	=> __( 'Site Information', 'meteorite' ),
		'section' 	=> 'title_tagline',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 9
		) )
	);

	/*--------------------------------------------------------------
	# General
	--------------------------------------------------------------*/
	$wp_customize->add_section(
		'meteorite_general',
		array(
			'title'		=> __( 'General', 'meteorite' ),
			'priority'	=> 10,
		)
	);

	// Layout title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'layout_type', array(
		'label' 	=> __( 'Layout Options', 'meteorite' ),
		'section' 	=> 'meteorite_general',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 10
		) )
	);

	// Layout type
	$wp_customize->add_setting(
		'body_layout',
		array(
			'default'			=> 'wide',
			'sanitize_callback' => 'meteorite_sanitize_lt',
		)
	);
	$wp_customize->add_control(
		'body_layout',
		array(
			'type'		=> 'radio',
			'label'		=> __( 'Layout', 'meteorite' ),
			'section'	=> 'meteorite_general',
			'priority'	=> 12,
			'choices'	=> array(
				'wide'	=> __( 'Wide', 'meteorite' ),
				'boxed'	=> __( 'Boxed', 'meteorite' ),
			),
		)
	);

	// Background image upload
	$wp_customize->add_setting(
		'body_image_boxed',
		array(
			'default-image'		=> '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'body_image_boxed',
			array(
				'label'		=> __( 'Upload your background (boxed)', 'meteorite' ),
				'type'		=> 'image',
				'section'	=> 'meteorite_general',
				'priority'	=> 14,
			)
		)
	);

	// Background type
	$wp_customize->add_setting(
		'body_boxed_image_type',
		array(
			'default'			=> 'image',
			'sanitize_callback' => 'meteorite_sanitize_bt',
		)
	);
	$wp_customize->add_control(
		'body_boxed_image_type',
		array(
			'type'		=> 'radio',
			'label'		=> __( 'Background Type', 'meteorite' ),
			'section'	=> 'meteorite_general',
			'priority'	=> 16,
			'choices' 	=> array(
				'image'		=> __( 'Image', 'meteorite' ),
				'pattern'	=> __( 'Pattern', 'meteorite' ),
			),
		)
	);

	// Preloader title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'preloader_title', array(
		'label' 	=> __( 'Preloader Options', 'meteorite' ),
		'section' 	=> 'meteorite_general',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 16
		) )
	);

	// Preloader type
	$wp_customize->add_setting(
		'preloader_type',
		array(
			'default'			=> 'none',
			'sanitize_callback' => 'meteorite_sanitize_pt',
		)
	);
	$wp_customize->add_control(
		'preloader_type',
		array(
			'type'			=> 'radio',
			'label'			=> __( 'Preloader', 'meteorite' ),
			'description' 	=> __( 'Display an animation while the site loads', 'meteorite' ),
			'section'		=> 'meteorite_general',
			'priority'		=> 20,
			'choices' 		=> array(
				'none'		=> __( 'None', 'meteorite' ),
				'wave'		=> __( 'Wave', 'meteorite' ),
				'dots'		=> __( 'Dots', 'meteorite' ),
				'circles'	=> __( 'Circles', 'meteorite' ),
			),
		)
	);

	// Page wrapper padding title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'page_wrap_pad', array(
		'label' 	=> __( 'Page Wrapper', 'meteorite' ),
		'section' 	=> 'meteorite_general',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 22
		) )
	);

	// Page wrapper top padding
	$wp_customize->add_setting(
		'page_wrapper_padding_top',
		array(
			'default'			=> '100',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'page_wrapper_padding_top', array(
		'type'			=> 'number',
		'priority'		=> 24,
		'section'		=> 'meteorite_general',
		'label'			=> __( 'Page Wrapper - Top Padding ', 'meteorite' ),
		'description'	=> __( 'Top padding for the page wrapper (the space between the header and the page title).', 'meteorite' ),
		'input_attrs'	=> array(
			'min'	=> 0,
			'max'	=> 250,
			'step'	=> 5,
		),
	) );

	// Page wrapper bottom padding
	$wp_customize->add_setting(
		'page_wrapper_padding_bottom',
		array(
			'default'			=> '100',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'page_wrapper_padding_bottom', array(
		'type'			=> 'number',
		'priority'		=> 26,
		'section'		=> 'meteorite_general',
		'label'			=> __( 'Page Wrapper - Bottom Padding ', 'meteorite' ),
		'description'	=> __( 'Bottom padding for the page wrapper (the space between the page content and the footer).', 'meteorite' ),
		'input_attrs'	=> array(
			'min'	=> 0,
			'max'	=> 250,
			'step'	=> 5,
		),
	) );

	// Animations title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'animation_checkbox_title', array(
		'label' 	=> __( 'Animations', 'meteorite' ),
		'section' 	=> 'meteorite_general',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 28
		) )
	);

	// Animation disable
	$wp_customize->add_setting(
		'animation_disable_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'animation_disable_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Disable all widget animations?', 'meteorite' ),
			'section'	=> 'meteorite_general',
			'priority'	=> 30,
		)
	);

	/*--------------------------------------------------------------
	# Header
	--------------------------------------------------------------*/
	$wp_customize->add_panel( 'meteorite_header_panel', array(
		'priority'			=> 12,
		'capability'		=> 'edit_theme_options',
		'theme_supports' 	=> '',
		'title'				=> __( 'Header area', 'meteorite' ),
	) );
 
	// Header settings
	$wp_customize->add_section(
		'meteorite_header_settings',
		array(
			'title'		=> __( 'Header settings', 'meteorite' ),
			'priority'	=> 10,
			'panel'		=> 'meteorite_header_panel',
		)
	);

	// Header titlebar title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'header_titlebar_title', array(
		'label' 	=> __( 'Titlebar', 'meteorite' ),
		'section' 	=> 'meteorite_header_settings',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 11
		) )
	);

	// Header type page
	$wp_customize->add_setting(
		'header_titlebar',
		array(
			'default'			=> 'off',
			'sanitize_callback' => 'meteorite_sanitize_titlebar',
		)
	);
	$wp_customize->add_control(
		'header_titlebar',
		array(
			'type'			=> 'radio',
			'priority'		=> 12,
			'label'			=> __( 'Sub page titlebar', 'meteorite' ),
			'description'	=> __( 'Turn on or off the titlebar on sub pages.', 'meteorite' ),
			'section'		=> 'meteorite_header_settings',
			'choices'		=> array(
				'on'	=> __( 'On', 'meteorite' ),
				'off'	=> __( 'Off', 'meteorite' ),
			),
		)
	);

	// Breadcrumbs
	$wp_customize->add_setting(
		'enable_titlebar_breadcrumbs',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'enable_titlebar_breadcrumbs',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Enable breadcrumbs in titlebar?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 14,
		)
	);

	// Header image height title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'header_height', array(
		'label' 	=> __( 'Image Height', 'meteorite' ),
		'section' 	=> 'meteorite_header_settings',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 18
		) )
	);

	// Header image activation
	$wp_customize->add_setting(
		'header_image_active',
		array(
			'default'			=> true,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'header_image_active',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Activate the header image/shortcode area for all pages?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 20,
		)
	);

	// Header image responsiveness
	$wp_customize->add_setting(
		'header_image_full_height_front',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'header_image_full_height_front',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Set header image height to viewport height (front page).', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 22,
		)
	);

	// Header image responsiveness
	$wp_customize->add_setting(
		'header_image_full_height_page',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'header_image_full_height_page',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Set header image height to viewport height (sub pages).', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 24,
		)
	);

	// Header height
	$wp_customize->add_setting(
		'header_height_home',
		array(
			'default'			=> '800',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'header_height_home', array(
		'type'			=> 'number',
		'priority'		=> 26,
		'section'		=> 'meteorite_header_settings',
		'label'			=> __( 'Header height front page [default: 800px]', 'meteorite' ),
		'input_attrs'	=> array(
			'min'	=> 300,
			'max'	=> 1800,
			'step'	=> 10,
		),
	) );

	// Header height
	$wp_customize->add_setting(
		'header_height_page',
		array(
			'default'			=> '800',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'header_height_page', array(
		'type'			=> 'number',
		'priority'		=> 28,
		'section'		=> 'meteorite_header_settings',
		'label'			=> __( 'Header height sub pages [default: 800px]', 'meteorite' ),
		'input_attrs'	=> array(
			'min'	=> 300,
			'max'	=> 1800,
			'step'	=> 10,
		),
	) );

	// Header image responsiveness
	$wp_customize->add_setting(
		'header_image_responsive',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'header_image_responsive',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Activate scaling header image height on screens < 992px?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 30,
		)
	);

	// Header image customize title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'header_customize', array(
		'label' 	=> __( 'Customize', 'meteorite' ),
		'section' 	=> 'meteorite_header_settings',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 32
		) )
	);

	// Header image overlay frontpage
	$wp_customize->add_setting(
		'headerimage_overlay_checkbox_front',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headerimage_overlay_checkbox_front',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Disable header image overlay on front page?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 34,
		)
	);

	// Header image overlay subpages
	$wp_customize->add_setting(
		'headerimage_overlay_checkbox_sub',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headerimage_overlay_checkbox_sub',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Disable header image overlay on sub pages?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 36,
		)
	);

	// Header image parallax
	$wp_customize->add_setting(
		'headerimage_parallax_image_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headerimage_parallax_image_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Disable header image parallax effect?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 38,
		)
	);

	// Header image parallax
	$wp_customize->add_setting(
		'headerimage_parallax_text_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headerimage_parallax_text_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Disable header text parallax effect?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 40,
		)
	);

	// Header image parallax fixed
	$wp_customize->add_setting(
		'headerimage_bg_fixed_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headerimage_bg_fixed_checkbox',
		array(
			'type'			=> 'checkbox',
			'label'			=> __( 'Fix the background image?', 'meteorite' ),
			'description' 	=> __( 'Header image parallax should be disabled.', 'meteorite' ),
			'section'		=> 'meteorite_header_settings',
			'priority'		=> 42,
		)
	);

	// Header parallax-text opacity
	$wp_customize->add_setting(
		'headertext_opacity_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headertext_opacity_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Stop header image text from fading out?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 44,
		)
	);

	// Arrow button title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'arrow_button_title', array(
		'label' 	=> __( 'Arrow button', 'meteorite' ),
		'section' 	=> 'meteorite_header_settings',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 46
		) )
	);

	// Header image button front page
	$wp_customize->add_setting(
		'headerimage_fp_button_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headerimage_fp_button_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Display an arrow button in the header image on front page?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 48,
		)
	);

	// Header image button sub page
	$wp_customize->add_setting(
		'headerimage_page_button_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'headerimage_page_button_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Display an arrow button in the header image on sub pages?', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 50,
		)
	);

	// Arrow button URL
	$wp_customize->add_setting(
		'headerimage_page_button_url',
		array(
			'default'			=> '#content',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'headerimage_page_button_url',
		array(
			'type'		=> 'url',
			'label'		=> __( 'Arrow button URL', 'meteorite' ),
			'section'	=> 'meteorite_header_settings',
			'priority'	=> 52
		)
	);

	//Topbar type
	$wp_customize->add_section(
		'meteorite_nav_type',
		array(
			'title'		=> __( 'Topbar type', 'meteorite' ),
			'priority'	=> 14,
			'panel'		=> 'meteorite_header_panel',
		)
	);

	// Topbar type title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'topbar_type_title', array(
		'label' 	=> __( 'Topbar type', 'meteorite' ),
		'section' 	=> 'meteorite_nav_type',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 14
		) )
	);

	// Topbar type
	$wp_customize->add_setting(
		'topbar_type',
		array(
			'default'			=> 'none',
			'sanitize_callback' => 'meteorite_sanitize_topbar_type',
		)
	);
	$wp_customize->add_control(
		'topbar_type',
		array(
			'type'		=> 'radio',
			'priority'	=> 16,
			'label'		=> 'Topbar',
			'section'	=> 'meteorite_nav_type',
			'choices'	=> array(
				'none'		=> __( 'None', 'meteorite' ),
				'topbar_1'	=> __( 'With topbar (contact left, social icons right)', 'meteorite' ),
				'topbar_2'	=> __( 'With topbar (social icons left, claim right)', 'meteorite' ),
				'topbar_3'	=> __( 'With topbar (contact left, claim right)', 'meteorite' ),
				'topbar_4'	=> __( 'With topbar (menu left, social icons right)', 'meteorite' ),
			),
		)
	);

	// Topbar information title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'topbar_info', array(
		'label' 	=> __( 'Topbar information', 'meteorite' ),
		'section' 	=> 'meteorite_nav_type',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 18
		) )
	);

	// Header topbar
	// Claim
	$wp_customize->add_setting(
		'claim',
		array(
			'default'			=> 'Display your claim here.',
			'sanitize_callback' => 'meteorite_sanitize_text',
		)
	);
	$wp_customize->add_control(
		'claim',
		array(
			'type'		=> 'text',
			'label'		=> __( 'Company claim', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 20
		)
	);
	// Contact info
	$wp_customize->add_setting(
		'tel',
		array(
			'default'			=> '+1 (0) 999-000',
			'sanitize_callback' => 'meteorite_sanitize_text',
		)
	);
	$wp_customize->add_control(
		'tel',
		array(
			'type'		=> 'text',
			'label'		=> __( 'Telephone number', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 22
		)
	);
	$wp_customize->add_setting(
		'email',
		array(
			'default'			=> 'example@company.com',
			'sanitize_callback' => 'sanitize_email',
		)
	);
	$wp_customize->add_control(
		'email',
		array(
			'type'		=> 'email',
			'label'		=> __( 'E-mail', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 24
		)
	);
	// Social-nav
	$wp_customize->add_setting(
		'social-media-one',
		array(
			'default'			=> 'www.facebook.com',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'social-media-one',
		array(
			'type'		=> 'url',
			'label'		=> __( 'Social Media Link (1)', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 26
		)
	);
	$wp_customize->add_setting(
		'social-media-two',
		array(
			'default'			=> 'plus.google.com',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'social-media-two',
		array(
			'type'		=> 'url',
			'label'		=> __( 'Social Media Link (2)', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 28
		)
	);
	$wp_customize->add_setting(
		'social-media-three',
		array(
			'default'			=> 'www.youtube.com',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'social-media-three',
		array(
			'type'		=> 'url',
			'label'		=> __( 'Social Media Link (3)', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 30
		)
	);
	$wp_customize->add_setting(
		'social-media-four',
		array(
			'default'			=> 'twitter.com',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'social-media-four',
		array(
			'type'		=> 'url',
			'label'		=> __( 'Social Media Link (4)', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 32
		)
	);
	$wp_customize->add_setting(
		'social-media-five',
		array(
			'default'			=> 'linkedin.com',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'social-media-five',
		array(
			'type'		=> 'url',
			'label'		=> __( 'Social Media Link (5)', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 34
		)
	);
	$wp_customize->add_setting(
		'social-media-six',
		array(
			'default'			=> 'pinterest.com',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'social-media-six',
		array(
			'type'		=> 'url',
			'label'		=> __( 'Social Media Link (6)', 'meteorite' ),
			'section'	=> 'meteorite_nav_type',
			'priority'	=> 36
		)
	);

	// Navigation options title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'nav_options_title', array(
		'label' 	=> __( 'Menu options', 'meteorite' ),
		'section' 	=> 'meteorite_navigation',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 10
		) )
	);

	// Navigation options
	$wp_customize->add_section(
		'meteorite_navigation',
		array(
			'title'		=> __( 'Navigation options', 'meteorite' ),
			'priority'	=> 16,
			'panel'		=> 'meteorite_header_panel',
		)
	);

	// Menu position
	$wp_customize->add_setting(
		'menu_pos',
		array(
			'default'			=> 'above',
			'sanitize_callback' => 'meteorite_sanitize_menu_pos',
		)
	);
	$wp_customize->add_control(
		'menu_pos',
		array(
			'type'		=> 'radio',
			'priority'	=> 11,
			'label'		=> __( 'Menu position', 'meteorite' ),
			'section'	=> 'meteorite_navigation',
			'choices'	=> array(
				'above'			=> __( 'Above Header Image', 'meteorite' ),
				'above_solid'	=> __( 'Above Header Image (solid)', 'meteorite' ),
				'below'			=> __( 'Below Header Image', 'meteorite' ),
			),
		)
	);

	// Sticky menu
	$wp_customize->add_setting(
		'sticky_menu',
		array(
			'default'			=> 'sticky',
			'sanitize_callback' => 'meteorite_sanitize_sticky',
		)
	);
	$wp_customize->add_control(
		'sticky_menu',
		array(
			'type'		=> 'radio',
			'priority'	=> 12,
			'label'		=> __( 'Sticky menu', 'meteorite' ),
			'section'	=> 'meteorite_navigation',
			'choices'	=> array(
				'sticky'	=> __( 'Sticky', 'meteorite' ),
				'static'	=> __( 'Static', 'meteorite' ),
			),
		)
	);

	// Menu style
	$wp_customize->add_setting(
		'menu_style',
		array(
			'default'			=> 'inline',
			'sanitize_callback' => 'meteorite_sanitize_menu_style',
		)
	);
	$wp_customize->add_control(
		'menu_style',
		array(
			'type'		=> 'radio',
			'priority'	=> 13,
			'label'		=> __( 'Menu style', 'meteorite' ),
			'section'	=> 'meteorite_navigation',
			'choices'	=> array(
				'inline'	=> __( 'Inline', 'meteorite' ),
				'centered'	=> __( 'Centered', 'meteorite' ),
			),
		)
	);

	// Menu width
	$wp_customize->add_setting(
		'menu_width',
		array(
			'default'			=> 'boxed',
			'sanitize_callback' => 'meteorite_sanitize_menu_width',
		)
	);
	$wp_customize->add_control(
		'menu_width',
		array(
			'type'		=> 'radio',
			'priority'	=> 14,
			'label'		=> __( 'Menu width', 'meteorite' ),
			'section'	=> 'meteorite_navigation',
			'style'		=> 'margin-bottom: 15px; padding: 15px;',
			'choices'	=> array(
				'boxed'	=> __( 'Boxed', 'meteorite' ),
				'wide'	=> __( 'Wide', 'meteorite' ),
			),
		)
	);

	// Menu float
	$wp_customize->add_setting(
		'menu_float',
		array(
			'default' 			=> true,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'menu_float',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Decrease menu height after scroll?', 'meteorite' ),
			'section'	=> 'meteorite_navigation',
			'priority'	=> 16,
		)
	);

	// Mobile menu type title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'mobile_menu_type_title', array(
		'label' 	=> __( 'Mobile menu', 'meteorite' ),
		'section' 	=> 'meteorite_navigation',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 18
		) )
	);

	// Mobile menu type
	$wp_customize->add_setting(
		'mobile_menu_type',
		array(
			'default'			=> 'fancy',
			'sanitize_callback' => 'meteorite_sanitize_mobile_menu_type',
		)
	);
	$wp_customize->add_control(
		'mobile_menu_type',
		array(
			'type'		=> 'radio',
			'priority'	=> 20,
			'label'		=> 'Mobile Menu Button',
			'section'	=> 'meteorite_navigation',
			'choices'	=> array(
				'classic'	=> __( 'Classic', 'meteorite' ),
				'fancy'		=> __( 'Fancy (animated)', 'meteorite' ),
			),
		)
	);

	// Search options title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'search_options', array(
		'label' 	=> __( 'Search options', 'meteorite' ),
		'section' 	=> 'meteorite_navigation',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 22
		) )
	);

	// Search in header
	$wp_customize->add_setting(
		'search_checkbox',
		array(
			'default' 			=> true,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'search_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Show search in navigation?', 'meteorite' ),
			'section'	=> 'meteorite_navigation',
			'priority'	=> 24,
		)
	);

	// Search type
	$wp_customize->add_setting(
		'search_type',
		array(
			'default'			=> 'search_fullscreen',
			'sanitize_callback' => 'meteorite_sanitize_search_type',
		)
	);
	$wp_customize->add_control(
		'search_type',
		array(
			'type'		=> 'radio',
			'priority'	=> 26,
			'label'		=> __( 'Search type', 'meteorite' ),
			'section'	=> 'meteorite_navigation',
			'choices'	=> array(
				'search_fullscreen'		=> __( 'Fullscreen Search', 'meteorite' ),
				'search_under_header'	=> __( 'Search Under Header', 'meteorite' ),
			),
		)
	);

	/*--------------------------------------------------------------
	# Footer
	--------------------------------------------------------------*/
	$wp_customize->add_section(
		'meteorite_footer',
		array(
			'title'		=> __( 'Footer', 'meteorite' ),
			'priority'	=> 14,
		)
	);

	// Footer background title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'footer_bg_title', array(
		'label' 	=> __( 'Background Image', 'meteorite' ),
		'section' 	=> 'meteorite_footer',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 10
		) )
	);

	// Footer background image upload
	$wp_customize->add_setting(
		'footer_bg_image',
		array(
			'default-image'		=> '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'footer_bg_image',
			array(
				'label'		=> __( 'Upload your background image', 'meteorite' ),
				'type'		=> 'image',
				'section'	=> 'meteorite_footer',
				'priority'	=> 12,
			)
		)
	);

	// Footer widget areas title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'footer_widget__areas_title', array(
		'label' 	=> __( 'Widget Area', 'meteorite' ),
		'section' 	=> 'meteorite_footer',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 16
		) )
	);

	// Footer widget area
	$wp_customize->add_setting(
		'footer_widget_areas',
		array(
			'default'			=> '3',
			'sanitize_callback' => 'meteorite_sanitize_fw',
		)
	);
	$wp_customize->add_control(
		'footer_widget_areas',
		array(
			'type'			=> 'radio',
			'label'			=> __( 'Footer widget area', 'meteorite' ),
			'section'		=> 'meteorite_footer',
			'priority'		=> 18,
			'description' 	=> __( 'Select the number of widget areas you want in the footer.', 'meteorite' ),
			'choices' 		=> array(
				'1'	=> __( 'One', 'meteorite' ),
				'2'	=> __( 'Two', 'meteorite' ),
				'3'	=> __( 'Three', 'meteorite' ),
				'4'	=> __( 'Four', 'meteorite' )
			),
		)
	);

	// Footer alignment title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'footer_alignment_title', array(
		'label' 	=> __( 'Alignment', 'meteorite' ),
		'section' 	=> 'meteorite_footer',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 20
		) )
	);

	// Footer alignment checkbox
	$wp_customize->add_setting(
		'footer_text_center',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'footer_text_center',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Center the text in the footer?', 'meteorite' ),
			'section'	=> 'meteorite_footer',
			'priority'	=> 22
		)
	);

	// Footer credits title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'footer_credits_title', array(
		'label' 	=> __( 'Credits', 'meteorite' ),
		'section' 	=> 'meteorite_footer',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 24
		) )
	);

	// Footer Credits
	$wp_customize->add_setting(
		'footer_credits',
		array(
			'default'			=> '',
			'sanitize_callback' => 'meteorite_sanitize_text',
		)
	);
	$wp_customize->add_control(
	'footer_credits',
		array(
			'type'		=> 'text',
			'label'		=> __( 'Add your own credits into the footer (HTML allowed)', 'meteorite' ),
			'section'	=> 'meteorite_footer',
			'priority'	=> 26
		)
	);

	// Footer social title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'footer_social_title', array(
		'label' 	=> __( 'Social Media', 'meteorite' ),
		'section' 	=> 'meteorite_footer',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 28
		) )
	);

	// Footer Social
	$wp_customize->add_setting(
		'footersocial_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'footersocial_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Activate social media icons in the footer? If activated, go to Appearance > Menus and create a menu containing links to your social profiles and assign it as the Footer Menu.', 'meteorite' ),
			'section'	=> 'meteorite_footer',
			'priority'	=> 30
		)
	);

	/*--------------------------------------------------------------
	# Blog options
	--------------------------------------------------------------*/
	$wp_customize->add_section(
		'meteorite_blog',
		array(
			'title'		=> __( 'Blog Options', 'meteorite' ),
			'priority'	=> 16,
		)
	);

	// Blog layout title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'layout_title', array(
		'label' 	=> __( 'Layout', 'meteorite' ),
		'section' 	=> 'meteorite_blog',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 10
		) )
	);

	// Blog layout
	$wp_customize->add_setting(
		'blog_layout',
		array(
			'default'			=> 'fullwidth',
			'sanitize_callback' => 'meteorite_sanitize_bl',
		)
	);
	$wp_customize->add_control(
		'blog_layout',
		array(
			'type'		=> 'radio',
			'label'		=> 'Blog/Archive/Search Layout',
			'section'	=> 'meteorite_blog',
			'priority'	=> 12,
			'choices' 	=> array(
				'fullwidth'			=> __( 'Full Width', 'meteorite' ),
				'img-left'			=> __( 'Image Left', 'meteorite' ),
				'grid_2_col'		=> __( 'Grid - 2 Columns', 'meteorite' ),
				'fullwidth_grid'	=> __( 'Full Width > Grid', 'meteorite' ),
				'masonry'			=> __( 'Masonry', 'meteorite' )
			),
		)
	);

	// Fullwidth blog
	$wp_customize->add_setting(
		'fullwidth_blog_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'fullwidth_blog_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Full width blog/archive page?', 'meteorite' ),
			'section'	=> 'meteorite_blog',
			'priority'	=> 16,
		)
	);

	// Fullwidth search
	$wp_customize->add_setting(
		'fullwidth_search_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'fullwidth_search_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Full width search results page?', 'meteorite' ),
			'section'	=> 'meteorite_blog',
			'priority'	=> 18,
		)
	);

	// Pagination title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'blog_pagination', array(
		'label' 	=> __( 'Pagination', 'meteorite' ),
		'section' 	=> 'meteorite_blog',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 22,
		) )
	);

	// Pagination type
	$wp_customize->add_setting(
		'pagination_type',
		array(
			'default'			=> 'titles',
			'sanitize_callback' => 'meteorite_sanitize_pagtype',
		)
	);
	$wp_customize->add_control(
		'pagination_type',
		array(
			'type'		=> 'radio',
			'label'		=> 'Pagination type blog/archive/search',
			'section'	=> 'meteorite_blog',
			'priority'	=> 24,
			'choices' 	=> array(
				'none'		=> __( 'None', 'meteorite' ),
				'titles'	=> __( 'Titles', 'meteorite' ),
				'arrows'	=> __( 'Arrows', 'meteorite' ),
				'numbers'	=> __( 'Numbers', 'meteorite' ),
			),
		)
	);

	// Content/Excerpt title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'content_excerpt', array(
		'label' 	=> __( 'Content/Excerpt', 'meteorite' ),
		'section' 	=> 'meteorite_blog',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 28,
		) )
	);

	// Full content posts
	$wp_customize->add_setting(
		'full_content_home',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'full_content_home',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Check this box to display the full content of your posts on the blog page.', 'meteorite' ),
			'section' 	=> 'meteorite_blog',
			'priority' 	=> 30,
		)
	);

	$wp_customize->add_setting(
		'full_content_archives',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'full_content_archives',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Check this box to display the full content of your posts on all archives.', 'meteorite' ),
			'section' 	=> 'meteorite_blog',
			'priority' 	=> 32,
		)
	);
	
	// Excerpt
	$wp_customize->add_setting(
		'excerpt_length',
		array(
			'default'			=> '55',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 
		'excerpt_length', 
		array(
			'type'			=> 'number',
			'priority'		=> 36,
			'section'		=> 'meteorite_blog',
			'label'			=> __( 'Excerpt length', 'meteorite' ),
			'description' 	=> __( 'Choose your excerpt length. Default: 55 words', 'meteorite' ),
			'input_attrs' 	=> array(
				'min'	=> 10,
				'max'	=> 200,
				'step'	=> 5,
			),
		) 
	);

	$wp_customize->add_setting(
		'hide_read_more',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'hide_read_more',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Hide read more button on blog page, archives and search page?', 'meteorite' ),
			'section' 	=> 'meteorite_blog',
			'priority' 	=> 38,
		)
	);

	// Meta title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new meteorite_Info( $wp_customize, 'meta_title', array(
		'label' 	=> __( 'Meta', 'meteorite' ),
		'section' 	=> 'meteorite_blog',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 40,
		) )
	); 

	// Hide meta index
	$wp_customize->add_setting(
		'hide_meta_index',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'hide_meta_index',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Hide post meta on blog page and archives?', 'meteorite' ),
			'section' 	=> 'meteorite_blog',
			'priority' 	=> 42,
		)
	);

	// Hide meta search
	$wp_customize->add_setting(
		'hide_meta_search',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'hide_meta_search',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Hide post meta on search results?', 'meteorite' ),
			'section' 	=> 'meteorite_blog',
			'priority' 	=> 43,
		)
	);

	// Featured images title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new meteorite_Info( $wp_customize, 'featured_images_title', array(
		'label' 	=> __( 'Featured images', 'meteorite' ),
		'section' 	=> 'meteorite_blog',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 46,
		) )
	);

	// Index images
	$wp_customize->add_setting(
		'index_feat_image',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'index_feat_image',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Check this box to hide featured images on blog page and archives.', 'meteorite' ),
			'section' 	=> 'meteorite_blog',
			'priority' 	=> 48,
		)
	);

	// Search images
	$wp_customize->add_setting(
		'search_feat_image',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'search_feat_image',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Check this box to hide featured images on search page.', 'meteorite' ),
			'section' 	=> 'meteorite_blog',
			'priority' 	=> 50,
		)
	);

	/*--------------------------------------------------------------
	# Single options
	--------------------------------------------------------------*/
	$wp_customize->add_section(
		'meteorite_single',
		array(
			'title'		=> __( 'Single Posts', 'meteorite' ),
			'priority'	=> 18,
		)
	);

	// Single layout title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'single_layout_title', array(
		'label' 	=> __( 'Layout Options', 'meteorite' ),
		'section' 	=> 'meteorite_single',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 10
		) )
	);

	// Fullwidth singles
	$wp_customize->add_setting(
		'fullwidth_single_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'fullwidth_single_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Full width single posts?', 'meteorite' ),
			'section'	=> 'meteorite_single',
			'priority'	=> 12,
		)
	);

	// Small width singles
	$wp_customize->add_setting(
		'smallwidth_single_checkbox',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'smallwidth_single_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Small width single posts?', 'meteorite' ),
			'section'	=> 'meteorite_single',
			'priority'	=> 13,
		)
	);

	// Hide title single
	$wp_customize->add_setting(
		'hide_title_single',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'hide_title_single',
		array(
			'type' 		=> 'checkbox',
			'label'		=> __( 'Hide post title on singles?', 'meteorite' ),
			'section' 	=> 'meteorite_single',
			'priority' 	=> 14,
		)
	);

	// Hide meta single
	$wp_customize->add_setting(
		'hide_meta_single',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'hide_meta_single',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Hide post meta on singles?', 'meteorite' ),
			'section' 	=> 'meteorite_single',
			'priority' 	=> 16
		)
	);

	// Featured images title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new meteorite_Info( $wp_customize, 'single_featured_images_title', array(
		'label' 	=> __( 'Featured images', 'meteorite' ),
		'section' 	=> 'meteorite_single',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 18,
		) )
	);

	// Header image options
	$wp_customize->add_setting(
		'single_header_image',
		array(
			'default'			=> 'none',
			'sanitize_callback' => 'meteorite_sanitize_single_header',
		)
	);
	$wp_customize->add_control(
		'single_header_image',
		array(
			'type'		=> 'radio',
			'label'		=> 'Singles header image',
			'section'	=> 'meteorite_single',
			'priority'	=> 20,
			'choices' 	=> array(
				'none'				=> __( 'None', 'meteorite' ),
				'full_width_image'	=> __( 'Additional Header Image', 'meteorite' ),
			),
		)
	);

	// Post images
	$wp_customize->add_setting(
		'post_feat_image',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'post_feat_image',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Check this box to hide featured images on single posts.', 'meteorite' ),
			'section' 	=> 'meteorite_single',
			'priority' 	=> 22,
		)
	);

	// Pagination title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'single_pagination', array(
		'label' 	=> __( 'Pagination', 'meteorite' ),
		'section' 	=> 'meteorite_single',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 24,
		) )
	);

	// Pagination type
	$wp_customize->add_setting(
		'pagination_type_single',
		array(
			'default'			=> 'titles',
			'sanitize_callback' => 'meteorite_sanitize_pagtype_single',
		)
	);
	$wp_customize->add_control(
		'pagination_type_single',
		array(
			'type'		=> 'radio',
			'label'		=> 'Pagination type singles',
			'section'	=> 'meteorite_single',
			'priority'	=> 26,
			'choices' 	=> array(
				'none'			=> __( 'None', 'meteorite' ),
				'titles'		=> __( 'Titles', 'meteorite' ),
				'titles_images' => __( 'Titles with images', 'meteorite' ),
				'arrows'		=> __( 'Arrows', 'meteorite' ),
			),
		)
	);

	// Post author title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new meteorite_Info( $wp_customize, 'post_author_title', array(
		'label' 	=> __( 'Author info', 'meteorite' ),
		'section' 	=> 'meteorite_single',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 28
		) )
	);

	// Show post author info
	$wp_customize->add_setting(
		'post_author_check',
		array(
			'default' 			=> true,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'post_author_check',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Show author info on posts?', 'meteorite' ),
			'section' 	=> 'meteorite_single',
			'priority' 	=> 30
		)
	);

	// Related posts title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new meteorite_Info( $wp_customize, 'related_posts_title', array(
		'label' 	=> __( 'Related posts', 'meteorite' ),
		'section' 	=> 'meteorite_single',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 32
		) )
	);

	// Show related posts
	$wp_customize->add_setting(
		'related_posts_check',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'related_posts_check',
		array(
			'type' 			=> 'checkbox',
			'label' 		=> __( 'Show related posts?', 'meteorite' ),
			'description' 	=> __( 'Posts with the same category will be displayed at the bottom of a post.', 'meteorite' ),
			'section' 		=> 'meteorite_single',
			'priority' 		=> 34
		)
	);

	/*--------------------------------------------------------------
	# Projects
	--------------------------------------------------------------*/
	$wp_customize->add_section(
		'meteorite_projects',
		array(
			'title'		=> __( 'Projects', 'meteorite' ),
			'priority'	=> 20,
		)
	);

	// Layout Options title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'projects_settings_title', array(
		'label' 	=> __( 'Layout Options', 'meteorite' ),
		'section' 	=> 'meteorite_projects',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 10
		) )
	);

	// Fullwidth singles
	$wp_customize->add_setting(
		'fullwidth_single_project_checkbox',
		array(
			'default'			=> true,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'fullwidth_single_project_checkbox',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Full width project singles?', 'meteorite' ),
			'section'	=> 'meteorite_projects',
			'priority'	=> 12,
		)
	);

	// Hide title single projects
	$wp_customize->add_setting(
		'hide_title_single_projects',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox', 
		)
	);
	$wp_customize->add_control(
		'hide_title_single_projects',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Hide post title on single projects?', 'meteorite' ),
			'section' 	=> 'meteorite_projects',
			'priority' 	=> 14,
		)
	);

	// Hide meta single projects
	$wp_customize->add_setting(
		'hide_meta_projects',
		array(
			'default' 			=> true,
			'sanitize_callback' => 'meteorite_sanitize_checkbox', 
		)
	);
	$wp_customize->add_control(
		'hide_meta_projects',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Hide post meta on project archive and search?', 'meteorite' ),
			'section' 	=> 'meteorite_projects',
			'priority' 	=> 16,
		)
	);

	// Hide meta single projects
	$wp_customize->add_setting(
		'hide_meta_single_projects',
		array(
			'default' 			=> true,
			'sanitize_callback' => 'meteorite_sanitize_checkbox', 
		)
	);
	$wp_customize->add_control(
		'hide_meta_single_projects',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Hide post meta on single projects?', 'meteorite' ),
			'section' 	=> 'meteorite_projects',
			'priority' 	=> 17,
		)
	);

	// Featured Image title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'projects_featured_image_title', array(
		'label' 	=> __( 'Featured Image', 'meteorite' ),
		'section' 	=> 'meteorite_projects',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 18
		) )
	);

	// Header image options
	$wp_customize->add_setting(
		'projects_header_image',
		array(
			'default'			=> 'none',
			'sanitize_callback' => 'meteorite_sanitize_project_header',
		)
	);
	$wp_customize->add_control(
		'projects_header_image',
		array(
			'type'		=> 'radio',
			'label'		=> 'Projects header image',
			'section'	=> 'meteorite_projects',
			'priority'	=> 20,
			'choices' 	=> array(
				'none'				=> __( 'None', 'meteorite' ),
				'full_width_image'	=> __( 'Additional Header Image', 'meteorite' ),
			),
		)
	);

	// Project images
	$wp_customize->add_setting(
		'project_feat_image',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'project_feat_image',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Check this box to hide featured images on single projects.', 'meteorite' ),
			'section' 	=> 'meteorite_projects',
			'priority' 	=> 22,
		)
	);

	// Pagination title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'project_pagination', array(
		'label' 	=> __( 'Pagination', 'meteorite' ),
		'section' 	=> 'meteorite_projects',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 24
		) )
	);

	// Pagination type
	$wp_customize->add_setting(
		'project_pagination_type',
		array(
			'default'			=> 'titles',
			'sanitize_callback' => 'meteorite_sanitize_pagtype_single',
		)
	);
	$wp_customize->add_control(
		'project_pagination_type',
		array(
			'type'		=> 'radio',
			'label'		=> 'Pagination type blog/archive',
			'section'	=> 'meteorite_projects',
			'priority'	=> 26,
			'choices' 	=> array(
				'none'			=> __( 'None', 'meteorite' ),
				'titles'		=> __( 'Titles', 'meteorite' ),
				'titles_images' => __( 'Titles with images', 'meteorite' ),
				'arrows'		=> __( 'Arrows', 'meteorite' ),
			),
		)
	);

	// Link to project page
	$wp_customize->add_setting(
		'project_page_url',
		array(
			'default'			=> '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'project_page_url',
		array(
			'label'			=> __( 'Project Page URL', 'meteorite' ),
			'description' 	=> __( 'Used for a button on project single pages', 'meteorite' ),
			'section'		=> 'meteorite_projects',
			'type'			=> 'url',
			'priority'		=> 28
		)
	);

	// Related projects title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new meteorite_Info( $wp_customize, 'related_projects_title', array(
		'label' 	=> __( 'Related projects', 'meteorite' ),
		'section' 	=> 'meteorite_projects',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 30
		) )
	);

	// Show related posts
	$wp_customize->add_setting(
		'related_projects_check',
		array(
			'default' 			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'related_projects_check',
		array(
			'type' 			=> 'checkbox',
			'label' 		=> __( 'Show related projects?', 'meteorite' ),
			'description' 	=> __( 'Projects with the same category will be displayed at the bottom of a project.', 'meteorite' ),
			'section' 		=> 'meteorite_projects',
			'priority' 		=> 32
		)
	);

	/*--------------------------------------------------------------
	# Fonts
	--------------------------------------------------------------*/
	$wp_customize->add_panel( 'meteorite_fonts_panel', array(
		'priority'			=> 22,
		'capability'		=> 'edit_theme_options',
		'theme_supports' 	=> '',
		'title'				=> __( 'Fonts', 'meteorite' ),
	) );

	$wp_customize->add_section(
		'meteorite_fonts',
		array(
			'title' 		=> __( 'Font selection', 'meteorite' ),
			'priority' 		=> 10,
			'panel' 		=> 'meteorite_fonts_panel',
			'description' 	=> __( 'Google Fonts can be found here: google.com/fonts.', 'meteorite' ),
		)
	);

	// Disable google fonts
	$wp_customize->add_setting(
		'disable_google_fonts',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'disable_google_fonts',
		array(
			'type' 		=> 'checkbox',
			'label' 	=> __( 'Check this box to disable Google Fonts. This might speed up your site.', 'meteorite' ),
			'section' 	=> 'meteorite_fonts',
			'priority' 	=> 10,
		)
	);

	//Headings fonts title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'headings_fonts_title', array(
		'label' 	=> __( 'Headings fonts', 'meteorite' ),
		'section' 	=> 'meteorite_fonts',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 12
		) )
	);

	//Headings fonts
	$wp_customize->add_setting(
		'headings_font_name',
		array(
			'default' 			=> 'Libre+Franklin:400,400italic,600,600italic',
			'sanitize_callback' => 'meteorite_sanitize_text',
		)
	);
	$wp_customize->add_control(
		'headings_font_name',
		array(
			'type' 		=> 'text',
			'label' 	=> __( 'Font name/style/sets', 'meteorite' ),
			'section' 	=> 'meteorite_fonts',
			'priority' 	=> 12
		)
	);

	//Headings fonts family
	$wp_customize->add_setting(
		'headings_font_family',
		array(
			'default' 			=> '\'Libre Franklin\', sans-serif',
			'sanitize_callback' => 'meteorite_sanitize_text',
		)
	);
	$wp_customize->add_control(
		'headings_font_family',
		array(
			'type' 		=> 'text',
			'label' 	=> __( 'Font family', 'meteorite' ),
			'section' 	=> 'meteorite_fonts',
			'priority' 	=> 14
		)
	);


	//Body fonts title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'body_fonts_title', array(
		'label' 	=> __( 'Body fonts', 'meteorite' ),
		'section' 	=> 'meteorite_fonts',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 16
		) )
	);

	//Body fonts
	$wp_customize->add_setting(
		'body_font_name',
		array(
			'default' 			=> 'Source+Sans+Pro:400,400italic,600,600italic',
			'sanitize_callback' => 'meteorite_sanitize_text',
		)
	);
	$wp_customize->add_control(
		'body_font_name',
		array(
			'type' 		=> 'text',
			'label' 	=> __( 'Font name/style/sets', 'meteorite' ),
			'section' 	=> 'meteorite_fonts',
			'priority' 	=> 18
		)
	);
	//Body fonts family
	$wp_customize->add_setting(
		'body_font_family',
		array(
			'default' 			=> '\'Source Sans Pro\', sans-serif',
			'sanitize_callback' => 'meteorite_sanitize_text',
		)
	);
	$wp_customize->add_control(
		'body_font_family',
		array(
			'type' 		=> 'text',
			'label' 	=> __( 'Font family', 'meteorite' ),
			'section' 	=> 'meteorite_fonts',
			'priority' 	=> 20
		)
	);

	$wp_customize->add_section(
		'meteorite_typography',
		array(
			'title'		=> __( 'Typography', 'meteorite' ),
			'priority' 	=> 12,
			'panel' 	=> 'meteorite_fonts_panel',
		)
	);

	// Font sizes title
	$wp_customize->add_setting( 'meteorite_options[info]', array(
			'type'				=> 'info_control',
			'capability'		=> 'edit_theme_options',
			'sanitize_callback' => 'esc_attr',
		)
	);
	$wp_customize->add_control( new Meteorite_Info( $wp_customize, 'font_sizes', array(
		'label' 	=> __( 'Font sizes', 'meteorite' ),
		'section' 	=> 'meteorite_typography',
		'settings' 	=> 'meteorite_options[info]',
		'priority' 	=> 24
		) )
	);

	// Site title
	$wp_customize->add_setting(
		'site_title_size',
		array(
			'default'			=> '32',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'site_title_size', array(
		'type'			=> 'number',
		'priority'		=> 26,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'Site Title', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 90,
			'step'	=> 1,
		),
	) ); 

	// Site description
	$wp_customize->add_setting(
		'site_desc_size',
		array(
			'default'			=> '14',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'site_desc_size', array(
		'type'			=> 'number',
		'priority'		=> 28,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'Site Description', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 50,
			'step'	=> 1,
		),
	) );

	// Nav menu
	$wp_customize->add_setting(
		'menu_size',
		array(
			'default'			=> '14',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'menu_size', array(
		'type'			=> 'number',
		'priority'		=> 30,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'Menu items', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 50,
			'step'	=> 1,
		),
	) );

	// H1 size
	$wp_customize->add_setting(
		'h1_size',
		array(
			'default'			=> '44',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'h1_size', array(
		'type'			=> 'number',
		'priority'		=> 32,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'H1 font size', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 60,
			'step'	=> 1,
		),
	) );

	// H2 size
	$wp_customize->add_setting(
		'h2_size',
		array(
			'default'			=> '38',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'h2_size', array(
		'type'			=> 'number',
		'priority'		=> 34,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'H2 font size', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 60,
			'step'	=> 1,
		),
	) );

	// H3 size
	$wp_customize->add_setting(
		'h3_size',
		array(
			'default'			=> '32',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'h3_size', array(
		'type'			=> 'number',
		'priority'		=> 36,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'H3 font size', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 60,
			'step'	=> 1,
		),
	) );

	// H4 size
	$wp_customize->add_setting(
		'h4_size',
		array(
			'default'			=> '28',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'h4_size', array(
		'type'			=> 'number',
		'priority'		=> 38,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'H4 font size', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 60,
			'step'	=> 1,
		),
	) );

	// H5 size
	$wp_customize->add_setting(
		'h5_size',
		array(
			'default'			=> '22',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'h5_size', array(
		'type'			=> 'number',
		'priority'		=> 40,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'H5 font size', 'meteorite' ),
		'input_attrs'	=> array(
			'min'	=> 10,
			'max'	=> 60,
			'step'	=> 1,
		),
	) );

	// H6 size
	$wp_customize->add_setting(
		'h6_size',
		array(
			'default'			=> '18',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'h6_size', array(
		'type'			=> 'number',
		'priority'		=> 42,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'H6 font size', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 60,
			'step'	=> 1,
		),
	) );

	// Body
	$wp_customize->add_setting(
		'body_size',
		array(
			'default'			=> '16',
			'sanitize_callback' => 'absint',
		)
	);
	$wp_customize->add_control( 'body_size', array(
		'type'			=> 'number',
		'priority'		=> 44,
		'section'		=> 'meteorite_typography',
		'label'			=> __( 'Body font size', 'meteorite' ),
		'input_attrs' 	=> array(
			'min'	=> 10,
			'max'	=> 24,
			'step'	=> 1,
		),
	) );

	/*--------------------------------------------------------------
	# Colors
	--------------------------------------------------------------*/

	$wp_customize->add_panel( 'meteorite_colors_panel', array(
		'priority'			=> 19,
		'capability'		=> 'edit_theme_options',
		'theme_supports'	=> '',
		'title'				=> __( 'Colors', 'meteorite' ),
	) );
	$wp_customize->add_section(
		'colors_header',
		array(
			'title'		=> __( 'Header', 'meteorite' ),
			'priority'	=> 11,
			'panel'		=> 'meteorite_colors_panel',
		)
	);
	$wp_customize->add_section(
		'colors_footer',
		array(
			'title'		=> __( 'Footer', 'meteorite' ),
			'priority'	=> 13,
			'panel'		=> 'meteorite_colors_panel',
		)
	);

	// Body
	$wp_customize->add_setting(
		'body_text_color',
		array(
			'default'			=> '#777777',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'body_text_color',
			array(
				'label'		=> __( 'Body Text', 'meteorite' ),
				'section'	=> 'colors',
				'priority'	=> 10
			)
		)
	);

	// Primary color
	$wp_customize->add_setting(
		'primary_color',
		array(
			'default'			=> '#337ab7',
			'sanitize_callback' => 'sanitize_hex_color',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'primary_color',
			array(
				'label'		=> __( 'Primary Color', 'meteorite' ),
				'section'	=> 'colors',
				'settings'	=> 'primary_color',
				'priority'	=> 11
			)
		)
	);

	// Site title
	$wp_customize->add_setting(
		'site_title_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'site_title_color',
			array(
				'label'		=> __( 'Site Title', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'site_title_color',
				'priority'	=> 12
			)
		)
	);

	// Site description
	$wp_customize->add_setting(
		'site_desc_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'site_desc_color',
			array(
				'label'		=> __( 'Site Description', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 14
			)
		)
	);

	// Site title sticky
	$wp_customize->add_setting(
		'site_title_color_sticky',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'site_title_color_sticky',
			array(
				'label'		=> __( 'Site Title Sticky', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'site_title_color_sticky',
				'priority'	=> 16
			)
		)
	);

	// Site description sticky
	$wp_customize->add_setting(
		'site_desc_color_sticky',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'site_desc_color_sticky',
			array(
				'label'		=> __( 'Site Description Sticky', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'site_desc_color_sticky',
				'priority'	=> 18
			)
		)
	);

	// Topbar background
	$wp_customize->add_setting(
		'topbar_bg_color',
		array(
			'default'			=> '#202529',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'topbar_bg_color',
			array(
				'label'		=> __( 'Topbar Background', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'topbar_bg_color',
				'priority'	=> 20
			)
		)
	);

	// Topbar border color
	$wp_customize->add_setting(
		'topbar_border_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'topbar_border_color',
			array(
				'label'		=> __( 'Topbar/Menu Border Color', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'topbar_border_color',
				'priority'	=> 22
			)
		)
	);

	// Topbar color
	$wp_customize->add_setting(
		'topbar_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'topbar_color',
			array(
				'label'		=> __( 'Topbar Color', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'topbar_color',
				'priority'	=> 24
			)
		)
	);

	// Menu background
	$wp_customize->add_setting(
		'menu_bg_color',
		array(
			'default'			=> '#202529',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'menu_bg_color',
			array(
				'label'		=> __( 'Menu Background', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'menu_bg_color',
				'priority'	=> 26
			)
		)
	);

	// Menu background after scroll
	$wp_customize->add_setting(
		'menu_bg_sticky_color',
		array(
			'default'			=> '#202529',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'menu_bg_sticky_color',
			array(
				'label'		=> __( 'Menu Background Sticky', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'menu_bg_sticky_color',
				'priority'	=> 28
			)
		)
	);

	// Top level menu items color
	$wp_customize->add_setting(
		'top_items_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'top_items_color',
			array(
				'label'		=> __( 'Toplevel Menu Items', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 30
			)
		)
	);

	// Top level menu items color after scroll
	$wp_customize->add_setting(
		'top_items_sticky_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'top_items_sticky_color',
			array(
				'label'		=> __( 'Toplevel Menu Items Sticky', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 34
			)
		)
	);

	// Sub menu background
	$wp_customize->add_setting(
		'submenu_background',
		array(
			'default'			=> '#202529',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'submenu_background',
			array(
				'label'		=> __( 'Submenu Background', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 36
			)
		)
	);

	// Sub menu items color
	$wp_customize->add_setting(
		'submenu_items_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'submenu_items_color',
			array(
				'label'		=> __( 'Submenu Items', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 38
			)
		)
	);

	// Mobile menu background
	$wp_customize->add_setting(
		'mobile_menu_bg_color',
		array(
			'default'			=> '#202529',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'mobile_menu_bg_color',
			array(
				'label'		=> __( 'Mobile Menu Background', 'meteorite' ),
				'section'	=> 'colors_header',
				'settings'	=> 'mobile_menu_bg_color',
				'priority'	=> 40
			)
		)
	);

	// Mobile menu items color
	$wp_customize->add_setting(
		'mobile_menu_items_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'mobile_menu_items_color',
			array(
				'label'		=> __( 'Mobile Menu Items', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 42
			)
		)
	);

	// Header Overlay color
	$wp_customize->add_setting(
		'header_overlay_color',
		array(
			'default'			=> '#000000',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'header_overlay_color',
			array(
				'label'		=> __( 'Header Overlay Color', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 44
			)
		)
	);

	// Header image text color
	$wp_customize->add_setting(
		'header_image_text_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'header_image_text_color',
			array(
				'label'		=> __( 'Header Image Text', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 46
			)
		)
	);

	// Titlebar background
	$wp_customize->add_setting(
		'header_titlebar_background',
		array(
			'default'			=> '#337ab7',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'header_titlebar_background',
			array(
				'label'		=> __( 'Header Titlebar Background', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 48
			)
		)
	);

	// Titlebar color
	$wp_customize->add_setting(
		'header_titlebar_color',
		array(
			'default'			=> '#ffffff',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'header_titlebar_color',
			array(
				'label'		=> __( 'Header Titlebar Color', 'meteorite' ),
				'section'	=> 'colors_header',
				'priority'	=> 50
			)
		)
	);

	// Footer widgets background
	$wp_customize->add_setting(
		'footer_widgets_background',
		array(
			'default'			=> '#202529',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'footer_widgets_background',
			array(
				'label'		=> __( 'Footer Widgets Background', 'meteorite' ),
				'section'	=> 'colors_footer',
				'priority'	=> 52
			)
		)
	);

	// Footer widgets color
	$wp_customize->add_setting(
		'footer_widgets_color',
		array(
			'default'			=> '#a3aaaa',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'footer_widgets_color',
			array(
				'label'		=> __( 'Footer Widgets Color', 'meteorite' ),
				'section'	=> 'colors_footer',
				'priority'	=> 54
			)
		)
	);

	// Footer background
	$wp_customize->add_setting(
		'footer_background',
		array(
			'default'			=> '#1b2024',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'footer_background',
			array(
				'label'		=> __( 'Footer Background', 'meteorite' ),
				'section'	=> 'colors_footer',
				'priority'	=> 56
			)
		)
	);

	// Footer color
	$wp_customize->add_setting(
		'footer_color',
		array(
			'default'			=> '#a3aaaa',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'			=> 'postMessage'
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'footer_color',
			array(
				'label'		=> __( 'Footer Color', 'meteorite' ),
				'section'	=> 'colors_footer',
				'priority'	=> 58
			)
		)
	);

	/*--------------------------------------------------------------
	# Shop
	--------------------------------------------------------------*/

	$wp_customize->add_section( 'meteorite_shop_options', array(
		'priority'			=> 25,
		'capability'		=> 'edit_theme_options',
		'theme_supports' 	=> '',
		'title'				=> __( 'Shop', 'meteorite' ),
		'description'		=> __( 'Meteorite supports WooCommerce. Use this options if you have a shop.', 'meteorite' ),
	) );

	// Shop full width
	$wp_customize->add_setting(
		'shop_full_width',
		array(
			'default'			=> false,
			'sanitize_callback' => 'meteorite_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'shop_full_width',
		array(
			'type'		=> 'checkbox',
			'label'		=> __( 'Full width "shop" page?', 'meteorite' ),
			'section'	=> 'meteorite_shop_options',
			'priority'	=> 12,
		)
	);


}
add_action( 'customize_register', 'meteorite_customize_register' );

/**
* Sanitize
*/

// Logo type
function meteorite_sanitize_logo_type( $input ) {
	if ( in_array( $input, array( 'logo-default', 'logo-light' ), true ) ) {
		return $input;
	}
}

// Layout type
function meteorite_sanitize_lt( $input ) {
	if ( in_array( $input, array( 'wide', 'boxed' ), true ) ) {
		return $input;
	}
}

// Background type (boxed mode)
function meteorite_sanitize_bt( $input ) {
	if ( in_array( $input, array( 'image', 'pattern' ), true ) ) {
		return $input;
	}
}

// Preloader type
function meteorite_sanitize_pt( $input ) {
	if ( in_array( $input, array( 'none', 'wave', 'dots', 'circles' ), true ) ) {
		return $input;
	}
}

// Header type front
function meteorite_sanitize_titlebar( $input ) {
	if ( in_array( $input, array( 'on', 'off', ), true ) ) {
		return $input;
	}
}

// Topbar type
function meteorite_sanitize_topbar_type( $input ) {
	if ( in_array( $input, array( 'none', 'topbar_1', 'topbar_2', 'topbar_3', 'topbar_4' ), true ) ) {
		return $input;
	}
}

// Mobile menu type
function meteorite_sanitize_mobile_menu_type( $input ) {
	if ( in_array( $input, array( 'classic', 'fancy' ), true ) ) {
		return $input;
	}
}

// Menu position
function meteorite_sanitize_menu_pos( $input ) {
	if ( in_array( $input, array( 'above', 'above_solid', 'below' ), true ) ) {
		return $input;
	}
}

// Sticky menu
function meteorite_sanitize_sticky( $input ) {
	if ( in_array( $input, array( 'sticky', 'static' ), true ) ) {
		return $input;
	}
}

// Menu style
function meteorite_sanitize_menu_style( $input ) {
	if ( in_array( $input, array( 'inline', 'centered' ), true ) ) {
		return $input;
	}
}

// Menu width
function meteorite_sanitize_menu_width( $input ) {
	if ( in_array( $input, array( 'boxed', 'wide' ), true ) ) {
		return $input;
	}
}

// Search type
function meteorite_sanitize_search_type( $input ) {
	if ( in_array( $input, array( 'search_fullscreen', 'search_under_header' ), true ) ) {
		return $input;
	}
}

// Footer widget areas
function meteorite_sanitize_fw( $input ) {
	if ( in_array( $input, array( '1', '2', '3', '4' ), true ) ) {
		return $input;
	}
}

// Blog layout
function meteorite_sanitize_bl( $input ) {
	if ( in_array( $input, array( 'fullwidth', 'img-left', 'grid_2_col', 'fullwidth_grid', 'masonry' ), true ) ) {
		return $input;
	}
}

// Pagination type blog/archive
function meteorite_sanitize_pagtype( $input ) {
	if ( in_array( $input, array( 'none', 'numbers', 'titles', 'arrows' ), true ) ) {
		return $input;
	}
}

// Pagination type single
function meteorite_sanitize_pagtype_single( $input ) {
	if ( in_array( $input, array( 'none', 'titles', 'titles_images', 'arrows' ), true ) ) {
		return $input;
	}
}

// Single Posts Header Image
function meteorite_sanitize_single_header( $input ) {
	if ( in_array( $input, array( 'none', 'full_width_image' ), true ) ) {
		return $input;
	}
}

// Projects Header Image
function meteorite_sanitize_project_header( $input ) {
	if ( in_array( $input, array( 'none', 'full_width_image' ), true ) ) {
		return $input;
	}
}

// Checkboxes
function meteorite_sanitize_checkbox( $input ) {
	if ( true == $input ) {
		return true;
	} else {
		return false;
	}
}

// Text
function meteorite_sanitize_text( $input ) {
	return wp_kses_post( force_balance_tags( $input ) );
}


/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function meteorite_customize_preview_js() {
	wp_enqueue_script( 'meteorite_customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), '20180825', true );
}
add_action( 'customize_preview_init', 'meteorite_customize_preview_js' );