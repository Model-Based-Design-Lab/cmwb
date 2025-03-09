<?php
/**
 * Theme info page
 *
 * @package Meteorite
 */	

/**
 * Add the theme info page to the menu
 *
 * @since 2.0
 */
function meteorite_add_theme_info_page() {

	if ( ! current_user_can( 'install_plugins' ) ) {
		return;
	}

	$theme_info = add_theme_page(
		esc_html__( 'Meteorite Info', 'meteorite' ),
		esc_html__( 'Meteorite Info', 'meteorite' ),
		'manage_options',
		'meteorite-theme-info.php',
		'meteorite_theme_info_page' 
	);
	// Load styles and scripts only on this page
	add_action( 'load-' . $theme_info, 'meteorite_theme_info_hook_scripts' );
}
add_action( 'admin_menu', 'meteorite_add_theme_info_page' );

/**
 * Action for admin_enqueue_scripts
 *
 * @since 2.0
 */
function meteorite_theme_info_hook_scripts(){
	add_action( 'admin_enqueue_scripts', 'meteorite_theme_info_page_scripts' );
}

/**
 * Enqueue styles and scripts for theme info page
 *
 * @since 2.0
 */
function meteorite_theme_info_page_scripts() {
	wp_enqueue_style( 'meteorite-info-style', get_template_directory_uri() . '/inc/admin/css/theme-info-page.css', array(), true );
	wp_enqueue_script( 'meteorite-info-script', get_template_directory_uri() . '/inc/admin/js/theme-info-page.js', array( 'jquery' ), '', true );
}

/**
 * Callback with content to display on theme info page
 *
 * @since 2.0
 */
