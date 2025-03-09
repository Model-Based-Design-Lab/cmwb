<?php
/**
 * Meteorite functions and definitions.
 *
 * @package Meteorite
 */

if ( ! function_exists( 'meteorite_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function meteorite_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on Meteorite, use a find and replace
		 * to change 'meteorite' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'meteorite', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		// Enable custom logo function since WP Version 4.5
		add_theme_support( 'custom-logo' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		* Add Support for Custom Fields, Meteorite needs it for parallax header text.
		*/
		add_theme_support( 'custom-fields' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );
		add_image_size( 'meteorite-blog-thumb', 1140 );
		add_image_size( 'meteorite-large-thumb', 830 );
		add_image_size( 'meteorite-medium-thumb', 550, 400, true );
		add_image_size( 'meteorite-small-thumb', 75, 75, true );

		// This theme uses wp_nav_menu() in four location.
		register_nav_menus(
			array(
				'topbar' 	=> __( 'Topbar', 'meteorite' ),
				'primary' 	=> __( 'Primary', 'meteorite' ),
				'footer' 	=> __( 'Footer', 'meteorite' ),
				'404_pages' => __( '404 Menu', 'meteorite' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'meteorite_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Terra Themes Tools (plugin) post type support
		add_theme_support( 'terra-themes-tools-post-types', array(
			'clients',
			'employees',
			'projects',
			'slides',
			'testimonials',
		) );

		// Add theme support for breadcrumb trail
		add_theme_support( 'breadcrumb-trail' );

		// Add theme support for post formats
		add_theme_support( 'post-formats', array(
			'aside',
			'audio',
			'gallery',
			'image',
			'link',
			'quote',
			'status',
			'video',
		) );

		// Gutenberg align-wide support
		add_theme_support( 'align-wide' );

	}
endif;
add_action( 'after_setup_theme', 'meteorite_setup' );


/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function meteorite_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'meteorite_content_width', 1170 );
}
add_action( 'after_setup_theme', 'meteorite_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function meteorite_widgets_init() {
	register_sidebar( 
		array(
			'name'			=> __( 'Sidebar default', 'meteorite' ),
			'id'			=> 'sidebar-1',
			'description'	=> '',
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'	=> '</section>',
			'before_title'	=> '<h2 class="widget-title">',
			'after_title'	=> '</h2>',
		)
	);
	register_sidebar( 
		array(
			'name'			=> __( 'Sidebar left', 'meteorite' ),
			'id'			=> 'sidebar-left',
			'description'	=> '',
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'	=> '</section>',
			'before_title'	=> '<h2 class="widget-title">',
			'after_title'	=> '</h2>',
		)
	);

	// Footer widget areas
	$widget_areas = get_theme_mod( 'footer_widget_areas', '3' );
	for ( $i = 1; $i <= $widget_areas; $i++ ) {
		register_sidebar( 
			array(
				'name'			=> __( 'Footer ', 'meteorite' ) . $i,
				'id'			=> 'footer-' . $i,
				'description'	=> '',
				'before_widget' => '<aside id="%1$s" class="widget %2$s">',
				'after_widget'	=> '</aside>',
				'before_title'	=> '<h3 class="widget-title">',
				'after_title'	=> '</h3>',
			)
		);
	}
}
add_action( 'widgets_init', 'meteorite_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function meteorite_scripts() {
	if ( get_theme_mod( 'disable_google_fonts', false ) == false ) :
		wp_enqueue_style( 'meteorite-fonts', meteorite_google_fonts(), array(), null );
	endif;

	wp_enqueue_style( 'meteorite-style', get_stylesheet_uri(), '', '20230117' );

	wp_enqueue_style( 'font-awesome', get_template_directory_uri() . '/fonts/font-awesome.min.css' );

	wp_enqueue_script( 'imagesloaded' );

	wp_enqueue_script( 'meteorite-scripts', get_template_directory_uri() . '/js/scripts.js', array( 'jquery' ), '20201214', true );

	wp_enqueue_script( 'meteorite-main', get_template_directory_uri() . '/js/main.min.js', array( 'jquery' ), '20201226', true );

	wp_enqueue_script( 'meteorite-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20201214', true );

	if ( ( get_theme_mod( 'blog_layout', 'fullwidth' ) == 'masonry' && ( is_home() || is_archive() || is_search() ) ) ) {
		wp_enqueue_script( 'meteorite-masonry-init', get_template_directory_uri() . '/js/masonry-init.js', array( 'masonry' ), '', true );
	}	

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'meteorite_scripts' );

/**
 * Create the Google fonts url
 *
 * @return String Url to Google font stylesheet
 * @since 2.1  
 */
if ( ! function_exists('meteorite_google_fonts') ) :
function meteorite_google_fonts() {
	$headings_font 	= get_theme_mod( 'headings_font_name', 'Libre+Franklin:400,400italic,600,600italic' );
	$body_font 		= get_theme_mod( 'body_font_name', 'Source+Sans+Pro:400,400italic,600,600italic' );

	$fonts		= array();
	$fonts[]	= esc_attr( str_replace( '+', ' ', $headings_font ) );
	$fonts[]	= esc_attr( str_replace( '+', ' ', $body_font ) );

	if ( $fonts ) {
		$fonts_url = add_query_arg( array(
			'family' => urlencode( implode( '|', $fonts ) )
		), 'https://fonts.googleapis.com/css' );
	}

	return $fonts_url;	
}
endif;

/**
 * Enqueue Bootstrap
 */
function meteorite_enqueue_bootstrap() {
	wp_enqueue_style( 'meteorite-bootstrap', get_template_directory_uri() . '/assets/bootstrap/bootstrap.min.css', array(), true );
}
add_action( 'wp_enqueue_scripts', 'meteorite_enqueue_bootstrap', 9 );

/**
 * Enqueue Owlcarousel transition css
 */
function meteorite_enqueue_owlcarouselcss() {
	wp_enqueue_style( 'meteorite-owlcarousel', get_template_directory_uri() . '/assets/owlcarousel/owl.transitions.css', array(), true );
}
add_action( 'wp_enqueue_scripts', 'meteorite_enqueue_owlcarouselcss' );

/**
 * Registers an editor stylesheet for the theme.
 */
function meteorite_add_editor_styles() {
	add_editor_style( 'inc/admin/css/custom-editor-style.css' );
}
add_action( 'admin_init', 'meteorite_add_editor_styles' );

/**
 * Show a menu fallback text for admins if the menu location isn't assigned
 *
 * @param $args Array of nav menu arguments defined by wp_nav_menu
 * @since 1.1
 */
function meteorite_menu_fallback( $args ) {
	if ( ! current_user_can( 'edit_theme_options' ) ) {
		return;
	}

	$markup_before = '';
	$markup_after = '';

	if ( 'primary' == $args['theme_location'] ) {
		$markup_before = '<li class="li-placeholder">';
		$markup_after = '</li>';
	} elseif ( 'topbar' == $args['theme_location'] ) {
		$markup_before = '<ul><li>';
		$markup_after = '</li></ul>';
	}
	echo $markup_before . '<a class="menu-fallback" href="' . esc_url( admin_url( 'nav-menus.php' ) ) . '">' . __( 'Admin notice: Create your menu here &raquo;', 'meteorite' ) . '</a>' . $markup_after;
}

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';

/**
 * Functions
 */
require get_template_directory() . '/inc/functions/loader.php';

/**
* Custom styles through customizer.
*/
require get_template_directory() . '/inc/styles.php';

/**
* SVG for text with icon widget.
*/
require get_template_directory() . '/inc/svg.php';

/**
* Post options for pages
*/
require get_template_directory() . '/inc/page-options.php';

/**
* Post options for posts
*/
require get_template_directory() . '/inc/post-options.php';

/**
 * Woocommerce
 */
require get_template_directory() . '/inc/woocommerce.php';

/**
 * Gutenberg
 */
require get_template_directory() . '/inc/editor.php';

/**
 * Breadcrumb trail. Check that there is no Plugin version around.
 */
if ( ! function_exists( 'breadcrumb_trail' ) && get_theme_mod( 'enable_titlebar_breadcrumbs', false ) == true ) {
	require get_template_directory() . '/inc/breadcrumb-trail.php';
}

/**
 * Media grabber file.
 */
require get_template_directory() . '/inc/media-grabber.php';

/**
 * Theme info page.
 */
require get_template_directory() . '/inc/admin/theme-info-page.php';

/**
 * TGM Plugin activation.
 */
require get_template_directory() . '/plugins/class-tgm-plugin-activation.php';

/**
 * Contains the recommended plugins for Meteorite.
 *
 * @since 1.0.6
 */
function meteorite_recommend_plugin() {
	$plugins = array(
		array(
			'name'		=> 'Terra Themes Tools',
			'slug'		=> 'terra-themes-tools',
			'required'	=> false,
		),
		array(
			'name'		=> 'Meteorite Extensions',
			'slug'		=> 'meteorite-extensions',
			'required'	=> false,
		),
		array(
			'name'		=> 'Page Builder by SiteOrigin',
			'slug'		=> 'siteorigin-panels',
			'required'	=> false,
		),
		array(
			'name'		=> 'SiteOrigin Widgets Bundle',
			'slug'		=> 'so-widgets-bundle',
			'required'	=> false,
		),
	);
	tgmpa( $plugins );
}
add_action( 'tgmpa_register', 'meteorite_recommend_plugin' );

/**
 * Dismissible admin notice.
 */
require get_template_directory() . '/inc/admin/notices/persist-admin-notices-dismissal.php';

/**
 * Contains the admin notice.
 *
 * @since 2.0
 */
function meteorite_admin_notice_welcome() {
	if ( ! PAnD::is_admin_notice_active( 'meteorite-welcome-forever' ) ) {
		return;
	}
	
	?>
	<div data-dismissible="meteorite-welcome-forever" class="updated notice notice-success is-dismissible meteorite-admin-notice">

		<p><?php echo sprintf( __( 'Welcome to Meteorite! To make your start easier take a look at our <a href="%s">info page</a>.', 'meteorite' ), admin_url( 'themes.php?page=meteorite-theme-info.php' ) ); ?></p>
		<a class="button" href="<?php echo admin_url( 'themes.php?page=meteorite-theme-info.php' ); ?>"><?php esc_html_e( 'Learn more about Meteorite', 'meteorite' ); ?></a>

	</div>
	<?php
}
add_action( 'admin_init', array( 'PAnD', 'init' ) );
add_action( 'admin_notices', 'meteorite_admin_notice_welcome' );