function meteorite_theme_info_page() {
	?>
	<div class="meteorite-theme-info-wrapper">
		<div class="meteorite-theme-info-inner">

			<div class="meteorite-theme-info-header">
				<h1 class="meteorite-theme-info-heading"><?php esc_html_e( 'Welcome to Meteorite!', 'meteorite' ); ?></h1>
				<p class="meteorite-version"><?php echo esc_html__( 'Version', 'meteorite' ) . ' ' . esc_html( wp_get_theme()->version ); ?></p>
			</div>

			<div class="meteorite-theme-info-tabs">

				<nav class="meteorite-tab-nav">
					<ul>
						<li>
							<a href="#overview" data-target="overview" class="meteorite-tab-button overview active"><span class="dashicons dashicons-admin-home"></span><?php esc_html_e( 'Overview', 'meteorite' ); ?></a>
						</li>
						<li>
							<a href="#rec-plugins" data-target="rec-plugins" class="meteorite-tab-button rec-plugins"><span class="dashicons dashicons-yes"></span><?php esc_html_e( 'Recommended Plugins', 'meteorite' ); ?></a>
						</li>
						<li>
							<a href="#demo-import" data-target="demo-import" class="meteorite-tab-button demo-import"><span class="dashicons dashicons-download"></span><?php esc_html_e( 'Demo Import', 'meteorite' ); ?></a>
						</li>
						<li>
							<a href="<?php echo admin_url( 'customize.php' ); ?>" class="customize"><span class="dashicons dashicons-admin-appearance"></span><?php esc_html_e( 'Customizer', 'meteorite' ); ?><span class="dashicons dashicons-external"></span></a>
						</li>
						<li>
							<a href="#support" data-target="support" class="meteorite-tab-button support"><span class="dashicons dashicons-sos"></span><?php esc_html_e( 'Support', 'meteorite' ); ?></a>
						</li>
					</ul>
				</nav>

				<div class="meteorite-tab-wrapper">

					<div id="#overview" class="meteorite-tab overview show">
						<section class="meteorite-theme-info-row">
							<div class="meteorite-theme-info-col-12">
								<div class="meteorite-theme-info-card">
									<h3 class="welcome-user">
										<?php
										$user = wp_get_current_user();

										/* translators: %s: user name */
										echo sprintf( esc_html__( 'Hello %s,', 'meteorite' ), '<span>' . esc_html( ucfirst( $user->display_name ) ) . '</span>' );
										?>
									</h3>
									<p class="welcome-intro">
										<?php esc_html_e( 'Thank you for choosing Meteorite. Here are some steps that will help you to create your website.', 'meteorite' ); ?>
									</p>
								</div>
							</div>
						</section>

						<section class="meteorite-theme-info-row meteorite-equal-height">
							<div class="meteorite-theme-info-col-4">
								<div class="meteorite-theme-info-card rec-plugins-card">
									<h3><?php esc_html_e( '1. Recommended plugins', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'Take a look at the plugins we recommend for Meteorite. With them you can use the full set of features we created for Meteorite.', 'meteorite' ); ?></p>
									<p><a href="#rec-plugins" data-target="rec-plugins" class="meteorite-tab-button button button-primary button-large"><?php esc_html_e( 'Go to recommended plugins', 'meteorite' ); ?></a></p>
								</div>
							</div>
							<div class="meteorite-theme-info-col-4">
								<div class="meteorite-theme-info-card demo-import-card">
									<h3><?php esc_html_e( '2. Demo import', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'Install one of the awesome demo pages with just some clicks. See which demos are available.', 'meteorite' ); ?></p>
									<p><a href="#demo-import" data-target="demo-import" class="meteorite-tab-button button button-primary button-large"><?php esc_html_e( 'Go to demo import', 'meteorite' ); ?></a></p>
								</div>
							</div>
							<div class="meteorite-theme-info-col-4">
								<div class="meteorite-theme-info-card customize-card">
									<h3><?php esc_html_e( '3. Customize your website', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'All options to change the look of Meteorite are located in the WordPress Customizer. Get a live preview while customizing your website with the powerful Customizer.', 'meteorite' ); ?></p>
									<p><a class="button button-primary button-large" href="<?php echo admin_url( 'customize.php' ); ?>"><?php esc_html_e( 'Go to Customizer', 'meteorite' ); ?><span class="dashicons dashicons-external"></span></a></p>
								</div>
							</div>
						</section>

						<section class="meteorite-theme-info-row meteorite-theme-info-changelog clearfix">
							<div class="meteorite-theme-info-col-12">
								<div class="meteorite-theme-info-card">
									<h2><?php esc_html_e( 'Changelog', 'meteorite' ); ?></h2>
									<hr>
									<p class="changelog-notice">
										<?php 
										/* translators: %s: link to Meteorite changelog */
										printf( esc_html__( 'The full changelog can be seen on %s.', 'meteorite' ), '<a href="https://terra-themes.com/changelog/meteorite/" target="_blank">Terra Themes<span class="dashicons dashicons-external"></span></a>' ); 
										?>
									</p>
								</div>
						</section>
					</div><!-- #start -->

					<div id="#rec-plugins" class="meteorite-tab rec-plugins">
						<div class="meteorite-theme-info-row">
							<div class="meteorite-theme-info-col-12">
								<div class="meteorite-theme-info-card">
									<h2><?php esc_html_e( 'Recommended plugins', 'meteorite' ); ?></h2>
									<p><?php esc_html_e( 'We recommend using the following plugins with Meteorite:', 'meteorite' ); ?></p>
									
									<hr>

									<h3><?php esc_html_e( 'Terra Themes Tools', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'Terra Themes Tools is a plugin for all of our themes. It activates the custom post types employees, projects, testimonials, clients, our Terra Slider and their meta fields.', 'meteorite' ); ?></p>
									<?php if ( ! class_exists( 'Terra_Themes_Tools' ) ) : ?>
										<?php 
										$ttt_slug = "terra-themes-tools";
										$ttt_state = meteorite_get_plugin_state( $ttt_slug );

										$ttt_link = $ttt_label = $ttt_btn_class = '';
										$ttt_plugin_is_ready = $ttt_state['installed'] && $ttt_state['active'];
										if ( ! $ttt_plugin_is_ready ) {
											if ( $ttt_state['installed'] ) {
												$ttt_link 		= meteorite_get_activate_link( $ttt_slug );
												$ttt_label 		= esc_html__( 'Activate', 'meteorite' );
												$ttt_btn_class 	= "activate";
											} else {
												$ttt_link 		= meteorite_get_install_link( $ttt_slug );
												$ttt_label 		= esc_html__( 'Install', 'meteorite' );
												$ttt_btn_class 	= "install-now";
											}
										}
										?>
										<p><a href="<?php echo esc_url( $ttt_link ); ?>" class="button <?php echo $ttt_btn_class; ?>"><?php echo $ttt_label; ?></a></p>
									<?php else : ?>
										<p class="plugin-installed"><?php esc_html_e( 'Plugin installed and active!', 'meteorite' ); ?></p>
									<?php endif; ?>

									<hr>

									<h3><?php esc_html_e( 'Meteorite Extensions', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'Meteorite Extensions is built to be used with Meteorite. It extends the Page Builder by SiteOrigin and Elementor and adds more than 20 custom widgets. Also it adds more features for the header image and demo layouts for Meteorite.', 'meteorite' ); ?></p>
									<?php if ( ! class_exists( 'Meteorite_Extensions' ) ) : ?>
										<?php 
										$me_slug = "meteorite-extensions";
										$me_state = meteorite_get_plugin_state( $me_slug );

										$me_link = $me_label = $me_btn_class = '';
										$me_plugin_is_ready = $me_state['installed'] && $me_state['active'];
										if ( ! $me_plugin_is_ready ) {
											if ( $me_state['installed'] ) {
												$me_link 		= meteorite_get_activate_link( $me_slug );
												$me_label 		= esc_html__( 'Activate', 'meteorite' );
												$me_btn_class	= "activate";
											} else {
												$me_link 		= meteorite_get_install_link( $me_slug );
												$me_label 		= esc_html__( 'Install', 'meteorite' );
												$me_btn_class 	= "install-now";
											}
										}
										?>
										<p><a href="<?php echo esc_url( $me_link ); ?>" class="button <?php echo $me_btn_class; ?>"><?php echo $me_label; ?></a></p>
									<?php else : ?>
										<p class="plugin-installed"><?php esc_html_e( 'Plugin installed and active!', 'meteorite' ); ?></p>
									<?php endif; ?>

									<hr>

									<h3><?php esc_html_e( 'Page Builder by SiteOrigin', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'Use the Page Builder to create your pages by dragging and dropping your content.', 'meteorite' ); ?></p>
									<?php if ( ! class_exists( 'SiteOrigin_Panels' ) ) : ?>
										<?php 
										$so_slug = "siteorigin-panels";
										$so_state = meteorite_get_plugin_state( $so_slug );

										$so_link = $so_label = $so_btn_class = '';
										$so_plugin_is_ready = $so_state['installed'] && $so_state['active'];
										if ( ! $so_plugin_is_ready ) {
											if ( $so_state['installed'] ) {
												$so_link 		= meteorite_get_activate_link( $so_slug );
												$so_label 		= esc_html__( 'Activate', 'meteorite' );
												$so_btn_class 	= "activate";
											} else {
												$so_link 		= meteorite_get_install_link( $so_slug );
												$so_label 		= esc_html__( 'Install', 'meteorite' );
												$so_btn_class 	= "install-now";
											}
										}
										?>
										<p><a href="<?php echo esc_url( $so_link ); ?>" class="button <?php echo $so_btn_class; ?>"><?php echo $so_label; ?></a></p>
									<?php else : ?>
										<p class="plugin-installed"><?php esc_html_e( 'Plugin installed and active!', 'meteorite' ); ?></p>
									<?php endif; ?>

									<hr>

									<h3><?php esc_html_e( 'SiteOrigin Widgets Bundle', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'The widget bundle extends the page builder with more widgets. If you plan to import demo content, this plugin should be installed.', 'meteorite' ); ?></p>
									<?php if ( ! class_exists( 'SiteOrigin_Widgets_Bundle' ) ) : ?>
										<?php 
										$sowb_slug = "so-widgets-bundle";
										$sowb_state = meteorite_get_plugin_state( $sowb_slug );

										$sowb_link = $sowb_label = $sowb_btn_class = '';
										$sowb_plugin_is_ready = $sowb_state['installed'] && $sowb_state['active'];
										if ( ! $sowb_plugin_is_ready ) {
											if ( $sowb_state['installed'] ) {
												$sowb_link		= meteorite_get_activate_link( $sowb_slug );
												$sowb_label		= esc_html__( 'Activate', 'meteorite' );
												$sowb_btn_class	= "activate";
											} else {
												$sowb_link 		= meteorite_get_install_link( $sowb_slug );
												$sowb_label		= esc_html__( 'Install', 'meteorite' );
												$sowb_btn_class	= "install-now";
											}
										}
										?>
										<p><a href="<?php echo esc_url( $sowb_link ); ?>" class="button <?php echo $sowb_btn_class; ?>"><?php echo $sowb_label; ?></a></p>
									<?php else : ?>
										<p class="plugin-installed"><?php esc_html_e( 'Plugin installed and active!', 'meteorite' ); ?></p>
									<?php endif; ?>

								</div>
							</div>
						</div>
					</div><!-- #rec-plugins -->

					<div id="#demo-import" class="meteorite-tab demo-import">
						<div class="meteorite-theme-info-row">
							<div class="meteorite-theme-info-col-12">
								<div class="meteorite-theme-info-card">
									<h3><?php esc_html_e( 'Import demo content', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'To import our demo sites with just a few clicks you need to install and activate the One Click Demo Import and Meteorite Extensions plugin.', 'meteorite' ) ?></p>

									<hr>

									<h3><?php esc_html_e( 'Meteorite Extensions', 'meteorite' ); ?></h3>
									<p><?php esc_html_e( 'Meteorite Extensions is built to be used with Meteorite. It extends the Page Builder by SiteOrigin and Elementor and adds more than 20 custom widgets. Also it adds more features for the header image and demo layouts for Meteorite.', 'meteorite' ); ?></p>
									<?php if ( ! class_exists( 'Meteorite_Extensions' ) ) : ?>
										<?php 
										$me_slug = "meteorite-extensions";
										$me_state = meteorite_get_plugin_state( $me_slug );

										$me_link = $me_label = $me_btn_class = '';
										$me_plugin_is_ready = $me_state['installed'] && $me_state['active'];
										if ( ! $me_plugin_is_ready ) {
											if ( $me_state['installed'] ) {
												$me_link 		= meteorite_get_activate_link( $me_slug );
												$me_label 		= esc_html__( 'Activate', 'meteorite' );
												$me_btn_class	= "activate";
											} else {
												$me_link 		= meteorite_get_install_link( $me_slug );
												$me_label 		= esc_html__( 'Install', 'meteorite' );
												$me_btn_class 	= "install-now";
											}
										}
										?>
										<p><a href="<?php echo esc_url( $me_link ); ?>" class="button <?php echo $me_btn_class; ?>"><?php echo $me_label; ?></a></p>
									<?php else : ?>
										<p class="plugin-installed"><?php esc_html_e( 'Plugin installed and active!', 'meteorite' ); ?></p>
									<?php endif; ?>

									<hr>
									
									<h4><?php esc_html_e( 'One Click Demo Import', 'meteorite' ); ?></h4>
									<p><?php esc_html_e( 'The One Click Demo Import plugin saves you from building your page from scratch and imports everything from the demo page.', 'meteorite' ); ?></p>
									<?php if ( ! class_exists( 'OCDI_Plugin' ) ) : ?>
										<?php
										// Do not check state because then it needs to be registered as recommended by tgmpa.
										$ocdi_slug 		= "one-click-demo-import";
										$ocdi_link 		= meteorite_get_install_link( $ocdi_slug );
										$ocdi_label		= esc_html__( 'Install', 'meteorite' );
										$ocdi_btn_class	= "install-now";
										?>
										<p><a href="<?php echo esc_url( $ocdi_link ); ?>" class="button <?php echo $ocdi_btn_class; ?>"><?php echo $ocdi_label; ?></a></p>
									<?php else : ?>
										<p class="plugin-installed"><?php esc_html_e( 'Plugin installed and active!', 'meteorite' ); ?></p>
									<?php endif; ?>

									<?php if ( class_exists( 'OCDI_Plugin' ) ) : ?>
										<?php if ( ! class_exists( 'Meteorite_Extensions' ) ) : ?>
											<p class="import-notice"><?php esc_html_e( "You won't be able to import the demo layouts without Meteorite Extensions installed and activated. All recommended plugins should be activated.", "meteorite" ); ?><a href="#rec-plugins" data-target="rec-plugins" class="meteorite-tab-button button" style="margin-left: 10px; margin-top: 0;"><?php esc_html_e( 'Go to recommended plugins', 'meteorite' ); ?></a></p>
										<?php elseif (
												! class_exists( 'Terra_Themes_Tools' ) || 
												! class_exists( 'SiteOrigin_Panels' ) || 
												! class_exists( 'SiteOrigin_Widgets_Bundle' )
											) : ?>
											<p class="import-notice"><?php esc_html_e( 'Please make sure that all recommended plugins are installed and activated. Otherwise the demo import may not work properly.', 'meteorite' ); ?><a href="#rec-plugins" data-target="rec-plugins" class="meteorite-tab-button button" style="margin-left: 10px; margin-top: 0;"><?php esc_html_e( 'Go to recommended plugins', 'meteorite' ); ?></a></p>
											<p><a href="<?php echo admin_url( 'themes.php?page=pt-one-click-demo-import.php' ); ?>" class="button button-large"><?php esc_html_e( 'Go to importer', 'meteorite' ); ?></a></p>
										<?php else : ?>
											<p><a href="<?php echo admin_url( 'themes.php?page=pt-one-click-demo-import.php' ); ?>" class="button button-primary button-large"><?php esc_html_e( 'Go to importer', 'meteorite' ); ?></a></p>
										<?php endif; ?>
									<?php endif; ?>
								</div>
							</div>
						</div>
					</div><!-- #demo-import -->

					<div id="#support" class="meteorite-tab support">
						<div class="meteorite-theme-info-row">
							<div class="meteorite-theme-info-col-12">
								<div class="meteorite-theme-info-card support-info">
									<h2><?php esc_html_e( 'Searching for help?', 'meteorite' ); ?></h2>
									<p><?php esc_html_e( 'You are stuck on a problem or have a question about any theme feature?', 'meteorite' ); ?></p>
								</div><!-- .support-info -->
							</div>
						</div>
						<div class="meteorite-theme-info-row meteorite-equal-height">
							<div class="meteorite-theme-info-col-6">
								<div class="meteorite-theme-info-card support-forum">
									<span class="dashicons dashicons-sos meteorite-icon-lg"></span>
									<h2><?php esc_html_e( 'Support Forums', 'meteorite' ); ?></h2>
									<p><?php esc_html_e( 'Ask your question in our support forums and we do our best to solve your issue.', 'meteorite' ); ?></p>
									<a href="https://terra-themes.com/forums/forum/meteorite/" target="_blank" class="button button-large button-primary" ><?php esc_html_e( 'Support', 'meteorite' ); ?><span class="dashicons dashicons-external"></span></a>
								</div><!-- .support-forum -->
							</div>
							<div class="meteorite-theme-info-col-6">
								<div class="meteorite-theme-info-card support-docs">
									<span class="dashicons dashicons-book-alt meteorite-icon-lg"></span>
									<h2><?php esc_html_e( 'Documentation', 'meteorite' ); ?></h2>
									<p><?php esc_html_e( 'Read our documentation which provides basic instructions on how to set up your site with Meteorite.', 'meteorite' ); ?></p>
									<a href="https://terra-themes.com/documentation/meteorite/" target="_blank" class="button button-large button-primary" ><?php esc_html_e( 'Documentation', 'meteorite' ); ?><span class="dashicons dashicons-external"></span></a>
								</div><!-- .support-docs -->
							</div>
						</div>
						<div class="meteorite-theme-info-row">
							<div class="meteorite-theme-info-col-12">
								<div class="meteorite-theme-info-card rate-meteorite">
									<h2>
										<?php esc_html_e( 'You like Meteorite?', 'meteorite' ); ?>
										<span class="dashicons dashicons-thumbs-up meteorite-like"></span>
									</h2>
									<p>
										<?php
										/* translators: %s: link to WordPress.org */
										printf( esc_html__( 'We would be very pleased if you would take the time to write a review about Meteorite on %s.', 'meteorite' ), '<a href="https://wordpress.org/support/theme/meteorite/reviews/#new-post" target="_blank">WordPress.org<span class="dashicons dashicons-external"></span></a>' );
										?>
									</p>
									<p><a href="https://wordpress.org/support/theme/meteorite/reviews/#new-post" class="button" target="_blank"><?php esc_html_e( 'Leave a rating', 'meteorite' ); ?><span class="dashicons dashicons-external"></span></a></p>
								</div><!-- .support-info -->
							</div>
						</div>
					</div><!-- #support -->

				</div><!-- .meteorite-tab-wrapper -->

			</div><!-- .meteorite-theme-info-tabs -->

		</div>
	</div>
	<?php
}

/**
 * Get the state of the plugin. 
 * Only works with plugins that are registered through add_action( 'tgmpa_register' )
 *
 * @copyright Mesmerize Theme
 * @param $plugin_slug string Slug of the plugin.
 * @return array The states installed and active in a array with its boolean.
 * @since 2.0
 */
function meteorite_get_plugin_state( $plugin_slug ) {
	$tgmpa 		= \TGM_Plugin_Activation::get_instance();
	$installed 	= $tgmpa->is_plugin_installed( $plugin_slug );

	return array(
		'installed' => $installed,
		'active'	=> $installed && $tgmpa->is_plugin_active( $plugin_slug ),
	);
}

/**
 * Get the link to install the plugin with the given slug
 *
 * @copyright Mesmerize Theme
 * @param $slug string Slug of the plugin
 * @return string URL to install the plugin (unescaped)
 * @since 2.0
 */
function meteorite_get_install_link( $slug = false ) {
	if ( ! $slug ) {
		return;
	}

	return add_query_arg(
		array(
		'action'	=> 'install-plugin',
		'plugin'	=> $slug,
		'_wpnonce' 	=> wp_create_nonce( 'install-plugin_' . $slug ),
		),
		network_admin_url( 'update.php' )
	);
}

/**
 * Get the link to activate the plugin with the given slug
 *
 * @copyright Mesmerize Theme
 * @param $slug string Slug of the plugin
 * @return string URL to activate the plugin (unescaped)
 * @since 2.0
 */
function meteorite_get_activate_link( $slug = false ) {
	if ( ! $slug ) {
		return;
	}
	$tgmpa 	= \TGM_Plugin_Activation::get_instance();
	$path	= $tgmpa->plugins[$slug]['file_path'];

	return add_query_arg(
		array(
			'action'		=> 'activate',
			'plugin'		=> rawurlencode( $path ),
			'plugin_status' => 'all',
			'paged'			=> '1',
			'_wpnonce'		=> wp_create_nonce( 'activate-plugin_' . $path ),
		), network_admin_url( 'plugins.php' ) 
	);
}